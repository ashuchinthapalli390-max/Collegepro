import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3, TrendingUp, Zap, CheckSquare, Flame, Wallet,
  Calendar, Award, Sparkles, ArrowUpRight, ArrowDownRight, Clock
} from 'lucide-react'
import { useTaskStore } from '../store/useTaskStore'
import { useHabitStore } from '../store/useHabitStore'
import { useFinanceStore } from '../store/useFinanceStore'
import { useProjectStore } from '../store/useProjectStore'
import { useGoalsStore } from '../store/useGoalsStore'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts'

export const AnalyticsPage: React.FC = () => {
  const { tasks } = useTaskStore()
  const { habits, xp, level } = useHabitStore()
  const { availableBalance, monthlyIncome, monthlyExpense, transactions, budgets } = useFinanceStore()
  const { projects } = useProjectStore()
  const { goals } = useGoalsStore()

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'year'>('30d')

  // Calculated Productivity Score
  const completedTasks = tasks.filter((t) => t.status === 'completed').length
  const totalTasks = tasks.length
  const taskRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
  const avgHabitRate = habits.length > 0 ? habits.reduce((acc, h) => acc + h.completionRate, 0) / habits.length : 0
  const productivityScore = Math.round((taskRate * 0.4) + (avgHabitRate * 0.4) + 20)

  // Chart Data
  const weeklyProductivityData = [
    { day: 'Mon', tasks: 4, habits: 5, focusHours: 6.2 },
    { day: 'Tue', tasks: 6, habits: 4, focusHours: 7.5 },
    { day: 'Wed', tasks: 3, habits: 5, focusHours: 5.0 },
    { day: 'Thu', tasks: 8, habits: 4, focusHours: 8.4 },
    { day: 'Fri', tasks: 5, habits: 5, focusHours: 6.8 },
    { day: 'Sat', tasks: 2, habits: 3, focusHours: 3.5 },
    { day: 'Sun', tasks: 1, habits: 4, focusHours: 2.0 },
  ]

  const cashFlowData = [
    { month: 'Jan', income: 5500, expense: 2100 },
    { month: 'Feb', income: 5800, expense: 2300 },
    { month: 'Mar', income: 6000, expense: 1950 },
    { month: 'Apr', income: 5900, expense: 2400 },
    { month: 'May', income: 6200, expense: 2200 },
    { month: 'Jun', income: 6000, expense: 2380 },
  ]

  const taskCategoryData = [
    { name: 'Study', value: tasks.filter((t) => t.category === 'study').length, color: '#6366f1' },
    { name: 'Work', value: tasks.filter((t) => t.category === 'work').length, color: '#8b5cf6' },
    { name: 'Fitness', value: tasks.filter((t) => t.category === 'fitness').length, color: '#10b981' },
    { name: 'Finance', value: tasks.filter((t) => t.category === 'finance').length, color: '#f59e0b' },
  ]

  const budgetUsageData = budgets.map((b) => ({
    name: b.category,
    spent: b.spent,
    limit: b.limit,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-black text-text-primary tracking-tight flex items-center gap-2">
            <BarChart3 size={20} className="text-indigo-500" />
            Analytics Hub
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">Cross-system insights, productivity scoring, and financial telemetry</p>
        </div>

        <div className="flex bg-muted/60 rounded-xl border border-border p-0.5">
          {(['7d', '30d', '90d', 'year'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all ${
                timeRange === r ? 'bg-surface text-text-primary shadow-apple' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-surface border border-border rounded-2xl shadow-apple flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500 flex items-center justify-center font-black text-lg shadow-apple">
            {productivityScore}
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Productivity Score</span>
            <h3 className="text-lg font-black text-text-primary mt-0.5">Top 5% Performer</h3>
          </div>
        </div>

        <div className="p-5 bg-surface border border-border rounded-2xl shadow-apple flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 flex items-center justify-center font-black text-lg shadow-apple">
            {Math.round(avgHabitRate)}%
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Habit Consistency</span>
            <h3 className="text-lg font-black text-text-primary mt-0.5">{habits.length} Active Habits</h3>
          </div>
        </div>

        <div className="p-5 bg-surface border border-border rounded-2xl shadow-apple flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/30 text-amber-500 flex items-center justify-center font-black text-lg shadow-apple">
            ${(monthlyIncome - monthlyExpense).toLocaleString()}
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Net Savings Rate</span>
            <h3 className="text-lg font-black text-text-primary mt-0.5">+{Math.round(((monthlyIncome - monthlyExpense) / monthlyIncome) * 100)}% Cashflow</h3>
          </div>
        </div>

        <div className="p-5 bg-surface border border-border rounded-2xl shadow-apple flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/30 text-purple-500 flex items-center justify-center font-black text-lg shadow-apple">
            39.8h
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Weekly Focus Time</span>
            <h3 className="text-lg font-black text-text-primary mt-0.5">+4.2h vs Last Week</h3>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productivity & Focus Hours */}
        <div className="p-5 bg-surface border border-border rounded-2xl shadow-apple">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-text-primary">Weekly Focus & Task Output</h3>
              <p className="text-[10px] text-text-secondary">Completed tasks vs daily focus hours</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyProductivityData}>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', borderColor: '#334155', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="tasks" fill="#6366f1" radius={[6, 6, 0, 0]} name="Tasks Done" />
                <Bar dataKey="focusHours" fill="#10b981" radius={[6, 6, 0, 0]} name="Focus Hours" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Cash Flow */}
        <div className="p-5 bg-surface border border-border rounded-2xl shadow-apple">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-text-primary">Monthly Cash Flow Trend</h3>
              <p className="text-[10px] text-text-secondary">Income vs Expense telemetry ($)</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashFlowData}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', borderColor: '#334155', color: '#fff', fontSize: '12px' }} />
                <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#incomeGrad)" name="Income" />
                <Area type="monotone" dataKey="expense" stroke="#f43f5e" fillOpacity={1} fill="url(#expenseGrad)" name="Expenses" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary Charts & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Category Distribution */}
        <div className="p-5 bg-surface border border-border rounded-2xl shadow-apple">
          <h3 className="text-sm font-bold text-text-primary mb-1">Task Category Split</h3>
          <p className="text-[10px] text-text-secondary mb-4">Distribution by life domain</p>
          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={taskCategoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={4}>
                  {taskCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', borderColor: '#334155', color: '#fff', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 flex-wrap mt-2">
            {taskCategoryData.map((t) => (
              <div key={t.name} className="flex items-center gap-1.5 text-[10px]">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                <span className="text-text-secondary font-medium">{t.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Utilization Bars */}
        <div className="p-5 bg-surface border border-border rounded-2xl shadow-apple">
          <h3 className="text-sm font-bold text-text-primary mb-1">Budget Utilization</h3>
          <p className="text-[10px] text-text-secondary mb-4">Spent vs Target Budget</p>
          <div className="space-y-3">
            {budgetUsageData.slice(0, 5).map((b) => {
              const pct = Math.min(100, Math.round((b.spent / b.limit) * 100))
              return (
                <div key={b.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-text-primary">{b.name}</span>
                    <span className="text-text-secondary font-mono">${b.spent} / ${b.limit}</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${pct > 90 ? 'bg-red-500' : 'bg-indigo-500'}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* AI Insight Cards */}
        <div className="p-5 bg-surface border border-border rounded-2xl shadow-apple space-y-4">
          <h3 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
            <Sparkles size={14} className="text-violet-500" />
            AI Productivity Telemetry
          </h3>

          <div className="p-3.5 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-950/30 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Peak Focus Window</span>
            <p className="text-xs text-text-primary font-semibold">You complete 68% of tasks between 9:00 AM – 11:30 AM.</p>
          </div>

          <div className="p-3.5 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-950/30 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Habit Synergies</span>
            <p className="text-xs text-text-primary font-semibold">Hydrate habit correlates with +35% longer gym workout sessions.</p>
          </div>

          <div className="p-3.5 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-950/30 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Budget Forecast</span>
            <p className="text-xs text-text-primary font-semibold">Food expenses are running 12% below monthly safety limit.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
