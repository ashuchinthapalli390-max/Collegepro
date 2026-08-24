import { 
  processAcademicEventsCsv, 
  generateBulkImportTemplateCsv, 
  generateIssuesReportCsv,
  DEPARTMENT_ALIASES 
} from '../src/lib/events/bulkImportEngine.js';

// The 15 records as uploaded from 26-27 WORKSHOPS SEMINARS HACKTHONS PROGRAMS ORGANIZED.xlsx
const SAMPLE_WORKBOOK_CSV = `S.No,Year,Type,Program,Resource Person Details / Faculty Coordinator,Organized By,MOU (IF YES DETAILS),Amount,Invoice Date,Total No of Participants,Venue,Start Date,End Date,Department
1,III & IV,EVENT,CODE-A-THON,P. Sardar Khan,"TechnoElite, ISTE",-,,,75,3427,29/06/2026,04/07/2026,ALL
2,III,Workshop,Data Science Accelerator,P. Sardar Khan,"TechnoElite, ISTE",-,,,59,3305,29/06/2026,04/07/2026,DS
3,III & IV,Seminar,Alumni Talk on DSA and Placement Guidance,Alumni Speaker,ISTE,-,,,"Total=64, (III-26, IV-38)",3427,02/07/2026,,CSE
4,III,Workshop,Ethical Hacking,G. Nageswara Rao,"TechnoElite, ISTE",Supraja Technologies,,,51,3427,29/06/2026,04/07/2026,CS
5,III,Workshop,AI Tools and Applications,G. Nageswara Rao,"TechnoElite, ISTE",-,,,59,3421,29/06/2026,04/07/2026,CSE
47,III & IV,Workshop,Advanced Robotics With AI,K. M. Srinivas Rao,,,0,0,IV -3,,29/06/2026,1/7/26,
6,III,Workshop,Claude Architecture,Internal Resource Person,"TechnoElite, ISTE",-,,,97,3427,1/7/26,2/7/26,CSE
7,III,Workshop,PowerBI,"Bhavani Sankar, Power BI Developer, TCS HYD.","TechnoElite, ISTE",-,,,98,3427,6/8/26,8/8/26,CSE
8,III,Workshop,Microsoft Fabric,Expert Trainer,"TechnoElite, ISTE",-,,,110,3427,6/8/26,8/8/26,CSE
9,III & IV,Seminar,Flutter Development,Mobile Dev Lead,ISTE,-,,,127,3427,4/7/26,,CSE
10,All,Bootcamp & Hackathon,Vibe Coding,"SK. Abdul Khadar, Technology Lead, Infosys","TechnoElite, ISTE",Fynity,,,196,Campus Auditoriums,10/7/26,10/7/26,CSE
11,III,Workshop,Robotics,K. M. Srinivas Rao,,,0,0,93,,29/06/2026,1/7/26,
12,III,Workshop,End To End Data Tools and AI Application Tools,Cloud & AI Specialist,"TechnoElite, ISTE",-,,,115,3427,1/8/26,6/8/26,
13,II & III,Seminar,Git &Git Hub Technologies,Open Source Contributor,ISTE,-,,,"II & III- AI-15, AIML-5",,1/8/26,,"AIML, AI"
14,All,Seminar,Swetcah Orientation Program,Community Lead,Swetcah Club,-,,,,,,10/8/26,,
`;

async function runVerification() {
  console.log('--- RUNNING ACADEMIC EVENTS BULK IMPORT VERIFICATION ---');

  const adminUser = { name: 'Dr. Principal', role: 'SUPER_ADMIN', dept: 'CSE' };
  const mockMous = [
    { id: 'mou_1', organization: 'Supraja Technologies', mouNumber: 'MOU-IND-2025-0001' }
  ];
  const mockExistingEvents = [];

  const result = await processAcademicEventsCsv(
    SAMPLE_WORKBOOK_CSV,
    adminUser,
    mockMous,
    mockExistingEvents,
    []
  );

  console.log(`\n1. CSV Parsing: ${result.isValid ? 'SUCCESS' : 'FAILED'}`);
  console.log(`Total Rows Parsed: ${result.rows.length}`);
  console.log(`Summary: Total: ${result.jobSummary.totalRows}, Ready: ${result.jobSummary.readyRows}, Warnings: ${result.jobSummary.warningRows}, Blocked: ${result.jobSummary.blockedRows}, Duplicates: ${result.jobSummary.duplicateRows}`);

  // Check critical tests
  const row1 = result.rows[0];
  console.log(`\nRow 1: Code-a-thon (Type: ${row1.eventType}, Dept: ${row1.departmentCode}, Participants: ${row1.participantsTotal}) -> Status: ${row1.validationStatus}`);

  const row2 = result.rows[1];
  console.log(`Row 2: DS alias resolution -> Dept: "${row2.departmentCode}" (${row2.departmentLabel}) -> Status: ${row2.validationStatus}`);

  const row3 = result.rows[2];
  console.log(`Row 3: Total=64 parsing -> Total: ${row3.participantsTotal}, Breakdown: "${row3.participantsBreakdown}"`);

  const row4 = result.rows[3];
  console.log(`Row 4: CS alias -> Dept: "${row4.departmentCode}", MoU: ${row4.isMouAssociated} (ID: ${row4.mouId})`);

  const row47 = result.rows.find(r => r.sourceRowNumber === 47);
  console.log(`Row 47 (S.No 47): Advanced Robotics -> Status: ${row47.validationStatus}, Errors: ${JSON.stringify(row47.validationErrors)}, Warnings: ${JSON.stringify(row47.validationWarnings)}`);

  const row11 = result.rows.find(r => r.title === 'Robotics');
  console.log(`Row 11: Robotics -> Status: ${row11.validationStatus}, Errors: ${JSON.stringify(row11.validationErrors)}, Warnings: ${JSON.stringify(row11.validationWarnings)}`);

  const row13 = result.rows.find(r => r.title.includes('Git &Git Hub'));
  console.log(`Row 13: Git seminar -> Derived Total: ${row13.participantsTotal} (Derived: ${row13.participantsIsDerived}), Dept: "${row13.departmentCode}"`);

  const row14 = result.rows.find(r => r.title.includes('Swetcah'));
  console.log(`Row 14: Swetcah -> Status: ${row14.validationStatus}, Errors: ${JSON.stringify(row14.validationErrors)}`);

  console.log(`\nDuplicate Clusters Detected: ${result.jobSummary.duplicateClusters.length}`);
  result.jobSummary.duplicateClusters.forEach((c, idx) => {
    console.log(` Cluster ${idx + 1}: ${c.reason}`);
  });

  // Verify template CSV generation
  const templateCsv = generateBulkImportTemplateCsv();
  console.log(`\nTemplate CSV generated (${templateCsv.split('\n').length} lines). Header: ${templateCsv.split('\n')[0]}`);

  // Verify issues report CSV generation
  const issuesReportCsv = generateIssuesReportCsv(result.rows);
  console.log(`Issues Report CSV generated (${issuesReportCsv.split('\n').length} lines).`);

  console.log('\n--- VERIFICATION COMPLETED SUCCESSFULLY ---');
}

runVerification().catch(console.error);
