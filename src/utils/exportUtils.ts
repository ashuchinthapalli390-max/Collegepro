import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { AttendanceRecord, FlattenedEventSectionRow, BoSMeeting } from '../types/nec'
import { DepartmentResolver } from './departmentResolver'

export class ExportService {
  /**
   * Helper to trigger browser download of CSV string
   */
  private static downloadCSVFile(csvContent: string, fileName: string) {
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  /**
   * Export Attendance to CSV
   */
  public static exportAttendanceCSV(
    records: AttendanceRecord[],
    fileName = 'NEC_Attendance_Report.csv',
    includeParentContact = false
  ) {
    const headers = [
      'S.No',
      'Roll Number',
      'Student Name',
      'Department',
      'Year',
      'Semester',
      'Section',
      'Classes Held',
      'Classes Attended',
      'Attendance %',
      'Risk Status',
      'Parent Contact Status'
    ]

    if (includeParentContact) {
      headers.push('Guardian Name', 'Guardian Phone', 'Last Contacted')
    }

    const rows = records.map((r, idx) => {
      const row = [
        idx + 1,
        `"${r.rollNumber}"`,
        `"${r.studentName}"`,
        `"${DepartmentResolver.getDisplayName(r.departmentId)}"`,
        r.year,
        r.semester,
        r.section,
        r.classesHeld,
        r.classesAttended,
        `${r.percentage}%`,
        r.percentage < 65 ? 'LOW ATTENDANCE (<65%)' : 'NORMAL',
        `"${r.parentContactStatus}"`
      ]

      if (includeParentContact) {
        row.push(
          `"${r.guardianName || '-'}"`,
          `"${r.guardianPhone || '-'}"`,
          `"${r.lastContactedAt || '-'}"`
        )
      }

      return row.join(',')
    })

    const csvString = [headers.join(','), ...rows].join('\r\n')
    this.downloadCSVFile(csvString, fileName)
  }

  /**
   * Export Attendance to Institutional PDF
   */
  public static exportAttendancePDF(
    records: AttendanceRecord[],
    metadata: {
      academicYear?: string
      departmentName?: string
      year?: string
      section?: string
      monthYear?: string
      thresholdLabel?: string
    }
  ) {
    const doc = new jsPDF('p', 'mm', 'a4')
    const totalPagesExp = '{total_pages_count_string}'

    // Header Background
    doc.setFillColor(15, 23, 42) // Dark Navy
    doc.rect(0, 0, 210, 32, 'F')

    // Header Titles
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('NARASARAOPETA ENGINEERING COLLEGE', 105, 12, { align: 'center' })

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text('(AUTONOMOUS) • Approved by AICTE, Accredited with "A+" Grade by NAAC', 105, 18, { align: 'center' })

    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(245, 158, 11) // Amber
    doc.text('STUDENT ATTENDANCE & CONDONATION RISK REPORT', 105, 26, { align: 'center' })

    // Metadata Subheader
    doc.setTextColor(30, 41, 59)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')

    const startY = 40
    doc.text(`Academic Year: ${metadata.academicYear || '2026-27'}`, 14, startY)
    doc.text(`Department: ${metadata.departmentName || 'Emerging Technologies'}`, 14, startY + 5)
    doc.text(`Cohort: Year ${metadata.year || 'All'} - Section ${metadata.section || 'All'}`, 120, startY)
    doc.text(`Period / Month: ${metadata.monthYear || 'Current Active'}`, 120, startY + 5)

    doc.setFont('helvetica', 'italic')
    doc.setFontSize(8)
    doc.setTextColor(220, 38, 38)
    doc.text(`* Institutional Condonation / Detention Risk Threshold: Below 65.00% attendance`, 14, startY + 12)

    // Table Data
    const tableData = records.map((r, idx) => [
      idx + 1,
      r.rollNumber,
      r.studentName,
      DepartmentResolver.getShortName(r.departmentId),
      `${r.year}-${r.section}`,
      r.classesHeld,
      r.classesAttended,
      `${r.percentage.toFixed(1)}%`,
      r.percentage < 65 ? 'RISK (<65%)' : 'OK',
      r.parentContactStatus
    ])

    autoTable(doc, {
      startY: startY + 16,
      head: [['S.No', 'Roll No', 'Student Name', 'Dept', 'Class', 'Held', 'Attended', 'Att %', 'Status', 'Contact']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [30, 41, 59],
        textColor: [255, 255, 255],
        fontSize: 8,
        fontStyle: 'bold',
        halign: 'center'
      },
      styles: {
        fontSize: 8,
        cellPadding: 2,
        valign: 'middle'
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 10 },
        1: { halign: 'center', fontStyle: 'bold', cellWidth: 26 },
        2: { cellWidth: 45 },
        3: { halign: 'center', cellWidth: 18 },
        4: { halign: 'center', cellWidth: 16 },
        5: { halign: 'center', cellWidth: 12 },
        6: { halign: 'center', cellWidth: 14 },
        7: { halign: 'center', fontStyle: 'bold', cellWidth: 16 },
        8: { halign: 'center', fontStyle: 'bold', cellWidth: 18 },
        9: { halign: 'center', cellWidth: 25 }
      },
      didParseCell: (data) => {
        if (data.section === 'body') {
          const rowData = records[data.row.index]
          if (rowData && rowData.percentage < 65) {
            if (data.column.index === 7 || data.column.index === 8) {
              data.cell.styles.textColor = [220, 38, 38]
              data.cell.styles.fillColor = [254, 242, 242]
            }
          }
        }
      },
      didDrawPage: (data) => {
        // Footer
        const pageCount = (doc as any).internal.getNumberOfPages()
        doc.setFontSize(8)
        doc.setTextColor(148, 163, 184)
        doc.text(
          `Generated on: ${new Date().toLocaleString()} | Narasaraopeta Engineering College ET Portal`,
          14,
          290
        )
        doc.text(`Page ${data.pageNumber} of ${totalPagesExp}`, 190, 290, { align: 'right' })
      }
    })

    if (typeof (doc as any).putTotalPages === 'function') {
      ;(doc as any).putTotalPages(totalPagesExp)
    }

    doc.save(`NEC_Attendance_Report_${Date.now()}.pdf`)
  }

  /**
   * Export Section-expanded Academic Events to CSV
   */
  public static exportEventsCSV(rows: FlattenedEventSectionRow[], fileName = 'NEC_Academic_Events.csv') {
    const headers = [
      'S.No',
      'Event Title',
      'Event Type',
      'Department',
      'Year',
      'Semester',
      'Section',
      'Start Date',
      'End Date',
      'Mode',
      'Venue',
      'Resource Person',
      'Organization',
      'Status'
    ]

    const csvRows = rows.map((r, idx) => [
      idx + 1,
      `"${r.title}"`,
      r.eventType,
      `"${r.departmentName}"`,
      r.year,
      r.semester,
      r.section,
      r.startDate,
      r.endDate,
      r.mode,
      `"${r.venue}"`,
      `"${r.resourcePerson}"`,
      `"${r.resourcePersonOrg}"`,
      r.status
    ])

    const csvString = [headers.join(','), ...csvRows.map((r) => r.join(','))].join('\r\n')
    this.downloadCSVFile(csvString, fileName)
  }

  /**
   * Export Section-expanded Academic Events to PDF
   */
  public static exportEventsPDF(
    rows: FlattenedEventSectionRow[],
    filters: { departmentName?: string; academicYear?: string }
  ) {
    const doc = new jsPDF('l', 'mm', 'a4')
    const totalPagesExp = '{total_pages_count_string}'

    // Header
    doc.setFillColor(15, 23, 42)
    doc.rect(0, 0, 297, 28, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('NARASARAOPETA ENGINEERING COLLEGE (AUTONOMOUS)', 148.5, 12, { align: 'center' })

    doc.setFontSize(10)
    doc.setTextColor(245, 158, 11)
    doc.text('ACADEMIC EVENTS & WORKSHOPS — SECTION-WISE CONSOLIDATED REPORT', 148.5, 20, { align: 'center' })

    // Meta
    doc.setFontSize(9)
    doc.setTextColor(30, 41, 59)
    doc.setFont('helvetica', 'bold')
    doc.text(`Department: ${filters.departmentName || 'All Emerging Technologies'}`, 14, 35)
    doc.text(`Academic Year: ${filters.academicYear || '2026-27'}`, 200, 35)

    const tableData = rows.map((r, idx) => [
      idx + 1,
      r.title,
      r.eventType,
      r.departmentName,
      `${r.year}-${r.section}`,
      r.startDate,
      r.mode,
      r.resourcePerson,
      r.resourcePersonOrg,
      r.status
    ])

    autoTable(doc, {
      startY: 40,
      head: [['S.No', 'Event Title', 'Type', 'Department', 'Class', 'Date', 'Mode', 'Resource Person', 'Organization', 'Status']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [30, 41, 59],
        textColor: [255, 255, 255],
        fontSize: 8,
        fontStyle: 'bold',
        halign: 'center'
      },
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 10 },
        1: { cellWidth: 60, fontStyle: 'bold' },
        2: { halign: 'center', cellWidth: 20 },
        3: { cellWidth: 35 },
        4: { halign: 'center', cellWidth: 15 },
        5: { halign: 'center', cellWidth: 22 },
        6: { halign: 'center', cellWidth: 18 },
        7: { cellWidth: 35 },
        8: { cellWidth: 35 },
        9: { halign: 'center', cellWidth: 20 }
      },
      didDrawPage: (data) => {
        doc.setFontSize(8)
        doc.setTextColor(148, 163, 184)
        doc.text(`Generated: ${new Date().toLocaleString()} | NEC ET Portal`, 14, 200)
        doc.text(`Page ${data.pageNumber} of ${totalPagesExp}`, 280, 200, { align: 'right' })
      }
    })

    if (typeof (doc as any).putTotalPages === 'function') {
      ;(doc as any).putTotalPages(totalPagesExp)
    }

    doc.save(`NEC_Events_Report_${Date.now()}.pdf`)
  }

  /**
   * Export BoS Minutes & Governance Report to PDF
   */
  public static exportBoSPDF(meeting: BoSMeeting) {
    const doc = new jsPDF('p', 'mm', 'a4')
    const totalPagesExp = '{total_pages_count_string}'

    // Header
    doc.setFillColor(15, 23, 42)
    doc.rect(0, 0, 210, 32, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.text('NARASARAOPETA ENGINEERING COLLEGE (AUTONOMOUS)', 105, 12, { align: 'center' })

    doc.setFontSize(9)
    doc.text('DEPARTMENT OF ' + DepartmentResolver.getDisplayName(meeting.departmentId).toUpperCase(), 105, 18, { align: 'center' })

    doc.setFontSize(11)
    doc.setTextColor(245, 158, 11)
    doc.text(`BOARD OF STUDIES (BoS) MEETING REPORT — ${meeting.meetingNumber}`, 105, 26, { align: 'center' })

    let y = 40
    doc.setTextColor(30, 41, 59)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')

    doc.text(`Regulation: ${meeting.regulation}`, 14, y)
    doc.text(`Academic Year: ${meeting.academicYear}`, 70, y)
    doc.text(`Status: ${meeting.meetingStatus}`, 140, y)

    y += 7
    doc.text(`Meeting Date: ${meeting.bosDate}`, 14, y)
    doc.text(`Time Slot: ${meeting.startTime} – ${meeting.endTime}`, 70, y)
    doc.text(`Mode: ${meeting.meetingMode} (${meeting.venue || meeting.meetingLink || 'N/A'})`, 140, y)

    // Schedule Postponement History Notice if present
    if (meeting.postponementHistory && meeting.postponementHistory.length > 0) {
      y += 8
      doc.setFillColor(254, 242, 242)
      doc.setDrawColor(239, 68, 68)
      doc.roundedRect(14, y, 182, 16, 2, 2, 'FD')
      doc.setTextColor(185, 28, 28)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      doc.text('RESCHEDULED / POSTPONEMENT RECORD:', 18, y + 5)
      doc.setFont('helvetica', 'normal')
      const latest = meeting.postponementHistory[meeting.postponementHistory.length - 1]
      doc.text(`Original: ${latest.previousDate} (${latest.previousStartTime}–${latest.previousEndTime})  →  Rescheduled: ${latest.newDate} (${latest.newStartTime}–${latest.newEndTime})`, 18, y + 10)
      doc.text(`Reason: ${latest.reason}`, 18, y + 14)
      y += 20
    } else {
      y += 6
    }

    // Members Section
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(15, 23, 42)
    doc.text('1. Board of Studies Members & Committee', 14, y)

    const membersData = [
      [
        1,
        meeting.chairman.name,
        meeting.chairman.designation,
        meeting.chairman.institution,
        'Chairman (HoD)',
        meeting.chairman.email || '-'
      ],
      ...meeting.members.map((m, idx) => [
        idx + 2,
        m.name,
        m.designation,
        m.institution,
        m.category,
        m.email || '-'
      ])
    ]

    autoTable(doc, {
      startY: y + 3,
      head: [['S.No', 'Name of Member', 'Designation', 'Institution / Org', 'Category', 'Email']],
      body: membersData,
      theme: 'grid',
      headStyles: { fillColor: [30, 41, 59], fontSize: 8, fontStyle: 'bold' },
      styles: { fontSize: 8, cellPadding: 2 }
    })

    y = (doc as any).lastAutoTable.finalY + 8

    // Agenda Section
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(15, 23, 42)
    doc.text('2. Meeting Agenda & Resolutions', 14, y)

    const agendaData = meeting.agendaItems.map((item) => [
      item.itemNo,
      item.title,
      item.startTime && item.endTime ? `${item.startTime} – ${item.endTime}` : 'As Scheduled',
      item.description || '-',
      item.decisionResolution || 'Approved / Recommended'
    ])

    autoTable(doc, {
      startY: y + 3,
      head: [['Item #', 'Agenda Title', 'Time Slot', 'Discussion Details', 'Resolution / Decision']],
      body: agendaData,
      theme: 'grid',
      headStyles: { fillColor: [30, 41, 59], fontSize: 8, fontStyle: 'bold' },
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: {
        0: { halign: 'center', cellWidth: 15 },
        1: { fontStyle: 'bold', cellWidth: 45 },
        2: { halign: 'center', cellWidth: 30 },
        3: { cellWidth: 50 },
        4: { cellWidth: 42 }
      },
      didDrawPage: (data) => {
        doc.setFontSize(8)
        doc.setTextColor(148, 163, 184)
        doc.text(`Narasaraopeta Engineering College Autonomous • Board of Studies Record`, 14, 290)
        doc.text(`Page ${data.pageNumber} of ${totalPagesExp}`, 190, 290, { align: 'right' })
      }
    })

    if (typeof (doc as any).putTotalPages === 'function') {
      ;(doc as any).putTotalPages(totalPagesExp)
    }

    doc.save(`BoS_${meeting.meetingNumber}_${meeting.regulation}.pdf`)
  }

  /**
   * Export Community Service Projects to CSV
   */
  public static exportCSPCSV(
    projects: any[],
    fileName = 'NEC_Community_Service_Projects.csv'
  ) {
    const headers = [
      'S.No',
      'Project Number',
      'Project Title',
      'Academic Year',
      'Department',
      'Year',
      'Section',
      'Project Type',
      'Students Count',
      'Student Roll Numbers',
      'Faculty Guide',
      'Location / Village',
      'District',
      'Start Date',
      'End Date',
      'Beneficiaries',
      'Status'
    ]

    const rows = projects.map((p, idx) => [
      idx + 1,
      `"${p.projectNumber}"`,
      `"${p.projectTitle.replace(/"/g, '""')}"`,
      `"${p.academicYear}"`,
      `"${DepartmentResolver.getDisplayName(p.departmentId)}"`,
      p.year,
      p.section,
      `"${p.projectType}"`,
      p.students?.length || 0,
      `"${(p.students || []).map((s: any) => s.rollNumber).join('; ')}"`,
      `"${p.facultyGuideName}"`,
      `"${p.villageOrLocation}"`,
      `"${p.district}"`,
      p.startDate,
      p.endDate,
      p.beneficiaryCount || 0,
      `"${p.status}"`
    ])

    const csvString = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n')
    this.downloadCSVFile(csvString, fileName)
  }

  /**
   * Export Companies Visited to CSV
   */
  public static exportCompanyVisitsCSV(
    visits: any[],
    fileName = 'NEC_Companies_Visited_Report.csv'
  ) {
    const headers = [
      'S.No',
      'Company Name',
      'Academic Year',
      'Visit Date',
      'Drive Type',
      'Mode',
      'Venue',
      'Eligible ET Departments',
      'Roles Offered',
      'Max Package LPA',
      'Attended Students',
      'Offers Released',
      'Status'
    ]

    const rows = visits.map((v, idx) => {
      const depts = (v.eligibleDepartmentIds || [])
        .map((d: string) => DepartmentResolver.getShortName(d))
        .join('; ')
      const roles = (v.roles || []).map((r: any) => r.roleName).join('; ')
      const maxPkg = Math.max(0, ...(v.roles || []).map((r: any) => r.packageLPA || 0))

      return [
        idx + 1,
        `"${v.companyName}"`,
        `"${v.academicYear}"`,
        v.visitDate,
        `"${v.driveType}"`,
        v.mode,
        `"${v.venue || '-'}"`,
        `"${depts}"`,
        `"${roles}"`,
        maxPkg ? `${maxPkg} LPA` : '-',
        v.participation?.attendedStudentsCount || 0,
        v.participation?.offersReleasedCount || 0,
        `"${v.status}"`
      ]
    })

    const csvString = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n')
    this.downloadCSVFile(csvString, fileName)
  }

  /**
   * Export Campus Placements to CSV
   */
  public static exportCampusPlacementsCSV(
    offers: any[],
    fileName = 'NEC_Campus_Placements_Report.csv'
  ) {
    const headers = [
      'S.No',
      'Roll Number',
      'Student Name',
      'Department',
      'Year',
      'Section',
      'Batch',
      'Company Name',
      'Role / Designation',
      'Package LPA',
      'Offer Type',
      'Job Location',
      'Offer Date',
      'Status'
    ]

    const rows = offers.map((o, idx) => [
      idx + 1,
      `"${o.rollNumber}"`,
      `"${o.studentName}"`,
      `"${DepartmentResolver.getDisplayName(o.departmentId)}"`,
      o.year,
      o.section,
      `"${o.batch}"`,
      `"${o.companyName}"`,
      `"${o.role}"`,
      `${o.packageLPA} LPA`,
      `"${o.offerType}"`,
      `"${o.jobLocation}"`,
      o.offerDate,
      `"${o.status}"`
    ])

    const csvString = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n')
    this.downloadCSVFile(csvString, fileName)
  }
}
