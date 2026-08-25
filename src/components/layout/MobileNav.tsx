import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, Flame, Wallet, Settings } from 'lucide-react'

export const MobileNav: React.FC = () => {
  const navItems = [
    { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Habits', path: '/habits', icon: Flame },
    { name: 'Finance', path: '/finance', icon: Wallet },
    { name: 'Settings', path: '/settings', icon: Settings },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface/85 backdrop-blur-lg border-t border-border z-30 flex items-center justify-around px-2 pb-safe shadow-apple">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => 
            `flex flex-col items-center justify-center gap-1 w-14 h-12 rounded-xl transition-all ${
              isActive 
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold' 
                : 'text-text-secondary hover:text-text-primary'
            }`
          }
        >
          <item.icon className="w-5 h-5 transition-transform active:scale-90" />
          <span className="text-[9px] tracking-wide">{item.name}</span>
        </NavLink>
      ))}
    </nav>
  )
}
