import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const sourceDir = path.resolve('..', 'NEC Assets', 'nrtec_public_assets');
const targetDir = path.resolve('public', 'assets', 'nrtec');
const manifestPath = path.join(sourceDir, 'asset_manifest.json');

console.log('--- Starting NRTEC Asset Ingestion & Integrity Verification ---');

if (!fs.existsSync(sourceDir)) {
  console.error('Source directory does not exist:', sourceDir);
  process.exit(1);
}

if (!fs.existsSync(manifestPath)) {
  console.error('Manifest file does not exist:', manifestPath);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
console.log(`Found ${manifest.length} manifest entries.`);

let verifiedCount = 0;
let errors = [];

manifest.forEach((item) => {
  const srcFile = path.join(sourceDir, item.renamed_file);
  const destFile = path.join(targetDir, item.renamed_file);

  if (!fs.existsSync(srcFile)) {
    errors.push(`Missing source file: ${srcFile}`);
    return;
  }

  // Calculate SHA-256 of source file
  const fileBuffer = fs.readFileSync(srcFile);
  const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

  if (hash.toLowerCase() !== item.sha256.toLowerCase()) {
    errors.push(`SHA-256 mismatch for ${item.renamed_file}: expected ${item.sha256}, got ${hash}`);
    return;
  }

  // Ensure target folder exists
  const destFolder = path.dirname(destFile);
  if (!fs.existsSync(destFolder)) {
    fs.mkdirSync(destFolder, { recursive: true });
  }

  // Copy file
  fs.copyFileSync(srcFile, destFile);
  verifiedCount++;
  console.log(`✓ [${item.category}] ${item.renamed_file} (${item.size_bytes} bytes) - Hash Verified`);
});

// Also save provenance manifest copy
const provenanceDir = path.resolve('src', 'data', 'provenance');
if (!fs.existsSync(provenanceDir)) {
  fs.mkdirSync(provenanceDir, { recursive: true });
}
fs.copyFileSync(manifestPath, path.join(provenanceDir, 'nrtec_assets_manifest.json'));

if (errors.length > 0) {
  console.error(`\nFAILED: Encountered ${errors.length} errors:`);
  errors.forEach(e => console.error(e));
  process.exit(1);
}

console.log(`\nSUCCESS: All ${verifiedCount}/${manifest.length} NRTEC assets verified and ingested into public/assets/nrtec/!`);
