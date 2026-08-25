import * as XLSX from 'xlsx'

export interface ParsedAttendanceRow {
  rollNumber: string
  studentName?: string
  classesHeld?: number
  classesAttended?: number
  percentage?: number
  department?: string
  year?: string
  section?: string
  rawRow: Record<string, any>
  hasConflict?: boolean
  conflictDetails?: string
  isValidRow: boolean
  validationError?: string
}

export interface AttendanceParseResult {
  fileName: string
  fileChecksum: string
  detectedFormat: 'CSV' | 'XLSX' | 'XLS' | 'TSV' | 'TXT'
  sheetNames?: string[]
  activeSheetName?: string
  totalRows: number
  validRows: ParsedAttendanceRow[]
  invalidRows: { rowNumber: number; reason: string; raw: any }[]
  detectedDepartment?: string
  detectedYear?: string
  detectedSection?: string
  headers: string[]
  columnMapping: {
    rollNumber: string
    studentName?: string
    classesHeld?: string
    classesAttended?: string
    percentage?: string
  }
}

export class FileSignatureService {
  /**
   * Compute a fast SHA-256 hash from ArrayBuffer
   */
  public static async calculateChecksum(buffer: ArrayBuffer): Promise<string> {
    try {
      if (window.crypto && window.crypto.subtle) {
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', buffer)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
      }
    } catch {
      // Fallback simple checksum
    }
    const bytes = new Uint8Array(buffer)
    let hash = 0
    for (let i = 0; i < bytes.length; i++) {
      hash = (hash * 31 + bytes[i]) >>> 0
    }
    return `hash_${hash.toString(16)}_${bytes.length}`
  }

  /**
   * Detect format from file name and signatures
   */
  public static detectFormat(file: File): 'CSV' | 'XLSX' | 'XLS' | 'TSV' | 'TXT' {
    const name = file.name.toLowerCase()
    if (name.endsWith('.xlsx')) return 'XLSX'
    if (name.endsWith('.xls')) return 'XLS'
    if (name.endsWith('.tsv')) return 'TSV'
    if (name.endsWith('.txt')) return 'TXT'
    return 'CSV'
  }

  /**
   * Smart column matching aliases
   */
  private static matchHeader(header: string, aliases: string[]): boolean {
    const clean = header.toLowerCase().replace(/[^a-z0-9]/g, '')
    return aliases.some((a) => {
      const cleanAlias = a.toLowerCase().replace(/[^a-z0-9]/g, '')
      return clean === cleanAlias || clean.includes(cleanAlias)
    })
  }

  public static findColumnMapping(headers: string[]): {
    rollNumber: string
    studentName?: string
    classesHeld?: string
    classesAttended?: string
    percentage?: string
    department?: string
    year?: string
    section?: string
  } {
    const rollAliases = ['rollno', 'rollnumber', 'htno', 'htnumber', 'hallticket', 'regno', 'registrationno', 'studentid', 'pin', 'regdno', 'studentrollno']
    const nameAliases = ['studentname', 'name', 'candidatename', 'student', 'fullname', 'nameofstudent']
    const heldAliases = ['classesheld', 'conducted', 'totalclasses', 'totalperiods', 'total', 'classesconducted', 'held', 'totalworkingdays']
    const attendedAliases = ['classesattended', 'present', 'attended', 'periodspresent', 'totalpresent', 'dayspresent']
    const pctAliases = ['attendancepercentage', 'attendancepct', 'attendance', 'percentage', 'attpct', 'percent', 'att']
    const deptAliases = ['department', 'dept', 'branch']
    const yearAliases = ['year', 'classyear', 'academicclass']
    const secAliases = ['section', 'sec']

    let rollNumber = ''
    let studentName: string | undefined
    let classesHeld: string | undefined
    let classesAttended: string | undefined
    let percentage: string | undefined
    let department: string | undefined
    let year: string | undefined
    let section: string | undefined

    for (const h of headers) {
      if (!rollNumber && this.matchHeader(h, rollAliases)) {
        rollNumber = h
      } else if (!studentName && this.matchHeader(h, nameAliases)) {
        studentName = h
      } else if (!classesHeld && this.matchHeader(h, heldAliases)) {
        classesHeld = h
      } else if (!classesAttended && this.matchHeader(h, attendedAliases)) {
        classesAttended = h
      } else if (!percentage && this.matchHeader(h, pctAliases)) {
        percentage = h
      } else if (!department && this.matchHeader(h, deptAliases)) {
        department = h
      } else if (!year && this.matchHeader(h, yearAliases)) {
        year = h
      } else if (!section && this.matchHeader(h, secAliases)) {
        section = h
      }
    }

    // Fallback: If rollNumber still not detected, pick first column
    if (!rollNumber && headers.length > 0) {
      rollNumber = headers[0]
    }

    return { rollNumber, studentName, classesHeld, classesAttended, percentage, department, year, section }
  }

  /**
   * Parse workbook or CSV
   */
  public static async parseAttendanceFile(file: File): Promise<AttendanceParseResult> {
    const buffer = await file.arrayBuffer()
    const checksum = await this.calculateChecksum(buffer)
    const detectedFormat = this.detectFormat(file)

    const workbook = XLSX.read(buffer, { type: 'array' })
    const sheetNames = workbook.SheetNames
    const activeSheetName = sheetNames[0] || 'Sheet1'
    const worksheet = workbook.Sheets[activeSheetName]

    // Read as JSON objects
    const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' })

    if (rawRows.length === 0) {
      return {
        fileName: file.name,
        fileChecksum: checksum,
        detectedFormat,
        sheetNames,
        activeSheetName,
        totalRows: 0,
        validRows: [],
        invalidRows: [],
        headers: [],
        columnMapping: { rollNumber: '' }
      }
    }

    const headers = Object.keys(rawRows[0])
    const mapping = this.findColumnMapping(headers)

    const validRows: ParsedAttendanceRow[] = []
    const invalidRows: { rowNumber: number; reason: string; raw: any }[] = []

    let detectedDept: string | undefined
    let detectedYr: string | undefined
    let detectedSec: string | undefined

    rawRows.forEach((row, idx) => {
      const rowNum = idx + 2
      const rawRoll = String(row[mapping.rollNumber] || '').trim()

      if (!rawRoll || rawRoll.toLowerCase() === 'total' || rawRoll.toLowerCase() === 'average') {
        invalidRows.push({ rowNumber: rowNum, reason: 'Empty or aggregate summary roll number row', raw: row })
        return
      }

      const name = mapping.studentName ? String(row[mapping.studentName] || '').trim() : undefined
      const heldVal = mapping.classesHeld ? Number(row[mapping.classesHeld]) : undefined
      const attendedVal = mapping.classesAttended ? Number(row[mapping.classesAttended]) : undefined
      let pctVal = mapping.percentage ? parseFloat(String(row[mapping.percentage]).replace('%', '')) : undefined

      let calculatedPct: number | undefined
      let hasConflict = false
      let conflictDetails: string | undefined

      if (heldVal !== undefined && !isNaN(heldVal) && attendedVal !== undefined && !isNaN(attendedVal)) {
        if (heldVal <= 0) {
          invalidRows.push({ rowNumber: rowNum, reason: 'Classes held cannot be 0 or negative', raw: row })
          return
        }
        if (attendedVal > heldVal) {
          invalidRows.push({ rowNumber: rowNum, reason: `Attended (${attendedVal}) exceeds held (${heldVal})`, raw: row })
          return
        }
        calculatedPct = parseFloat(((attendedVal / heldVal) * 100).toFixed(2))

        // Validate percentage conflict if provided
        if (pctVal !== undefined && !isNaN(pctVal)) {
          if (Math.abs(pctVal - calculatedPct) > 1.5) {
            hasConflict = true
            conflictDetails = `Source % (${pctVal}%) differs from calculated (${calculatedPct}% from ${attendedVal}/${heldVal})`
          }
        } else {
          pctVal = calculatedPct
        }
      }

      if (pctVal === undefined || isNaN(pctVal)) {
        invalidRows.push({ rowNumber: rowNum, reason: 'Could not determine attendance percentage or classes count', raw: row })
        return
      }

      // Check department from row if present
      if (mapping.department && row[mapping.department]) {
        detectedDept = String(row[mapping.department]).trim()
      }
      if (mapping.year && row[mapping.year]) {
        detectedYr = String(row[mapping.year]).trim()
      }
      if (mapping.section && row[mapping.section]) {
        detectedSec = String(row[mapping.section]).trim()
      }

      validRows.push({
        rollNumber: rawRoll,
        studentName: name,
        classesHeld: heldVal,
        classesAttended: attendedVal,
        percentage: pctVal,
        department: detectedDept,
        year: detectedYr,
        section: detectedSec,
        rawRow: row,
        hasConflict,
        conflictDetails,
        isValidRow: !hasConflict
      })
    })

    return {
      fileName: file.name,
      fileChecksum: checksum,
      detectedFormat,
      sheetNames,
      activeSheetName,
      totalRows: rawRows.length,
      validRows,
      invalidRows,
      detectedDepartment: detectedDept,
      detectedYear: detectedYr,
      detectedSection: detectedSec,
      headers,
      columnMapping: mapping
    }
  }
}
