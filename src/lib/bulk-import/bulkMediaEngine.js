/**
 * NEC Institutional Portal - Folder-Based Bulk Media Ingestion Engine
 * Parses webkitRelativePath folder structures, auto-detects media roles (cover, poster, gallery, videos),
 * resolves event mappings without CSV manifests, generates video poster snapshots, and packages folder zip templates.
 */

import { SimpleZipBuilder } from './zipGenerator.js';

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];

/**
 * Parses file list from directory drop/input and organizes into structured event folders.
 */
export async function parseFolderMediaUpload(fileList, existingEvents = []) {
  const files = Array.from(fileList || []);
  if (files.length === 0) {
    return {
      totalFolders: 0,
      totalFiles: 0,
      imageCount: 0,
      videoCount: 0,
      matchedFolders: 0,
      unmatchedFolders: 0,
      folders: []
    };
  }

  const folderMap = new Map();
  let imageCount = 0;
  let videoCount = 0;

  for (const file of files) {
    const relPath = file.webkitRelativePath || file.name;
    const parts = relPath.split('/').filter(Boolean);

    // Skip hidden files/OS metadata (.DS_Store, Thumbs.db)
    const filename = parts[parts.length - 1] || '';
    if (filename.startsWith('.') || filename.toLowerCase() === 'thumbs.db') continue;

    // Detect media type
    const mimeType = file.type || '';
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    
    let mediaType = null;
    if (ALLOWED_IMAGE_TYPES.includes(mimeType) || ['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
      mediaType = 'IMAGE';
      imageCount++;
    } else if (ALLOWED_VIDEO_TYPES.includes(mimeType) || ['mp4', 'webm'].includes(ext)) {
      mediaType = 'VIDEO';
      videoCount++;
    } else {
      // Non-media file, skip
      continue;
    }

    // Role detection from parent subfolder name
    let role = 'GALLERY';
    const subfolderName = parts.length >= 3 ? parts[parts.length - 2].toLowerCase() : '';

    if (subfolderName.includes('cover')) {
      role = 'COVER';
    } else if (subfolderName.includes('poster')) {
      role = 'POSTER';
    } else if (subfolderName.includes('session')) {
      role = 'SESSION';
    } else if (subfolderName.includes('video') || mediaType === 'VIDEO') {
      role = 'VIDEO';
    }

    // Determine event folder name (e.g. "SNO-1_Code-a-thon" or "EVT-2026-0001_Code-a-thon")
    let eventFolderSegment = parts.length >= 2 ? parts[parts.length - 2] : parts[0];
    if (parts.length >= 3 && ['cover', 'poster', 'gallery', 'session', 'videos', 'video'].includes(subfolderName)) {
      eventFolderSegment = parts[parts.length - 3];
    }

    const folderKey = eventFolderSegment || 'ROOT_FOLDER';

    if (!folderMap.has(folderKey)) {
      folderMap.set(folderKey, {
        id: `fld_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        folderName: folderKey,
        fullPath: parts.slice(0, -1).join('/'),
        items: []
      });
    }

    // Read image dimensions or create video preview object
    let previewUrl = '';
    try {
      previewUrl = URL.createObjectURL(file);
    } catch {
      previewUrl = '';
    }

    const mediaItem = {
      id: `med_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      file,
      originalFilename: filename,
      relativePath: relPath,
      mediaType,
      mediaRole: role,
      mimeType: mimeType || (mediaType === 'IMAGE' ? `image/${ext}` : `video/${ext}`),
      fileSize: file.size,
      previewUrl,
      validationStatus: file.size > 100 * 1024 * 1024 ? 'WARNING' : 'VALID'
    };

    folderMap.get(folderKey).items.push(mediaItem);
  }

  // Resolve folder to existing events
  const resolvedFolders = [];
  let matchedFoldersCount = 0;
  let unmatchedFoldersCount = 0;

  for (const [folderName, folderData] of folderMap.entries()) {
    const match = matchFolderToEvent(folderName, existingEvents);

    if (match.status === 'MATCHED') {
      matchedFoldersCount++;
    } else {
      unmatchedFoldersCount++;
    }

    // Check multiple covers
    const covers = folderData.items.filter(i => i.mediaRole === 'COVER');
    const hasMultipleCovers = covers.length > 1;

    resolvedFolders.push({
      ...folderData,
      mappingStatus: match.status, // 'MATCHED' | 'NEEDS_MAPPING' | 'UNMATCHED'
      matchedRecordId: match.eventId,
      matchedRecordTitle: match.eventTitle,
      matchReason: match.reason,
      hasMultipleCovers,
      possibleMatches: match.possibleMatches || []
    });
  }

  return {
    totalFolders: resolvedFolders.length,
    totalFiles: imageCount + videoCount,
    imageCount,
    videoCount,
    matchedFolders: matchedFoldersCount,
    unmatchedFolders: unmatchedFoldersCount,
    folders: resolvedFolders
  };
}

/**
 * Matches folder string to existing events with strict priority.
 */
export function matchFolderToEvent(folderName, existingEvents = []) {
  if (!folderName || existingEvents.length === 0) {
    return { status: 'UNMATCHED', eventId: null, eventTitle: null, reason: 'No matching event found.' };
  }

  const cleanFolder = folderName.toLowerCase().replace(/[^a-z0-9]/g, '');

  // 1. Exact event_number match (e.g. EVT-CSE-2026-0001 or EVT-2026-0001)
  for (const evt of existingEvents) {
    if (evt.eventNumber) {
      const cleanEvtNum = evt.eventNumber.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (cleanFolder.includes(cleanEvtNum) || cleanEvtNum.includes(cleanFolder)) {
        return {
          status: 'MATCHED',
          eventId: evt.id,
          eventTitle: evt.title || evt.name,
          reason: `Exact Event Number match (${evt.eventNumber}).`
        };
      }
    }
  }

  // 2. Source reference match (e.g. SNO-1, SNO-47, SNO-5)
  for (const evt of existingEvents) {
    const srcRef = evt.sourceReference || (evt.sourceRowNumber ? `SNO-${evt.sourceRowNumber}` : '');
    if (srcRef) {
      const cleanSrc = srcRef.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (cleanFolder.startsWith(cleanSrc) || cleanFolder.includes(cleanSrc)) {
        return {
          status: 'MATCHED',
          eventId: evt.id,
          eventTitle: evt.title || evt.name,
          reason: `Source reference match (${srcRef}: "${evt.title || evt.name}").`
        };
      }
    }
  }

  // 3. Exact Title match
  for (const evt of existingEvents) {
    const title = evt.title || evt.name || '';
    const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (cleanTitle && (cleanFolder.includes(cleanTitle) || cleanTitle.includes(cleanFolder))) {
      return {
        status: 'MATCHED',
        eventId: evt.id,
        eventTitle: title,
        reason: `Title match ("${title}").`
      };
    }
  }

  // 4. Multiple possible matches -> Needs Mapping
  const possible = existingEvents.filter(evt => {
    const t = (evt.title || evt.name || '').toLowerCase();
    const words = folderName.toLowerCase().split(/[ _-]+/).filter(w => w.length > 3);
    return words.some(w => t.includes(w));
  }).slice(0, 4);

  if (possible.length > 0) {
    return {
      status: 'NEEDS_MAPPING',
      eventId: null,
      eventTitle: null,
      reason: 'Ambiguous folder name. Please select the target event.',
      possibleMatches: possible.map(p => ({ id: p.id, title: p.title || p.name, eventNumber: p.eventNumber }))
    };
  }

  return { status: 'UNMATCHED', eventId: null, eventTitle: null, reason: 'No matching event record found in the portal.' };
}

/**
 * Generates and triggers download of the official NEC Bulk Media Template ZIP file.
 */
export function downloadBulkMediaFolderTemplateZip() {
  const zip = new SimpleZipBuilder();

  // Add README Instructions
  const readmeText = `================================================================================
NEC AUTONOMOUS PORTAL — BULK MEDIA FOLDER TEMPLATE (AY 2026-27)
================================================================================

HOW TO USE THIS FOLDER STRUCTURE:

1. Extract this ZIP file onto your computer.
2. Place your event photographs and videos inside the appropriate subfolders:
   - cover/     : Primary event cover / banner image (JPG, PNG, WebP)
   - poster/    : Official promotional poster / brochure image
   - gallery/   : High-resolution photographs from the event sessions
   - session/   : Session-wise workshop presentation photos
   - videos/    : Event highlight clip or recorded talk (MP4, WebM)

3. Folder Naming Convention:
   - Preferred: EVT-2026-0001_Event-Title/
   - Or by S.No: SNO-1_Code-a-thon/

4. Open the NEC Portal -> Bulk Data Center -> Bulk Media Upload.
5. Click "Select Folder" and select this entire extracted folder.
6. The portal will automatically match folders to event records and attach media.

All uploaded media will be saved with PRIVATE status by default until
approved for public showcase.
`;

  zip.addFile('AY_2026-27/Academic_Events/README.txt', readmeText);

  // Sample event folders
  const sampleEvents = [
    { name: 'ALL_ET/EVT-2026-0001_Code-a-thon', desc: 'Code-a-thon Event Media' },
    { name: 'DS/EVT-2026-0002_Data-Science-Accelerator', desc: 'Data Science Accelerator Media' },
    { name: 'CSE/EVT-2026-0003_Alumni-Talk-DSA', desc: 'Alumni Talk on DSA Media' },
    { name: 'CS/EVT-2026-0004_Ethical-Hacking', desc: 'Ethical Hacking Workshop Media' },
    { name: 'AIML/EVT-2026-0013_Git-GitHub-Technologies', desc: 'Git & GitHub Workshop Media' }
  ];

  for (const evt of sampleEvents) {
    zip.addFile(`AY_2026-27/Academic_Events/${evt.name}/cover/PLACE_COVER_IMAGE_HERE.txt`, 'Place 1 primary cover image (JPG/PNG/WebP) here.');
    zip.addFile(`AY_2026-27/Academic_Events/${evt.name}/poster/PLACE_POSTER_IMAGE_HERE.txt`, 'Place official event poster / brochure here.');
    zip.addFile(`AY_2026-27/Academic_Events/${evt.name}/gallery/PLACE_GALLERY_PHOTOS_HERE.txt`, 'Place session photographs and group photos here.');
    zip.addFile(`AY_2026-27/Academic_Events/${evt.name}/videos/PLACE_MP4_VIDEOS_HERE.txt`, 'Place MP4 / WebM video highlights here.');
  }

  const zipBytes = zip.build();
  const blob = new Blob([zipBytes], { type: 'application/zip' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'NEC_Bulk_Media_Template.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
