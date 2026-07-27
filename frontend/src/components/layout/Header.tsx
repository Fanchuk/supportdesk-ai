import { useState, useEffect } from 'react'
import { Search, Bell, Sun, Moon, Plus } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import SearchModal from '../header/SearchModal'
import AddTicketModal from '../header/AddTicketModal'
import UserMenu from '../header/UserMenu'

export default function Header() {
  const { dark, toggle } = useTheme()
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
      <header className="h-[80px] border-b border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700 px-7 flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Dashboard</span>
          <span>/</span>
        </div>

        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 bg-[rgba(28,28,28,0.05)] dark:bg-gray-800 rounded-lg px-2 py-1 w-[277px] h-[36px] hover:bg-[rgba(28,28,28,0.08)] transition-colors"
        >
          <Search size={16} className="text-gray-400 flex-shrink-0" />
          <span className="text-sm text-gray-400 flex-1 text-left">Search</span>
          <kbd className="text-xs text-gray-300 border border-gray-200 rounded px-1">⌘/</kbd>
        </button>

        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-[28px] h-[28px] rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <Search size={14} className="text-gray-500" />
          </button>

          <button className="w-6 h-6 flex items-center justify-center relative">
            <Bell size={20} className="text-gray-500" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <button
            onClick={toggle}
            className="w-6 h-6 flex items-center justify-center transition-transform hover:scale-110"
          >
            {dark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-500" />}
          </button>

          <button
            onClick={() => setAddTicketOpen(true)}
            className="flex items-center gap-2 bg-[#00b67a] text-white text-sm font-medium px-[15px] py-1 rounded-lg h-[40px] hover:bg-[#00a36c] transition-colors"
          >
            <Plus size={16} />
            Add Ticket
          </button>

          <UserMenu />
        </div>
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <AddTicketModal open={addTicketOpen} onClose={() => setAddTicketOpen(false)} />
    </>
  )
}