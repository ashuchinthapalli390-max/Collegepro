import fs from 'fs';
import { normalizeBoSRecord } from './test_bos_cys_parser.mjs';

const pkgDir = 'd:/nec portal/data/NEC_CYS_BoS_Package';
const csvPath = `${pkgDir}/NEC_CYS_BoS_All_Meetings_Website_Import.csv`;
const csvContent = fs.readFileSync(csvPath, 'utf8');

// RFC parse
function parseRFC4180CSV(text) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let insideQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    if (char === '"') {
      if (insideQuotes && nextChar === '"') { currentField += '"'; i++; }
      else { insideQuotes = !insideQuotes; }
      continue;
    }
    if (char === ',' && !insideQuotes) { currentRow.push(currentField.trim()); currentField = ''; continue; }
    if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      currentRow.push(currentField.trim()); currentField = '';
      if (currentRow.some(c => c.length > 0)) rows.push(currentRow);
      currentRow = []; continue;
    }
    currentField += char;
  }
  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some(c => c.length > 0)) rows.push(currentRow);
  }
  return rows;
}

const allRows = parseRFC4180CSV(csvContent);
const headers = allRows[0];
const records = allRows.slice(1).map((row, i) => {
  const obj = {};
  headers.forEach((h, idx) => { obj[h] = row[idx] || ''; });
  return normalizeBoSRecord(obj, i);
});

console.log(`Normalized ${records.length} BoS records.`);
fs.writeFileSync('scripts/normalized_bos_cys.json', JSON.stringify(records, null, 2));
console.log('Saved to scripts/normalized_bos_cys.json');

// Inject into masterData.js INITIAL_BOS
let masterDataContent = fs.readFileSync('src/data/masterData.js', 'utf8');
const initialBosReplacement = `export const INITIAL_BOS = ${JSON.stringify(records, null, 2)};`;

masterDataContent = masterDataContent.replace('export const INITIAL_BOS = [];', initialBosReplacement);
fs.writeFileSync('src/data/masterData.js', masterDataContent);
console.log('Successfully injected INITIAL_BOS with 6 canonical records into masterData.js');
