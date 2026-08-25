import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Send, Plus, Pin, Trash2, Mic, Image as ImageIcon,
  MessageSquare, User, Bot, Clock, Search, ChevronRight, Copy, Check
} from 'lucide-react'
import { useAIStore } from '../store/useAIStore'

export const AIPage: React.FC = () => {
  const { conversations, selectedChatId, isTyping, setSelectedChat, sendMessage, newChat, deleteChat, togglePinChat } = useAIStore()
  const [input, setInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const selectedConv = conversations.find((c) => c.id === selectedChatId) || null

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selectedConv?.messages, isTyping])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    sendMessage(input)
    setInput('')
  }

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const promptSuggestions = [
    "Plan my daily focus routine based on my priority tasks",
    "Audit my subscriptions and give savings recommendations",
    "Create a 4-week workout & nutrition progression plan",
    "Summarize my OKR progress for Q3 and highlight risks",
  ]

  return (
    <div className="flex gap-0 h-[calc(100vh-100px)] -m-4 md:-m-6">
      {/* Sidebar */}
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden md:flex flex-col w-72 shrink-0 bg-surface border-r border-border"
      >
        <div className="p-3 border-b border-border space-y-2">
          <button
            onClick={newChat}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-apple transition-colors"
          >
            <Plus size={14} /> New Chat
          </button>

          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-2 text-text-secondary" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-muted/50 border border-border rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-text-primary"
              placeholder="Search chats..."
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredConversations.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors group ${
                selectedChatId === chat.id
                  ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-text-primary hover:bg-muted'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <MessageSquare size={14} className="shrink-0 text-text-secondary" />
                <span className="text-xs truncate">{chat.title}</span>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); togglePinChat(chat.id) }}
                  className="p-1 hover:bg-muted rounded text-text-secondary"
                >
                  <Pin size={12} className={chat.isPinned ? 'text-indigo-500 fill-indigo-500' : ''} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteChat(chat.id) }}
                  className="p-1 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-400 rounded"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.aside>

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col min-w-0 bg-surface/50">
        {selectedConv ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-border bg-surface flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-violet-500 text-white flex items-center justify-center font-black shadow-apple">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-text-primary">{selectedConv.title}</h2>
                  <span className="text-[10px] text-text-secondary">LifeOS Neural Assistant · GPT-4o Class</span>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              {selectedConv.messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start gap-3 max-w-3xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs shadow-apple ${
                    msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-violet-600 text-white'
                  }`}>
                    {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>

                  <div className={`p-4 rounded-2xl max-w-xl text-xs leading-relaxed space-y-2 relative group ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-surface border border-border text-text-primary rounded-tl-none shadow-apple'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <div className="flex items-center justify-between text-[9px] opacity-60 pt-1">
                      <span>{msg.timestamp}</span>
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="hover:opacity-100 transition-opacity"
                      >
                        {copiedId === msg.id ? <Check size={12} /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-violet-600 text-white flex items-center justify-center font-bold text-xs shadow-apple">
                    <Bot size={14} />
                  </div>
                  <div className="p-3 bg-surface border border-border rounded-2xl rounded-tl-none shadow-apple flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-violet-500 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-violet-500 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Box */}
            <div className="p-4 border-t border-border bg-surface">
              <form onSubmit={handleSend} className="relative flex items-center max-w-4xl mx-auto">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full pl-4 pr-24 py-3 bg-muted/60 border border-border focus:border-indigo-500 rounded-2xl text-xs focus:outline-none text-text-primary shadow-apple"
                  placeholder="Ask LifeOS AI anything... (e.g. optimize my habits, audit expenses)"
                />
                <div className="absolute right-2 flex items-center gap-1">
                  <button type="button" className="p-1.5 text-text-secondary hover:text-text-primary rounded-lg"><Mic size={16} /></button>
                  <button type="button" className="p-1.5 text-text-secondary hover:text-text-primary rounded-lg"><ImageIcon size={16} /></button>
                  <button type="submit" disabled={!input.trim()} className="p-2 bg-indigo-600 disabled:opacity-50 text-white rounded-xl shadow-apple hover:bg-indigo-700 transition-colors">
                    <Send size={14} />
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          /* Empty State Suggestions */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-violet-500 text-white flex items-center justify-center font-black text-2xl shadow-apple-floating mb-4">
              <Sparkles size={32} />
            </div>
            <h2 className="text-lg font-black text-text-primary mb-1">LifeOS Neural Assistant</h2>
            <p className="text-xs text-text-secondary mb-6">Ask questions, generate schedules, audit expenses, or brainstorm goals.</p>

            <div className="grid grid-cols-1 gap-2 w-full">
              {promptSuggestions.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => { newChat(); sendMessage(prompt) }}
                  className="p-3 bg-surface border border-border rounded-xl text-left text-xs font-semibold text-text-primary hover:border-indigo-500 transition-colors shadow-apple"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
