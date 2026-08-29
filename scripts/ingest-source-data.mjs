/**
 * ET Portal - Master Canonical Ingestion Engine
 * Ingests all 5 verified source datasets:
 *  1. Patents: 4 canonical published patents (40 inventor links, 18 unique faculty)
 *  2. Campus Placements: 63 offer rows (43 unique students, 11 companies, 1 duplicate candidate, 2 dept conflicts)
 *  3. Student Achievements: 46 records (41 unique students, AI:31, AIML:12, DS:2, CYS:1, 44 academic, 2 sports)
 *  4. Academic Events/Workshops: 15 canonical events (no fake sections, date conflict preservation)
 *  5. Board of Studies: 6 canonical CYS meetings (2 R20 summary + 4 R23 detailed, 4 real PDF attachments)
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DATA_DIR = path.resolve('data/import-source');

function computeSha256(content) {
  return crypto.createHash('sha256').update(typeof content === 'string' ? content : JSON.stringify(content)).digest('hex');
}

console.log('================================================================');
console.log('--- ET PORTAL MASTER CANONICAL SOURCE INGESTION ENGINE ---');
console.log('================================================================\n');

// 1. Ingest Patents
const patentsFile = path.join(DATA_DIR, 'patents/canonical_patents.json');
const patentsRaw = fs.readFileSync(patentsFile, 'utf8');
const patents = JSON.parse(patentsRaw);
const patentsSha256 = computeSha256(patentsRaw);

const totalInventors = patents.reduce((acc, p) => acc + (p.inventors?.length || 0), 0);
const uniqueFaculty = new Set();
patents.forEach(p => (p.inventors || []).forEach(inv => uniqueFaculty.add(inv.name.trim().toLowerCase())));

console.log(`[PATENTS] Ingested ${patents.length} canonical published patents.`);
console.log(`   - Total Inventor Links: ${totalInventors}`);
console.log(`   - Unique Faculty Names: ${uniqueFaculty.size}`);
console.log(`   - SHA-256: ${patentsSha256}`);

// 2. Ingest Campus Placements
const placementsFile = path.join(DATA_DIR, 'placements/canonical_placements.json');
const placementsRaw = fs.readFileSync(placementsFile, 'utf8');
const placements = JSON.parse(placementsRaw);
const placementsSha256 = computeSha256(placementsRaw);

const uniqueStudentsPlacements = new Set(placements.map(p => p.studentRoll.trim().toUpperCase()));
const uniqueCompanies = new Set(placements.map(p => p.companyName.trim().toLowerCase()));
const duplicateCandidates = placements.filter(p => p.isDuplicateCandidate || p.status === 'DUPLICATE_CANDIDATE');
const deptConflicts = placements.filter(p => p.departmentConflict);
const nullPackages = placements.filter(p => p.packageLpa === null || p.packageLpa === undefined);

console.log(`\n[CAMPUS PLACEMENTS] Ingested ${placements.length} source offer rows.`);
console.log(`   - Unique Placed Students: ${uniqueStudentsPlacements.size}`);
console.log(`   - Unique Hiring Companies: ${uniqueCompanies.size}`);
console.log(`   - Duplicate Candidates: ${duplicateCandidates.length} (Roll: ${duplicateCandidates.map(d => d.studentRoll).join(', ')})`);
console.log(`   - Department Conflicts: ${deptConflicts.length} (Rolls: ${deptConflicts.map(d => d.studentRoll).join(', ')})`);
console.log(`   - Null/Missing Package Rows: ${nullPackages.length} (Roll: ${nullPackages.map(d => d.studentRoll).join(', ')})`);
console.log(`   - SHA-256: ${placementsSha256}`);

// 3. Ingest Student Achievements
const achievementsFile = path.join(DATA_DIR, 'achievements/canonical_achievements.json');
const achievementsRaw = fs.readFileSync(achievementsFile, 'utf8');
const achievements = JSON.parse(achievementsRaw);
const achievementsSha256 = computeSha256(achievementsRaw);

const uniqueStudentsAchievements = new Set(achievements.map(a => a.rollNumber.trim().toUpperCase()));
const deptCounts = { AI: 0, AIML: 0, DS: 0, CYS: 0 };
achievements.forEach(a => { if (deptCounts[a.departmentCode] !== undefined) deptCounts[a.departmentCode]++; });
const typeCounts = { Academic: 0, Sports: 0 };
achievements.forEach(a => { if (typeCounts[a.category] !== undefined) typeCounts[a.category]++; });

console.log(`\n[STUDENT ACHIEVEMENTS] Ingested ${achievements.length} valid achievement records.`);
console.log(`   - Unique Students: ${uniqueStudentsAchievements.size}`);
console.log(`   - Department Breakdown: AI=${deptCounts.AI}, AIML=${deptCounts.AIML}, DS=${deptCounts.DS}, CYS=${deptCounts.CYS}`);
console.log(`   - Category Breakdown: Academic=${typeCounts.Academic}, Sports=${typeCounts.Sports}`);
console.log(`   - SHA-256: ${achievementsSha256}`);

// 4. Ingest Workshops & Academic Events
const workshopsFile = path.join(DATA_DIR, 'workshops/canonical_workshops.json');
const workshopsRaw = fs.readFileSync(workshopsFile, 'utf8');
const workshops = JSON.parse(workshopsRaw);
const workshopsSha256 = computeSha256(workshopsRaw);

const eventTypes = {};
workshops.forEach(w => { eventTypes[w.eventType] = (eventTypes[w.eventType] || 0) + 1; });
const dateConflicts = workshops.filter(w => w.hasDateConflict);

console.log(`\n[ACADEMIC EVENTS & WORKSHOPS] Ingested ${workshops.length} canonical event records.`);
console.log(`   - Event Types: ${JSON.stringify(eventTypes)}`);
console.log(`   - Date Conflict Flagged Events: ${dateConflicts.length}`);
console.log(`   - SHA-256: ${workshopsSha256}`);

// 5. Ingest Board of Studies
const bosFile = path.join(DATA_DIR, 'bos/canonical_bos.json');
const bosRaw = fs.readFileSync(bosFile, 'utf8');
const bos = JSON.parse(bosRaw);
const bosSha256 = computeSha256(bosRaw);

console.log(`\n[BOARD OF STUDIES] Ingested ${bos.length} canonical CYS meetings.`);
console.log(`   - Meetings: ${bos.map(b => `${b.bosNumber} (${b.academicYear})`).join(', ')}`);
console.log(`   - Attached PDFs: ${bos.filter(b => b.hasDocument).length}`);
console.log(`   - SHA-256: ${bosSha256}`);

// Update src/data/masterData.js
console.log('\n--- UPDATING src/data/masterData.js WITH CANONICAL SEED ARRAYS ---');

let masterDataCode = fs.readFileSync('src/data/masterData.js', 'utf8');

// Replace empty initial constants with formatted canonical objects
function updateExportConst(code, constName, value) {
  const regex = new RegExp(`export const ${constName} = [\\s\\S]*?;`, 'm');
  const replacement = `export const ${constName} = ${JSON.stringify(value, null, 2)};`;
  if (regex.test(code)) {
    return code.replace(regex, replacement);
  }
  return code + `\n${replacement}\n`;
}

masterDataCode = updateExportConst(masterDataCode, 'INITIAL_PATENTS', patents);
masterDataCode = updateExportConst(masterDataCode, 'INITIAL_CAMPUS_PLACEMENTS', placements);
masterDataCode = updateExportConst(masterDataCode, 'INITIAL_PLACEMENTS', placements);
masterDataCode = updateExportConst(masterDataCode, 'INITIAL_STUDENT_ACHIEVEMENTS', achievements);
masterDataCode = updateExportConst(masterDataCode, 'INITIAL_EVENTS', workshops);
masterDataCode = updateExportConst(masterDataCode, 'INITIAL_BOS', bos);

fs.writeFileSync('src/data/masterData.js', masterDataCode, 'utf8');
console.log('✅ Successfully updated src/data/masterData.js with all canonical datasets!');

// Create persistence store snapshot file for server-side persistence
const serverDataDir = path.resolve('data/server-db');
if (!fs.existsSync(serverDataDir)) {
  fs.mkdirSync(serverDataDir, { recursive: true });
}

const serverState = {
  patents,
  placements,
  campusPlacements: placements,
  studentAchievements: achievements,
  events: workshops,
  bos: bos,
  manifest: {
    lastIngestedAt: new Date().toISOString(),
    patentsSha256,
    placementsSha256,
    achievementsSha256,
    workshopsSha256,
    bosSha256,
    counts: {
      patents: patents.length,
      patentInventors: totalInventors,
      uniquePatentFaculty: uniqueFaculty.size,
      placements: placements.length,
      uniquePlacementStudents: uniqueStudentsPlacements.size,
      placementCompanies: uniqueCompanies.size,
      studentAchievements: achievements.length,
      uniqueAchievementStudents: uniqueStudentsAchievements.size,
      academicEvents: workshops.length,
      bosMeetings: bos.length
    }
  }
};

fs.writeFileSync(path.join(serverDataDir, 'portal_db_state.json'), JSON.stringify(serverState, null, 2), 'utf8');
console.log('✅ Successfully updated data/server-db/portal_db_state.json with server state!');
console.log('\n================================================================');
console.log('--- MASTER CANONICAL INGESTION COMPLETE ---');
console.log('================================================================');
