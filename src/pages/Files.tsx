import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HardDrive, Plus, Search, LayoutGrid, List, FolderOpen, Star, Trash2,
  X, Download, Eye, FileText, Image as ImageIcon, FileCode, Archive,
  File, UploadCloud, ChevronRight, Hash
} from 'lucide-react'
import { useFilesStore } from '../store/useFilesStore'
import type { FileItem } from '../store/useFilesStore'

const FILE_ICON_MAP = {
  image: <ImageIcon size={20} className="text-indigo-500" />,
  pdf: <FileText size={20} className="text-red-500" />,
  markdown: <FileText size={20} className="text-emerald-500" />,
  code: <FileCode size={20} className="text-amber-500" />,
  archive: <Archive size={20} className="text-purple-500" />,
  doc: <File size={20} className="text-slate-500" />,
}

export const FilesPage: React.FC = () => {
  const { files, folders, selectedFolderId, viewMode, searchQuery, selectedFile, setSelectedFolder, setViewMode, setSearchQuery, setSelectedFile, addFile, deleteFile, toggleFavorite, addFolder } = useFilesStore()
  const [showUploadModal, setShowUploadModal] = useState(false)

  const filteredFiles = useMemo(() => {
    let result = files
    if (selectedFolderId) {
      result = result.filter((f) => f.folderId === selectedFolderId)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter((f) => f.name.toLowerCase().includes(q) || f.tags.some((t) => t.toLowerCase().includes(q)))
    }
    return result
  }, [files, selectedFolderId, searchQuery])

  // Total storage usage (max 100 MB)
  const totalSizeBytes = useMemo(() => files.reduce((acc, f) => acc + f.sizeBytes, 0), [files])
  const storageLimitBytes = 100 * 1024 * 1024 // 100 MB
  const storagePct = Math.min(100, Math.round((totalSizeBytes / storageLimitBytes) * 100))
  const totalMB = (totalSizeBytes / (1024 * 1024)).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-black text-text-primary tracking-tight flex items-center gap-2">
            <HardDrive size={20} className="text-slate-500" />
            File Vault
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">{files.length} items stored · {totalMB} MB used of 100 MB limit</p>
        </div>

        <button onClick={() => setShowUploadModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-apple transition-colors">
          <UploadCloud size={14} /> Upload File
        </button>
      </motion.div>

      {/* Storage Bar Card */}
      <div className="p-4 bg-surface border border-border rounded-2xl shadow-apple flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <div className="flex justify-between text-xs font-bold text-text-primary mb-1">
            <span>Storage Usage</span>
            <span>{storagePct}% ({totalMB} MB / 100 MB)</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full transition-all duration-500" style={{ width: `${storagePct}%` }} />
          </div>
        </div>

        <div className="flex bg-muted/60 rounded-xl border border-border p-0.5">
          <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-surface text-text-primary shadow-apple' : 'text-text-secondary'}`}><LayoutGrid size={14} /></button>
          <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-surface text-text-primary shadow-apple' : 'text-text-secondary'}`}><List size={14} /></button>
        </div>
      </div>

      {/* Folders Bar */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedFolder(null)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            !selectedFolderId ? 'bg-indigo-600 text-white shadow-apple' : 'bg-surface border border-border text-text-primary hover:bg-muted'
          }`}
        >
          <FolderOpen size={14} /> All Files ({files.length})
        </button>
        {folders.map((f) => {
          const count = files.filter((item) => item.folderId === f.id).length
          return (
            <button
              key={f.id}
              onClick={() => setSelectedFolder(f.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedFolderId === f.id ? 'bg-indigo-600 text-white shadow-apple' : 'bg-surface border border-border text-text-primary hover:bg-muted'
              }`}
            >
              <FolderOpen size={14} /> {f.name} ({count})
            </button>
          )
        })}
      </div>

      {/* Files Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredFiles.map((file) => (
            <motion.div
              key={file.id}
              whileHover={{ y: -2 }}
              onClick={() => setSelectedFile(file)}
              className="p-4 bg-surface border border-border rounded-2xl shadow-apple hover:shadow-apple-floating transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 bg-muted/50 rounded-xl">
                  {FILE_ICON_MAP[file.type]}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(file.id) }}
                  className="p-1 hover:bg-muted rounded-lg text-text-secondary"
                >
                  <Star size={14} className={file.isFavorite ? 'text-amber-500 fill-amber-500' : ''} />
                </button>
              </div>

              <div>
                <h4 className="text-xs font-bold text-text-primary truncate mb-1">{file.name}</h4>
                <div className="flex items-center justify-between text-[10px] text-text-secondary">
                  <span>{file.size}</span>
                  <span>{file.createdAt}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-2xl shadow-apple overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border text-[10px] uppercase font-bold text-text-secondary">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Size</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredFiles.map((file) => (
                <tr key={file.id} onClick={() => setSelectedFile(file)} className="hover:bg-muted/30 cursor-pointer transition-colors">
                  <td className="p-3 flex items-center gap-2 font-semibold text-text-primary">
                    {FILE_ICON_MAP[file.type]}
                    <span className="truncate">{file.name}</span>
                  </td>
                  <td className="p-3 text-text-secondary uppercase text-[10px] font-bold">{file.type}</td>
                  <td className="p-3 text-text-secondary">{file.size}</td>
                  <td className="p-3 text-text-secondary">{file.createdAt}</td>
                  <td className="p-3 text-right">
                    <button onClick={(e) => { e.stopPropagation(); deleteFile(file.id) }} className="p-1 text-red-400 hover:text-red-500 rounded"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* File Detail Modal Overlay */}
      <AnimatePresence>
        {selectedFile && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-50" onClick={() => setSelectedFile(null)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="fixed inset-x-4 top-10 max-w-lg md:mx-auto md:top-20 bg-surface rounded-2xl border border-border shadow-apple-floating p-6 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
                <div className="flex items-center gap-2">
                  {FILE_ICON_MAP[selectedFile.type]}
                  <h3 className="font-bold text-text-primary text-sm truncate max-w-xs">{selectedFile.name}</h3>
                </div>
                <button onClick={() => setSelectedFile(null)} className="text-text-secondary"><X size={18} /></button>
              </div>

              {selectedFile.url && (
                <div className="mb-4 rounded-xl overflow-hidden max-h-56 bg-black flex items-center justify-center">
                  <img src={selectedFile.url} alt="" className="object-cover max-h-56 w-full" />
                </div>
              )}

              <div className="space-y-2 text-xs text-text-secondary mb-6">
                <p><strong className="text-text-primary">Size:</strong> {selectedFile.size}</p>
                <p><strong className="text-text-primary">Created:</strong> {selectedFile.createdAt}</p>
                <p><strong className="text-text-primary">Type:</strong> {selectedFile.type.toUpperCase()}</p>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-border">
                <button onClick={() => deleteFile(selectedFile.id)} className="px-3 py-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-bold rounded-xl">Delete</button>
                <button onClick={() => setSelectedFile(null)} className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-apple">Close Preview</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <UploadModal onClose={() => setShowUploadModal(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}

const UploadModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const addFile = useFilesStore((s) => s.addFile)
  const [fileName, setFileName] = useState('')
  const [type, setType] = useState<FileItem['type']>('pdf')

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fileName.trim()) return
    addFile({
      name: fileName,
      type,
      size: '1.5 MB',
      sizeBytes: 1572864,
      folderId: 'fol1',
      tags: ['Upload'],
      isFavorite: false,
    })
    onClose()
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-50" onClick={onClose} />
      <motion.div initial={{ scale: 0.95, opacity: 0, y: 15 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 15 }} className="fixed inset-x-4 top-10 max-w-lg md:mx-auto md:top-24 bg-surface rounded-2xl border border-border shadow-apple-floating p-6 z-50">
        <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
          <h3 className="font-bold text-text-primary text-base">Upload File</h3>
          <button onClick={onClose} className="text-text-secondary"><X size={18} /></button>
        </div>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-text-secondary block mb-1">File Name</label>
            <input value={fileName} onChange={(e) => setFileName(e.target.value)} className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none text-text-primary" placeholder="Document_Specification.pdf" />
          </div>
          <div>
            <label className="text-xs font-bold text-text-secondary block mb-1">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value as FileItem['type'])} className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none text-text-primary">
              <option value="pdf">PDF Document</option>
              <option value="image">Image</option>
              <option value="markdown">Markdown Note</option>
              <option value="code">Code / JSON</option>
              <option value="archive">Zip Archive</option>
            </select>
          </div>
          <div className="p-8 border-2 border-dashed border-border rounded-2xl text-center bg-muted/20">
            <UploadCloud size={32} className="mx-auto text-indigo-500 mb-2" />
            <p className="text-xs text-text-primary font-bold">Drag and drop file here or click to browse</p>
            <p className="text-[10px] text-text-secondary mt-1">Supports PNG, PDF, MD, JSON up to 25MB</p>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-border text-xs font-semibold text-text-secondary rounded-xl">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl shadow-apple">Confirm Upload</button>
          </div>
        </form>
      </motion.div>
    </>
  )
}
