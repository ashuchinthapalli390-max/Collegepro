/**
 * Zero-dependency pure JavaScript ZIP file generator (Store mode - uncompressed standard ZIP).
 * Used to package the NEC Bulk Media Folder Template archive with nested directory structures.
 */

// CRC-32 Lookup Table
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
  }
  crcTable[i] = c;
}

function crc32(buffer) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buffer.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buffer[i]) & 0xFF];
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

export class SimpleZipBuilder {
  constructor() {
    this.files = [];
  }

  /**
   * Adds a file or directory entry to the zip archive.
   * Path should use forward slashes (e.g. 'AY_2026-27/Academic_Events/ALL_ET/README.txt')
   * Directory entries must end with '/' and have empty content.
   */
  addFile(path, content = '') {
    let data;
    if (typeof content === 'string') {
      data = new TextEncoder().encode(content);
    } else if (content instanceof Uint8Array) {
      data = content;
    } else if (content instanceof ArrayBuffer) {
      data = new Uint8Array(content);
    } else {
      data = new Uint8Array(0);
    }

    const isDir = path.endsWith('/');
    this.files.push({
      path,
      data,
      isDir,
      crc: crc32(data),
      size: data.length
    });
  }

  /**
   * Builds and returns a binary Uint8Array representing the valid ZIP file.
   */
  build() {
    const localHeaders = [];
    const centralDirectoryHeaders = [];
    let offset = 0;

    const date = new Date();
    const dosTime = ((date.getHours() << 11) | (date.getMinutes() << 5) | (date.getSeconds() >> 1)) & 0xFFFF;
    const dosDate = (((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate()) & 0xFFFF;

    for (const file of this.files) {
      const filenameBytes = new TextEncoder().encode(file.path);
      const localHeaderOffset = offset;

      // Local file header (30 bytes + filename length + data length)
      const localHeader = new Uint8Array(30 + filenameBytes.length + file.data.length);
      const view = new DataView(localHeader.buffer);

      view.setUint32(0, 0x04034b50, true); // Local file header signature
      view.setUint16(4, 20, true);         // Version needed to extract (2.0)
      view.setUint16(6, 0, true);          // General purpose bit flag
      view.setUint16(8, 0, true);          // Compression method (0 = store)
      view.setUint16(10, dosTime, true);   // File last mod time
      view.setUint16(12, dosDate, true);   // File last mod date
      view.setUint32(14, file.crc, true);  // CRC-32
      view.setUint32(18, file.size, true); // Compressed size
      view.setUint32(22, file.size, true); // Uncompressed size
      view.setUint16(26, filenameBytes.length, true); // File name length
      view.setUint16(28, 0, true);         // Extra field length

      localHeader.set(filenameBytes, 30);
      localHeader.set(file.data, 30 + filenameBytes.length);

      localHeaders.push(localHeader);
      offset += localHeader.length;

      // Central directory header (46 bytes + filename length)
      const cdHeader = new Uint8Array(46 + filenameBytes.length);
      const cdView = new DataView(cdHeader.buffer);

      cdView.setUint32(0, 0x02014b50, true); // Central directory signature
      cdView.setUint16(4, 20, true);         // Version made by
      cdView.setUint16(6, 20, true);         // Version needed to extract
      cdView.setUint16(8, 0, true);          // General purpose bit flag
      cdView.setUint16(10, 0, true);         // Compression method (0 = store)
      cdView.setUint16(12, dosTime, true);   // File last mod time
      cdView.setUint16(14, dosDate, true);   // File last mod date
      cdView.setUint32(16, file.crc, true);  // CRC-32
      cdView.setUint32(20, file.size, true); // Compressed size
      cdView.setUint32(24, file.size, true); // Uncompressed size
      cdView.setUint16(28, filenameBytes.length, true); // File name length
      cdView.setUint16(30, 0, true);         // Extra field length
      cdView.setUint16(32, 0, true);         // File comment length
      cdView.setUint16(34, 0, true);         // Disk number start
      cdView.setUint16(36, 0, true);         // Internal file attributes
      cdView.setUint32(38, file.isDir ? 0x10 : 0x20, true); // External file attributes
      cdView.setUint32(42, localHeaderOffset, true); // Relative offset of local header

      cdHeader.set(filenameBytes, 46);
      centralDirectoryHeaders.push(cdHeader);
    }

    const cdOffset = offset;
    let cdSize = 0;
    for (const cdh of centralDirectoryHeaders) {
      cdSize += cdh.length;
    }

    // End of central directory record (22 bytes)
    const eocd = new Uint8Array(22);
    const eocdView = new DataView(eocd.buffer);

    eocdView.setUint32(0, 0x06054b50, true); // End of central directory signature
    eocdView.setUint16(4, 0, true);          // Number of this disk
    eocdView.setUint16(6, 0, true);          // Disk where central directory starts
    eocdView.setUint16(8, this.files.length, true);  // Number of central directory records on this disk
    eocdView.setUint16(10, this.files.length, true); // Total number of central directory records
    eocdView.setUint32(12, cdSize, true);    // Size of central directory
    eocdView.setUint32(16, cdOffset, true);  // Offset of start of central directory
    eocdView.setUint16(20, 0, true);         // ZIP file comment length

    const totalLength = cdOffset + cdSize + 22;
    const finalZip = new Uint8Array(totalLength);

    let pos = 0;
    for (const lh of localHeaders) {
      finalZip.set(lh, pos);
      pos += lh.length;
    }
    for (const cdh of centralDirectoryHeaders) {
      finalZip.set(cdh, pos);
      pos += cdh.length;
    }
    finalZip.set(eocd, pos);

    return finalZip;
  }
}
