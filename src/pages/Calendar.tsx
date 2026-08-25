import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, ChevronLeft, ChevronRight, Calendar as CalIcon, Clock, MapPin,
  Trash2, X, Edit3, LayoutGrid, List, CalendarDays, CalendarClock, Repeat
} from 'lucide-react'
import { useCalendarStore } from '../store/useCalendarStore'
import type { CalendarEvent } from '../store/useCalendarStore'

const HOUR_HEIGHT = 60
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const CATEGORY_COLORS: Record<string, string> = { work: '#6366f1', personal: '#f43f5e', health: '#10b981', meeting: '#6366f1', social: '#f43f5e', other: '#64748b' }
const COLOR_OPTIONS = ['#6366f1','#8b5cf6','#f43f5e','#10b981','#f59e0b','#06b6d4','#64748b','#ec4899']

export const CalendarPage: React.FC = () => {
  const { events, view, selectedDate, setView, setSelectedDate, addEvent, updateEvent, deleteEvent } = useCalendarStore()
  const [showEventModal, setShowEventModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)

  const sel = new Date(selectedDate + 'T00:00:00')
  const currentYear = sel.getFullYear()
  const currentMonth = sel.getMonth()

  // Navigation
  const navigate = (dir: number) => {
    const d = new Date(sel)
    if (view === 'month') d.setMonth(d.getMonth() + dir)
    else if (view === 'week') d.setDate(d.getDate() + dir * 7)
    else d.setDate(d.getDate() + dir)
    setSelectedDate(d.toISOString().split('T')[0])
  }

  const goToday = () => setSelectedDate(new Date().toISOString().split('T')[0])

  // Month calendar grid
  const monthDays = useMemo(() => {
    const first = new Date(currentYear, currentMonth, 1)
    const startDay = first.getDay()
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate()
    const cells: { date: Date; isCurrentMonth: boolean }[] = []
    for (let i = startDay - 1; i >= 0; i--) {
      cells.push({ date: new Date(currentYear, currentMonth - 1, prevMonthDays - i), isCurrentMonth: false })
    }
    for (let i = 1; i <= daysInMonth; i++) {
      cells.push({ date: new Date(currentYear, currentMonth, i), isCurrentMonth: true })
    }
    const remaining = 42 - cells.length
    for (let i = 1; i <= remaining; i++) {
      cells.push({ date: new Date(currentYear, currentMonth + 1, i), isCurrentMonth: false })
    }
    return cells
  }, [currentYear, currentMonth])

  // Week days
  const weekDays = useMemo(() => {
    const d = new Date(sel)
    d.setDate(d.getDate() - d.getDay())
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(d)
      day.setDate(d.getDate() + i)
      return day
    })
  }, [selectedDate])

  // Get events for a date
  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return events.filter((e) => e.start.startsWith(dateStr))
  }

  const isToday = (date: Date) => {
    const t = new Date()
    return date.getDate() === t.getDate() && date.getMonth() === t.getMonth() && date.getFullYear() === t.getFullYear()
  }

  const formatTime = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
  }

  // Title for the header
  const headerTitle = view === 'month'
    ? `${MONTHS[currentMonth]} ${currentYear}`
    : view === 'week'
    ? `${MONTHS[weekDays[0].getMonth()]} ${weekDays[0].getDate()} – ${weekDays[6].getDate()}, ${weekDays[6].getFullYear()}`
    : `${MONTHS[sel.getMonth()]} ${sel.getDate()}, ${sel.getFullYear()}`

  // Upcoming events (next 7 days)
  const upcomingEvents = useMemo(() => {
    const now = new Date()
    const weekLater = new Date(now)
    weekLater.setDate(weekLater.getDate() + 7)
    return events
      .filter((e) => new Date(e.start) >= now && new Date(e.start) <= weekLater)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .slice(0, 6)
  }, [events])

  // Hours for day/week view
  const hours = Array.from({ length: 16 }, (_, i) => i + 6) // 6 AM to 9 PM

  return (
    <div className="flex gap-6 h-[calc(100vh-100px)]">
      {/* Sidebar */}
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:flex flex-col w-64 shrink-0"
      >
        {/* Mini Calendar */}
        <div className="p-4 bg-surface border border-border rounded-2xl shadow-apple mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-text-primary">{MONTHS[currentMonth]} {currentYear}</span>
            <div className="flex gap-1">
              <button onClick={() => navigate(-1)} className="p-1 hover:bg-muted rounded-lg text-text-secondary"><ChevronLeft size={14} /></button>
              <button onClick={() => navigate(1)} className="p-1 hover:bg-muted rounded-lg text-text-secondary"><ChevronRight size={14} /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-0.5 text-center">
            {WEEKDAYS.map((d) => (
              <span key={d} className="text-[9px] font-semibold text-text-secondary/60 py-1">{d[0]}</span>
            ))}
            {monthDays.map((cell, i) => {
              const dateStr = cell.date.toISOString().split('T')[0]
              const hasEvents = events.some((e) => e.start.startsWith(dateStr))
              const isSel = dateStr === selectedDate
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`text-[10px] py-1 rounded-lg transition-all relative ${
                    !cell.isCurrentMonth ? 'text-text-secondary/30' :
                    isSel ? 'bg-indigo-600 text-white font-bold' :
                    isToday(cell.date) ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 font-bold' :
                    'text-text-primary hover:bg-muted'
                  }`}
                >
                  {cell.date.getDate()}
                  {hasEvents && !isSel && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-500" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="p-4 bg-surface border border-border rounded-2xl shadow-apple flex-1 overflow-y-auto">
          <h3 className="text-xs font-bold text-text-primary mb-3 flex items-center gap-1.5">
            <Clock size={12} className="text-indigo-500" />
            Upcoming
          </h3>
          <div className="space-y-2">
            {upcomingEvents.map((ev) => (
              <button
                key={ev.id}
                onClick={() => setSelectedEvent(ev)}
                className="w-full text-left p-2.5 rounded-xl border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-2">
                  <div className="w-1 h-8 rounded-full mt-0.5 shrink-0" style={{ backgroundColor: ev.color }} />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-text-primary truncate">{ev.title}</p>
                    <p className="text-[10px] text-text-secondary">{formatTime(ev.start)}</p>
                  </div>
                </div>
              </button>
            ))}
            {upcomingEvents.length === 0 && (
              <p className="text-[10px] text-text-secondary/60 text-center py-4">No upcoming events</p>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="p-4 bg-surface border border-border rounded-2xl shadow-apple mt-4">
          <h3 className="text-xs font-bold text-text-primary mb-2">Categories</h3>
          <div className="space-y-1.5">
            {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
              <div key={cat} className="flex items-center gap-2 text-[10px]">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-text-secondary capitalize font-medium">{cat}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.aside>

      {/* Main Calendar Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-4 flex-wrap gap-3"
        >
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black text-text-primary tracking-tight">{headerTitle}</h1>
            <button onClick={goToday} className="px-2.5 py-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-950/50 transition-colors">
              Today
            </button>
            <div className="flex">
              <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-muted rounded-lg text-text-secondary"><ChevronLeft size={16} /></button>
              <button onClick={() => navigate(1)} className="p-1.5 hover:bg-muted rounded-lg text-text-secondary"><ChevronRight size={16} /></button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex bg-muted/60 rounded-xl border border-border p-0.5">
              {([
                { v: 'month', icon: LayoutGrid, label: 'Month' },
                { v: 'week', icon: CalendarDays, label: 'Week' },
                { v: 'day', icon: CalendarClock, label: 'Day' },
                { v: 'agenda', icon: List, label: 'Agenda' },
              ] as const).map(({ v, icon: Icon, label }) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                    view === v ? 'bg-surface text-text-primary shadow-apple' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Icon size={12} />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => { setEditingEvent(null); setShowEventModal(true) }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-apple transition-colors"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">New Event</span>
            </button>
          </div>
        </motion.div>

        {/* Calendar Grid */}
        <div className="flex-1 bg-surface border border-border rounded-2xl shadow-apple overflow-hidden">
          <AnimatePresence mode="wait">
            {view === 'month' && (
              <motion.div key="month" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col">
                {/* Weekday headers */}
                <div className="grid grid-cols-7 border-b border-border">
                  {WEEKDAYS.map((d) => (
                    <div key={d} className="text-center py-2 text-[10px] font-bold text-text-secondary uppercase tracking-wider">{d}</div>
                  ))}
                </div>
                {/* Day cells */}
                <div className="grid grid-cols-7 flex-1">
                  {monthDays.map((cell, i) => {
                    const dayEvents = getEventsForDate(cell.date)
                    const dateStr = cell.date.toISOString().split('T')[0]
                    return (
                      <div
                        key={i}
                        onClick={() => { setSelectedDate(dateStr); setView('day') }}
                        className={`border-b border-r border-border p-1.5 min-h-[80px] cursor-pointer hover:bg-muted/30 transition-colors ${
                          !cell.isCurrentMonth ? 'bg-muted/10' : ''
                        }`}
                      >
                        <span className={`text-[10px] font-bold inline-flex items-center justify-center w-5 h-5 rounded-full ${
                          isToday(cell.date) ? 'bg-indigo-600 text-white' :
                          !cell.isCurrentMonth ? 'text-text-secondary/30' : 'text-text-primary'
                        }`}>
                          {cell.date.getDate()}
                        </span>
                        <div className="mt-0.5 space-y-0.5">
                          {dayEvents.slice(0, 3).map((ev) => (
                            <div
                              key={ev.id}
                              onClick={(e) => { e.stopPropagation(); setSelectedEvent(ev) }}
                              className="text-[9px] font-semibold text-white rounded px-1.5 py-0.5 truncate cursor-pointer hover:opacity-90 transition-opacity"
                              style={{ backgroundColor: ev.color }}
                            >
                              {ev.title}
                            </div>
                          ))}
                          {dayEvents.length > 3 && (
                            <span className="text-[9px] text-text-secondary font-medium">+{dayEvents.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {view === 'week' && (
              <motion.div key="week" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full overflow-y-auto">
                <div className="grid grid-cols-[60px_repeat(7,1fr)] sticky top-0 bg-surface border-b border-border z-10">
                  <div />
                  {weekDays.map((d, i) => (
                    <div key={i} className={`text-center py-2 border-l border-border ${isToday(d) ? 'bg-indigo-50/50 dark:bg-indigo-950/20' : ''}`}>
                      <span className="text-[10px] font-semibold text-text-secondary">{WEEKDAYS[d.getDay()]}</span>
                      <span className={`block text-sm font-bold ${isToday(d) ? 'text-indigo-600' : 'text-text-primary'}`}>{d.getDate()}</span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-[60px_repeat(7,1fr)]">
                  {hours.map((hour) => (
                    <React.Fragment key={hour}>
                      <div className="h-[60px] text-[10px] text-text-secondary font-medium text-right pr-2 pt-0.5 border-r border-border">
                        {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                      </div>
                      {weekDays.map((d, di) => {
                        const dayEvents = getEventsForDate(d).filter((e) => {
                          const h = new Date(e.start).getHours()
                          return h === hour
                        })
                        return (
                          <div key={di} className={`h-[60px] border-b border-l border-border relative ${isToday(d) ? 'bg-indigo-50/20 dark:bg-indigo-950/10' : ''}`}>
                            {dayEvents.map((ev) => (
                              <div
                                key={ev.id}
                                onClick={() => setSelectedEvent(ev)}
                                className="absolute inset-x-0.5 top-0.5 rounded-lg px-1.5 py-1 text-[9px] font-semibold text-white cursor-pointer hover:opacity-90 z-10 overflow-hidden"
                                style={{ backgroundColor: ev.color, minHeight: '24px' }}
                              >
                                {ev.title}
                              </div>
                            ))}
                          </div>
                        )
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </motion.div>
            )}

            {view === 'day' && (
              <motion.div key="day" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full overflow-y-auto">
                <div className="p-3 border-b border-border bg-muted/20">
                  <span className={`text-sm font-bold ${isToday(sel) ? 'text-indigo-600' : 'text-text-primary'}`}>
                    {WEEKDAYS[sel.getDay()]}, {MONTHS[sel.getMonth()]} {sel.getDate()}
                  </span>
                </div>
                <div>
                  {hours.map((hour) => {
                    const hourEvents = getEventsForDate(sel).filter((e) => new Date(e.start).getHours() === hour)
                    return (
                      <div key={hour} className="flex border-b border-border">
                        <div className="w-16 shrink-0 text-[10px] text-text-secondary font-medium text-right pr-3 pt-1.5 border-r border-border">
                          {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                        </div>
                        <div className="flex-1 min-h-[60px] relative p-1">
                          {hourEvents.map((ev) => (
                            <div
                              key={ev.id}
                              onClick={() => setSelectedEvent(ev)}
                              className="rounded-xl px-3 py-2 text-white cursor-pointer hover:opacity-90 mb-1"
                              style={{ backgroundColor: ev.color }}
                            >
                              <p className="text-xs font-bold">{ev.title}</p>
                              <p className="text-[10px] opacity-80">{formatTime(ev.start)} – {formatTime(ev.end)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {view === 'agenda' && (
              <motion.div key="agenda" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full overflow-y-auto p-4">
                <div className="space-y-3">
                  {events
                    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
                    .map((ev) => {
                      const d = new Date(ev.start)
                      return (
                        <div
                          key={ev.id}
                          onClick={() => setSelectedEvent(ev)}
                          className="flex items-start gap-3 p-3 rounded-xl border border-border hover:bg-muted/30 cursor-pointer transition-colors"
                        >
                          <div className="w-1.5 h-12 rounded-full shrink-0" style={{ backgroundColor: ev.color }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-text-primary">{ev.title}</p>
                            <p className="text-[10px] text-text-secondary mt-0.5">
                              {WEEKDAYS[d.getDay()]}, {MONTHS[d.getMonth()]} {d.getDate()} · {formatTime(ev.start)} – {formatTime(ev.end)}
                            </p>
                            {ev.location && (
                              <p className="text-[10px] text-text-secondary flex items-center gap-1 mt-1">
                                <MapPin size={10} /> {ev.location}
                              </p>
                            )}
                          </div>
                          {ev.isRecurring && <Repeat size={12} className="text-text-secondary/50 shrink-0 mt-1" />}
                        </div>
                      )
                    })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Event Detail Drawer */}
      <AnimatePresence>
        {selectedEvent && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-40" onClick={() => setSelectedEvent(null)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-surface border-l border-border shadow-apple-floating z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-base font-bold text-text-primary">Event Details</h2>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingEvent(selectedEvent); setShowEventModal(true); setSelectedEvent(null) }} className="p-2 hover:bg-muted rounded-lg text-text-secondary"><Edit3 size={16} /></button>
                  <button onClick={() => { deleteEvent(selectedEvent.id); setSelectedEvent(null) }} className="p-2 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-red-500"><Trash2 size={16} /></button>
                  <button onClick={() => setSelectedEvent(null)} className="p-2 hover:bg-muted rounded-lg text-text-secondary"><X size={16} /></button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: selectedEvent.color }} />
                  <div>
                    <h3 className="text-lg font-black text-text-primary">{selectedEvent.title}</h3>
                    <p className="text-xs text-text-secondary mt-1">{selectedEvent.description}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 text-xs text-text-secondary">
                    <Clock size={14} className="text-indigo-500" />
                    <span>{formatTime(selectedEvent.start)} – {formatTime(selectedEvent.end)}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-text-secondary">
                    <CalIcon size={14} className="text-indigo-500" />
                    <span>{new Date(selectedEvent.start).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  {selectedEvent.location && (
                    <div className="flex items-center gap-2.5 text-xs text-text-secondary">
                      <MapPin size={14} className="text-indigo-500" />
                      <span>{selectedEvent.location}</span>
                    </div>
                  )}
                  {selectedEvent.isRecurring && (
                    <div className="flex items-center gap-2.5 text-xs text-text-secondary">
                      <Repeat size={14} className="text-indigo-500" />
                      <span>Recurring event</span>
                    </div>
                  )}
                </div>
                <div className="pt-3 border-t border-border">
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Category</span>
                  <span className="block text-xs font-semibold text-text-primary capitalize mt-1">{selectedEvent.category}</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Create/Edit Event Modal */}
      <AnimatePresence>
        {showEventModal && (
          <EventModal
            event={editingEvent}
            onSave={(eventData) => {
              if (editingEvent) {
                updateEvent(editingEvent.id, eventData)
              } else {
                addEvent(eventData as Omit<CalendarEvent, 'id'>)
              }
              setShowEventModal(false)
              setEditingEvent(null)
            }}
            onClose={() => { setShowEventModal(false); setEditingEvent(null) }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Event Form Modal ─────────────────────────────────────────────
const EventModal: React.FC<{
  event: CalendarEvent | null
  onSave: (data: Partial<CalendarEvent>) => void
  onClose: () => void
}> = ({ event, onSave, onClose }) => {
  const [title, setTitle] = useState(event?.title || '')
  const [description, setDescription] = useState(event?.description || '')
  const [date, setDate] = useState(event ? event.start.split('T')[0] : new Date().toISOString().split('T')[0])
  const [startTime, setStartTime] = useState(event ? new Date(event.start).toTimeString().slice(0, 5) : '09:00')
  const [endTime, setEndTime] = useState(event ? new Date(event.end).toTimeString().slice(0, 5) : '10:00')
  const [color, setColor] = useState(event?.color || '#6366f1')
  const [category, setCategory] = useState<CalendarEvent['category']>(event?.category || 'work')
  const [location, setLocation] = useState(event?.location || '')
  const [isAllDay, setIsAllDay] = useState(event?.isAllDay || false)
  const [isRecurring, setIsRecurring] = useState(event?.isRecurring || false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) { setError('Title is required'); return }
    onSave({
      title, description, color, category, location, isAllDay, isRecurring,
      start: `${date}T${startTime}:00`,
      end: `${date}T${endTime}:00`,
    })
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-50" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        className="fixed inset-x-4 top-10 max-w-lg md:mx-auto md:top-20 bg-surface rounded-2xl border border-border shadow-apple-floating p-6 z-50 max-h-[85vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
          <h3 className="font-bold text-text-primary text-base">{event ? 'Edit Event' : 'New Event'}</h3>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}
          <div>
            <label className="text-xs font-bold text-text-secondary block mb-1">Title</label>
            <input value={title} onChange={(e) => { setTitle(e.target.value); setError('') }} className="w-full px-3 py-2 bg-muted/50 border border-border focus:border-indigo-500 rounded-xl text-sm focus:outline-none text-text-primary" placeholder="Sprint Planning" />
          </div>
          <div>
            <label className="text-xs font-bold text-text-secondary block mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 bg-muted/50 border border-border focus:border-indigo-500 rounded-xl text-sm focus:outline-none text-text-primary min-h-[60px]" placeholder="Add details..." />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-text-secondary block mb-1">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 bg-muted/50 border border-border focus:border-indigo-500 rounded-xl text-sm focus:outline-none text-text-primary" />
            </div>
            <div>
              <label className="text-xs font-bold text-text-secondary block mb-1">Start</label>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full px-3 py-2 bg-muted/50 border border-border focus:border-indigo-500 rounded-xl text-sm focus:outline-none text-text-primary" />
            </div>
            <div>
              <label className="text-xs font-bold text-text-secondary block mb-1">End</label>
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full px-3 py-2 bg-muted/50 border border-border focus:border-indigo-500 rounded-xl text-sm focus:outline-none text-text-primary" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-text-secondary block mb-1">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as CalendarEvent['category'])} className="w-full px-3 py-2 bg-muted/50 border border-border focus:border-indigo-500 rounded-xl text-sm focus:outline-none text-text-primary">
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="health">Health</option>
                <option value="meeting">Meeting</option>
                <option value="social">Social</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-text-secondary block mb-1">Location</label>
              <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2 bg-muted/50 border border-border focus:border-indigo-500 rounded-xl text-sm focus:outline-none text-text-primary" placeholder="Room A / Virtual" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-text-secondary block mb-1.5">Color</label>
            <div className="flex gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button key={c} type="button" onClick={() => setColor(c)} className={`w-6 h-6 rounded-full transition-transform ${color === c ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : 'hover:scale-110'}`} style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-xs font-semibold text-text-secondary cursor-pointer">
              <input type="checkbox" checked={isAllDay} onChange={() => setIsAllDay(!isAllDay)} className="rounded border-border accent-indigo-600" />
              All Day
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-text-secondary cursor-pointer">
              <input type="checkbox" checked={isRecurring} onChange={() => setIsRecurring(!isRecurring)} className="rounded border-border accent-indigo-600" />
              Recurring
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-border hover:bg-muted text-xs font-semibold text-text-secondary rounded-xl transition-all">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-apple transition-all">{event ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </motion.div>
    </>
  )
}
