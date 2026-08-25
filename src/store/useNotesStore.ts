import { create } from 'zustand'

export interface Note {
  id: string
  title: string
  content: string
  folderId: string
  tags: string[]
  isFavorite: boolean
  isPinned: boolean
  createdAt: string
  updatedAt: string
}

export interface NoteFolder {
  id: string
  name: string
  parentId: string | null
  icon: string
}

interface NotesState {
  notes: Note[]
  folders: NoteFolder[]
  selectedNoteId: string | null
  selectedFolderId: string | null
  searchQuery: string
  isEditing: boolean
  showPreview: boolean
  setSelectedNote: (id: string | null) => void
  setSelectedFolder: (id: string | null) => void
  setSearchQuery: (query: string) => void
  setEditing: (editing: boolean) => void
  setShowPreview: (show: boolean) => void
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateNote: (id: string, updates: Partial<Note>) => void
  deleteNote: (id: string) => void
  addFolder: (folder: Omit<NoteFolder, 'id'>) => void
  deleteFolder: (id: string) => void
  toggleFavorite: (id: string) => void
  togglePin: (id: string) => void
}

const mockFolders: NoteFolder[] = [
  { id: 'f1', name: 'Work', parentId: null, icon: 'Briefcase' },
  { id: 'f2', name: 'Personal', parentId: null, icon: 'User' },
  { id: 'f3', name: 'Learning', parentId: null, icon: 'GraduationCap' },
  { id: 'f4', name: 'Meeting Notes', parentId: 'f1', icon: 'MessageSquare' },
]

const mockNotes: Note[] = [
  {
    id: 'n1',
    title: 'Q3 OKR Planning',
    content: `# Q3 OKR Planning\n\n## Objective 1: Ship LifeOS V1\n\n### Key Results\n- [ ] Complete all 13 modules by July 31\n- [ ] Achieve 60fps animations across all views\n- [ ] Zero TypeScript errors in production build\n\n## Objective 2: Build User Base\n- [ ] Launch landing page with premium animations\n- [ ] Set up analytics tracking\n- [ ] Create onboarding flow\n\n---\n\n> "The best way to predict the future is to create it." — Peter Drucker\n\n### Notes\nFocus on **Calendar**, **Projects**, and **Notes** modules first. These are the most requested features.\n\n\`\`\`typescript\nconst priority = ['calendar', 'projects', 'notes']\npriority.forEach(module => buildModule(module))\n\`\`\``,
    folderId: 'f1',
    tags: ['planning', 'okr', 'q3'],
    isFavorite: true,
    isPinned: true,
    createdAt: '2026-07-01T09:00:00',
    updatedAt: '2026-07-20T14:30:00',
  },
  {
    id: 'n2',
    title: 'Sprint 7 Retro',
    content: `# Sprint 7 Retrospective\n\n## What went well ✅\n- Shipped Dashboard with all widgets\n- Habit heatmap rendering smoothly\n- Finance ledger CRUD complete\n\n## What could improve 🔄\n- Need more unit tests\n- Mobile responsiveness needs polishing\n- Code splitting for lazy loading\n\n## Action Items\n1. Add skeleton loaders to all pages\n2. Set up Vitest for component tests\n3. Review Tailwind class consistency`,
    folderId: 'f4',
    tags: ['sprint', 'retro'],
    isFavorite: false,
    isPinned: false,
    createdAt: '2026-07-15T10:00:00',
    updatedAt: '2026-07-15T11:00:00',
  },
  {
    id: 'n3',
    title: 'React 19 Notes',
    content: `# React 19 Key Features\n\n## Server Components\nRender on the server, zero client bundle size for data-fetching components.\n\n## Actions\n\`\`\`tsx\nasync function submitForm(formData: FormData) {\n  'use server'\n  await db.insert(formData)\n}\n\n<form action={submitForm}>\n  <input name="title" />\n  <button type="submit">Save</button>\n</form>\n\`\`\`\n\n## use() Hook\nRead promises and context directly in render.\n\n## Document Metadata\n\`<title>\` and \`<meta>\` tags in components — no more Helmet!\n\n## Asset Loading\nSuspense-integrated asset preloading for images, scripts, stylesheets.`,
    folderId: 'f3',
    tags: ['react', 'frontend', 'learning'],
    isFavorite: true,
    isPinned: false,
    createdAt: '2026-07-10T08:00:00',
    updatedAt: '2026-07-18T16:00:00',
  },
  {
    id: 'n4',
    title: 'Daily Journal — July 20',
    content: `# July 20, 2026\n\n## Morning Reflection\nSlept well. 7.5 hours. Woke up at 6:30 AM.\n\n## Gratitude\n- Grateful for the productive coding session yesterday\n- Good weather for a morning run\n- Healthy breakfast with fresh fruit\n\n## Today's Priorities\n1. Finish Calendar module implementation\n2. Review PR for finance charts\n3. Gym session — leg day\n4. Read 20 pages of "Atomic Habits"\n\n## Evening Notes\nCompleted 3/4 priorities. Skipped reading — will catch up tomorrow.`,
    folderId: 'f2',
    tags: ['journal', 'daily'],
    isFavorite: false,
    isPinned: false,
    createdAt: '2026-07-20T06:30:00',
    updatedAt: '2026-07-20T22:00:00',
  },
  {
    id: 'n5',
    title: 'API Architecture Draft',
    content: `# API Architecture\n\n## Stack Decision\n- **REST** for CRUD operations\n- **GraphQL** for dashboard aggregations\n- **WebSocket** for real-time notifications\n\n## Endpoints\n| Resource | Method | Path |\n|----------|--------|------|\n| Tasks | GET | /api/tasks |\n| Tasks | POST | /api/tasks |\n| Habits | GET | /api/habits |\n| Finance | GET | /api/finance/transactions |\n\n## Auth\nJWT with refresh tokens. HttpOnly cookies.\n\n## Rate Limiting\n100 requests/minute per user.`,
    folderId: 'f1',
    tags: ['architecture', 'api', 'backend'],
    isFavorite: false,
    isPinned: true,
    createdAt: '2026-07-05T14:00:00',
    updatedAt: '2026-07-12T09:00:00',
  },
  {
    id: 'n6',
    title: 'Book Notes: Atomic Habits',
    content: `# Atomic Habits — James Clear\n\n## Core Ideas\n\n### 1. The 1% Rule\nSmall improvements compound. 1% better each day = 37x better in a year.\n\n### 2. Four Laws of Behavior Change\n1. **Cue** — Make it obvious\n2. **Craving** — Make it attractive\n3. **Response** — Make it easy\n4. **Reward** — Make it satisfying\n\n### 3. Identity-Based Habits\nDon't focus on goals. Focus on **who you want to become**.\n\n> "Every action is a vote for the type of person you wish to become."\n\n### 4. Environment Design\nDesign your environment to make good habits easier and bad habits harder.\n\n## My Takeaways\n- Stack habits: After I [CURRENT HABIT], I will [NEW HABIT]\n- Track habits visually (that's why LifeOS heatmaps matter!)\n- Never miss twice`,
    folderId: 'f3',
    tags: ['book', 'habits', 'productivity'],
    isFavorite: true,
    isPinned: false,
    createdAt: '2026-07-08T20:00:00',
    updatedAt: '2026-07-19T21:00:00',
  },
  {
    id: 'n7',
    title: 'Weekend Trip Ideas',
    content: `# Weekend Getaway Ideas\n\n## Option 1: Napa Valley 🍷\n- Drive time: 1.5 hours\n- Wine tasting at Opus One\n- Hot air balloon ride\n- Budget: $400-600\n\n## Option 2: Big Sur 🌊\n- Drive time: 3 hours\n- Bixby Bridge viewpoint\n- McWay Falls hike\n- Budget: $300-500\n\n## Option 3: Lake Tahoe 🏔️\n- Drive time: 3.5 hours\n- Kayaking on Emerald Bay\n- Sand Harbor beach\n- Budget: $500-700`,
    folderId: 'f2',
    tags: ['travel', 'personal'],
    isFavorite: false,
    isPinned: false,
    createdAt: '2026-07-18T19:00:00',
    updatedAt: '2026-07-18T19:30:00',
  },
]

export const useNotesStore = create<NotesState>((set) => ({
  notes: mockNotes,
  folders: mockFolders,
  selectedNoteId: 'n1',
  selectedFolderId: null,
  searchQuery: '',
  isEditing: true,
  showPreview: false,

  setSelectedNote: (id) => set({ selectedNoteId: id }),
  setSelectedFolder: (id) => set({ selectedFolderId: id }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setEditing: (isEditing) => set({ isEditing }),
  setShowPreview: (showPreview) => set({ showPreview }),

  addNote: (noteData) =>
    set((state) => {
      const now = new Date().toISOString()
      const newNote: Note = {
        ...noteData,
        id: `n_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: now,
        updatedAt: now,
      }
      return { notes: [newNote, ...state.notes], selectedNoteId: newNote.id }
    }),

  updateNote: (id, updates) =>
    set((state) => ({
      notes: state.notes.map((n) =>
        n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
      ),
    })),

  deleteNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== id),
      selectedNoteId: state.selectedNoteId === id ? null : state.selectedNoteId,
    })),

  addFolder: (folderData) =>
    set((state) => ({
      folders: [
        ...state.folders,
        { ...folderData, id: `f_${Math.random().toString(36).substr(2, 9)}` },
      ],
    })),

  deleteFolder: (id) =>
    set((state) => ({
      folders: state.folders.filter((f) => f.id !== id),
      notes: state.notes.map((n) => (n.folderId === id ? { ...n, folderId: '' } : n)),
    })),

  toggleFavorite: (id) =>
    set((state) => ({
      notes: state.notes.map((n) =>
        n.id === id ? { ...n, isFavorite: !n.isFavorite } : n
      ),
    })),

  togglePin: (id) =>
    set((state) => ({
      notes: state.notes.map((n) =>
        n.id === id ? { ...n, isPinned: !n.isPinned } : n
      ),
    })),
}))
