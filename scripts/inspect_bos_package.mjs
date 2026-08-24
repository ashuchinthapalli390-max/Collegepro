import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const pkgDir = 'd:/nec portal/data/NEC_CYS_BoS_Package';
const files = fs.readdirSync(pkgDir);

console.log('=== PACKAGE FILES & SHA-256 ===');
const fileHashes = {};
for (const f of files) {
  const full = path.join(pkgDir, f);
  const buf = fs.readFileSync(full);
  const hash = crypto.createHash('sha256').update(buf).digest('hex');
  fileHashes[f] = hash;
  console.log(`${f}:`);
  console.log(`  Size: ${buf.length} bytes (${(buf.length / 1024 / 1024).toFixed(2)} MB)`);
  console.log(`  SHA-256: ${hash}`);
}

const csvPath = path.join(pkgDir, 'NEC_CYS_BoS_All_Meetings_Website_Import.csv');
const csvContent = fs.readFileSync(csvPath, 'utf8');

// Parse RFC 4180 multiline CSV
function parseRFC4180CSV(text) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (char === ',' && !insideQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
      continue;
    }

    if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentField.trim());
      currentField = '';
      if (currentRow.some(c => c.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      continue;
    }

    currentField += char;
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some(c => c.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

const allRows = parseRFC4180CSV(csvContent);
const headers = allRows[0];
console.log(`\n=== CSV HEADERS (${headers.length}) ===`);
console.log(headers);

const records = allRows.slice(1).map(row => {
  const obj = {};
  headers.forEach((h, idx) => {
    obj[h] = row[idx] || '';
  });
  return obj;
});

console.log(`\nTotal Records: ${records.length}`);
records.forEach((rec, idx) => {
  console.log(`\n------------------------------------------------------------`);
  console.log(`RECORD #${idx + 1}: ${rec.meeting_source_key} | ${rec.regulation_codes} | ${rec.meeting_date} | Target: ${rec.target_year}`);
  console.log(`Title: ${rec.meeting_title}`);
  console.log(`Dept: ${rec.department_code} (${rec.department_name})`);
  console.log(`Mode: ${rec.meeting_mode || 'N/A'} | Platform: ${rec.platform || 'N/A'} | Time: ${rec.meeting_time || 'N/A'}`);
  console.log(`Confidence: ${rec.source_confidence}`);
  console.log(`Source File: ${rec.source_files || 'NONE'}`);
  console.log(`Review Notes: ${rec.review_notes}`);

  // Test JSON parsing
  try {
    const members = rec.member_list_json ? JSON.parse(rec.member_list_json) : [];
    console.log(`  Members Count: ${members.length}`);
    if (members.length > 0) {
      console.log(`  First Member: ${members[0].name} (${members[0].member_type || members[0].category})`);
    }
  } catch (e) {
    console.log(`  ERROR parsing member_list_json: ${e.message}`);
  }

  try {
    const agenda = rec.agenda_items_json ? JSON.parse(rec.agenda_items_json) : [];
    console.log(`  Agenda Items: ${agenda.length}`);
  } catch (e) {
    console.log(`  ERROR parsing agenda_items_json: ${e.message}`);
  }

  try {
    const res = rec.resolutions_json ? JSON.parse(rec.resolutions_json) : [];
    console.log(`  Resolutions Count: ${res.length}`);
  } catch (e) {
    console.log(`  ERROR parsing resolutions_json: ${e.message}`);
  }

  try {
    const sha = rec.source_sha256_json ? JSON.parse(rec.source_sha256_json) : null;
    if (sha) {
      console.log(`  Embedded Source SHA-256:`, sha);
      // Compare with actual file hash
      for (const [filename, expectedHash] of Object.entries(sha)) {
        const actualHash = fileHashes[filename];
        const match = actualHash === expectedHash;
        console.log(`    Hash Match for ${filename}: ${match ? '✓ MATCH' : '❌ MISMATCH'}`);
      }
    }
  } catch (e) {
    console.log(`  ERROR parsing source_sha256_json: ${e.message}`);
  }
});
