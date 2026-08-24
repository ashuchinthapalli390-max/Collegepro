import { 
  TrendingUp, 
  BarChart3, 
  Bell, 
  Activity, 
  Users, 
  UserCheck, 
  FileText, 
  Lightbulb, 
  Trophy, 
  BookOpen, 
  Award, 
  Briefcase, 
  Code, 
  GraduationCap, 
  Handshake, 
  Mail, 
  Megaphone, 
  Image as ImageIcon, 
  Download, 
  FileSpreadsheet, 
  Sliders, 
  Grid, 
  Smartphone, 
  Trash2, 
  ShieldAlert, 
  Sparkles,
  Database
} from 'lucide-react';

export const NAVIGATION_CATEGORIES = [
  {
    id: 'cat-overview',
    label: 'Overview',
    icon: TrendingUp,
    items: [
      { id: 'overview', label: 'Executive Dashboard', icon: TrendingUp },
      { id: 'analytics', label: 'Quick Analytics', icon: BarChart3 },
      { id: 'alerts', label: 'Alerts & Notices', icon: Bell, dynamicBadgeKey: 'alerts' },
      { id: 'activity', label: 'Recent Activity', icon: Activity }
    ]
  },
  {
    id: 'cat-events-outreach',
    label: 'Events & Outreach',
    icon: Megaphone,
    items: [
      { id: 'events', label: 'Workshops & Events', icon: Megaphone },
      { id: 'mous-collaborations', label: 'Industry MoUs & Tie-Ups', icon: Handshake },
      { id: 'gallery-media', label: 'Media & Campus Gallery', icon: ImageIcon },
      { id: 'circulars-notices', label: 'Official Circulars', icon: Mail }
    ]
  },
  {
    id: 'cat-faculty-dev',
    label: 'Faculty Development',
    icon: Award,
    items: [
      { id: 'faculty-memberships', label: 'Faculty Memberships', icon: Award },
      { id: 'fdps-organized', label: 'FDPs Organized (Host)', icon: Award },
      { id: 'faculty-achievements', label: 'Faculty Achievements & FDPs', icon: GraduationCap },
      { id: 'faculty-directory', label: 'Faculty Directory & Profiles', icon: Users },
      { id: 'staff-profiles', label: 'Staff Profiles', icon: UserCheck }
    ]
  },
  {
    id: 'cat-students-dev',
    label: 'Student Development',
    icon: Trophy,
    items: [
      { id: 'student-projects', label: 'Student Projects & Capstone', icon: Code },
      { id: 'student-achievements', label: 'Student Achievements & Honors', icon: Trophy },
      { id: 'internships', label: 'Student Internships & Training', icon: Briefcase }
    ]
  },
  {
    id: 'cat-governance',
    label: 'Academic Governance',
    icon: BookOpen,
    items: [
      { id: 'bos-meetings', label: 'Board of Studies (BoS)', icon: BookOpen },
      { id: 'academic-council', label: 'Academic Council', icon: Award },
      { id: 'regulations-hub', label: 'Curriculum & Regulations', icon: FileText }
    ]
  },
  {
    id: 'cat-research',
    label: 'Research & Publications',
    icon: Lightbulb,
    items: [
      { id: 'publications', label: 'Journal & Conference Papers', icon: FileText },
      { id: 'patents', label: 'Patents & IPR Records', icon: Lightbulb },
      { id: 'funded-projects', label: 'Funded Research Projects', icon: Briefcase },
      { id: 'research-discovery', label: 'Research Discovery & Local Index', icon: Sparkles },
      { id: 'research-data-sources', label: 'Research Datasets & Index', icon: Database }
    ]
  },
  {
    id: 'cat-compliance',
    label: 'Accreditation & Data',
    icon: FileSpreadsheet,
    items: [
      { id: 'nptel-certifications', label: 'NPTEL & MOOC Certifications', icon: GraduationCap },
      { id: 'naac-portal', label: 'NAAC SSR Documentation', icon: Award },
      { id: 'nba-tier1', label: 'NBA Tier-1 Compliance', icon: FileText },
      { id: 'nirf-data', label: 'NIRF Data Repository', icon: BarChart3 },
      { id: 'export-hub', label: 'Compliance Data Exports', icon: Download }
    ]
  },
  {
    id: 'cat-admin',
    label: 'Administration & IAM',
    icon: Sliders,
    items: [
      { id: 'iam-users', label: 'User Directory & Roles', icon: UserCheck },
      { id: 'iam-matrix', label: 'Permissions Matrix', icon: Grid },
      { id: 'iam-sessions', label: 'Active Sessions & Devices', icon: Smartphone },
      { id: 'iam-settings', label: 'Auth & OTP Policies', icon: Sliders },
      { id: 'recycle-bin', label: 'Recycle Bin & Restore', icon: Trash2 },
      { id: 'audit-logs', label: 'Audit Trail & Incident Log', icon: ShieldAlert }
    ]
  }
];
