import { create } from 'zustand'

export interface ChatMessage {
  id: string
  sender: 'user' | 'ai'
  text: string
  timestamp: string
}

export interface Conversation {
  id: string
  title: string
  messages: ChatMessage[]
  isPinned: boolean
  createdAt: string
}

interface AIState {
  conversations: Conversation[]
  selectedChatId: string | null
  isTyping: boolean
  setSelectedChat: (id: string | null) => void
  sendMessage: (text: string) => void
  newChat: () => void
  deleteChat: (id: string) => void
  togglePinChat: (id: string) => void
}

const mockConversations: Conversation[] = [
  {
    id: 'c1',
    title: 'Daily Productivity Plan',
    isPinned: true,
    createdAt: '2026-07-20',
    messages: [
      { id: 'm1', sender: 'user', text: 'Analyze my schedule and optimize my top priorities for today.', timestamp: '09:00 AM' },
      { id: 'm2', sender: 'ai', text: `Based on your LifeOS telemetry:\n\n1. **Deep Work Window**: Reserve 9:00 AM – 11:30 AM for *Spring Boot Architecture*.\n2. **Habit Integration**: You've hit a 12-day streak on *Hydration*. Keep it up during afternoon gym session.\n3. **Budget Health**: Monthly expenses are running 12% below your target ceiling.`, timestamp: '09:01 AM' },
    ],
  },
  {
    id: 'c2',
    title: 'Finance & Budget Audit',
    isPinned: false,
    createdAt: '2026-07-18',
    messages: [
      { id: 'm3', sender: 'user', text: 'How much did I spend on subscriptions this month?', timestamp: '02:15 PM' },
      { id: 'm4', sender: 'ai', text: `You currently have **5 active subscriptions** totaling **$85/month**:\n- Netflix Premium ($20)\n- Spotify Duo ($15)\n- ChatGPT Plus ($20)\n- YouTube Premium ($23)\n- Amazon Prime ($12)\n\nRecommendation: You haven't accessed Netflix in 14 days. Consider pausing to save $240/year.`, timestamp: '02:16 PM' },
    ],
  },
]

export const useAIStore = create<AIState>((set, get) => ({
  conversations: mockConversations,
  selectedChatId: 'c1',
  isTyping: false,

  setSelectedChat: (id) => set({ selectedChatId: id }),

  newChat: () =>
    set((state) => {
      const newConv: Conversation = {
        id: `c_${Math.random().toString(36).substr(2, 9)}`,
        title: 'New Conversation',
        isPinned: false,
        createdAt: new Date().toISOString().split('T')[0],
        messages: [
          { id: 'm_welcome', sender: 'ai', text: 'Hello! I am LifeOS AI. How can I assist your workflow today?', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        ],
      }
      return {
        conversations: [newConv, ...state.conversations],
        selectedChatId: newConv.id,
      }
    }),

  sendMessage: (text) => {
    const { selectedChatId, conversations } = get()
    if (!selectedChatId) return

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const userMsg: ChatMessage = {
      id: `m_${Math.random().toString(36).substr(2, 9)}`,
      sender: 'user',
      text,
      timestamp: nowStr,
    }

    // Append user message immediately
    set((state) => ({
      isTyping: true,
      conversations: state.conversations.map((c) => {
        if (c.id !== selectedChatId) return c
        const newTitle = c.messages.length <= 1 ? text.slice(0, 30) : c.title
        return {
          ...c,
          title: newTitle,
          messages: [...c.messages, userMsg],
        }
      }),
    }))

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponses = [
        `I have updated your LifeOS workspace telemetry accordingly. Is there anything else you'd like me to calculate or adjust?`,
        `Analyzing your tasks and habit logs... Your focus score is high today! Keep up the momentum.`,
        `I've noted that requirement. Let me know if you need automated calendar time-blocking for this task.`,
      ]
      const chosenText = aiResponses[Math.floor(Math.random() * aiResponses.length)]
      const aiMsg: ChatMessage = {
        id: `m_${Math.random().toString(36).substr(2, 9)}`,
        sender: 'ai',
        text: chosenText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      set((state) => ({
        isTyping: false,
        conversations: state.conversations.map((c) =>
          c.id === selectedChatId ? { ...c, messages: [...c.messages, aiMsg] } : c
        ),
      }))
    }, 1000)
  },

  deleteChat: (id) =>
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== id),
      selectedChatId: state.selectedChatId === id ? (state.conversations[0]?.id || null) : state.selectedChatId,
    })),

  togglePinChat: (id) =>
    set((state) => ({
      conversations: state.conversations.map((c) => (c.id === id ? { ...c, isPinned: !c.isPinned } : c)),
    })),
}))
