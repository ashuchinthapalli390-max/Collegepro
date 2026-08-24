import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { runIngestion } from './ingest_event_media.mjs';
import { 
  VERIFIED_EVENT_MEDIA_REGISTRY,
  INGESTED_MEDIA_ASSETS,
  RECORD_MEDIA_LINKS,
  getVerifiedMediaForEvent 
} from '../src/data/verified-event-media.js';
import { 
  INITIAL_EVENTS 
} from '../src/data/masterData.js';
import { 
  getAcademicEvents, 
  getMediaAssets, 
  getRecordMediaLinks 
} from '../src/data/portalStore.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

async function runTestSuite() {
  console.log('\n=============================================================');
  console.log('NEC PORTAL: ACADEMIC EVENT MEDIA INGESTION TEST SUITE');
  console.log('=============================================================\n');

  // Test 1: Ingestion Manifest & Discovery
  console.log('--- TEST 1: Source Discovery & Manifest Integrity ---');
  const reportPath = path.resolve('event-media-ingest-report.json');
  assert(fs.existsSync(reportPath), 'event-media-ingest-report.json exists');

  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  assert(report.topLevelFoldersCount === 14, `Found exactly 14 top-level folders (got ${report.topLevelFoldersCount})`);
  assert(report.scannedFilesCount === 42, `Found exactly 42 raw files across folders (got ${report.scannedFilesCount})`);
  assert(report.uniqueFilesCount === 37, `Found exactly 37 unique media assets (got ${report.uniqueFilesCount})`);
  assert(report.duplicateFilesCount === 5, `Found exactly 5 duplicate files skipped (got ${report.duplicateFilesCount})`);

  // Test 2: Duplicate Detection & Non-pollution
  console.log('\n--- TEST 2: SHA-256 Deduplication & Code-a-thon Isolation ---');
  const codeathonEntry = VERIFIED_EVENT_MEDIA_REGISTRY['code-a-thon'];
  assert(codeathonEntry !== undefined, 'Code-a-thon entry exists in registry');
  assert(codeathonEntry.hasPoster === true || codeathonEntry.poster !== null, 'Code-a-thon has official poster');
  assert(codeathonEntry.gallery.length === 1, `Code-a-thon has exactly 1 direct gallery image (got ${codeathonEntry.gallery.length})`);
  
  // Verify nested Robotics media was not polluted into Code-a-thon
  const codeathonGallerySrcs = codeathonEntry.gallery.map(g => g.src);
  assert(!codeathonGallerySrcs.some(src => src.includes('594a1b18') || src.includes('robotics')), 'Nested Robotics media NOT assigned to Code-a-thon');

  // Test 3: Exact & Confirmed Alias Mappings
  console.log('\n--- TEST 3: Deterministic Event Mappings & Aliases ---');
  const dsaEntry = VERIFIED_EVENT_MEDIA_REGISTRY['dsa-placement-guidance'];
  assert(dsaEntry && dsaEntry.mappingStatus === 'CONFIRMED_ALIAS', 'DSA & Placement Guidance mapped as CONFIRMED_ALIAS');
  assert(dsaEntry.eventId === 'evt_2026_27_003', 'DSA correctly mapped to evt_2026_27_003');

  const gitEntry = VERIFIED_EVENT_MEDIA_REGISTRY['git-github'];
  assert(gitEntry && gitEntry.mappingStatus === 'CONFIRMED_ALIAS', 'Git & Github mapped as CONFIRMED_ALIAS');
  assert(gitEntry.eventId === 'evt_2026_27_011', 'Git & Github mapped to evt_2026_27_011');

  const roboticsEntry = VERIFIED_EVENT_MEDIA_REGISTRY['advanced-robotics-with-ai'];
  assert(roboticsEntry && roboticsEntry.mappingStatus === 'EXACT', 'Advanced Robotics With AI mapped as EXACT');
  assert(roboticsEntry.eventId === 'evt_2026_27_047', 'Advanced Robotics mapped to evt_2026_27_047');
  assert(roboticsEntry.gallery.length === 4, `Advanced Robotics has 4 gallery images (got ${roboticsEntry.gallery.length})`);

  // Test 4: Swecha One Day Seminar (NEEDS_REVIEW, Poster = NULL)
  console.log('\n--- TEST 4: Swecha One Day Seminar Handling ---');
  const swechaEntry = VERIFIED_EVENT_MEDIA_REGISTRY['swecha-one-day-seminar'];
  assert(swechaEntry !== undefined, 'Swecha entry exists in registry');
  assert(swechaEntry.mappingStatus === 'NEEDS_REVIEW', 'Swecha is flagged as NEEDS_REVIEW');
  assert(swechaEntry.poster === null, 'Swecha poster is strictly NULL');
  assert(swechaEntry.gallery.length === 2, `Swecha has 2 session gallery images (got ${swechaEntry.gallery.length})`);

  // Test 5: Ideathon 2k26 (UNMATCHED_EVENT, Zero Fake Events Created)
  console.log('\n--- TEST 5: Ideathon 2k26 (Unmatched Event) ---');
  const ideathonEntry = VERIFIED_EVENT_MEDIA_REGISTRY['ideathon-2k26'];
  assert(ideathonEntry !== undefined, 'Ideathon entry exists in registry');
  assert(ideathonEntry.mappingStatus === 'UNMATCHED', 'Ideathon is flagged as UNMATCHED');
  assert(ideathonEntry.eventId === null, 'Ideathon eventId is strictly NULL');

  const allEvents = INITIAL_EVENTS;
  const fakeIdeathon = allEvents.find(e => (e.title || '').toLowerCase().includes('ideathon'));
  assert(fakeIdeathon === undefined, 'No fake Ideathon event created in master database');

  // Test 6: Zero Borrowed Media for Events with No Source Media
  console.log('\n--- TEST 6: AI Tools and Applications & Separate Robotics No-Borrow Rule ---');
  const aiToolsEvent = getAcademicEvents().find(e => e.id === 'evt_2026_27_005');
  assert(aiToolsEvent !== undefined, 'AI Tools and Applications event exists');
  assert(aiToolsEvent.posterUrl === null || aiToolsEvent.poster === null, 'AI Tools has NULL poster (no borrowed poster)');
  assert(Array.isArray(aiToolsEvent.gallery) && aiToolsEvent.gallery.length === 0, 'AI Tools has empty gallery (no borrowed images)');

  const sepRoboticsEvent = getAcademicEvents().find(e => e.id === 'evt_2026_27_011_rob');
  assert(sepRoboticsEvent !== undefined, 'Separate Robotics event exists');
  assert(sepRoboticsEvent.posterUrl === null, 'Separate Robotics event has NULL poster');
  assert(sepRoboticsEvent.gallery.length === 0, 'Separate Robotics event has empty gallery');

  // Test 7: WebP Asset Optimization & File Dimensions
  console.log('\n--- TEST 7: WebP Derivatives & Image Integrity ---');
  let checkedWebPCount = 0;
  for (const entry of Object.values(VERIFIED_EVENT_MEDIA_REGISTRY)) {
    if (entry.poster) {
      const posterDiskPath = path.join('public', entry.poster.src.replace(/^\//, ''));
      assert(fs.existsSync(posterDiskPath), `Poster file exists: ${entry.poster.src}`);
      const meta = await sharp(posterDiskPath).metadata();
      assert(meta.format === 'webp', `Poster is WebP format: ${posterDiskPath}`);
      assert(meta.width > 0 && meta.height > 0, `Valid dimensions: ${meta.width}x${meta.height}`);
      checkedWebPCount++;
    }

    for (const g of entry.gallery) {
      const gDiskPath = path.join('public', g.src.replace(/^\//, ''));
      assert(fs.existsSync(gDiskPath), `Gallery file exists: ${g.src}`);
      const meta = await sharp(gDiskPath).metadata();
      assert(meta.format === 'webp', `Gallery photo is WebP format: ${gDiskPath}`);
      assert(meta.width > 0 && meta.height > 0, `Valid dimensions: ${meta.width}x${meta.height}`);
      checkedWebPCount++;
    }
  }
  assert(checkedWebPCount === 37, `Verified all 37 WebP files on disk (checked ${checkedWebPCount})`);

  // Test 8: Store Resolution & Relational Links
  console.log('\n--- TEST 8: Store Resolution & Security Defaults ---');
  const codeathonFromStore = getAcademicEvents().find(e => e.id === 'evt_2026_27_001');
  assert(codeathonFromStore.posterUrl !== null, 'Code-a-thon has posterUrl populated from verified media');
  assert(codeathonFromStore.gallery.length === 1, 'Code-a-thon has gallery attached');
  assert(codeathonFromStore.photosPayload.length === 1, 'Code-a-thon has photosPayload populated');
  assert(codeathonFromStore.photosPayload[0].visibility === 'PRIVATE', 'Default media visibility is PRIVATE');

  const assets = getMediaAssets();
  assert(assets.length === 37, `Media assets store contains 37 records (got ${assets.length})`);

  const links = getRecordMediaLinks();
  assert(links.length > 0, `Record media links store contains ${links.length} relational links`);

  // Summary
  console.log('\n=============================================================');
  console.log(`TEST SUITE RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('=============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch(err => {
  console.error('Test suite runner crashed:', err);
  process.exit(1);
});
