import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Bell, Moon, Shield } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'

interface Props { open: boolean; onClose: () => void }

export default function SettingsModal({ open, onClose }: Props) {
    const { theme, setTheme } = useTheme()
    const { i18n } = useTranslation()
    const [notifications, setNotifications] = useState(true)
    const isDark = theme === 'dark'

    const handleSave = () => {
        toast.success('Settings saved!')
        onClose()
    }

    return (
        <AnimatePresence>
            {open && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 20 }}
                        transition={{ type: 'spring', duration: 0.4 }}
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
                                    <div className="w-9 h-9 rounded-lg bg-[rgba(10,134,245,0.1)] flex items-center justify-center">
                                        <Moon size={16} className="text-[#0A86F5]" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Dark Mode</p>
                                        <p className="text-xs text-gray-400">Switch to dark theme</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setTheme(isDark ? 'light' : 'dark')}
                                    className={`w-11 h-6 rounded-full relative transition-colors ${isDark ? 'bg-[#0A86F5]' : 'bg-gray-200 dark:bg-gray-700'}`}
                                >
                                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isDark ? 'left-6' : 'left-1'}`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-[rgba(10,134,245,0.1)] flex items-center justify-center">
                                        <Bell size={16} className="text-[#0A86F5]" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Notifications</p>
                                        <p className="text-xs text-gray-400">Email and push alerts</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setNotifications(p => !p)}
                                    className={`w-11 h-6 rounded-full relative transition-colors ${notifications ? 'bg-[#0A86F5]' : 'bg-gray-200 dark:bg-gray-700'}`}
                                >
                                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${notifications ? 'left-6' : 'left-1'}`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-[rgba(10,134,245,0.1)] flex items-center justify-center">
                                        <span className="text-[#0A86F5] text-sm font-bold">EN</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Language</p>
                                        <p className="text-xs text-gray-400">Interface language</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {[{ code: 'en', label: 'EN' }, { code: 'ua', label: 'UA' }].map(({ code, label }) => (
                                        <button key={code}
                                            onClick={() => {
                                                i18n.changeLanguage(code)
                                                localStorage.setItem('language', code)
                                            }}
                                            className={`px-3 h-8 rounded-lg text-xs font-medium border transition-all ${
                                                i18n.language === code
                                                    ? 'border-[#0A86F5] bg-[rgba(10,134,245,0.08)] text-[#0A86F5]'
                                                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
                                            }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-[rgba(10,134,245,0.1)] flex items-center justify-center">
                                        <Shield size={16} className="text-[#0A86F5]" />
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
                            <button onClick={handleSave}
                                className="w-full h-10 text-white font-medium rounded-lg text-sm transition-colors"
                                style={{ background: 'linear-gradient(135deg, #b18cff 40%, #5ac8c8 100%)' }}
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