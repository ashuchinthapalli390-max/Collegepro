import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { Dashboard } from '../pages/Dashboard'
import { AttendancePage } from '../pages/Attendance'
import { BoSPage } from '../pages/BoS/BoSPage'
import { AcademicEventsPage } from '../pages/AcademicEvents'
import { StudentProjectsPage } from '../pages/StudentProjects'
import { StudentAchievementsPage } from '../pages/StudentAchievements'
import { StudentInternshipsPage } from '../pages/StudentInternships'
import { CommunityServicePage } from '../pages/CommunityService/CommunityServicePage'
import { CompaniesVisitedPage } from '../pages/Placements/CompaniesVisitedPage'
import { CampusPlacementsPage } from '../pages/Placements/CampusPlacementsPage'
import { MidExamAnalysisPage } from '../pages/ExamAnalysis/MidExamAnalysis'
import { ExternalExamAnalysisPage } from '../pages/ExamAnalysis/ExternalExamAnalysis'
import { NPTELCertificationsPage } from '../pages/NPTELCertifications'
import { FacultyDirectoryPage } from '../pages/FacultyDirectory'
import { ResearchPublicationsPage } from '../pages/ResearchPublications'
import { PatentsPage } from '../pages/Patents'
import { IndustryMoUsPage } from '../pages/IndustryMoUs'
import { MediaGalleryPage } from '../pages/MediaGallery'
import { CircularsPage } from '../pages/Circulars'
import { AcademicCouncilPage } from '../pages/AcademicCouncil'
import { CurriculumRegulationsPage } from '../pages/CurriculumRegulations'
import { BulkDataCenterPage } from '../pages/BulkDataCenter'
import { DisabledFeature } from '../pages/DisabledFeature'

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main Portal App Layout */}
      <Route element={<AppLayout />}>
        {/* Core Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/portal/dashboard" element={<Navigate to="/dashboard" replace />} />

        {/* Academic Analytics (Placeholders) */}
        <Route path="/exam-analysis/mid" element={<MidExamAnalysisPage />} />
        <Route path="/portal/exam-analysis/mid" element={<MidExamAnalysisPage />} />
        <Route path="/exam-analysis/external" element={<ExternalExamAnalysisPage />} />
        <Route path="/portal/exam-analysis/external" element={<ExternalExamAnalysisPage />} />

        {/* Student Development */}
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/portal/attendance" element={<Navigate to="/attendance" replace />} />
        <Route path="/student-projects" element={<StudentProjectsPage />} />
        <Route path="/student-achievements" element={<StudentAchievementsPage />} />
        <Route path="/student-internships" element={<StudentInternshipsPage />} />
        <Route path="/community-service-projects" element={<CommunityServicePage />} />
        <Route path="/portal/community-service-projects" element={<CommunityServicePage />} />

        {/* Placements & Career */}
        <Route path="/placements/companies" element={<CompaniesVisitedPage />} />
        <Route path="/portal/placements/companies" element={<CompaniesVisitedPage />} />
        <Route path="/placements/campus" element={<CampusPlacementsPage />} />
        <Route path="/portal/placements/campus" element={<CampusPlacementsPage />} />

        {/* Academic Governance */}
        <Route path="/bos" element={<BoSPage />} />
        <Route path="/academic-council" element={<AcademicCouncilPage />} />
        <Route path="/curriculum-regulations" element={<CurriculumRegulationsPage />} />

        {/* Events & Outreach */}
        <Route path="/events" element={<AcademicEventsPage />} />
        <Route path="/mous" element={<IndustryMoUsPage />} />
        <Route path="/media-gallery" element={<MediaGalleryPage />} />
        <Route path="/circulars" element={<CircularsPage />} />

        {/* Accreditation & Data */}
        <Route path="/nptel" element={<NPTELCertificationsPage />} />

        {/* Faculty & Research */}
        <Route path="/faculty" element={<FacultyDirectoryPage />} />
        <Route path="/research" element={<ResearchPublicationsPage />} />
        <Route path="/patents" element={<PatentsPage />} />
        <Route path="/data-center" element={<BulkDataCenterPage />} />

        {/* Hidden / Feature-Flagged Modules */}
        <Route path="/naac" element={<DisabledFeature />} />
        <Route path="/nba" element={<DisabledFeature />} />
        <Route path="/nirf" element={<DisabledFeature />} />
        <Route path="/compliance-exports" element={<DisabledFeature />} />

        {/* Root Redirect to Dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
