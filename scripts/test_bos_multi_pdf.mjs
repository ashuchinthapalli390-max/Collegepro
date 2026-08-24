import fs from 'fs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { normalizeBoSRecord } from './test_bos_cys_parser.mjs';

// Multi-meeting executive BoS PDF report
export function generateBoSReportPDF(meetings, filters = {}, actor = null) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let y = margin;

  // Header Banner
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
  doc.text('BOARD OF STUDIES (BoS) — COMPREHENSIVE INSTITUTIONAL REPORT', pageWidth / 2, y + 20, { align: 'center' });

  y += 28;

  // Title & Filter Summary
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(11, 25, 44);
  doc.text(`Department BoS Meetings Summary (${meetings.length} Records)`, margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Filter Scope: Department: ${filters.dept || 'All'} | Regulation: ${filters.reg || 'All'} | Academic Year: ${filters.ay || 'All'}`, margin, y);
  y += 6;

  // Executive Summary Table
  const summaryRows = meetings.map((m, idx) => [
    String(idx + 1),
    m.bosNumber || m.id || 'N/A',
    m.department || 'CSE (Cyber Security)',
    m.regulationCodes || (m.regulations ? m.regulations.join(', ') : 'R23'),
    m.bosDate || m.meetingDate || '—',
    m.targetYear || '—',
    String((m.members && m.members.length) || 0),
    m.workflowStatus || 'DRAFT'
  ]);

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [['#', 'Meeting Ref', 'Department', 'Regulation', 'Date', 'Target', 'Members', 'Status']],
    body: summaryRows,
    theme: 'striped',
    headStyles: { fillColor: [11, 25, 44], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 7.5 },
    bodyStyles: { fontSize: 7.5, cellPadding: 2.2, textColor: [30, 41, 59] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 38, fontStyle: 'bold' },
      2: { cellWidth: 42 },
      3: { cellWidth: 18, halign: 'center' },
      4: { cellWidth: 22 },
      5: { cellWidth: 20 },
      6: { cellWidth: 16, halign: 'center' },
      7: { cellWidth: 18 }
    }
  });

  y = doc.lastAutoTable.finalY + 8;

  // Render Details for Each Meeting
  meetings.forEach((meeting, mIdx) => {
    // Each detailed meeting starts on a fresh page or section
    doc.addPage();
    let my = margin;

    // Meeting Section Header
    doc.setFillColor(30, 41, 59);
    doc.rect(margin, my, pageWidth - (margin * 2), 12, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(`RECORD ${mIdx + 1} OF ${meetings.length}: ${meeting.bosNumber || meeting.id} — ${meeting.title || 'BoS Meeting'}`, margin + 4, my + 8);
    my += 16;

    // Meeting Metadata table
    const mRows = [
      [
        { content: 'Department:', styles: { fontStyle: 'bold', fillColor: [241, 245, 249] } },
        meeting.department || 'CSE (Cyber Security)',
        { content: 'Meeting Date & Time:', styles: { fontStyle: 'bold', fillColor: [241, 245, 249] } },
        `${meeting.bosDate || meeting.meetingDate || 'N/A'} at ${meeting.startTime || '10:00 AM'}`
      ],
      [
        { content: 'Regulation & Target:', styles: { fontStyle: 'bold', fillColor: [241, 245, 249] } },
        `${meeting.regulationCodes || (meeting.regulations ? meeting.regulations.join(', ') : 'R23')} (${meeting.targetYear || 'All Years'})`,
        { content: 'Mode & Venue:', styles: { fontStyle: 'bold', fillColor: [241, 245, 249] } },
        `${meeting.meetingMode || 'Online'} (${meeting.platform || meeting.venue || 'Microsoft Teams'})`
      ],
      [
        { content: 'Chairperson:', styles: { fontStyle: 'bold', fillColor: [241, 245, 249] } },
        { content: meeting.chairperson || meeting.chairman || 'Dr. V. V. A. S. Lakshmi (HOD)', colSpan: 3 }
      ]
    ];

    autoTable(doc, {
      startY: my,
      margin: { left: margin, right: margin },
      body: mRows,
      theme: 'grid',
      styles: { fontSize: 7.5, cellPadding: 2, textColor: [30, 41, 59] },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 55 },
        2: { cellWidth: 35 },
        3: { cellWidth: 57 }
      }
    });

    my = doc.lastAutoTable.finalY + 6;

    // Committee Members Table
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(11, 25, 44);
    doc.text(`Committee Members (${(meeting.members && meeting.members.length) || 0})`, margin, my);
    my += 3.5;

    const memRows = (meeting.members || []).map((mem, idx) => [
      String(idx + 1),
      mem.name || '—',
      (mem.member_type || mem.category || 'MEMBER').replace(/_/g, ' '),
      mem.designation || '—',
      mem.organization || mem.institution || 'Narasaraopeta Engineering College'
    ]);

    autoTable(doc, {
      startY: my,
      margin: { left: margin, right: margin },
      head: [['#', 'Member Name', 'Role', 'Designation', 'Institution']],
      body: memRows.length > 0 ? memRows : [['1', meeting.chairperson || 'Dr. V. V. A. S. Lakshmi', 'CHAIRMAN', 'HOD & Professor', 'Narasaraopeta Engineering College']],
      theme: 'striped',
      headStyles: { fillColor: [11, 25, 44], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 7 },
      bodyStyles: { fontSize: 7, cellPadding: 1.8, textColor: [30, 41, 59] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: {
        0: { cellWidth: 8, halign: 'center' },
        1: { cellWidth: 46, fontStyle: 'bold' },
        2: { cellWidth: 34 },
        3: { cellWidth: 42 },
        4: { cellWidth: 52 }
      }
    });

    my = doc.lastAutoTable.finalY + 5;

    // Agenda & Resolutions summary
    if (meeting.agendaItems && meeting.agendaItems.length > 0) {
      if (my > pageHeight - 40) {
        doc.addPage();
        my = margin;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(11, 25, 44);
      doc.text(`Agenda & Deliberations (${meeting.agendaItems.length} Items)`, margin, my);
      my += 3.5;

      const agRows = meeting.agendaItems.map((ag, idx) => [
        String(ag.itemNo || idx + 1),
        ag.title || `Agenda Item ${idx + 1}`,
        ag.description || ag.title || '—'
      ]);

      autoTable(doc, {
        startY: my,
        margin: { left: margin, right: margin },
        head: [['#', 'Agenda Topic', 'Discussion / Context']],
        body: agRows,
        theme: 'grid',
        headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 7 },
        bodyStyles: { fontSize: 7, cellPadding: 2, textColor: [30, 41, 59] },
        columnStyles: {
          0: { cellWidth: 10, halign: 'center' },
          1: { cellWidth: 56, fontStyle: 'bold' },
          2: { cellWidth: 116 }
        }
      });

      my = doc.lastAutoTable.finalY + 5;
    }

    if (meeting.resolutions && meeting.resolutions.length > 0) {
      if (my > pageHeight - 40) {
        doc.addPage();
        my = margin;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(11, 25, 44);
      doc.text(`Resolutions & Approved Outcomes (${meeting.resolutions.length} Decisions)`, margin, my);
      my += 3.5;

      const resRows = meeting.resolutions.map((r, idx) => [
        String(r.resolutionNumber || idx + 1),
        r.title || `Resolution ${idx + 1}`,
        r.resolutionText || r.title || 'Approved.'
      ]);

      autoTable(doc, {
        startY: my,
        margin: { left: margin, right: margin },
        head: [['#', 'Subject', 'Resolution Details']],
        body: resRows,
        theme: 'grid',
        headStyles: { fillColor: [4, 120, 87], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 7 },
        bodyStyles: { fontSize: 7, cellPadding: 2, textColor: [30, 41, 59] },
        columnStyles: {
          0: { cellWidth: 10, halign: 'center' },
          1: { cellWidth: 56, fontStyle: 'bold' },
          2: { cellWidth: 116 }
        }
      });

      my = doc.lastAutoTable.finalY + 5;
    }

    // Provenance / Review Notes
    if (meeting.reviewNotes || meeting.sourceConfidence) {
      if (my > pageHeight - 25) {
        doc.addPage();
        my = margin;
      }

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(`Provenance Note: ${meeting.sourceConfidence || 'HIGH'} — ${meeting.reviewNotes || 'Source verified.'}`, margin, my + 3);
    }
  });

  // Add Running Footers
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

// Test multi-record report generation
const pkgDir = 'd:/nec portal/data/NEC_CYS_BoS_Package';
const csvPath = `${pkgDir}/NEC_CYS_BoS_All_Meetings_Website_Import.csv`;
const csvContent = fs.readFileSync(csvPath, 'utf8');

// Parse all 6 records
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

console.log('Generating Comprehensive BoS Report for all 6 records...');
const reportDoc = generateBoSReportPDF(records, { dept: 'CSE (Cyber Security)', reg: 'All', ay: 'All' });
const reportBuffer = Buffer.from(reportDoc.output('arraybuffer'));
const reportOutputPath = 'd:/nec portal/data/NEC_CYS_BoS_Package/NEC_CYS_BoS_All_Meetings_Generated_Report.pdf';
fs.writeFileSync(reportOutputPath, reportBuffer);
console.log(`✓ Comprehensive BoS Report PDF created at: ${reportOutputPath} (${reportBuffer.length} bytes, ${reportDoc.internal.getNumberOfPages()} pages)`);
