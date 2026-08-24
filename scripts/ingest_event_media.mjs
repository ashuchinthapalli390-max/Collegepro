import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

// 1. Locate Source Directory
function findSourceDirectory(explicitPath) {
  if (explicitPath && fs.existsSync(explicitPath)) return path.resolve(explicitPath);

  const candidates = [
    path.resolve('../data/NEC Assets'),
    path.resolve('data/NEC Assets'),
    path.resolve('../NEC Assets'),
    path.resolve('assets/source/workshops'),
    path.resolve('media-source/academic-events'),
    path.resolve('public/uploads/events')
  ];

  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).isDirectory()) {
      return c;
    }
  }
  throw new Error('Source media directory could not be located.');
}

// 2. Canonical Slug Generator
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// 3. Known / Canonical Event Mappings Definition
const CANONICAL_MAPPINGS = {
  'advance-robotics-with-ai': {
    eventTitle: 'Advanced Robotics With AI',
    eventNumber: 'EVT-CYSA-2026-0047',
    eventId: 'evt_2026_27_047',
    status: 'EXACT',
    slug: 'advanced-robotics-with-ai'
  },
  'claude-architecture': {
    eventTitle: 'Claude Architecture',
    eventNumber: 'EVT-CYSA-2026-0006',
    eventId: 'evt_2026_27_006',
    status: 'EXACT',
    slug: 'claude-architecture'
  },
  'code-a-thon': {
    eventTitle: 'Code-a-thon',
    eventNumber: 'EVT-CYSA-2026-0001',
    eventId: 'evt_2026_27_001',
    status: 'EXACT',
    slug: 'code-a-thon'
  },
  'data-science-accelerator': {
    eventTitle: 'Data Science Accelerator',
    eventNumber: 'EVT-DS-2026-0002',
    eventId: 'evt_2026_27_002',
    status: 'EXACT',
    slug: 'data-science-accelerator'
  },
  'data-structures-and-algorithm-and-placements-guidance': {
    eventTitle: 'Alumni Talk on Data Structures & Algorithms (DSA) and Placement Guidance',
    eventNumber: 'EVT-CYSA-2026-0003',
    eventId: 'evt_2026_27_003',
    status: 'CONFIRMED_ALIAS',
    slug: 'dsa-placement-guidance'
  },
  'end-to-end-data-tools-and-ai-applications': {
    eventTitle: 'End To End Data Tools and AI Application Tools',
    eventNumber: 'EVT-AI-2026-0012',
    eventId: 'evt_2026_27_012',
    status: 'CONFIRMED_ALIAS',
    slug: 'end-to-end-data-tools'
  },
  'ethical-hacking': {
    eventTitle: 'Ethical Hacking',
    eventNumber: 'EVT-CYS-2026-0004',
    eventId: 'evt_2026_27_004',
    status: 'EXACT',
    slug: 'ethical-hacking'
  },
  'flutter-development': {
    eventTitle: 'Flutter Development',
    eventNumber: 'EVT-CYSA-2026-0009',
    eventId: 'evt_2026_27_009',
    status: 'EXACT',
    slug: 'flutter-development'
  },
  'git-and-github': {
    eventTitle: 'Git & GitHub Technologies',
    eventNumber: 'EVT-AIML-2026-0011',
    eventId: 'evt_2026_27_011',
    status: 'CONFIRMED_ALIAS',
    slug: 'git-github'
  },
  'microsoft-fabric': {
    eventTitle: 'Microsoft Fabric',
    eventNumber: 'EVT-CYSA-2026-0008',
    eventId: 'evt_2026_27_008',
    status: 'EXACT',
    slug: 'microsoft-fabric'
  },
  'power-bi': {
    eventTitle: 'PowerBI',
    eventNumber: 'EVT-CYSA-2026-0007',
    eventId: 'evt_2026_27_007',
    status: 'CONFIRMED_ALIAS',
    slug: 'power-bi'
  },
  'vibecoding-bootcamp': {
    eventTitle: 'Vibe Coding',
    eventNumber: 'EVT-CYSA-2026-0010',
    eventId: 'evt_2026_27_010',
    status: 'CONFIRMED_ALIAS',
    slug: 'vibecoding-bootcamp'
  },
  'swecha-one-day-seminar': {
    eventTitle: 'Swetcah Orientation Program',
    eventNumber: 'EVT-SWET-2026-0014',
    eventId: 'evt_2026_27_014',
    status: 'NEEDS_REVIEW',
    slug: 'swecha-one-day-seminar'
  },
  'ideathon-2k26': {
    eventTitle: null,
    eventNumber: null,
    eventId: null,
    status: 'UNMATCHED',
    slug: 'ideathon-2k26'
  }
};

// 4. Recursive Scan function
function scanDirectory(dir, relPath = '') {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const entryRelPath = path.join(relPath, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(scanDirectory(fullPath, entryRelPath));
    } else if (entry.isFile()) {
      // Ignore hidden or OS files
      if (entry.name.startsWith('.') || entry.name.toLowerCase() === 'thumbs.db') continue;
      const buffer = fs.readFileSync(fullPath);
      const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');
      const ext = path.extname(entry.name).toLowerCase();
      const stat = fs.statSync(fullPath);

      results.push({
        fullPath,
        relPath: entryRelPath.replace(/\\/g, '/'),
        filename: entry.name,
        ext,
        sizeBytes: stat.size,
        sha256,
        buffer
      });
    }
  }
  return results;
}

// 5. Main Ingestion Execution
export async function runIngestion(options = {}) {
  const sourcePath = findSourceDirectory(options.source);
  console.log(`[Ingest] Source root: ${sourcePath}`);

  const topLevelFolders = fs.readdirSync(sourcePath, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  console.log(`[Ingest] Found ${topLevelFolders.length} top-level folders.`);

  const allScannedFiles = scanDirectory(sourcePath);
  console.log(`[Ingest] Scanned ${allScannedFiles.length} files recursively.`);

  // Duplicate detection by SHA-256
  const shaMap = new Map();
  const duplicateFiles = [];
  const canonicalFiles = [];

  for (const file of allScannedFiles) {
    if (shaMap.has(file.sha256)) {
      const canonical = shaMap.get(file.sha256);
      duplicateFiles.push({
        duplicatePath: file.relPath,
        canonicalPath: canonical.relPath,
        sha256: file.sha256,
        sizeBytes: file.sizeBytes
      });
    } else {
      shaMap.set(file.sha256, file);
      canonicalFiles.push(file);
    }
  }

  console.log(`[Ingest] Unique files: ${canonicalFiles.length}, Duplicates skipped: ${duplicateFiles.length}`);

  // Base output destination
  const outputBase = path.resolve('public/assets/nrtec/events/2026-27');
  if (!fs.existsSync(outputBase)) {
    fs.mkdirSync(outputBase, { recursive: true });
  }

  // Process folder by folder
  const ingestedManifest = [];
  const verifiedEventMediaMap = {};
  const mediaAssetsTable = [];
  const recordMediaLinksTable = [];

  let totalPosters = 0;
  let totalGallery = 0;
  let totalVideos = 0;

  for (const topFolder of topLevelFolders) {
    const slug = slugify(topFolder);
    const mapping = CANONICAL_MAPPINGS[slug] || {
      eventTitle: null,
      eventNumber: null,
      eventId: null,
      status: 'UNMATCHED',
      slug
    };

    // Filter canonical files belonging to this top folder (ignore nested duplicates like Code-A-Thon/Advance Robotics With AI)
    const folderFiles = canonicalFiles.filter(f => {
      const parts = f.relPath.split('/');
      return parts[0] === topFolder;
    });

    const eventOutputDir = path.join(outputBase, mapping.slug);
    if (!fs.existsSync(eventOutputDir)) {
      fs.mkdirSync(eventOutputDir, { recursive: true });
    }

    const eventMediaEntry = {
      folderName: topFolder,
      slug: mapping.slug,
      mappingStatus: mapping.status,
      eventId: mapping.eventId,
      eventNumber: mapping.eventNumber,
      eventTitle: mapping.eventTitle,
      poster: null,
      gallery: [],
      videos: []
    };

    // Detect poster vs gallery
    const posterFiles = folderFiles.filter(f => /^poster\.(jpe?g|png|webp)$/i.test(f.filename));
    const galleryFiles = folderFiles.filter(f => !/^poster\.(jpe?g|png|webp)$/i.test(f.filename));

    // Process Poster if present
    if (posterFiles.length > 0) {
      const posterFile = posterFiles[0];
      const posterOutName = 'poster.webp';
      const posterOutPath = path.join(eventOutputDir, posterOutName);
      const publicSrc = `/assets/nrtec/events/2026-27/${mapping.slug}/${posterOutName}`;

      // Optimize with sharp (preserve high text quality for posters)
      const image = sharp(posterFile.buffer);
      const meta = await image.metadata();

      await image
        .rotate() // auto rotate based on EXIF
        .webp({ quality: 90, effort: 4 })
        .toFile(posterOutPath);

      const outStat = fs.statSync(posterOutPath);
      const outSha = crypto.createHash('sha256').update(fs.readFileSync(posterOutPath)).digest('hex');

      const posterAssetId = `med_ast_${mapping.slug}_poster`;
      const posterAsset = {
        id: posterAssetId,
        storagePath: publicSrc,
        originalFilename: posterFile.filename,
        safeFilename: posterOutName,
        mediaType: 'IMAGE',
        mimeType: 'image/webp',
        mediaRole: 'POSTER',
        fileSizeBytes: outStat.size,
        sourceSizeBytes: posterFile.sizeBytes,
        sha256: outSha,
        sourceSha256: posterFile.sha256,
        width: meta.width || 1200,
        height: meta.height || 1600,
        aspectRatio: `${meta.width || 1200} / ${meta.height || 1600}`,
        processingStatus: 'OPTIMIZED',
        visibility: mapping.status === 'EXACT' || mapping.status === 'CONFIRMED_ALIAS' ? 'INTERNAL' : 'PRIVATE',
        sourceType: 'GOOGLE_DRIVE_INGEST',
        sourceReference: `Google Drive / ${posterFile.relPath}`,
        createdAt: new Date().toISOString()
      };

      mediaAssetsTable.push(posterAsset);

      if (mapping.eventId) {
        recordMediaLinksTable.push({
          id: `link_${mapping.eventId}_poster`,
          eventId: mapping.eventId,
          eventNumber: mapping.eventNumber,
          mediaAssetId: posterAssetId,
          role: 'POSTER',
          sortOrder: 0,
          caption: `Official Poster for ${mapping.eventTitle || topFolder}`,
          altText: `Poster for ${mapping.eventTitle || topFolder}`,
          visibility: posterAsset.visibility,
          createdAt: new Date().toISOString()
        });
      }

      eventMediaEntry.poster = {
        id: posterAssetId,
        src: publicSrc,
        alt: `Poster for ${mapping.eventTitle || topFolder}`,
        width: meta.width,
        height: meta.height,
        aspectRatio: `${meta.width} / ${meta.height}`,
        sha256: outSha,
        sourceSha256: posterFile.sha256
      };

      totalPosters++;
    }

    // Process Gallery Files
    let galleryIndex = 1;
    for (const gFile of galleryFiles) {
      const gIndexStr = String(galleryIndex).padStart(2, '0');
      const galleryOutName = `gallery-${gIndexStr}.webp`;
      const galleryOutPath = path.join(eventOutputDir, galleryOutName);
      const publicSrc = `/assets/nrtec/events/2026-27/${mapping.slug}/${galleryOutName}`;

      const image = sharp(gFile.buffer);
      const meta = await image.metadata();

      // Optimize gallery (max 1600px long edge if larger)
      let pipeline = image.rotate();
      if (meta.width > 1600 || meta.height > 1600) {
        pipeline = pipeline.resize({
          width: meta.width >= meta.height ? 1600 : undefined,
          height: meta.height > meta.width ? 1600 : undefined,
          fit: 'inside',
          withoutEnlargement: true
        });
      }

      await pipeline
        .webp({ quality: 82, effort: 4 })
        .toFile(galleryOutPath);

      const outStat = fs.statSync(galleryOutPath);
      const outSha = crypto.createHash('sha256').update(fs.readFileSync(galleryOutPath)).digest('hex');
      const outMeta = await sharp(galleryOutPath).metadata();

      const galleryAssetId = `med_ast_${mapping.slug}_gallery_${gIndexStr}`;
      const galleryAsset = {
        id: galleryAssetId,
        storagePath: publicSrc,
        originalFilename: gFile.filename,
        safeFilename: galleryOutName,
        mediaType: 'IMAGE',
        mimeType: 'image/webp',
        mediaRole: 'GALLERY',
        fileSizeBytes: outStat.size,
        sourceSizeBytes: gFile.sizeBytes,
        sha256: outSha,
        sourceSha256: gFile.sha256,
        width: outMeta.width || meta.width,
        height: outMeta.height || meta.height,
        aspectRatio: `${outMeta.width || meta.width} / ${outMeta.height || meta.height}`,
        processingStatus: 'OPTIMIZED',
        visibility: 'PRIVATE', // Private by default as required
        sourceType: 'GOOGLE_DRIVE_INGEST',
        sourceReference: `Google Drive / ${gFile.relPath}`,
        createdAt: new Date().toISOString()
      };

      mediaAssetsTable.push(galleryAsset);

      if (mapping.eventId) {
        recordMediaLinksTable.push({
          id: `link_${mapping.eventId}_gallery_${gIndexStr}`,
          eventId: mapping.eventId,
          eventNumber: mapping.eventNumber,
          mediaAssetId: galleryAssetId,
          role: 'GALLERY',
          sortOrder: galleryIndex,
          caption: `${mapping.eventTitle || topFolder} Session Photograph ${galleryIndex}`,
          altText: `${mapping.eventTitle || topFolder} workshop session`,
          visibility: 'PRIVATE',
          createdAt: new Date().toISOString()
        });
      }

      eventMediaEntry.gallery.push({
        id: galleryAssetId,
        src: publicSrc,
        alt: `${mapping.eventTitle || topFolder} workshop session`,
        caption: `Session Photo ${galleryIndex}`,
        width: outMeta.width || meta.width,
        height: outMeta.height || meta.height,
        aspectRatio: `${outMeta.width || meta.width} / ${outMeta.height || meta.height}`,
        sha256: outSha,
        sourceSha256: gFile.sha256
      });

      totalGallery++;
      galleryIndex++;
    }

    ingestedManifest.push(eventMediaEntry);
    verifiedEventMediaMap[mapping.slug] = eventMediaEntry;
  }

  // Generate Report Object
  const report = {
    generatedAt: new Date().toISOString(),
    sourceRoot: sourcePath,
    sourceRootFolderId: '1xrMwf1fCGGjFGkL9yVjdRhqZPNoKo8W1',
    topLevelFoldersCount: topLevelFolders.length,
    scannedFilesCount: allScannedFiles.length,
    uniqueFilesCount: canonicalFiles.length,
    duplicateFilesCount: duplicateFiles.length,
    postersCount: totalPosters,
    galleryImagesCount: totalGallery,
    videosCount: totalVideos,
    exactMatches: Object.values(CANONICAL_MAPPINGS).filter(m => m.status === 'EXACT').length,
    confirmedAliasMatches: Object.values(CANONICAL_MAPPINGS).filter(m => m.status === 'CONFIRMED_ALIAS').length,
    needsReviewCount: Object.values(CANONICAL_MAPPINGS).filter(m => m.status === 'NEEDS_REVIEW').length,
    unmatchedCount: Object.values(CANONICAL_MAPPINGS).filter(m => m.status === 'UNMATCHED').length,
    eventsWithNoMediaCount: 2, // AI Tools and Applications, Robotics
    duplicateGroups: duplicateFiles,
    foldersSummary: ingestedManifest.map(f => ({
      folderName: f.folderName,
      slug: f.slug,
      mappingStatus: f.mappingStatus,
      matchedEventId: f.eventId,
      matchedEventNumber: f.eventNumber,
      matchedEventTitle: f.eventTitle,
      hasPoster: Boolean(f.poster),
      galleryCount: f.gallery.length,
      videoCount: f.videos.length
    }))
  };

  // Write report to root and data
  fs.writeFileSync('event-media-ingest-report.json', JSON.stringify(report, null, 2), 'utf8');

  // Generate verified-event-media.js
  const registryCode = `/**
 * Canonical Verified Academic Event Media Registry
 * Generated by Developer Ingestion Pipeline: scripts/ingest_event_media.mjs
 * Source Google Drive Folder: 1xrMwf1fCGGjFGkL9yVjdRhqZPNoKo8W1
 * All assets optimized to WebP and served locally from public/assets/nrtec/events/2026-27/
 */

export const VERIFIED_EVENT_MEDIA_REGISTRY = ${JSON.stringify(verifiedEventMediaMap, null, 2)};

export const INGESTED_MEDIA_ASSETS = ${JSON.stringify(mediaAssetsTable, null, 2)};

export const RECORD_MEDIA_LINKS = ${JSON.stringify(recordMediaLinksTable, null, 2)};

/**
 * Resolves verified media bundle for an academic event by ID, eventNumber, or title
 */
export function getVerifiedMediaForEvent(eventIdOrNumberOrTitle) {
  if (!eventIdOrNumberOrTitle) return null;
  const q = String(eventIdOrNumberOrTitle).toLowerCase().trim();
  
  for (const entry of Object.values(VERIFIED_EVENT_MEDIA_REGISTRY)) {
    if (
      (entry.eventId && entry.eventId.toLowerCase() === q) ||
      (entry.eventNumber && entry.eventNumber.toLowerCase() === q) ||
      (entry.eventTitle && entry.eventTitle.toLowerCase() === q) ||
      (entry.slug && entry.slug.toLowerCase() === q)
    ) {
      return entry;
    }
  }
  return null;
}
`;

  fs.writeFileSync('src/data/verified-event-media.js', registryCode, 'utf8');
  console.log('[Ingest] Successfully wrote event-media-ingest-report.json and src/data/verified-event-media.js!');

  return report;
}

// CLI Execution
if (process.argv[1] && process.argv[1].endsWith('ingest_event_media.mjs')) {
  runIngestion()
    .then(report => {
      console.log('\n====================================================');
      console.log('INGESTION COMPLETED SUCCESSFULLY');
      console.log('====================================================');
      console.log(`Top Level Folders : ${report.topLevelFoldersCount}`);
      console.log(`Total Files       : ${report.scannedFilesCount}`);
      console.log(`Unique Images     : ${report.uniqueFilesCount}`);
      console.log(`Duplicates Skipped: ${report.duplicateFilesCount}`);
      console.log(`Posters Generated : ${report.postersCount}`);
      console.log(`Gallery Generated : ${report.galleryImagesCount}`);
      console.log(`Videos            : ${report.videosCount}`);
      console.log('====================================================\n');
    })
    .catch(err => {
      console.error('Ingestion failed:', err);
      process.exit(1);
    });
}
