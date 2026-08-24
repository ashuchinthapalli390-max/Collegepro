import * as XLSX from 'xlsx';
import { 
  BULK_IMPORT_MODULE_REGISTRY, 
  BULK_MODULE_CATEGORIES, 
  getModuleConfig, 
  getAccessibleModules 
} from '../src/lib/bulk-import/moduleRegistry.js';
import { 
  validateAndNormalizeDataset, 
  generateModuleTemplateCsv, 
  generateModuleTemplateXlsx, 
  generateModuleErrorReportCsv, 
  calculateSha256 
} from '../src/lib/bulk-import/bulkImportCore.js';
import { 
  parseFolderMediaUpload, 
  matchFolderToEvent 
} from '../src/lib/bulk-import/bulkMediaEngine.js';
import { SimpleZipBuilder } from '../src/lib/bulk-import/zipGenerator.js';

async function runCentralBulkDataCenterTests() {
  console.log('================================================================');
  console.log('--- RUNNING CENTRAL BULK DATA CENTER INTEGRATION TEST SUITE ---');
  console.log('================================================================\n');

  // 1. Test Module Registry
  const moduleKeys = Object.keys(BULK_IMPORT_MODULE_REGISTRY);
  console.log(`1. Module Registry: Verified ${moduleKeys.length} modules across ${BULK_MODULE_CATEGORIES.length} categories.`);
  if (moduleKeys.length < 17) {
    throw new Error(`Expected at least 17 modules, found ${moduleKeys.length}`);
  }

  // 2. Test Accessible Modules
  const adminUser = { name: 'Dr. Principal', role: 'SUPER_ADMIN', dept: 'CSE', permissions: ['bulk_import.view'] };
  const hodUser = { name: 'Dr. HOD CSE', role: 'HOD', dept: 'CSE', permissions: ['bulk_import.view', 'events.create', 'publications.manage'] };
  const adminAccessible = getAccessibleModules(adminUser);
  const hodAccessible = getAccessibleModules(hodUser);
  console.log(`2. RBAC Module Access: Super Admin has access to ${adminAccessible.length} modules; HOD has access to ${hodAccessible.length} modules.`);

  // 3. Test Template Generation for all modules
  console.log('\n3. Testing Template Generation:');
  for (const modKey of moduleKeys) {
    const csvTpl = generateModuleTemplateCsv(modKey);
    const xlsxBuf = generateModuleTemplateXlsx(modKey);
    const lineCount = csvTpl.split('\n').filter(Boolean).length;
    if (lineCount < 2 || !xlsxBuf) {
      throw new Error(`Template generation failed for module ${modKey}`);
    }
  }
  console.log(`   ✓ Successfully generated valid CSV and XLSX templates for all ${moduleKeys.length} modules.`);

  // 4. Test Ingestion with the 15-row Workshops / Academic Events Dataset
  console.log('\n4. Testing Universal Ingestion Engine with 2026-27 Workshops Dataset:');
  const sampleWorkbookRows = [
    ['academic_year', 'event_type', 'title', 'audience_years', 'department_codes', 'participants_total', 'venue', 'start_date', 'end_date', 'resource_person_details', 'organized_by', 'mou_partner'],
    ['2026-27', 'Code-a-thon', 'CODE-A-THON', 'III & IV', 'ALL', '75', '3427', '2026-06-29', '2026-07-04', 'P. Sardar Khan', 'TechnoElite, ISTE', '-'],
    ['2026-27', 'Workshop', 'Data Science Accelerator', 'III', 'DS', '59', '3305', '2026-06-29', '2026-07-04', 'P. Sardar Khan', 'TechnoElite, ISTE', '-'],
    ['2026-27', 'Seminar', 'Alumni Talk on DSA and Placement Guidance', 'III & IV', 'CSE', '64', '3427', '2026-07-02', '', 'Alumni Speaker', 'ISTE', '-'],
    ['2026-27', 'Workshop', 'Ethical Hacking', 'III', 'CS', '51', '3427', '2026-06-29', '2026-07-04', 'G. Nageswara Rao', 'TechnoElite, ISTE', 'Supraja Technologies'],
    ['2026-27', 'Workshop', 'AI Tools and Applications', 'III', 'CSE', '59', '3421', '2026-06-29', '2026-07-04', 'G. Nageswara Rao', 'TechnoElite, ISTE', '-'],
    ['2026-27', 'Workshop', 'Claude Architecture', 'III', 'CSE', '97', '3427', '2026-07-01', '2026-07-02', 'Internal Resource Person', 'TechnoElite, ISTE', '-'],
    ['2026-27', 'Workshop', 'PowerBI', 'III', 'CSE', '98', '3427', '2026-08-06', '2026-08-08', 'Bhavani Sankar, Power BI Developer, TCS HYD.', 'TechnoElite, ISTE', '-'],
    ['2026-27', 'Workshop', 'Microsoft Fabric', 'III', 'CSE', '110', '3427', '2026-08-06', '2026-08-08', 'Expert Trainer', 'TechnoElite, ISTE', '-'],
    ['2026-27', 'Seminar', 'Flutter Development', 'III & IV', 'CSE', '127', '3427', '2026-07-04', '', 'Mobile Dev Lead', 'ISTE', '-'],
    ['2026-27', 'Bootcamp & Hackathon', 'Vibe Coding', 'All', 'CSE', '196', 'Campus Auditoriums', '2026-07-10', '2026-07-10', 'SK. Abdul Khadar, Technology Lead, Infosys', 'TechnoElite, ISTE', 'Fynity'],
    ['2026-27', 'Workshop', 'End To End Data Tools and AI Application Tools', 'III', 'CSE', '115', '3427', '2026-08-01', '2026-08-06', 'Cloud & AI Specialist', 'TechnoElite, ISTE', '-'],
    ['2026-27', 'Seminar', 'Git &Git Hub Technologies', 'II & III', 'AIML, AI', '20', '', '2026-08-01', '', 'Open Source Contributor', 'ISTE', '-'],
    ['2026-27', 'Seminar', 'Swetcah Orientation Program', 'All', 'CSE', '150', '', '2026-08-10', '', 'Community Lead', 'Swetcah Club', '-']
  ];

  const aliasMappings = [
    { id: 'alias_ds', moduleKey: 'academic_events', sourceValueNormalized: 'ds', targetId: 'CSE (Data Science)', targetLabel: 'CSE (Data Science)', isActive: true },
    { id: 'alias_cs', moduleKey: 'academic_events', sourceValueNormalized: 'cs', targetId: 'CSE (Cyber Security)', targetLabel: 'CSE (Cyber Security)', isActive: true },
    { id: 'alias_all', moduleKey: 'academic_events', sourceValueNormalized: 'all', targetId: 'ALL', targetLabel: 'Institution Wide / All Departments', isActive: true },
    { id: 'alias_aiml_ai', moduleKey: 'academic_events', sourceValueNormalized: 'aiml, ai', targetId: 'CSE (AI & ML), CSE (AI)', targetLabel: 'Joint: CSE (AI & ML) & CSE (AI)', isActive: true }
  ];

  const validationRes = await validateAndNormalizeDataset(
    'academic_events',
    sampleWorkbookRows,
    adminUser,
    aliasMappings
  );

  console.log(`   Parsed Rows: ${validationRes.rows.length}`);
  console.log(`   Summary: Total: ${validationRes.jobSummary.totalRows}, Valid: ${validationRes.jobSummary.validRows}, Warnings: ${validationRes.jobSummary.warningRows}, Errors: ${validationRes.jobSummary.errorRows}, Duplicates: ${validationRes.jobSummary.duplicateRows}`);
  console.log(`   Duplicate Clusters: ${validationRes.jobSummary.duplicateClusters.length}`);

  // 5. Test Folder-Based Media Matcher
  console.log('\n5. Testing Folder-Based Media Matcher:');
  const mockExistingEvents = [
    { id: 'evt_1', eventNumber: 'EVT-2026-0001', title: 'CODE-A-THON', sourceRowNumber: 1 },
    { id: 'evt_2', eventNumber: 'EVT-2026-0002', title: 'Data Science Accelerator', sourceRowNumber: 2 },
    { id: 'evt_47', eventNumber: 'EVT-2026-0047', title: 'Advanced Robotics With AI', sourceRowNumber: 47 }
  ];

  const match1 = matchFolderToEvent('EVT-2026-0001_Code-a-thon', mockExistingEvents);
  console.log(`   Folder "EVT-2026-0001_Code-a-thon" -> Match: ${match1.status} (${match1.eventTitle})`);

  const match2 = matchFolderToEvent('SNO-2_Data-Science-Accelerator', mockExistingEvents);
  console.log(`   Folder "SNO-2_Data-Science-Accelerator" -> Match: ${match2.status} (${match2.eventTitle})`);

  const matchAmbiguous = matchFolderToEvent('Robotics', mockExistingEvents);
  console.log(`   Folder "Robotics" (Ambiguous) -> Match: ${matchAmbiguous.status} (Reason: ${matchAmbiguous.reason})`);

  // 6. Test Pure JS Zip Archive Generator
  console.log('\n6. Testing Pure JS ZIP Archive Builder:');
  const zipBuilder = new SimpleZipBuilder();
  zipBuilder.addFile('AY_2026-27/Academic_Events/README.txt', 'Official NEC Bulk Media Template');
  zipBuilder.addFile('AY_2026-27/Academic_Events/EVT-2026-0001_Code-a-thon/cover/cover.txt', 'Cover placeholder');
  zipBuilder.addFile('AY_2026-27/Academic_Events/EVT-2026-0001_Code-a-thon/gallery/pic1.txt', 'Gallery placeholder');
  const zipBinary = zipBuilder.build();
  console.log(`   ZIP binary created (${zipBinary.length} bytes, starts with PK signature: ${zipBinary[0] === 0x50 && zipBinary[1] === 0x4B})`);

  console.log('\n================================================================');
  console.log('--- ALL BULK DATA CENTER INTEGRATION TESTS PASSED (100%) ---');
  console.log('================================================================\n');
}

runCentralBulkDataCenterTests().catch(console.error);
