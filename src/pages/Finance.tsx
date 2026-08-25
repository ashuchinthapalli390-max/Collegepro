
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, ArrowUpRight, ArrowDownRight, Search, 
  Trash2, X, AlertCircle, Calendar, CreditCard
} from 'lucide-react'
import { useFinanceStore } from '../store/useFinanceStore'
import type { Transaction } from '../store/useFinanceStore'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'

export const FinancePage: React.FC = () => {
  const { 
    availableBalance, monthlyIncome, monthlyExpense, savings, netWorth,
    transactions, budgets, savingsGoals, investments, subscriptions, bills,
    addTransaction, deleteTransaction, toggleBillPaid
  } = useFinanceStore()

  const [activeTab, setActiveTab] = useState<'ledger' | 'budgets' | 'investments' | 'subscriptions'>('ledger')
  const [isAddOpen, setIsAddOpen] = useState<'income' | 'expense' | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')

  // Form Fields State
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')
  const [merchant, setMerchant] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Please enter a valid amount')
      return
    }
    if (!merchant.trim()) {
      setError('Please specify a merchant or source')
      return
    }

    addTransaction({
      amount: Number(amount),
      type: isAddOpen!,
      category,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'upi',
      merchant,
      notes,
    })

    setIsAddOpen(null)
    setAmount('')
    setMerchant('')
    setNotes('')
    setError('')
  }

  // Filter Transactions
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = tx.merchant.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (tx.notes && tx.notes.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = filterCategory === 'all' || tx.category === filterCategory
    return matchesSearch && matchesCategory
  })

  // Recharts Chart Data
  const chartData = [
    { name: 'Income', amount: monthlyIncome, fill: '#10b981' },
    { name: 'Expenses', amount: monthlyExpense, fill: '#ef4444' },
    { name: 'Savings', amount: savings / 10, fill: '#6366f1' }, // scaled down for layout
  ]

  return (
    <div className="space-y-6 select-none relative">
      
      {/* Top Header metrics */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-text-primary">Money Management</h2>
          <div className="flex items-center gap-2 text-xs text-text-secondary font-medium mt-0.5">
            <span>Net Worth: <span className="text-indigo-600 dark:text-indigo-400 font-bold">${netWorth.toLocaleString()}</span></span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Tabs */}
          <div className="flex bg-muted p-1 rounded-xl border border-border">
            {[
              { id: 'ledger', label: 'Ledger Ledger' },
              { id: 'budgets', label: 'Budgets & Goals' },
              { id: 'investments', label: 'Investments' },
              { id: 'subscriptions', label: 'Bills & Sync' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                  activeTab === tab.id 
                    ? 'bg-surface text-emerald-600 dark:text-emerald-400 shadow-apple' 
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setIsAddOpen('expense')}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl shadow-apple transition-colors"
          >
            <Plus size={14} />
            <span>Add Expense</span>
          </button>
          
          <button 
            onClick={() => setIsAddOpen('income')}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-apple transition-colors"
          >
            <Plus size={14} />
            <span>Add Income</span>
          </button>
        </div>
      </section>

      {/* Financial Wallet Balance Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Core balance card */}
        <div className="p-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white rounded-3xl shadow-apple-floating space-y-6 relative overflow-hidden">
          <div className="absolute top-[-20%] right-[-20%] w-36 h-36 rounded-full bg-indigo-500/10 blur-xl pointer-events-none" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Available Wallet Balance</span>
              <h3 className="text-3xl font-black tracking-tight">${availableBalance.toLocaleString()}</h3>
            </div>
            <CreditCard size={24} className="text-indigo-400" />
          </div>
          
          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
            <span>•••• •••• •••• 4242</span>
            <span>Varun Kumar</span>
          </div>
        </div>

        {/* Column 2: Combined Income & Expense Stack */}
        <div className="flex flex-col gap-4">
          <div className="p-4 bg-surface border border-border rounded-2xl shadow-apple flex items-center justify-between">
            <div>
              <span className="text-[10px] text-text-secondary font-bold uppercase block mb-0.5">Monthly Cash Income</span>
              <h4 className="text-base font-black text-text-primary">${monthlyIncome.toLocaleString()}</h4>
            </div>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-xl">
              <ArrowUpRight size={16} />
            </div>
          </div>
          
          <div className="p-4 bg-surface border border-border rounded-2xl shadow-apple flex items-center justify-between">
            <div>
              <span className="text-[10px] text-text-secondary font-bold uppercase block mb-0.5">Monthly Cash Expenses</span>
              <h4 className="text-base font-black text-text-primary">${monthlyExpense.toLocaleString()}</h4>
            </div>
            <div className="p-2 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-xl">
              <ArrowDownRight size={16} />
            </div>
          </div>
        </div>

        {/* Column 3: Recharts Flow Visualizer */}
        <div className="p-4 bg-surface border border-border rounded-3xl shadow-apple flex flex-col justify-between min-h-[160px]">
          <span className="text-[10px] text-text-secondary font-bold uppercase block mb-2">Monthly Flow Overview</span>
          <div className="h-28 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 9 }} stroke="var(--text-secondary)" opacity={0.3} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9 }} stroke="var(--text-secondary)" opacity={0.3} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 10, borderRadius: 10, background: 'var(--surface)', border: '1px solid var(--border)' }} />
                <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </section>

      {/* Main Tab Views */}
      <section className="min-h-[50vh]">
        <AnimatePresence mode="wait">
          {activeTab === 'ledger' && (
            <motion.div 
              key="ledger" 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Ledger ledger filter */}
              <div className="flex gap-3 bg-surface p-4 border border-border rounded-2xl shadow-apple">
                <div className="flex-1 relative">
                  <Search size={16} className="absolute left-3 top-2.5 text-text-secondary" />
                  <input
                    type="text"
                    placeholder="Search merchant, notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-1.5 bg-muted/40 border border-border/80 focus:border-indigo-500 rounded-xl text-xs focus:outline-none transition-all placeholder:text-text-secondary/50 text-text-primary"
                  />
                </div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-1.5 bg-muted/40 border border-border rounded-xl text-xs focus:outline-none text-text-primary"
                >
                  <option value="all">All Categories</option>
                  <option value="Salary">Salary</option>
                  <option value="Freelancing">Freelancing</option>
                  <option value="Food">Food</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Bills">Bills</option>
                  <option value="Rent">Rent</option>
                  <option value="Subscriptions">Subscriptions</option>
                </select>
              </div>

              {/* Transactions Ledger Table */}
              <div className="bg-surface border border-border rounded-2xl shadow-apple overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-muted/40 border-b border-border text-text-secondary font-bold uppercase text-[10px] tracking-wider">
                      <th className="p-3.5">Merchant / Source</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5">Payment Method</th>
                      <th className="p-3.5">Type</th>
                      <th className="p-3.5 text-right">Amount</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="p-3.5">
                          <div className="flex flex-col">
                            <span className="font-bold text-text-primary">{tx.merchant}</span>
                            {tx.notes && <span className="text-[10px] text-text-secondary">{tx.notes}</span>}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 bg-muted rounded-full border border-border text-[9px] font-semibold">
                            {tx.category}
                          </span>
                        </td>
                        <td className="p-3.5">{tx.date}</td>
                        <td className="p-3.5 uppercase font-medium font-mono">{tx.paymentMethod.replace('_', ' ')}</td>
                        <td className="p-3.5 capitalize">
                          <span className={`font-bold ${tx.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className={`p-3.5 text-right font-bold text-sm ${tx.type === 'income' ? 'text-emerald-500' : 'text-text-primary'}`}>
                          {tx.type === 'income' ? '+' : '-'}${tx.amount}
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => deleteTransaction(tx.id)}
                            className="p-1 rounded-lg border border-border bg-surface text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'budgets' && (
            <motion.div 
              key="budgets" 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {/* Category Budgets list */}
              <div className="md:col-span-2 p-5 bg-surface border border-border rounded-3xl shadow-apple space-y-4">
                <h3 className="text-sm font-bold text-text-primary border-b border-border/80 pb-3">Monthly Category Budgets</h3>
                <div className="space-y-4">
                  {budgets.map((b, idx) => {
                    const ratio = Math.min(100, Math.round((b.spent / b.limit) * 100))
                    const isOver = b.spent > b.limit
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between items-center text-xs font-semibold">
                          <span className="text-text-primary">{b.category}</span>
                          <span className={`${isOver ? 'text-red-500 font-bold' : 'text-text-secondary'}`}>
                            ${b.spent} / ${b.limit}
                          </span>
                        </div>
                        <div className="h-2 bg-muted border border-border/80 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${isOver ? 'bg-red-500' : 'bg-emerald-500'}`}
                            style={{ width: `${ratio}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Savings Goals Cards */}
              <div className="p-5 bg-surface border border-border rounded-3xl shadow-apple space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-text-primary border-b border-border/80 pb-3 mb-4">Savings Target Goals</h3>
                  <div className="space-y-4">
                    {savingsGoals.map((g) => {
                      const ratio = Math.round((g.currentAmount / g.targetAmount) * 100)
                      return (
                        <div key={g.id} className="space-y-1.5 p-3 rounded-2xl bg-muted/20 border border-border/60">
                          <div className="flex justify-between items-center text-xs font-bold">
                            <span className="text-text-primary truncate">{g.name}</span>
                            <span className="text-indigo-600 dark:text-indigo-400 shrink-0">{ratio}%</span>
                          </div>
                          <div className="h-1.5 bg-muted border border-border/80 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${ratio}%` }} />
                          </div>
                          <div className="flex justify-between items-center text-[9px] text-text-secondary pt-1">
                            <span>Balance: ${g.currentAmount}</span>
                            <span>Target: ${g.targetAmount}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'investments' && (
            <motion.div 
              key="investments" 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {investments.map((inv) => (
                <div key={inv.id} className="p-5 bg-surface border border-border rounded-3xl shadow-apple flex flex-col justify-between min-h-[160px]">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded bg-muted border border-border text-[9px] font-bold uppercase text-text-secondary">{inv.type}</span>
                      <span className="text-xs font-bold text-emerald-500">+{inv.roi}% ROI</span>
                    </div>
                    <h4 className="text-xs font-extrabold text-text-primary mb-1">{inv.name}</h4>
                    <span className="text-2xl font-black text-text-primary tracking-tight">${inv.currentValue.toLocaleString()}</span>
                  </div>
                  <div className="pt-3 border-t border-border mt-3 flex justify-between text-[10px] text-text-secondary">
                    <span>Invested: ${inv.buyValue}</span>
                    <span className="font-bold text-emerald-500">+${inv.currentValue - inv.buyValue}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'subscriptions' && (
            <motion.div 
              key="subscriptions" 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {/* Bill Checklist reminders */}
              <div className="md:col-span-2 p-5 bg-surface border border-border rounded-3xl shadow-apple space-y-4">
                <h3 className="text-sm font-bold text-text-primary border-b border-border/80 pb-3">Upcoming Bill Reminders</h3>
                <div className="space-y-3">
                  {bills.map((bill) => {
                    const isPaid = bill.status === 'paid'
                    return (
                      <div 
                        key={bill.id}
                        className={`p-3.5 rounded-2xl border flex items-center justify-between transition-colors ${
                          isPaid 
                            ? 'bg-muted/30 border-border/60 opacity-60' 
                            : 'bg-muted/20 border-border/80'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className={`p-2 rounded-xl bg-surface border border-border shrink-0 ${isPaid ? 'text-text-secondary' : 'text-indigo-500'}`}>
                            <Calendar size={18} />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className={`text-xs font-bold text-text-primary ${isPaid ? 'line-through text-text-secondary' : ''}`}>{bill.name}</span>
                            <span className="text-[10px] text-text-secondary">Due date: {bill.dueDate}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-text-primary">${bill.price}</span>
                          <button
                            onClick={() => toggleBillPaid(bill.id)}
                            className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold uppercase transition-all ${
                              isPaid 
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' 
                                : 'bg-indigo-600 border-indigo-600 text-white shadow-apple hover:bg-indigo-700'
                            }`}
                          >
                            {isPaid ? 'Paid' : 'Mark Paid'}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Subscriptions ledger cost */}
              <div className="p-5 bg-surface border border-border rounded-3xl shadow-apple space-y-4">
                <h3 className="text-sm font-bold text-text-primary border-b border-border/80 pb-3">Subscriptions Tracker</h3>
                <div className="space-y-3">
                  {subscriptions.map((s) => (
                    <div key={s.id} className="flex justify-between items-center text-xs p-2.5 bg-muted/20 border border-border/60 rounded-xl">
                      <div className="flex flex-col">
                        <span className="font-bold text-text-primary">{s.name}</span>
                        <span className="text-[9px] text-text-secondary/60">Renews: {s.renewalDate}</span>
                      </div>
                      <span className="font-bold text-text-primary">${s.price}/mo</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Transaction modal (Add Income / Add Expense) */}
      <AnimatePresence>
        {isAddOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setIsAddOpen(null)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="fixed inset-x-4 top-10 max-w-lg md:mx-auto md:top-24 bg-surface rounded-2xl border border-border shadow-apple-floating p-6 z-50"
            >
              <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
                <h3 className="font-bold text-text-primary text-base">
                  New {isAddOpen === 'income' ? 'Income Transaction' : 'Expense Record'}
                </h3>
                <button onClick={() => setIsAddOpen(null)} className="text-text-secondary hover:text-text-primary">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateTransaction} className="space-y-4">
                {error && (
                  <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-500 text-xs font-semibold flex items-center gap-1.5 border border-red-100 dark:border-red-950/40">
                    <AlertCircle size={14} />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-text-secondary block mb-1">Amount ($)</label>
                  <input 
                    type="number"
                    value={amount}
                    onChange={(e) => { setAmount(e.target.value); setError('') }}
                    placeholder="450.00"
                    className="w-full px-3 py-2 bg-muted/50 border border-border focus:border-indigo-500 rounded-xl text-sm focus:outline-none text-text-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-text-secondary block mb-1">
                    {isAddOpen === 'income' ? 'Income Source' : 'Merchant / Payee'}
                  </label>
                  <input 
                    type="text"
                    value={merchant}
                    onChange={(e) => { setMerchant(e.target.value); setError('') }}
                    placeholder={isAddOpen === 'income' ? 'Upwork Client pay' : 'Uber Technologies'}
                    className="w-full px-3 py-2 bg-muted/50 border border-border focus:border-indigo-500 rounded-xl text-sm focus:outline-none text-text-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-text-secondary block mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-muted/50 border border-border focus:border-indigo-500 rounded-xl text-sm focus:outline-none text-text-primary"
                    >
                      {isAddOpen === 'income' ? (
                        <>
                          <option value="Salary">Salary</option>
                          <option value="Freelancing">Freelancing</option>
                          <option value="Investments">Investments</option>
                        </>
                      ) : (
                        <>
                          <option value="Food">Food</option>
                          <option value="Shopping">Shopping</option>
                          <option value="Transport">Transport</option>
                          <option value="Bills">Bills</option>
                          <option value="Rent">Rent</option>
                          <option value="Subscriptions">Subscriptions</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-text-secondary block mb-1">Payment Method</label>
                    <input 
                      type="text" 
                      disabled
                      value="UPI / Account" 
                      className="w-full px-3 py-2 bg-muted/30 border border-border rounded-xl text-sm focus:outline-none text-text-secondary font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-text-secondary block mb-1">Notes (Optional)</label>
                  <textarea 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Provide ledger notes description..."
                    className="w-full px-3 py-2 bg-muted/50 border border-border focus:border-indigo-500 rounded-xl text-sm focus:outline-none min-h-[60px] text-text-primary"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(null)}
                    className="px-4 py-2 border border-border hover:bg-muted text-xs font-semibold text-text-secondary rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-apple transition-all"
                  >
                    Save Entry
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
