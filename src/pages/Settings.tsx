import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User, Settings as SettingsIcon, Shield, Bell, Moon, Sun, Laptop,
  Key, Download, Upload, HardDrive, HelpCircle, Check, Sparkles
} from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { useThemeStore } from '../store/useThemeStore'

export const SettingsPage: React.FC = () => {
  const { user } = useAuthStore()
  const { theme, setTheme } = useThemeStore()
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'appearance' | 'notifications' | 'security' | 'backup' | 'about'>('profile')

  // Form states
  const [fullName, setFullName] = useState(user?.fullName || 'Varun')
  const [email, setEmail] = useState(user?.email || 'varun@example.com')
  const [profession, setProfession] = useState('Senior Full Stack Engineer')
  const [bio, setBio] = useState('Building high-performance web applications and AI-driven productivity operating systems.')
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-black text-text-primary tracking-tight flex items-center gap-2">
          <SettingsIcon size={20} className="text-slate-500" />
          Settings & Preferences
        </h1>
        <p className="text-xs text-text-secondary mt-0.5">Manage your profile, system themes, notification rules, and security options</p>
      </motion.div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="space-y-1 bg-surface p-2 border border-border rounded-2xl shadow-apple self-start">
          {[
            { key: 'profile', label: 'User Profile', icon: User },
            { key: 'account', label: 'Account Details', icon: Shield },
            { key: 'appearance', label: 'Appearance', icon: Sun },
            { key: 'notifications', label: 'Notifications', icon: Bell },
            { key: 'security', label: 'Security & Auth', icon: Key },
            { key: 'backup', label: 'Data & Backup', icon: Download },
            { key: 'about', label: 'About LifeOS', icon: HelpCircle },
          ].map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key as any)}
                className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === item.key
                    ? 'bg-indigo-600 text-white shadow-apple font-bold'
                    : 'text-text-secondary hover:bg-muted hover:text-text-primary'
                }`}
              >
                <Icon size={14} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>

        {/* Form Panel */}
        <div className="md:col-span-3 bg-surface p-6 border border-border rounded-2xl shadow-apple">
          {savedSuccess && (
            <div className="p-3 mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 text-xs font-bold flex items-center gap-2 border border-emerald-200 dark:border-emerald-900">
              <Check size={14} /> Preferences updated successfully!
            </div>
          )}

          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <h3 className="text-sm font-bold text-text-primary border-b border-border pb-3">User Profile Information</h3>
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&auto=format&q=80"
                  alt="Avatar"
                  className="w-16 h-16 rounded-full object-cover shadow-apple border-2 border-indigo-500"
                />
                <div>
                  <button type="button" className="px-3 py-1.5 bg-muted text-text-primary text-xs font-bold rounded-xl hover:bg-muted/80">Change Avatar</button>
                  <p className="text-[10px] text-text-secondary mt-1">JPG or PNG, Max 2MB</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-text-secondary block mb-1">Full Name</label>
                  <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs focus:outline-none text-text-primary" />
                </div>
                <div>
                  <label className="text-xs font-bold text-text-secondary block mb-1">Profession</label>
                  <input value={profession} onChange={(e) => setProfession(e.target.value)} className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs focus:outline-none text-text-primary" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-text-secondary block mb-1">Bio</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs focus:outline-none text-text-primary min-h-[70px]" />
              </div>

              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-apple hover:bg-indigo-700">Save Profile</button>
            </form>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-text-primary border-b border-border pb-3">Appearance & Theme Options</h3>
              <div>
                <label className="text-xs font-bold text-text-secondary block mb-2">Theme Mode</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'light', label: 'Light Mode', icon: Sun },
                    { key: 'dark', label: 'Dark Mode', icon: Moon },
                    { key: 'system', label: 'System Default', icon: Laptop },
                  ].map((t) => {
                    const Icon = t.icon
                    return (
                      <button
                        key={t.key}
                        onClick={() => setTheme(t.key as any)}
                        className={`p-4 rounded-xl border text-center font-bold text-xs flex flex-col items-center gap-2 transition-all ${
                          theme === t.key ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600' : 'border-border text-text-secondary hover:bg-muted'
                        }`}
                      >
                        <Icon size={20} />
                        <span>{t.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-text-primary border-b border-border pb-3">Notification Preferences</h3>
              <div className="space-y-3">
                {[
                  { label: 'Task Due Date Reminders', desc: 'Notify 24 hours before deadlines' },
                  { label: 'Habit Streak Alerts', desc: 'Daily reminder at chosen times' },
                  { label: 'Financial Bill Reminders', desc: 'Notify 3 days before due dates' },
                  { label: 'AI Daily Digest', desc: 'Morning summary of daily schedule' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted/30 border border-border rounded-xl">
                    <div>
                      <p className="text-xs font-bold text-text-primary">{item.label}</p>
                      <p className="text-[10px] text-text-secondary">{item.desc}</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-600 cursor-pointer" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-text-primary border-b border-border pb-3">Account Security</h3>
              <div>
                <label className="text-xs font-bold text-text-secondary block mb-1">Email Address</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-xs text-text-primary" />
              </div>
              <button className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-apple">Update Account Email</button>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-text-primary border-b border-border pb-3">Two-Factor & Password</h3>
              <div className="p-4 bg-muted/30 border border-border rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-text-primary">Two-Factor Authentication (2FA)</p>
                  <p className="text-[10px] text-text-secondary">Secure your account using authenticator app</p>
                </div>
                <button className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl">Enable 2FA</button>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-text-primary border-b border-border pb-3">Export & Backup Workspace Data</h3>
              <p className="text-xs text-text-secondary">Export all your tasks, habits, finance transactions, notes, and goals as JSON.</p>
              <button className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-apple flex items-center gap-2">
                <Download size={14} /> Export Full JSON Backup
              </button>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-3 text-center py-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl mx-auto shadow-apple">L</div>
              <h2 className="text-base font-black text-text-primary">LifeOS Production Build V1.0</h2>
              <p className="text-xs text-text-secondary max-w-sm mx-auto">The all-in-one productivity operating system built with React 19, Framer Motion, and Tailwind CSS.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
