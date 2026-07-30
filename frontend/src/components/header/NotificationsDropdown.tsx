import { useState, useRef, useEffect } from 'react'
import { Bell, X, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNotifications } from '../../hooks/useNotifications'
import { formatDistanceToNow } from 'date-fns'

export default function NotificationsDropdown() {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const { notifications, unreadCount, markAllRead } = useNotifications()

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => { setOpen(p => !p); if (!open) markAllRead() }}
                className="w-6 h-6 flex items-center justify-center relative"
            >
                <Bell size={20} className="text-white/70" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-10 z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl w-80"
                    >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Notifications</p>
                            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <X size={16} />
                            </button>
                        </div>

                        <div className="max-h-72 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="py-10 text-center">
                                    <Check size={24} className="text-gray-300 mx-auto mb-2" />
                                    <p className="text-sm text-gray-400">All caught up!</p>
                                </div>
                            ) : (
                                notifications.map(n => (
                                    <div key={n.id} className={`px-4 py-3 border-b border-gray-50 dark:border-gray-800 last:border-0 ${!n.read ? 'bg-[rgba(10,134,245,0.04)]' : ''}`}>
                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{n.title}</p>
                                        {n.message && <p className="text-xs text-gray-400 mt-0.5">{n.message}</p>}
                                        <p className="text-xs text-gray-400 mt-1">{formatDistanceToNow(n.time, { addSuffix: true })}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}