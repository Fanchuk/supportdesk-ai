import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, User, Settings, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import SettingsModal from './SettingsModal'

export default function UserMenu() {
    const [open, setOpen] = useState(false)
    const [settingsOpen, setSettingsOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()

    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const initials = user?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'SM'


  useEffect(() => {
      const handler = (e: MouseEvent) => {
          if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
      }
      document.addEventListener('mousedown', handler)
      return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    toast.success('Logged out')
    navigate('/login')
  }

  const items = [
      { icon: User, label: 'Profile', action: () => navigate('/profile') },
      { icon: Settings, label: 'Settings', action: () => setSettingsOpen(true) },
      { icon: LogOut, label: 'Logout', action: handleLogout, danger: true },
  ]

  return (
      <>
          <div ref={ref} className="relative">
              <div onClick={() => setOpen(!open)} className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold text-xs">{initials}</div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100 hidden md:block">{user?.name || 'Sheikh Muhammad Ashik'}</span>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform hidden md:block ${open ? 'rotate-180' : ''}`} />
              </div>

              <AnimatePresence>
                  {open && (
                      <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-12 z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg py-1 min-w-[180px]">
                          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.name || 'Admin'}</p>
                              <p className="text-xs text-gray-400">{user?.email || ''}</p>
                          </div>

                          {items.map(({ icon: Icon, label, action, danger }) => (
                              <button
                                  key={label}
                                  onClick={() => {
                                      action()
                                      setOpen(false)
                                  }}
                                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                                      danger ? 'text-red-500 dark:text-red-500' : 'text-gray-700 dark:text-gray-300'
                                  }`}>
                                  <Icon size={15} />
                                  {label}
                              </button>
                          ))}
                      </motion.div>
                  )}
              </AnimatePresence>
          </div>
          <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)}/>
      </>
  )
}