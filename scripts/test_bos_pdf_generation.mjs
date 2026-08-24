import fs from 'fs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Test single meeting PDF export
export function generateSingleBoSPDF(meeting, currentUser = null) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let y = margin;

  // 1. Header Banner
  doc.setFillColor(11, 25, 44);
  doc.rect(margin, y, pageWidth - (margin * 2), 24, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('NARASARAOPETA ENGINEERING COLLEGE (AUTONOMOUS)', pageWidth / 2, y + 8, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(212, 175, 55);
  doc.text('Approved by AICTE, Affiliated to JNTUK, Accredited with NAAC "A+" Grade & NBA', pageWidth / 2, y + 14, { align: 'center' });

  doc.setFontSize(8);
  doc.setTextColor(226, 232, 240);
  doc.text('BOARD OF STUDIES (BoS) — CURRICULUM & SYLLABUS GOVERNANCE', pageWidth / 2, y + 20, { align: 'center' });

  y += 28;

  // 2. Meeting Title & Key Badges
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(11, 25, 44);
  doc.text(meeting.title || `Board of Studies Meeting — ${meeting.bosNumber}`, margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Department: ${meeting.department || 'CSE (Cyber Security)'}  |  Regulation: ${meeting.regulationCodes || (meeting.regulations ? meeting.regulations.join(', ') : 'R23')}  |  AY: ${meeting.academicYear || '2023-24'}  |  Target: ${meeting.targetYear || 'All Years'}`, margin, y);
  y += 6;

  // 3. Metadata Table
  const metaRows = [
    [
      { content: 'BoS Ref Number:', styles: { fontStyle: 'bold', fillColor: [241, 245, 249] } },
      meeting.bosNumber || meeting.id || 'N/A',
      { content: 'Meeting Date & Time:', styles: { fontStyle: 'bold', fillColor: [241, 245, 249] } },
      `${meeting.bosDate || meeting.meetingDate || 'N/A'} at ${meeting.startTime || '10:00 AM'}`
    ],
    [
      { content: 'Meeting Mode:', styles: { fontStyle: 'bold', fillColor: [241, 245, 249] } },
      `${meeting.meetingMode || 'Online'} (${meeting.platform || meeting.venue || 'Microsoft Teams'})`,
      { content: 'Workflow Status:', styles: { fontStyle: 'bold', fillColor: [241, 245, 249] } },
      `${meeting.workflowStatus || 'DRAFT'} (Institutional Record)`
    ],
    [
      { content: 'Chairperson:', styles: { fontStyle: 'bold', fillColor: [241, 245, 249] } },
      { content: meeting.chairperson || meeting.chairman || 'Dr. V. V. A. S. Lakshmi (HOD)', colSpan: 3 }
    ]
  ];

  if (meeting.circularReference) {
    metaRows.push([
      { content: 'Circular Reference:', styles: { fontStyle: 'bold', fillColor: [241, 245, 249] } },
      meeting.circularReference,
      { content: 'Circular Date:', styles: { fontStyle: 'bold', fillColor: [241, 245, 249] } },
      meeting.circularDate || 'N/A'
    ]);
  }

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    body: metaRows,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2.5, textColor: [30, 41, 59] },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 55 },
      2: { cellWidth: 35 },
      3: { cellWidth: 57 }
    }
  });

  y = doc.lastAutoTable.finalY + 7;

  // 4. Committee Members Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(11, 25, 44);
  doc.text(`1. Board of Studies Committee Members (${(meeting.members && meeting.members.length) || 0} Members)`, margin, y);
  y += 4;

  const memberRows = (meeting.members || []).map((m, idx) => {
    const cat = m.member_type || m.category || (idx === 0 ? 'CHAIRMAN' : 'INTERNAL MEMBER');
    return [
      String(idx + 1),
      m.name || '—',
      cat.replace(/_/g, ' '),
      m.designation || '—',
      m.organization || m.institution || 'Narasaraopeta Engineering College'
    ];
  });

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [['#', 'Member Name', 'Category / Role', 'Designation', 'Institution / University']],
    body: memberRows.length > 0 ? memberRows : [['1', meeting.chairperson || 'Dr. V. V. A. S. Lakshmi', 'CHAIRMAN', 'HOD & Professor', 'Narasaraopeta Engineering College']],
    theme: 'striped',
    headStyles: { fillColor: [11, 25, 44], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 7.5 },
    bodyStyles: { fontSize: 7.5, cellPadding: 2.2, textColor: [30, 41, 59] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 46, fontStyle: 'bold' },
      2: { cellWidth: 34 },
      3: { cellWidth: 42 },
      4: { cellWidth: 52 }
    }
  });

  y = doc.lastAutoTable.finalY + 7;

  // Check if we need a new page for Agenda & Resolutions
  if (y > pageHeight - 50) {
    doc.addPage();
    y = margin;
  }

  // 5. Agenda Items
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(11, 25, 44);
  doc.text('2. Meeting Agenda & Points for Discussion', margin, y);
  y += 4;

  const agendaRows = (meeting.agendaItems || []).map((item, idx) => [
    String(item.itemNo || idx + 1),
    item.title || `Agenda Item ${idx + 1}`,
    item.description || item.title || '—'
  ]);

  if (agendaRows.length > 0) {
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [['Item #', 'Agenda Topic', 'Discussion Details']],
      body: agendaRows,
      theme: 'grid',
      headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 7.5 },
      bodyStyles: { fontSize: 7.5, cellPadding: 2.5, textColor: [30, 41, 59] },
      columnStyles: {
        0: { cellWidth: 14, halign: 'center' },
        1: { cellWidth: 60, fontStyle: 'bold' },
        2: { cellWidth: 108 }
      }
    });
    y = doc.lastAutoTable.finalY + 7;
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('   Detailed agenda items not recorded in summary source.', margin, y + 3);
    y += 9;
  }

  // Check page break
  if (y > pageHeight - 50) {
    doc.addPage();
    y = margin;
  }

  // 6. Resolutions & Decisions
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(11, 25, 44);
  doc.text('3. Resolutions & Official Meeting Outcomes', margin, y);
  y += 4;

  const resolutionRows = (meeting.resolutions || []).map((res, idx) => [
    String(res.resolutionNumber || idx + 1),
    res.title || `Resolution ${idx + 1}`,
    res.resolutionText || res.title || 'Approved as deliberated.'
  ]);

  if (resolutionRows.length > 0) {
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [['Res #', 'Subject', 'Resolution & Approved Outcome']],
      body: resolutionRows,
      theme: 'grid',
      headStyles: { fillColor: [4, 120, 87], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 7.5 },
      bodyStyles: { fontSize: 7.5, cellPadding: 2.5, textColor: [30, 41, 59] },
      columnStyles: {
        0: { cellWidth: 14, halign: 'center' },
        1: { cellWidth: 60, fontStyle: 'bold' },
        2: { cellWidth: 108 }
      }
    });
    y = doc.lastAutoTable.finalY + 7;
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('   Official resolutions recorded under signed minutes repository.', margin, y + 3);
    y += 9;
  }

  // 7. Provenance & Notes (if any)
  if (meeting.reviewNotes || meeting.sourceConfidence) {
    if (y > pageHeight - 35) {
      doc.addPage();
      y = margin;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Provenance & Institutional Review Notes:', margin, y);
    y += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    const splitNotes = doc.splitTextToSize(`Source Confidence: ${meeting.sourceConfidence || 'HIGH'} | Notes: ${meeting.reviewNotes || 'Verified against institutional source documents.'}`, pageWidth - (margin * 2));
    doc.text(splitNotes, margin, y);
    y += (splitNotes.length * 3.5) + 4;
  }

  // 8. Add Running Footer on every page
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text('NEC Autonomous Academic Management Portal  |  Generated from institutional database record. (Not the scanned physical signed minutes)', margin, pageHeight - 8);
    doc.text(`Page ${i} of ${totalPages}  |  Generated: ${new Date().toLocaleDateString('en-GB')}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
  }

  return doc;
}

// Test generation of R23 1st BoS PDF
import { normalizeBoSRecord } from './test_bos_cys_parser.mjs';

const pkgDir = 'd:/nec portal/data/NEC_CYS_BoS_Package';
const csvPath = `${pkgDir}/NEC_CYS_BoS_All_Meetings_Website_Import.csv`;
const csvContent = fs.readFileSync(csvPath, 'utf8');

// Parse records
const lines = csvContent.split('\n');
const headers = lines[0].split(',').map(h => h.trim());
console.log('Headers count:', headers.length);

const r23_01 = normalizeBoSRecord({
  meeting_source_key: 'BOS-CYS-R23-01',
  department_code: 'CYS',
  department_name: 'CSE (Cyber Security)',
  regulation_codes: 'R23',
  regulation_meeting_number: '1',
  academic_year: '2023-24',
  target_year: 'I',
  meeting_title: 'R23 - 1st Board of Studies Meeting - I Year',
  meeting_date: '2023-09-26',
  meeting_time: '10:00',
  meeting_mode: 'ONLINE',
  platform: 'Microsoft Teams',
  chairperson: 'Dr.V.V.A.S.Lakshmi',
  member_list_json: JSON.stringify([
    { name: 'Dr.V.V.A.S.Lakshmi', member_type: 'CHAIRMAN', designation: 'Professor & HOD', organization: 'Narasaraopeta Engineering College' },
    { name: 'Dr.ASN Chakravarthy', member_type: 'UNIVERSITY_NOMINEE', designation: 'Professor of CSE', organization: 'UCEK, JNTUK, Kakinada' },
    { name: 'Dr.K.V.Satyanarayana', member_type: 'SUBJECT_EXPERT', designation: 'Professor of CSE', organization: 'KL University, Vaddeswaram' },
    { name: 'Dr.M.Babu Reddy', member_type: 'SUBJECT_EXPERT', designation: 'Associate Professor of CS', organization: 'Krishna University, Machilipatnam' },
    { name: 'G.Venkata Ramana Rao', member_type: 'INDUSTRY_EXPERT', designation: 'Vice President - IT', organization: 'State Street Corporate Services, Hyderabad' },
    { name: 'Dr.G.K.V.Narasimha Reddy', member_type: 'INTERNAL_FACULTY', designation: 'Professor of CSE', organization: 'Narasaraopeta Engineering College' }
  ]),
  agenda_items_json: JSON.stringify([
    { itemNo: 1, title: 'Discussion on R23 B.Tech I & II Year Course Structure', description: 'Curriculum structure review aligned with APSCHE and AICTE model curriculum.' },
    { itemNo: 2, title: 'Approval of I Year Syllabus', description: 'Syllabus of C-Programming & Data Structures, Digital Logic Design, and Cyber Security Essentials.' }
  ]),
  resolutions_json: JSON.stringify([
    { resolutionNumber: 1, title: 'Approval of Course Structure', resolutionText: 'Resolved to approve the proposed course structure for I & II Year B.Tech Cyber Security under R23 Regulations.' },
    { resolutionNumber: 2, title: 'Approval of I Year Syllabus', resolutionText: 'Resolved to approve the detailed syllabus for I B.Tech Semester I and Semester II courses.' }
  ]),
  source_confidence: 'HIGH_WITH_NOTE',
  review_notes: 'Minutes and workbook identify this as R23. One agenda page contains an R20 wording reference; keep R23 as canonical.'
}, 2);

console.log('Generating PDF for R23 1st BoS...');
const pdfDoc = generateSingleBoSPDF(r23_01);
const pdfBuffer = Buffer.from(pdfDoc.output('arraybuffer'));
const outputPath = 'd:/nec portal/data/NEC_CYS_BoS_Package/NEC_CYS_R23_BoS_01_Generated_Test.pdf';
fs.writeFileSync(outputPath, pdfBuffer);
console.log(`✓ PDF successfully created at: ${outputPath} (${pdfBuffer.length} bytes)`);
