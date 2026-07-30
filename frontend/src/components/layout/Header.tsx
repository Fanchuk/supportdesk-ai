import { useState, useEffect } from 'react'
import { Search, Sun, Moon, Plus, Menu } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import SearchModal from '../header/SearchModal'
import AddTicketModal from '../header/AddTicketModal'
import UserMenu from '../header/UserMenu'
import NotificationsDropdown from '../header/NotificationsDropdown'

interface HeaderProps {
    onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'
  const [searchOpen, setSearchOpen] = useState(false)
  const [addTicketOpen, setAddTicketOpen] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      <header
        className="h-[80px] px-4 lg:px-7 flex items-center gap-3 lg:gap-4"
        style={{ background: 'linear-gradient(90deg, #a8aeff 0%, #add8ff 100%)' }}
      >
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors flex-shrink-0"
        >
          <Menu size={18} className="text-white" />
        </button>

        <div className="hidden md:flex items-center gap-2 text-sm text-white/70">
          <span>Dashboard</span>
          <span>/</span>
        </div>

        <button
          onClick={() => setSearchOpen(true)}
          className="hidden md:flex items-center gap-2 bg-white/10 rounded-lg px-2 py-1 w-[277px] h-[36px] hover:bg-white/20 transition-colors"
        >
          <Search size={16} className="text-white/60 flex-shrink-0" />
          <span className="text-sm text-white/60 flex-1 text-left">Search</span>
          <kbd className="text-xs text-white/50 border border-white/30 rounded px-1">⌘/</kbd>
        </button>

        <div className="ml-auto flex items-center gap-2 lg:gap-3">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-[28px] h-[28px] rounded-lg border border-white/30 bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <Search size={14} className="text-white/70" />
          </button>

          <NotificationsDropdown />

          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="w-6 h-6 flex items-center justify-center transition-transform hover:scale-110"
          >
            {isDark ? <Sun size={20} className="text-yellow-300" /> : <Moon size={20} className="text-white/70" />}
          </button>

          <button
            onClick={() => setAddTicketOpen(true)}
            className="flex items-center gap-2 text-white text-sm font-medium px-[15px] py-1 rounded-lg h-[40px] transition-colors"
            style={{ background: 'linear-gradient(135deg, #b18cff 40%, #5ac8c8 100%)' }}
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add Ticket</span>
          </button>

          <UserMenu />
        </div>
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <AddTicketModal open={addTicketOpen} onClose={() => setAddTicketOpen(false)} />
    </>
  )
}