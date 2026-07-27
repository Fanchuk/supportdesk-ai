import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Bell, Moon, Globe, Shield } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

interface Props { open: boolean; onClose: () => void }

export default function SettingsModal({ open, onClose }: Props) {
  const { dark, toggle } = useTheme()
  const [notifications, setNotifications] = useState(true)
  const [language, setLanguage] = useState('en')

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4"
          onClick={onClose}
        >
          <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }} transition={{ type: 'spring', duration: 0.4 }}
            className="bg-white dark:bg-gray-900 border border-transparent dark:border-gray-800 rounded-2xl w-full max-w-md shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Settings</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-2">

              <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[rgba(0,182,122,0.1)] flex items-center justify-center">
                    <Moon size={16} className="text-[#00b67a]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Dark Mode</p>
                    <p className="text-xs text-gray-400">Switch to dark theme</p>
                  </div>
                </div>
                <button
                  onClick={toggle}
                  className={`w-11 h-6 rounded-full relative transition-colors ${dark ? 'bg-[#00b67a]' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${dark ? 'left-6' : 'left-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[rgba(0,182,122,0.1)] flex items-center justify-center">
                    <Bell size={16} className="text-[#00b67a]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Notifications</p>
                    <p className="text-xs text-gray-400">Email and push alerts</p>
                  </div>
                </div>
                <button
                  onClick={() => setNotifications(p => !p)}
                  className={`w-11 h-6 rounded-full relative transition-colors ${notifications ? 'bg-[#00b67a]' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${notifications ? 'left-6' : 'left-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[rgba(0,182,122,0.1)] flex items-center justify-center">
                    <Globe size={16} className="text-[#00b67a]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Language</p>
                    <p className="text-xs text-gray-400">Interface language</p>
                  </div>
                </div>
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 h-8 outline-none focus:border-[#00b67a] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="en">English</option>
                  <option value="uk">Ukrainian</option>
                  <option value="de">German</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[rgba(0,182,122,0.1)] flex items-center justify-center">
                    <Shield size={16} className="text-[#00b67a]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Two-Factor Auth</p>
                    <p className="text-xs text-gray-400">Extra security layer</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">Coming soon</span>
              </div>

            </div>

            <div className="px-6 pb-6">
              <button
                onClick={onClose}
                className="w-full h-10 bg-[#00b67a] hover:bg-[#00a36c] text-white font-medium rounded-lg text-sm transition-colors"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}