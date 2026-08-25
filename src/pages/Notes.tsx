import React, { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, FileText, Star, Pin, Trash2, X, FolderOpen,
  ChevronRight, ChevronDown, Edit3, Eye, Columns, Clock,
  Hash, Bookmark, Sparkles, Bold, Italic, List, Code, Heading,
  Link, Image, Minus, Quote, ListOrdered
} from 'lucide-react'
import { useNotesStore } from '../store/useNotesStore'
import type { Note, NoteFolder } from '../store/useNotesStore'

// Simple markdown renderer
const renderMarkdown = (text: string): string => {
  return text
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-bold text-text-primary mt-4 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold text-text-primary mt-5 mb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-xl font-black text-text-primary mt-6 mb-3">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-muted rounded text-xs font-mono text-indigo-600 dark:text-indigo-400">$1</code>')
    .replace(/^- \[x\] (.+)$/gm, '<div class="flex items-center gap-2 text-sm text-text-secondary line-through"><span class="w-4 h-4 rounded border-2 border-emerald-500 bg-emerald-500 flex items-center justify-center text-white text-[10px]">✓</span>$1</div>')
    .replace(/^- \[ \] (.+)$/gm, '<div class="flex items-center gap-2 text-sm text-text-primary"><span class="w-4 h-4 rounded border-2 border-border"></span>$1</div>')
    .replace(/^- (.+)$/gm, '<li class="text-sm text-text-primary ml-4 list-disc">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="text-sm text-text-primary ml-4 list-decimal">$1</li>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-2 border-indigo-500 pl-3 text-sm text-text-secondary italic my-2">$1</blockquote>')
    .replace(/^---$/gm, '<hr class="my-4 border-border" />')
    .replace(/\| (.+) \|/g, (match) => {
      const cells = match.split('|').filter(Boolean).map(c => c.trim())
      return `<div class="flex gap-4 py-1.5 text-xs text-text-primary border-b border-border">${cells.map(c => `<span class="flex-1 font-medium">${c}</span>`).join('')}</div>`
    })
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-muted/60 border border-border rounded-xl p-3 my-3 overflow-x-auto text-xs font-mono text-text-primary">$2</pre>')
    .replace(/\n\n/g, '<div class="h-3"></div>')
    .replace(/\n/g, '<br />')
}

export const NotesPage: React.FC = () => {
  const {
    notes, folders, selectedNoteId, selectedFolderId, searchQuery, isEditing, showPreview,
    setSelectedNote, setSelectedFolder, setSearchQuery, setEditing, setShowPreview,
    addNote, updateNote, deleteNote, addFolder, deleteFolder, toggleFavorite, togglePin
  } = useNotesStore()

  const [showNewFolder, setShowNewFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['f1', 'f2', 'f3']))
  const [showSlashMenu, setShowSlashMenu] = useState(false)

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || null

  // Filtered notes
  const filteredNotes = useMemo(() => {
    let filtered = notes
    if (selectedFolderId) {
      filtered = filtered.filter((n) => n.folderId === selectedFolderId)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter((n) =>
        n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) || n.tags.some((t) => t.toLowerCase().includes(q))
      )
    }
    // Pinned first, then by updatedAt
    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
  }, [notes, selectedFolderId, searchQuery])

  const favoriteNotes = notes.filter((n) => n.isFavorite)

  const toggleFolder = (id: string) => {
    const next = new Set(expandedFolders)
    next.has(id) ? next.delete(id) : next.add(id)
    setExpandedFolders(next)
  }

  const handleCreateNote = () => {
    addNote({
      title: 'Untitled Note',
      content: '# Untitled Note\n\nStart writing...',
      folderId: selectedFolderId || 'f1',
      tags: [],
      isFavorite: false,
      isPinned: false,
    })
  }

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return
    addFolder({ name: newFolderName, parentId: null, icon: 'FolderOpen' })
    setNewFolderName('')
    setShowNewFolder(false)
  }

  const timeSince = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    return `${days}d ago`
  }

  // Slash command items
  const slashCommands = [
    { label: 'Heading 1', icon: <Heading size={14} />, insert: '# ' },
    { label: 'Heading 2', icon: <Heading size={14} />, insert: '## ' },
    { label: 'Heading 3', icon: <Heading size={14} />, insert: '### ' },
    { label: 'Bullet List', icon: <List size={14} />, insert: '- ' },
    { label: 'Numbered List', icon: <ListOrdered size={14} />, insert: '1. ' },
    { label: 'Checkbox', icon: <List size={14} />, insert: '- [ ] ' },
    { label: 'Code Block', icon: <Code size={14} />, insert: '```\n\n```' },
    { label: 'Quote', icon: <Quote size={14} />, insert: '> ' },
    { label: 'Divider', icon: <Minus size={14} />, insert: '\n---\n' },
    { label: 'Bold', icon: <Bold size={14} />, insert: '**text**' },
    { label: 'Italic', icon: <Italic size={14} />, insert: '*text*' },
    { label: 'Link', icon: <Link size={14} />, insert: '[text](url)' },
    { label: 'Image', icon: <Image size={14} />, insert: '![alt](url)' },
  ]

  const insertSlashCommand = (insert: string) => {
    if (!selectedNote) return
    const newContent = selectedNote.content + '\n' + insert
    updateNote(selectedNote.id, { content: newContent })
    setShowSlashMenu(false)
  }

  return (
    <div className="flex gap-0 h-[calc(100vh-100px)] -m-4 md:-m-6">
      {/* Notes Sidebar */}
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden md:flex flex-col w-64 shrink-0 bg-surface border-r border-border"
      >
        {/* Search */}
        <div className="p-3 border-b border-border">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-2 text-text-secondary" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-muted/50 border border-border rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-text-primary"
              placeholder="Search notes..."
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Quick Actions */}
          <div className="space-y-0.5">
            <button
              onClick={() => { setSelectedFolder(null); setSearchQuery('') }}
              className={`flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${!selectedFolderId ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400' : 'text-text-secondary hover:bg-muted'}`}
            >
              <FileText size={14} /> All Notes
              <span className="ml-auto text-[10px] bg-muted px-1.5 py-0.5 rounded font-bold">{notes.length}</span>
            </button>
            <button
              onClick={() => { setSelectedFolder(null); setSearchQuery('') }}
              className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-xs font-semibold text-text-secondary hover:bg-muted transition-colors"
            >
              <Star size={14} className="text-amber-500" /> Favorites
              <span className="ml-auto text-[10px] bg-muted px-1.5 py-0.5 rounded font-bold">{favoriteNotes.length}</span>
            </button>
          </div>

          {/* Folders */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Folders</span>
              <button onClick={() => setShowNewFolder(true)} className="p-1 hover:bg-muted rounded text-text-secondary"><Plus size={12} /></button>
            </div>
            {showNewFolder && (
              <div className="flex gap-1 mb-2">
                <input value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()} className="flex-1 px-2 py-1 bg-muted/50 border border-border rounded-lg text-xs focus:outline-none text-text-primary" placeholder="Folder name" autoFocus />
                <button onClick={handleCreateFolder} className="px-2 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded-lg">Add</button>
              </div>
            )}
            <div className="space-y-0.5">
              {folders.filter((f) => !f.parentId).map((folder) => {
                const children = folders.filter((f) => f.parentId === folder.id)
                const isExpanded = expandedFolders.has(folder.id)
                const count = notes.filter((n) => n.folderId === folder.id).length
                return (
                  <div key={folder.id}>
                    <button
                      onClick={() => { setSelectedFolder(folder.id); toggleFolder(folder.id) }}
                      className={`flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        selectedFolderId === folder.id ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400' : 'text-text-secondary hover:bg-muted'
                      }`}
                    >
                      {children.length > 0 ? (isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />) : <FolderOpen size={12} />}
                      <span className="truncate">{folder.name}</span>
                      <span className="ml-auto text-[10px] bg-muted px-1.5 py-0.5 rounded font-bold">{count}</span>
                    </button>
                    {isExpanded && children.map((child) => {
                      const childCount = notes.filter((n) => n.folderId === child.id).length
                      return (
                        <button
                          key={child.id}
                          onClick={() => setSelectedFolder(child.id)}
                          className={`flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-xs font-semibold pl-7 transition-colors ${
                            selectedFolderId === child.id ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600' : 'text-text-secondary hover:bg-muted'
                          }`}
                        >
                          <FolderOpen size={11} />
                          <span className="truncate">{child.name}</span>
                          <span className="ml-auto text-[10px] bg-muted px-1.5 py-0.5 rounded font-bold">{childCount}</span>
                        </button>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent Notes */}
          <div>
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-2">Recent</span>
            <div className="space-y-0.5">
              {notes
                .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                .slice(0, 5)
                .map((note) => (
                  <button
                    key={note.id}
                    onClick={() => setSelectedNote(note.id)}
                    className={`flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      selectedNoteId === note.id ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600' : 'text-text-secondary hover:bg-muted'
                    }`}
                  >
                    <Clock size={11} className="shrink-0" />
                    <span className="truncate font-medium">{note.title}</span>
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* New Note Button */}
        <div className="p-3 border-t border-border">
          <button
            onClick={handleCreateNote}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-apple transition-colors"
          >
            <Plus size={14} /> New Note
          </button>
        </div>
      </motion.aside>

      {/* Note List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="hidden md:flex flex-col w-72 shrink-0 border-r border-border bg-surface/50"
      >
        <div className="p-3 border-b border-border flex items-center justify-between">
          <span className="text-xs font-bold text-text-primary">
            {selectedFolderId ? folders.find((f) => f.id === selectedFolderId)?.name : 'All Notes'}
          </span>
          <span className="text-[10px] text-text-secondary bg-muted px-1.5 py-0.5 rounded font-bold">{filteredNotes.length}</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredNotes.map((note) => (
            <button
              key={note.id}
              onClick={() => setSelectedNote(note.id)}
              className={`w-full text-left p-3 border-b border-border hover:bg-muted/30 transition-colors ${
                selectedNoteId === note.id ? 'bg-indigo-50/50 dark:bg-indigo-950/10' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-1">
                <h4 className="text-xs font-bold text-text-primary truncate flex-1">{note.title}</h4>
                <div className="flex gap-1 shrink-0 ml-1">
                  {note.isPinned && <Pin size={10} className="text-indigo-500" />}
                  {note.isFavorite && <Star size={10} className="text-amber-500 fill-amber-500" />}
                </div>
              </div>
              <p className="text-[10px] text-text-secondary line-clamp-2 mb-1.5">
                {note.content.replace(/[#*`>\[\]|_-]/g, '').slice(0, 100)}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-text-secondary/60">{timeSince(note.updatedAt)}</span>
                {note.tags.slice(0, 2).map((t) => (
                  <span key={t} className="text-[8px] font-bold bg-muted px-1 py-0.5 rounded text-text-secondary">#{t}</span>
                ))}
              </div>
            </button>
          ))}
          {filteredNotes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText size={32} className="text-text-secondary/20 mb-2" />
              <p className="text-xs text-text-secondary/50">No notes found</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Editor / Preview */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedNote ? (
          <>
            {/* Editor Toolbar */}
            <div className="flex items-center justify-between p-3 border-b border-border bg-surface/80">
              <div className="flex items-center gap-2 min-w-0">
                <h2 className="text-sm font-bold text-text-primary truncate">{selectedNote.title}</h2>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button onClick={() => togglePin(selectedNote.id)} className={`p-1.5 rounded-lg hover:bg-muted transition-colors ${selectedNote.isPinned ? 'text-indigo-500' : 'text-text-secondary'}`}><Pin size={14} /></button>
                <button onClick={() => toggleFavorite(selectedNote.id)} className={`p-1.5 rounded-lg hover:bg-muted transition-colors ${selectedNote.isFavorite ? 'text-amber-500' : 'text-text-secondary'}`}><Star size={14} className={selectedNote.isFavorite ? 'fill-amber-500' : ''} /></button>
                <div className="w-px h-4 bg-border mx-0.5" />
                <button onClick={() => { setEditing(true); setShowPreview(false) }} className={`p-1.5 rounded-lg transition-colors ${isEditing && !showPreview ? 'bg-muted text-text-primary' : 'text-text-secondary hover:bg-muted'}`}><Edit3 size={14} /></button>
                <button onClick={() => { setEditing(false); setShowPreview(true) }} className={`p-1.5 rounded-lg transition-colors ${showPreview && !isEditing ? 'bg-muted text-text-primary' : 'text-text-secondary hover:bg-muted'}`}><Eye size={14} /></button>
                <button onClick={() => { setEditing(true); setShowPreview(true) }} className={`p-1.5 rounded-lg transition-colors ${isEditing && showPreview ? 'bg-muted text-text-primary' : 'text-text-secondary hover:bg-muted'}`}><Columns size={14} /></button>
                <div className="w-px h-4 bg-border mx-0.5" />
                <button onClick={() => deleteNote(selectedNote.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-red-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>

            {/* Formatting Bar */}
            {isEditing && (
              <div className="flex items-center gap-0.5 px-3 py-1.5 border-b border-border bg-muted/20">
                {[
                  { icon: <Bold size={13} />, insert: '**text**' },
                  { icon: <Italic size={13} />, insert: '*text*' },
                  { icon: <Code size={13} />, insert: '`code`' },
                  { icon: <Heading size={13} />, insert: '## ' },
                  { icon: <List size={13} />, insert: '- ' },
                  { icon: <ListOrdered size={13} />, insert: '1. ' },
                  { icon: <Quote size={13} />, insert: '> ' },
                  { icon: <Minus size={13} />, insert: '\n---\n' },
                  { icon: <Link size={13} />, insert: '[text](url)' },
                ].map((btn, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      updateNote(selectedNote.id, { content: selectedNote.content + '\n' + btn.insert })
                    }}
                    className="p-1.5 rounded-lg text-text-secondary hover:bg-muted hover:text-text-primary transition-colors"
                  >
                    {btn.icon}
                  </button>
                ))}
                <div className="w-px h-4 bg-border mx-1" />
                <button
                  onClick={() => setShowSlashMenu(!showSlashMenu)}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-text-secondary hover:bg-muted text-[10px] font-bold transition-colors"
                >
                  <Sparkles size={12} className="text-indigo-500" /> Slash
                </button>
              </div>
            )}

            {/* Editor + Preview Split */}
            <div className="flex-1 flex overflow-hidden">
              {/* Editor */}
              {isEditing && (
                <div className={`${showPreview ? 'w-1/2 border-r border-border' : 'w-full'} flex flex-col`}>
                  {/* Title */}
                  <input
                    value={selectedNote.title}
                    onChange={(e) => updateNote(selectedNote.id, { title: e.target.value })}
                    className="px-6 pt-5 pb-2 text-xl font-black text-text-primary bg-transparent focus:outline-none"
                    placeholder="Note title"
                  />
                  {/* Tags */}
                  <div className="px-6 pb-3 flex gap-1.5 flex-wrap">
                    {selectedNote.tags.map((t) => (
                      <span key={t} className="px-2 py-0.5 text-[10px] font-bold bg-muted border border-border/50 rounded-lg text-text-secondary flex items-center gap-1">
                        <Hash size={9} />{t}
                      </span>
                    ))}
                  </div>
                  {/* Content */}
                  <textarea
                    value={selectedNote.content}
                    onChange={(e) => updateNote(selectedNote.id, { content: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === '/' && (e.target as HTMLTextAreaElement).value.endsWith('\n')) {
                        setShowSlashMenu(true)
                      }
                    }}
                    className="flex-1 px-6 pb-6 text-sm text-text-primary bg-transparent focus:outline-none resize-none font-mono leading-relaxed"
                    placeholder="Start writing in Markdown..."
                  />
                </div>
              )}

              {/* Preview */}
              {(showPreview || !isEditing) && (
                <div className={`${isEditing && showPreview ? 'w-1/2' : 'w-full'} overflow-y-auto`}>
                  <div className="px-6 pt-5 pb-2">
                    <h1 className="text-xl font-black text-text-primary">{selectedNote.title}</h1>
                    <div className="flex gap-1.5 flex-wrap mt-2 mb-4">
                      {selectedNote.tags.map((t) => (
                        <span key={t} className="px-2 py-0.5 text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-lg">#{t}</span>
                      ))}
                    </div>
                  </div>
                  <div
                    className="px-6 pb-6 prose prose-sm dark:prose-invert max-w-none text-text-primary"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(selectedNote.content) }}
                  />
                </div>
              )}
            </div>

            {/* Slash Command Menu */}
            <AnimatePresence>
              {showSlashMenu && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowSlashMenu(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute bottom-20 left-1/2 -translate-x-1/2 w-64 bg-surface border border-border rounded-2xl shadow-apple-floating p-2 z-40 max-h-80 overflow-y-auto"
                  >
                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider px-2 py-1 mb-1">Insert Block</p>
                    {slashCommands.map((cmd) => (
                      <button
                        key={cmd.label}
                        onClick={() => insertSlashCommand(cmd.insert)}
                        className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-xl text-xs font-semibold text-text-primary hover:bg-muted transition-colors"
                      >
                        <span className="text-text-secondary">{cmd.icon}</span>
                        {cmd.label}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="p-4 bg-muted/30 rounded-2xl mb-4">
              <FileText size={40} className="text-text-secondary/30" />
            </div>
            <h3 className="text-base font-bold text-text-primary mb-1">Select a note</h3>
            <p className="text-xs text-text-secondary mb-4">Choose a note from the sidebar or create a new one</p>
            <button
              onClick={handleCreateNote}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-apple transition-colors"
            >
              <Plus size={14} /> Create Note
            </button>
          </div>
        )}

        {/* Mobile: Note list (when no note selected) */}
        <div className="md:hidden">
          {!selectedNote && (
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-black text-text-primary">Notes</h2>
                <button onClick={handleCreateNote} className="p-2 bg-indigo-600 rounded-xl text-white shadow-apple"><Plus size={16} /></button>
              </div>
              <div className="relative mb-3">
                <Search size={14} className="absolute left-2.5 top-2 text-text-secondary" />
                <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-8 pr-3 py-1.5 bg-muted/50 border border-border rounded-xl text-xs focus:outline-none text-text-primary" placeholder="Search..." />
              </div>
              {filteredNotes.map((note) => (
                <button key={note.id} onClick={() => setSelectedNote(note.id)} className="w-full text-left p-3 bg-surface border border-border rounded-xl">
                  <h4 className="text-xs font-bold text-text-primary mb-1">{note.title}</h4>
                  <p className="text-[10px] text-text-secondary line-clamp-2">{note.content.replace(/[#*`>\[\]|_-]/g, '').slice(0, 80)}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
