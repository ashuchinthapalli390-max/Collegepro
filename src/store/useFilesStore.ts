import { create } from 'zustand'

export interface FileItem {
  id: string
  name: string
  type: 'image' | 'pdf' | 'markdown' | 'code' | 'archive' | 'doc'
  size: string // e.g. "2.4 MB"
  sizeBytes: number
  folderId: string
  tags: string[]
  isFavorite: boolean
  createdAt: string
  url?: string
}

export interface FileFolder {
  id: string
  name: string
  parentId: string | null
}

interface FilesState {
  files: FileItem[]
  folders: FileFolder[]
  selectedFolderId: string | null
  viewMode: 'grid' | 'list'
  searchQuery: string
  selectedFile: FileItem | null
  setSelectedFolder: (id: string | null) => void
  setViewMode: (mode: 'grid' | 'list') => void
  setSearchQuery: (query: string) => void
  setSelectedFile: (file: FileItem | null) => void
  addFile: (file: Omit<FileItem, 'id' | 'createdAt'>) => void
  deleteFile: (id: string) => void
  toggleFavorite: (id: string) => void
  addFolder: (folder: Omit<FileFolder, 'id'>) => void
}

const mockFolders: FileFolder[] = [
  { id: 'fol1', name: 'Documents', parentId: null },
  { id: 'fol2', name: 'Design Assets', parentId: null },
  { id: 'fol3', name: 'Project Backups', parentId: null },
]

const mockFiles: FileItem[] = [
  { id: 'f1', name: 'LifeOS_System_Architecture_V1.pdf', type: 'pdf', size: '3.8 MB', sizeBytes: 3984588, folderId: 'fol1', tags: ['Architecture', 'PDF'], isFavorite: true, createdAt: '2026-07-01' },
  { id: 'f2', name: 'Landing_Page_Mockup_2026.png', type: 'image', size: '1.2 MB', sizeBytes: 1258291, folderId: 'fol2', tags: ['Design', 'UI'], isFavorite: true, createdAt: '2026-07-10', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&fit=crop&auto=format&q=80' },
  { id: 'f3', name: 'Sprint7_Retrospective_Notes.md', type: 'markdown', size: '14 KB', sizeBytes: 14336, folderId: 'fol1', tags: ['Notes'], isFavorite: false, createdAt: '2026-07-15' },
  { id: 'f4', name: 'Task_Management_Schema.json', type: 'code', size: '45 KB', sizeBytes: 46080, folderId: 'fol3', tags: ['Schema', 'Code'], isFavorite: false, createdAt: '2026-07-05' },
  { id: 'f5', name: 'App_Logo_Variants_Vector.svg', type: 'image', size: '240 KB', sizeBytes: 245760, folderId: 'fol2', tags: ['Branding'], isFavorite: false, createdAt: '2026-07-02', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&fit=crop&auto=format&q=80' },
  { id: 'f6', name: 'Quarterly_Financial_Audit_2026.pdf', type: 'pdf', size: '4.5 MB', sizeBytes: 4718592, folderId: 'fol1', tags: ['Finance'], isFavorite: true, createdAt: '2026-07-18' },
  { id: 'f7', name: 'Database_Backup_Postgres.zip', type: 'archive', size: '18.2 MB', sizeBytes: 19084083, folderId: 'fol3', tags: ['Backup'], isFavorite: false, createdAt: '2026-07-19' },
]

export const useFilesStore = create<FilesState>((set) => ({
  files: mockFiles,
  folders: mockFolders,
  selectedFolderId: null,
  viewMode: 'grid',
  searchQuery: '',
  selectedFile: null,

  setSelectedFolder: (id) => set({ selectedFolderId: id }),
  setViewMode: (viewMode) => set({ viewMode }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedFile: (selectedFile) => set({ selectedFile }),

  addFile: (fileData) =>
    set((state) => ({
      files: [
        ...state.files,
        { ...fileData, id: `f_${Math.random().toString(36).substr(2, 9)}`, createdAt: new Date().toISOString().split('T')[0] },
      ],
    })),

  deleteFile: (id) =>
    set((state) => ({
      files: state.files.filter((f) => f.id !== id),
      selectedFile: state.selectedFile?.id === id ? null : state.selectedFile,
    })),

  toggleFavorite: (id) =>
    set((state) => ({
      files: state.files.map((f) => (f.id === id ? { ...f, isFavorite: !f.isFavorite } : f)),
    })),

  addFolder: (folderData) =>
    set((state) => ({
      folders: [...state.folders, { ...folderData, id: `fol_${Math.random().toString(36).substr(2, 9)}` }],
    })),
}))
