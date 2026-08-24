import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

// Find source directory
const possibleSourcePaths = [
  path.resolve('../data/NEC Assets'),
  path.resolve('data/NEC Assets'),
  path.resolve('../NEC Assets'),
  path.resolve('assets/source/workshops'),
  path.resolve('media-source/academic-events'),
  path.resolve('public/uploads/events')
];

let sourceDir = null;
for (const p of possibleSourcePaths) {
  if (fs.existsSync(p) && fs.statSync(p).isDirectory()) {
    sourceDir = p;
    break;
  }
}

if (!sourceDir) {
  console.error('Could not locate NEC Assets source directory!');
  process.exit(1);
}

console.log('Discovered source directory:', sourceDir);

// Read magic bytes to detect true MIME
function detectImageMime(buffer) {
  if (buffer.length < 12) return 'UNKNOWN';
  // JPEG
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) return 'image/jpeg';
  // PNG
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) return 'image/png';
  // WebP
  if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
      buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) return 'image/webp';
  // MP4
  if (buffer.length >= 8 && buffer.toString('ascii', 4, 8) === 'ftyp') return 'video/mp4';
  return 'UNKNOWN';
}

// Simple dimensions parser for JPEG/PNG/WebP
function getImageDimensions(buffer) {
  try {
    // PNG
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
      const width = buffer.readUInt32BE(16);
      const height = buffer.readUInt32BE(20);
      return { width, height };
    }
    // JPEG
    if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
      let offset = 2;
      while (offset < buffer.length) {
        if (buffer[offset] !== 0xFF) break;
        const marker = buffer[offset + 1];
        if (marker === 0xC0 || marker === 0xC2) { // SOF0 or SOF2
          const height = buffer.readUInt16BE(offset + 5);
          const width = buffer.readUInt16BE(offset + 7);
          return { width, height };
        }
        const length = buffer.readUInt16BE(offset + 2);
        offset += 2 + length;
      }
    }
    // WebP (VP8/VP8L/VP8X)
    if (buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) {
      const chunkType = buffer.toString('ascii', 12, 16);
      if (chunkType === 'VP8 ') {
        const width = buffer.readUInt16LE(26) & 0x3fff;
        const height = buffer.readUInt16LE(28) & 0x3fff;
        return { width, height };
      } else if (chunkType === 'VP8L') {
        const b0 = buffer[21];
        const b1 = buffer[22];
        const b2 = buffer[23];
        const b3 = buffer[24];
        const width = 1 + (((b1 & 0x3f) << 8) | b0);
        const height = 1 + (((b3 & 0x0f) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6));
        return { width, height };
      } else if (chunkType === 'VP8X') {
        const width = 1 + (buffer[24] | (buffer[25] << 8) | (buffer[26] << 16));
        const height = 1 + (buffer[27] | (buffer[28] << 8) | (buffer[29] << 16));
        return { width, height };
      }
    }
  } catch (e) {
    // fallback
  }
  return { width: 0, height: 0 };
}

// Recursive scan
function scanDirectory(dir, relPath = '') {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const entryRelPath = path.join(relPath, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(scanDirectory(fullPath, entryRelPath));
    } else if (entry.isFile()) {
      const stat = fs.statSync(fullPath);
      const buffer = fs.readFileSync(fullPath);
      const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');
      const mime = detectImageMime(buffer);
      const dims = getImageDimensions(buffer);
      
      results.push({
        fullPath,
        relPath: entryRelPath.replace(/\\/g, '/'),
        filename: entry.name,
        sizeBytes: stat.size,
        sha256,
        mime,
        width: dims.width,
        height: dims.height
      });
    }
  }
  return results;
}

const topLevelFolders = fs.readdirSync(sourceDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

console.log('Top level folders found (' + topLevelFolders.length + '):');
topLevelFolders.forEach(f => console.log(' - ' + f));

const allFiles = scanDirectory(sourceDir);
console.log('\nTotal files found across all subdirectories:', allFiles.length);

// Group by sha256 to find duplicates
const hashMap = new Map();
allFiles.forEach(file => {
  if (!hashMap.has(file.sha256)) {
    hashMap.set(file.sha256, []);
  }
  hashMap.get(file.sha256).push(file);
});

console.log('\nUnique SHA-256 count:', hashMap.size);

const duplicates = [];
for (const [sha, files] of hashMap.entries()) {
  if (files.length > 1) {
    duplicates.push({ sha, files });
  }
}

console.log('Duplicate groups found:', duplicates.length);
duplicates.forEach((dup, idx) => {
  console.log(`\nDuplicate Group ${idx + 1} (SHA: ${dup.sha}):`);
  dup.files.forEach(f => console.log(`   ${f.relPath} (${f.sizeBytes} bytes)`));
});

// Group by top-level folder
const folderGroups = {};
topLevelFolders.forEach(f => folderGroups[f] = []);

allFiles.forEach(file => {
  const parts = file.relPath.split('/');
  const topFolder = parts[0];
  if (folderGroups[topFolder]) {
    folderGroups[topFolder].push(file);
  }
});

console.log('\nPer Folder breakdown:');
for (const [folder, files] of Object.entries(folderGroups)) {
  const posters = files.filter(f => /^poster\.(jpe?g|png|webp)$/i.test(f.filename));
  const gallery = files.filter(f => !/^poster\.(jpe?g|png|webp)$/i.test(f.filename));
  console.log(`Folder: "${folder}" -> Total: ${files.length}, Posters: ${posters.length} (${posters.map(p => p.filename).join(', ') || 'none'}), Gallery: ${gallery.length}`);
}
