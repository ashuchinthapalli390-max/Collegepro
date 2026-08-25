import { create } from 'zustand'

export interface Transaction {
  id: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string
  paymentMethod: 'credit_card' | 'bank_transfer' | 'cash' | 'upi'
  merchant: string // For expense, or source for income
  notes?: string
  reference?: string
  isRecurring?: boolean
}

export interface Budget {
  category: string
  limit: number
  spent: number
}

export interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  expectedDate: string
  category: string
}

export interface Investment {
  id: string
  name: string
  type: 'stocks' | 'crypto' | 'gold' | 'mutual_funds' | 'fixed_deposit'
  currentValue: number
  buyValue: number
  roi: number // Percentage
}

export interface Subscription {
  id: string
  name: string
  price: number
  renewalDate: string
  category: string
  logo?: string
}

export interface Bill {
  id: string
  name: string
  price: number
  dueDate: string
  status: 'paid' | 'unpaid'
  category: string
}

interface FinanceState {
  availableBalance: number
  monthlyIncome: number
  monthlyExpense: number
  savings: number
  netWorth: number
  transactions: Transaction[]
  budgets: Budget[]
  savingsGoals: SavingsGoal[]
  investments: Investment[]
  subscriptions: Subscription[]
  bills: Bill[]
  
  addTransaction: (tx: Omit<Transaction, 'id'>) => void
  deleteTransaction: (id: string) => void
  toggleBillPaid: (id: string) => void
  addSavingsContribution: (id: string, amount: number) => void
  addBudget: (budget: Budget) => void
}

const mockTransactions: Transaction[] = [
  { id: 'tx1', amount: 4500, type: 'income', category: 'Salary', date: '2026-07-01', paymentMethod: 'bank_transfer', merchant: 'Alphabet Inc.', notes: 'Monthly base pay' },
  { id: 'tx2', amount: 1500, type: 'income', category: 'Freelancing', date: '2026-07-15', paymentMethod: 'bank_transfer', merchant: 'Upwork', notes: 'UI design project client pay' },
  { id: 'tx3', amount: 120, type: 'expense', category: 'Food', date: '2026-07-18', paymentMethod: 'upi', merchant: 'Whole Foods', notes: 'Weekly groceries' },
  { id: 'tx4', amount: 80, type: 'expense', category: 'Transport', date: '2026-07-19', paymentMethod: 'credit_card', merchant: 'Uber Technologies', notes: 'Commute to meeting' },
  { id: 'tx5', amount: 65, type: 'expense', category: 'Subscriptions', date: '2026-07-17', paymentMethod: 'credit_card', merchant: 'Netflix', isRecurring: true },
  { id: 'tx6', amount: 20, type: 'expense', category: 'Subscriptions', date: '2026-07-16', paymentMethod: 'credit_card', merchant: 'Spotify', isRecurring: true },
  { id: 'tx7', amount: 250, type: 'expense', category: 'Bills', date: '2026-07-10', paymentMethod: 'bank_transfer', merchant: 'Comcast Broadband', notes: 'Internet and utility bill' },
  { id: 'tx8', amount: 500, type: 'expense', category: 'Shopping', date: '2026-07-12', paymentMethod: 'credit_card', merchant: 'Apple Store', notes: 'Leather laptop sleeve and accessories' },
  { id: 'tx9', amount: 350, type: 'expense', category: 'Rent', date: '2026-07-02', paymentMethod: 'bank_transfer', merchant: 'Slate Properties', notes: 'Co-working hotdesk space subscription' },
]

const mockBudgets: Budget[] = [
  { category: 'Food', limit: 600, spent: 320 },
  { category: 'Shopping', limit: 800, spent: 500 },
  { category: 'Transport', limit: 300, spent: 180 },
  { category: 'Bills', limit: 500, spent: 250 },
  { category: 'Subscriptions', limit: 200, spent: 85 },
  { category: 'Rent', limit: 1200, spent: 1200 },
  { category: 'Entertainment', limit: 400, spent: 150 },
]

const mockSavingsGoals: SavingsGoal[] = [
  { id: 'g1', name: 'Emergency Fund 6 Months', targetAmount: 15000, currentAmount: 10500, expectedDate: '2026-12-31', category: 'Security' },
  { id: 'g2', name: 'New M4 MacBook Pro Max', targetAmount: 3500, currentAmount: 2200, expectedDate: '2026-09-30', category: 'Tech Upgrade' },
  { id: 'g3', name: 'Tokyo Autumn Vacation', targetAmount: 5000, currentAmount: 1800, expectedDate: '2026-10-15', category: 'Travel' },
]

const mockInvestments: Investment[] = [
  { id: 'i1', name: 'NVIDIA Corp (NVDA)', type: 'stocks', currentValue: 4500, buyValue: 3200, roi: 40.6 },
  { id: 'i2', name: 'Ethereum (ETH)', type: 'crypto', currentValue: 2400, buyValue: 1950, roi: 23.1 },
  { id: 'i3', name: 'S&P 500 ETF (SPY)', type: 'mutual_funds', currentValue: 8000, buyValue: 7100, roi: 12.6 },
  { id: 'i4', name: 'Physical Gold ETF', type: 'gold', currentValue: 1500, buyValue: 1400, roi: 7.1 },
]

const mockSubscriptions: Subscription[] = [
  { id: 's1', name: 'Netflix Premium 4K', price: 20, renewalDate: '2026-08-17', category: 'Entertainment' },
  { id: 's2', name: 'Spotify Duo Plan', price: 15, renewalDate: '2026-08-16', category: 'Music' },
  { id: 's3', name: 'ChatGPT Plus subscription', price: 20, renewalDate: '2026-08-05', category: 'AI Tools' },
  { id: 's4', name: 'YouTube Premium Family', price: 23, renewalDate: '2026-08-22', category: 'Entertainment' },
  { id: 's5', name: 'Amazon Prime yearly', price: 12, renewalDate: '2026-12-15', category: 'Shopping' },
]

const mockBills: Bill[] = [
  { id: 'b1', name: 'Rent Co-working desk', price: 350, dueDate: '2026-08-02', status: 'unpaid', category: 'Office' },
  { id: 'b2', name: 'Broadband Fiber internet', price: 75, dueDate: '2026-08-10', status: 'paid', category: 'Utility' },
  { id: 'b3', name: 'Electricity Utility billing', price: 110, dueDate: '2026-08-15', status: 'unpaid', category: 'Utility' },
  { id: 'b4', name: 'Premium Health Insurance Plan', price: 180, dueDate: '2026-08-18', status: 'unpaid', category: 'Insurance' },
]

export const useFinanceStore = create<FinanceState>((set) => ({
  availableBalance: 8250,
  monthlyIncome: 6000,
  monthlyExpense: 2380,
  savings: 14500,
  netWorth: 38650, // includes investments + savings + balance - debts
  transactions: mockTransactions,
  budgets: mockBudgets,
  savingsGoals: mockSavingsGoals,
  investments: mockInvestments,
  subscriptions: mockSubscriptions,
  bills: mockBills,

  addTransaction: (txData) =>
    set((state) => {
      const newTx: Transaction = {
        ...txData,
        id: `tx_${Math.random().toString(36).substr(2, 9)}`,
      }
      const updatedTxs = [newTx, ...state.transactions]
      const delta = txData.amount

      let newBalance = state.availableBalance
      let newIncome = state.monthlyIncome
      let newExpense = state.monthlyExpense

      if (txData.type === 'income') {
        newBalance += delta
        newIncome += delta
      } else {
        newBalance -= delta
        newExpense += delta
      }

      // Automatically update budget spent if matching category
      const updatedBudgets = state.budgets.map((b) => {
        if (b.category.toLowerCase() === txData.category.toLowerCase() && txData.type === 'expense') {
          return { ...b, spent: b.spent + delta }
        }
        return b
      })

      return {
        transactions: updatedTxs,
        availableBalance: newBalance,
        monthlyIncome: newIncome,
        monthlyExpense: newExpense,
        budgets: updatedBudgets,
        netWorth: state.netWorth + (txData.type === 'income' ? delta : -delta),
      }
    }),

  deleteTransaction: (id) =>
    set((state) => {
      const tx = state.transactions.find((t) => t.id === id)
      if (!tx) return state

      const updatedTxs = state.transactions.filter((t) => t.id !== id)
      const delta = tx.amount

      let newBalance = state.availableBalance
      let newIncome = state.monthlyIncome
      let newExpense = state.monthlyExpense

      if (tx.type === 'income') {
        newBalance -= delta
        newIncome -= delta
      } else {
        newBalance += delta
        newExpense -= delta
      }

      const updatedBudgets = state.budgets.map((b) => {
        if (b.category.toLowerCase() === tx.category.toLowerCase() && tx.type === 'expense') {
          return { ...b, spent: Math.max(0, b.spent - delta) }
        }
        return b
      })

      return {
        transactions: updatedTxs,
        availableBalance: newBalance,
        monthlyIncome: newIncome,
        monthlyExpense: newExpense,
        budgets: updatedBudgets,
        netWorth: state.netWorth + (tx.type === 'income' ? -delta : delta),
      }
    }),

  toggleBillPaid: (id) =>
    set((state) => {
      const bill = state.bills.find((b) => b.id === id)
      if (!bill) return state

      const updatedStatus: 'paid' | 'unpaid' = bill.status === 'paid' ? 'unpaid' : 'paid'
      const updatedBills = state.bills.map((b) =>
        b.id === id ? { ...b, status: updatedStatus } : b
      )

      // If marked paid, create a matching expense transaction automatically
      if (updatedStatus === 'paid') {
        const newTx: Transaction = {
          id: `tx_${Math.random().toString(36).substr(2, 9)}`,
          amount: bill.price,
          type: 'expense',
          category: 'Bills',
          date: new Date().toISOString().split('T')[0],
          paymentMethod: 'bank_transfer',
          merchant: bill.name,
          notes: 'Auto-paid bill reminder',
        }
        
        return {
          bills: updatedBills,
          transactions: [newTx, ...state.transactions],
          availableBalance: state.availableBalance - bill.price,
          monthlyExpense: state.monthlyExpense + bill.price,
          netWorth: state.netWorth - bill.price,
        }
      }

      return { bills: updatedBills }
    }),

  addSavingsContribution: (id, amount) =>
    set((state) => {
      const updatedGoals = state.savingsGoals.map((g) => {
        if (g.id !== id) return g
        return { ...g, currentAmount: Math.min(g.targetAmount, g.currentAmount + amount) }
      })

      return {
        savingsGoals: updatedGoals,
        availableBalance: state.availableBalance - amount,
        savings: state.savings + amount,
      }
    }),

  addBudget: (budget) =>
    set((state) => ({
      budgets: [...state.budgets, budget],
    })),
}))
