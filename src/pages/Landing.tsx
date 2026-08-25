import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { 
  Sparkles, CheckSquare, Flame, Wallet, Calendar, FolderKanban, 
  FileText, BarChart3, ChevronRight, Menu, X, ArrowRight, Shield, 
  Zap, ChevronDown, Activity 
} from 'lucide-react'
import { AuroraBackground } from '../components/landing/AuroraBackground'
import { ScrollReveal } from '../components/landing/ScrollReveal'
import { 
  useMousePosition, useCountUp, useCardTilt, useReducedMotion
} from '../hooks/useAnimationHooks'

// ─── Framer Motion Variant Presets ────────────────────────────────
const navFadeIn: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.4 + i * 0.05, duration: 0.5, ease: 'easeOut' as const },
  }),
}

const heroStagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
}

const heroChild: Variants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: 'easeOut' as const },
  },
}

const buttonSlideUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
}

// ─── Magnetic Button Wrapper ──────────────────────────────────────
const MagneticButton: React.FC<{
  children: React.ReactNode
  className?: string
  as?: 'button' | 'a' | typeof Link
  [key: string]: any
}> = ({ children, className = '', as: Tag = 'button', ...props }) => {
  const ref = useRef<HTMLElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const reduced = useReducedMotion()

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (reduced) return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    setOffset({
      x: (e.clientX - cx) * 0.2,
      y: (e.clientY - cy) * 0.2,
    })
  }, [reduced])

  const handleMouseLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 })
  }, [])

  return (
    <motion.div
      ref={ref as any}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-flex"
    >
      {/* @ts-ignore */}
      <Tag className={className} {...props}>
        {children}
      </Tag>
    </motion.div>
  )
}

// ─── Animated Stat Number ─────────────────────────────────────────
const AnimatedStat: React.FC<{ value: string; label: string }> = ({ value, label }) => {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })

  // Extract numeric part
  const numericMatch = value.match(/^[\d,]+/)
  const numericPart = numericMatch ? parseInt(numericMatch[0].replace(/,/g, ''), 10) : null
  const suffix = numericMatch ? value.slice(numericMatch[0].length) : value
  const prefix = numericPart === null ? '' : ''

  const count = useCountUp(numericPart ?? 0, inView, 2000)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="space-y-1"
    >
      <span className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight block">
        {numericPart !== null ? (
          <>
            {prefix}{count.toLocaleString()}{suffix}
          </>
        ) : (
          value
        )}
      </span>
      <span className="text-xs font-semibold text-text-secondary block">
        {label}
      </span>
    </motion.div>
  )
}

// ─── Feature Card with 3D Tilt ────────────────────────────────────
const FeatureCard: React.FC<{
  feature: { name: string; desc: string; icon: React.ReactNode }
}> = ({ feature }) => {
  const { ref, transform, handleMouseMove, handleMouseLeave } = useCardTilt(5)
  const reduced = useReducedMotion()

  return (
    <div
      ref={ref}
      onMouseMove={reduced ? undefined : handleMouseMove}
      onMouseLeave={reduced ? undefined : handleMouseLeave}
      className="p-6 rounded-3xl bg-surface border border-border shadow-apple card-hover-glow glow-border glass-reflection flex flex-col justify-between"
      style={{
        transform: reduced ? undefined : transform,
        transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d',
      }}
    >
      <div className="space-y-4">
        <motion.div
          className="w-10 h-10 rounded-xl bg-muted border border-border/80 flex items-center justify-center"
          whileHover={reduced ? {} : { scale: 1.1, rotate: 8 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          {feature.icon}
        </motion.div>
        <h3 className="text-base font-bold text-text-primary tracking-tight">{feature.name}</h3>
        <p className="text-xs text-text-secondary leading-relaxed">{feature.desc}</p>
      </div>
      <Link 
        to="/register"
        className="mt-6 inline-flex items-center gap-1 text-xs font-bold text-indigo-500 hover:text-indigo-600 group"
      >
        <span>Launch workspace</span>
        <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  )
}

// ─── Timeline Step with Reveal ────────────────────────────────────
const TimelineStep: React.FC<{
  step: { title: string; desc: string; icon: React.ReactNode }
  index: number
}> = ({ step, index }) => {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: 'easeOut',
      }}
      className="relative"
    >
      {/* Timeline circle node */}
      <div
        className={`absolute left-[-32px] sm:left-[-50px] w-6 h-6 rounded-full bg-surface border-2 border-indigo-500 flex items-center justify-center z-10 shadow-apple ${
          inView ? 'timeline-dot-active' : ''
        }`}
      >
        <div className="w-2 h-2 rounded-full bg-indigo-500" />
      </div>
      
      <div className="glass-panel p-6 rounded-2xl border border-border shadow-apple card-hover-glow space-y-2">
        <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
          {step.title}
        </h3>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{step.desc}</p>
      </div>
    </motion.div>
  )
}

// ─── Testimonial Card ─────────────────────────────────────────────
const TestimonialCard: React.FC<{
  item: { quote: string; user: string; role: string; img: string }
  index: number
}> = ({ item, index }) => {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.94, filter: 'blur(6px)' }}
      animate={inView ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: 'easeOut',
      }}
      className="p-6 rounded-2xl bg-surface border border-border shadow-apple card-hover-glow flex flex-col justify-between"
    >
      <p className="text-xs sm:text-sm text-text-secondary italic leading-relaxed mb-6">"{item.quote}"</p>
      <div className="flex items-center gap-3">
        <img src={item.img} alt={item.user} className="w-9 h-9 rounded-full object-cover shadow-apple" />
        <div className="flex flex-col">
          <span className="text-xs font-bold text-text-primary">{item.user}</span>
          <span className="text-[10px] text-text-secondary">{item.role}</span>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Hero Headline with Character Reveal ──────────────────────────
const CharacterReveal: React.FC<{ text: string; className?: string; delay?: number }> = ({
  text,
  className = '',
  delay = 0,
}) => {
  const reduced = useReducedMotion()
  if (reduced) return <span className={className}>{text}</span>

  return (
    <span className={className} aria-label={text}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            delay: delay + i * 0.025,
            duration: 0.4,
            ease: 'easeOut',
          }}
          style={{ display: 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  )
}

// ═══════════════════════════════════════════════════════════════════
// LANDING PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════
export const Landing: React.FC = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const [pageReady, setPageReady] = useState(false)
  const reduced = useReducedMotion()
  
  // Mouse position for hero mockup parallax
  const mouse = useMousePosition()

  // Page load reveal
  useEffect(() => {
    const t = setTimeout(() => setPageReady(true), 100)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    { name: 'Task Management', desc: 'Linear-inspired backlog, Kanban boards, Gantt charts, and custom workflow swimlanes.', icon: <CheckSquare className="text-indigo-500" /> },
    { name: 'Habit Tracking', desc: 'Consistency analytics, streaks XP levels, and GitHub-style activity maps.', icon: <Flame className="text-amber-500" /> },
    { name: 'Finance Ledger', desc: 'Double-entry books, subscription alerts, automatic cash flow charting and savings goals.', icon: <Wallet className="text-emerald-500" /> },
    { name: 'Calendar Slots', desc: 'Drag-and-drop planning, task-box calendars, and time management agendas.', icon: <Calendar className="text-blue-500" /> },
    { name: 'Projects & Epics', desc: 'Agile sprints, nested epics, milestone tracking, and task dependency diagrams.', icon: <FolderKanban className="text-rose-500" /> },
    { name: 'Premium Notes', desc: 'Notion-style rich text Editor, slash commands, folder indexes, and quick outlines.', icon: <FileText className="text-slate-500" /> },
    { name: 'AI Planner', desc: 'Cognitive load analysis, schedule optimization, and expense categorization guides.', icon: <Sparkles className="text-violet-500" /> },
    { name: 'Analytics Hub', desc: 'Flow time trackers, category distributions, and daily focus scoring averages.', icon: <BarChart3 className="text-cyan-500" /> },
  ]

  const stats = [
    { value: '100+', label: 'Premium Features' },
    { value: '30+', label: 'Integrated Modules' },
    { value: 'Unlimited', label: 'Tasks & Habits' },
    { value: '99.9%', label: 'Local Uptime' },
  ]

  const timelineSteps = [
    { title: 'Everything in One App', desc: 'Ditch the subscriptions to 10 separate apps. LifeOS merges workflows, logs, and assets into one fast screen.', icon: <Activity className="text-indigo-500" /> },
    { title: 'AI-Guided Focus Scheduling', desc: 'Let your assistant scan upcoming deadlines and habits, optimizing calendar boxes to avoid burnout.', icon: <Sparkles className="text-violet-500" /> },
    { title: 'Elegant, Apple-Inspired UI', desc: 'Experience modern pastel color systems, fluid card animations, dark modes, and soft custom shadows.', icon: <Zap className="text-amber-500" /> },
    { title: 'Secure & Offline First', desc: 'Your personal notes and finance logs are cached directly in your secure local sandbox storage.', icon: <Shield className="text-emerald-500" /> },
  ]

  const faqs = [
    { q: 'Is LifeOS offline first?', a: 'Yes! LifeOS is built with absolute privacy in mind. All transactions, habits tracker entries, and personal notes are saved locally in your secure workspace cache.' },
    { q: 'How does the AI Assistant help me?', a: 'The AI helps auto-generate structured study layouts, analyzes transaction categories to highlight cash leaks, and suggests custom daily habits to keep you on course.' },
    { q: 'Can I import and export my data?', a: 'Absolutely. LifeOS supports instant JSON exports of all ledger, task database, and configuration files so you are never locked in.' },
    { q: 'Is there a mobile version of the app?', a: 'Yes! LifeOS features responsive view layouts optimized for phone touch layouts and tablet screen sizing, featuring sliding action drawers.' },
  ]

  const testimonials = [
    { quote: "LifeOS completely resolved my subscription bloat. I dropped Todoist, YNAB, and Notion in under 2 hours. The aesthetic is stunning.", user: "David Chen", role: "Software Architect", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop&auto=format&q=80" },
    { quote: "The Framer Motion animations and glassmorphism elements make scheduling my habits feel incredibly premium. Highly recommend it.", user: "Sarah Jenkins", role: "Lead UI Designer", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&fit=crop&auto=format&q=80" },
    { quote: "Having my ledger income charts directly inside the daily dashboard layout completely keeps me on track. Super intuitive.", user: "Marcus Aurelius", role: "Freelance Builder", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&fit=crop&auto=format&q=80" },
  ]

  // Hero mockup parallax transform
  const mockupTransform = reduced
    ? undefined
    : `perspective(1200px) rotateY(${mouse.x * 4}deg) rotateX(${-mouse.y * 4}deg)`

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="landing"
        initial={{ opacity: 0 }}
        animate={{ opacity: pageReady ? 1 : 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-background text-text-primary min-h-screen relative overflow-hidden select-none"
      >
      
        {/* Aurora Animated Background */}
        <AuroraBackground />
      
        {/* ── Sticky Header Nav ── */}
        <motion.nav 
          initial={{ opacity: 0, y: -20 }}
          animate={{ 
            opacity: 1,
            y: 0,
            backgroundColor: scrolled ? 'rgba(var(--bg-rgb, 248, 250, 252), 0.8)' : 'rgba(248, 250, 252, 0)',
            backdropFilter: scrolled ? 'blur(16px)' : 'blur(0px)',
            borderColor: scrolled ? 'var(--border)' : 'rgba(0,0,0,0)'
          }}
          transition={{ opacity: { duration: 0.5, delay: 0.1 }, y: { duration: 0.5, delay: 0.1 } }}
          className={`fixed top-0 left-0 right-0 border-b transition-all duration-300 z-50 flex items-center justify-between px-6 md:px-12 ${
            scrolled ? 'nav-shrunk' : 'h-16'
          }`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
            className="flex items-center gap-3"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-500 text-white font-black text-2xl shadow-apple">
              L
            </div>
            <span className="font-extrabold text-lg text-text-primary tracking-tight">LifeOS</span>
          </motion.div>

          {/* Desktop Menu links */}
          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-text-secondary">
            {['Features', 'Preview', 'Advantages', 'FAQ'].map((item, i) => (
              <motion.a
                key={item}
                href={`#${item === 'Advantages' ? 'why' : item.toLowerCase()}`}
                custom={i}
                variants={navFadeIn}
                initial="hidden"
                animate="visible"
                className="hover:text-text-primary transition-colors nav-link-underline"
              >
                {item}
              </motion.a>
            ))}
            <motion.span
              custom={4}
              variants={navFadeIn}
              initial="hidden"
              animate="visible"
              className="text-text-secondary/40 font-normal"
            >
              Pricing (Coming Soon)
            </motion.span>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <Link to="/login" className="text-xs font-bold text-text-secondary hover:text-text-primary transition-colors">
                Login
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.65, duration: 0.4, ease: 'easeOut' }}
            >
              <MagneticButton
                as={Link}
                to="/register"
                className="px-4 py-2 bg-text-primary hover:bg-text-primary/90 text-background text-xs font-bold rounded-xl shadow-apple transition-all"
              >
                Create Workspace
              </MagneticButton>
            </motion.div>
          </div>

          {/* Mobile Hamburger menu */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted text-text-secondary transition-colors"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </motion.nav>

        {/* Mobile drop menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="fixed inset-x-0 top-16 bg-surface border-b border-border shadow-apple-floating p-6 flex flex-col gap-4 z-40 md:hidden"
            >
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-text-secondary">Features</a>
              <a href="#preview" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-text-secondary">Preview</a>
              <a href="#why" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-text-secondary">Advantages</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-text-secondary">FAQ</a>
              <hr className="border-border" />
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-text-primary">Login</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-sm shadow-apple">
                Create Workspace
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Hero Section ── */}
        <section className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center text-center relative">
          <motion.div 
            variants={heroStagger}
            initial="hidden"
            animate={pageReady ? 'visible' : 'hidden'}
            className="max-w-3xl space-y-6"
          >
            {/* Badge */}
            <motion.div variants={heroChild}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 text-xs font-bold uppercase tracking-wider">
                <Sparkles size={12} className="animate-spin" style={{ animationDuration: '3s' }} />
                <span>The All-In-One Productivity OS</span>
              </div>
            </motion.div>

            {/* Headline with character reveal */}
            <motion.h1
              variants={heroChild}
              className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-text-primary leading-[1.08] lg:max-w-4xl mx-auto"
            >
              <CharacterReveal text="Organize Your" delay={0.4} />
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 gradient-text-animated">
                <CharacterReveal text="Entire Life" delay={0.7} />
              </span>
              <CharacterReveal text=" in One Place." delay={0.95} />
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={heroChild}
              className="text-base sm:text-lg md:text-xl text-text-secondary font-medium leading-relaxed max-w-2xl mx-auto"
            >
              A premium operating system combining tasks databases, streak heatmaps, double-entry ledgers, and cognitive AI assistants in a beautiful interface.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={buttonSlideUp} className="flex flex-col xs:flex-row items-center justify-center gap-4 pt-4">
              <MagneticButton
                as={Link}
                to="/register"
                className="w-full xs:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-apple shadow-indigo-200 dark:shadow-none transition-all flex items-center justify-center gap-2 group text-sm relative overflow-hidden"
              >
                <span className="relative z-10">Get Started Free</span>
                <ArrowRight size={16} className="relative z-10 group-hover:translate-x-0.5 transition-transform" />
              </MagneticButton>
              <MagneticButton
                as="a"
                href="#preview"
                className="w-full xs:w-auto px-8 py-3.5 bg-muted hover:bg-muted/80 text-text-primary font-bold rounded-xl text-sm transition-colors border border-border/80 flex items-center justify-center"
              >
                Interactive Tour
              </MagneticButton>
            </motion.div>
          </motion.div>

          {/* ── Hero Interactive UI Preview Mock Frame ── */}
          <motion.div 
            initial={{ opacity: 0, y: 60, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
            style={{ transform: mockupTransform }}
            className="w-full max-w-5xl mt-16 rounded-3xl border border-border overflow-hidden bg-surface glass-panel p-2 md:p-3 relative hero-mockup-float glass-reflection"
          >
            <div className="h-6 flex items-center gap-1.5 px-3 border-b border-border bg-muted/40 rounded-t-2xl">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>
            <div className="p-3 md:p-6 bg-background rounded-b-2xl">
              <LandingDashboardPreview />
            </div>
          </motion.div>
        </section>

        {/* ── Hero Stats ── */}
        <section className="py-12 border-t border-b border-border bg-muted/20 relative">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => (
              <AnimatedStat key={idx} value={stat.value} label={stat.label} />
            ))}
          </div>
        </section>

        {/* ── Features Showcase ── */}
        <section id="features" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
          <ScrollReveal variant="blurReveal" className="text-center space-y-3 mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-text-primary tracking-tight">
              Integrated Workspace Modules
            </h2>
            <p className="text-sm md:text-base text-text-secondary max-w-xl mx-auto">
              Everything you need to orchestrate notes, trackers, budgets, and milestones without switching tabs.
            </p>
          </ScrollReveal>

          <ScrollReveal
            variant="fadeUp"
            stagger
            staggerDelay={0.08}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, idx) => (
              <FeatureCard key={idx} feature={feature} />
            ))}
          </ScrollReveal>
        </section>

        {/* ── Why Choose LifeOS Timeline ── */}
        <section id="why" className="py-20 bg-muted/15 border-t border-b border-border">
          <div className="max-w-7xl mx-auto px-6">
            <ScrollReveal variant="blurReveal" className="text-center space-y-3 mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-text-primary tracking-tight">
                Re-engineered for Ultimate Control
              </h2>
              <p className="text-sm md:text-base text-text-secondary max-w-lg mx-auto">
                Why settle for clunky legacy task managers when you can run a full productivity operating system?
              </p>
            </ScrollReveal>

            <div className="max-w-3xl mx-auto relative border-l-2 border-border/80 pl-6 sm:pl-10 space-y-12">
              {timelineSteps.map((step, idx) => (
                <TimelineStep key={idx} step={step} index={idx} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
          <ScrollReveal variant="blurReveal" className="text-center space-y-3 mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-text-primary tracking-tight">
              Loved by Elite Creators
            </h2>
            <p className="text-sm md:text-base text-text-secondary">
              Here is what high-performers, builders, and designers say about LifeOS.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((item, idx) => (
              <TestimonialCard key={idx} item={item} index={idx} />
            ))}
          </div>
        </section>

        {/* ── FAQ Section ── */}
        <section id="faq" className="py-20 bg-muted/10 border-t border-b border-border">
          <div className="max-w-3xl mx-auto px-6">
            <ScrollReveal variant="blurReveal" className="text-center space-y-3 mb-12">
              <h2 className="text-3xl font-black text-text-primary tracking-tight">Frequently Asked Questions</h2>
              <p className="text-xs sm:text-sm text-text-secondary">Quick answers to clear up everything.</p>
            </ScrollReveal>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <ScrollReveal key={idx} variant="fadeUp" delay={idx * 0.06}>
                  <div className="border border-border rounded-2xl bg-surface overflow-hidden card-hover-glow">
                    <button
                      onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                      className="w-full px-6 py-4 flex items-center justify-between font-bold text-xs sm:text-sm text-text-primary text-left focus:outline-none"
                    >
                      <span>{faq.q}</span>
                      <motion.div
                        animate={{ rotate: activeFaq === idx ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                      >
                        <ChevronDown size={16} className="text-text-secondary" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {activeFaq === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: 'easeOut' }}
                          className="overflow-hidden"
                        >
                          <p className="px-6 pb-4 text-xs sm:text-sm text-text-secondary leading-relaxed border-t border-border/40 pt-2">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Section ── */}
        <section className="py-24 px-6 md:px-12 text-center max-w-4xl mx-auto">
          <ScrollReveal variant="scale">
            <div className="glow-border glass-panel border-indigo-100 dark:border-indigo-950/40 p-12 rounded-3xl bg-indigo-50/20 dark:bg-indigo-950/10 shadow-apple-floating space-y-6 relative overflow-hidden">
              {/* Shimmer gradient top border */}
              <div className="shimmer-top-border absolute inset-x-0 top-0" />
              
              <h2 className="text-3xl md:text-5xl font-black text-text-primary tracking-tight">
                Start Organizing Your Life Today
              </h2>
              <p className="text-sm md:text-base text-text-secondary max-w-xl mx-auto leading-relaxed">
                Create your premium local sandbox environment and experience the ultimate productivity command center. No credit card required.
              </p>
              <div className="pt-4">
                <MagneticButton
                  as={Link}
                  to="/register"
                  className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-apple shadow-indigo-200 dark:shadow-none transition-all inline-flex items-center gap-2 text-sm"
                >
                  <span>Create Free Account</span>
                  <ArrowRight size={16} />
                </MagneticButton>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ── Footer ── */}
        <ScrollReveal variant="fadeUp">
          <footer className="py-12 border-t border-border bg-surface text-text-secondary text-xs shimmer-top-border relative">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={reduced ? {} : { scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500 text-white font-black text-xl shadow-apple"
                  >
                    L
                  </motion.div>
                  <span className="font-extrabold text-sm text-text-primary">LifeOS</span>
                </div>
                <p className="text-[11px] leading-relaxed text-text-secondary/70">
                  The command center for your tasks, habits, finance, and schedules. Made for builders.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-text-primary uppercase tracking-wider text-[10px] mb-3">Product</h4>
                <ul className="space-y-2 font-medium">
                  <li><a href="#features" className="hover:text-text-primary transition-colors">Features</a></li>
                  <li><a href="#preview" className="hover:text-text-primary transition-colors">Preview</a></li>
                  <li><span className="text-text-secondary/40">Pricing</span></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-text-primary uppercase tracking-wider text-[10px] mb-3">Security</h4>
                <ul className="space-y-2 font-medium">
                  <li><span className="text-text-secondary/60">Local Sandbox</span></li>
                  <li><span className="text-text-secondary/60">Fully Secure</span></li>
                  <li><span className="text-text-secondary/60">Data Portability</span></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-text-primary uppercase tracking-wider text-[10px] mb-3">Company</h4>
                <ul className="space-y-2 font-medium">
                  <li><span className="text-text-secondary/60">Privacy Policy</span></li>
                  <li><span className="text-text-secondary/60">Terms & Service</span></li>
                  <li><span className="text-text-secondary/60">About Team</span></li>
                </ul>
              </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
              <span>© 2026 LifeOS Inc. All rights reserved.</span>
              <div className="flex gap-6 font-semibold">
                {['Twitter', 'GitHub', 'Discord'].map((social) => (
                  <motion.span
                    key={social}
                    whileHover={reduced ? {} : { scale: 1.1, color: 'var(--text-primary)' }}
                    className="hover:text-text-primary cursor-pointer transition-colors"
                  >
                    {social}
                  </motion.span>
                ))}
              </div>
            </div>
          </footer>
        </ScrollReveal>
      </motion.div>
    </AnimatePresence>
  )
}

// ═══════════════════════════════════════════════════════════════════
// Interactive Mock Dashboard Preview widget for Landing page
// ═══════════════════════════════════════════════════════════════════
const LandingDashboardPreview: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.96 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: 0.8 + i * 0.15,
        duration: 0.6,
        ease: 'easeOut' as const,
      },
    }),
  }

  return (
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
      
      {/* Task preview Card */}
      <motion.div
        custom={0}
        variants={cardVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="p-4 rounded-2xl bg-surface border border-border shadow-apple card-hover-glow flex flex-col justify-between min-h-[160px]"
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Today's Focus</span>
            <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 font-bold uppercase">
              Urgent
            </span>
          </div>
          <h4 className="text-xs font-bold text-text-primary mb-1.5">Complete Java Full Stack Roadmap</h4>
          <p className="text-[10px] text-text-secondary leading-normal">Read Spring Boot docs and build microservice container modules.</p>
        </div>
        <div className="pt-3 border-t border-border mt-3 flex justify-between items-center text-[10px] text-text-secondary">
          <span>Due: in 2 days</span>
          <span className="font-bold text-text-primary">50% Completed</span>
        </div>
      </motion.div>

      {/* Habit Streak preview card */}
      <motion.div
        custom={1}
        variants={cardVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="p-4 rounded-2xl bg-surface border border-border shadow-apple card-hover-glow flex flex-col justify-between min-h-[160px]"
      >
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Active Habits</span>
            <span className="flex items-center gap-1 font-extrabold text-xs text-amber-500">
              🔥 12 Days
            </span>
          </div>
          <h4 className="text-xs font-bold text-text-primary mb-1">Hydrate (Drink 3L Water)</h4>
          
          {/* Mock Heatmap blocks */}
          <div className="flex gap-1.5 mt-3">
            {[...Array(9)].map((_, idx) => (
              <motion.span 
                key={idx}
                initial={{ scale: 0, opacity: 0 }}
                animate={inView ? { scale: 1, opacity: 1 } : {}}
                transition={{ delay: 1.2 + idx * 0.05, duration: 0.3, ease: 'easeOut' }}
                className={`w-3.5 h-3.5 rounded ${
                  idx < 6 ? 'bg-amber-400 dark:bg-amber-500' : 'bg-muted border border-border'
                }`} 
              />
            ))}
          </div>
        </div>
        <div className="pt-3 border-t border-border mt-3 flex justify-between items-center text-[10px] text-text-secondary">
          <span>Success rate: 88%</span>
          <span className="font-bold text-text-primary">3/4 Done</span>
        </div>
      </motion.div>

      {/* Finance Ledger preview card */}
      <motion.div
        custom={2}
        variants={cardVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="p-4 rounded-2xl bg-surface border border-border shadow-apple card-hover-glow flex flex-col justify-between min-h-[160px]"
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Ledger Balance</span>
            <span className="text-[10px] text-text-secondary">USD ($)</span>
          </div>
          <h4 className="text-2xl font-black text-text-primary tracking-tight mb-0.5">$8,250.00</h4>
          <span className="text-[9px] text-text-secondary block">Available wallet balance</span>
        </div>
        
        {/* Simple mock transactions */}
        <div className="space-y-1.5 mt-3 pt-3 border-t border-border">
          <div className="flex justify-between items-center text-[10px]">
            <span className="font-medium text-text-primary">Alphabet Salary</span>
            <span className="font-bold text-emerald-500">+$4,500</span>
          </div>
          <div className="flex justify-between items-center text-[10px]">
            <span className="font-medium text-text-primary">Netflix Premium</span>
            <span className="font-bold text-red-500">-$20</span>
          </div>
        </div>
      </motion.div>

    </div>
  )
}
