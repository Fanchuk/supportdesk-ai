import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Clock, Tag } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getTickets } from '../../services/tickets'
import { useNavigate } from 'react-router-dom'

interface Props {
    open: boolean
    onClose: () => void
}

export default function SearchModal({ open, onClose }: Props) {
    const [q, setQ] = useState('')
    const navigate = useNavigate()

    const { data = [] } = useQuery({
        queryKey: ['tickets-search'], // ✅ Виправлено одрук у ключі
        queryFn: () => getTickets(),
        enabled: open
    })

    // ✅ Виправлено фільтр (тепер шукає і по title, і по user_name)
    const filtered = q.length > 1
        ? (data as any[]).filter((t: any) => 
            t.title?.toLowerCase().includes(q.toLowerCase()) ||
            t.user_name?.toLowerCase().includes(q.toLowerCase())
        ).slice(0, 6)
        : []

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === '/') {
                e.preventDefault()
                onClose()
            }
            if (e.key === 'Escape') onClose()
        }

        if (open) {
            window.addEventListener('keydown', handler)
        }
        return () => window.removeEventListener('keydown', handler)
    }, [open, onClose])

    useEffect(() => {
        if (!open) {
            setQ('')
        }
    }, [open])

    const statusStyle: Record<string, string> = {
        open: 'bg-[#fffbd1] text-[#ca8a04]',
        in_progress: 'bg-[#fff0ee] text-[#ef4444]',
        closed: 'bg-[#e4faef] text-[#00b67a]',
    }

    return (
        <AnimatePresence>
            {open && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4"
                    onClick={onClose}
                >
                    <motion.div initial={{ opacity: 0, y: -20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.96 }} transition={{ duration: 0.2 }}
                        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-gray-800"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Search Input Bar */}
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                            <Search size={18} className="text-gray-400 flex-shrink-0" />
                            <input
                                autoFocus
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Search tickets, users..."
                                className="flex-1 text-sm text-gray-800 dark:text-gray-100 outline-none bg-transparent placeholder:text-gray-400"
                            />
                            {q && (
                                <button onClick={() => setQ('')} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                    <X size={16} />
                                </button>
                            )}
                            <kbd className="text-xs text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700 rounded px-1.5 py-0.5">Esc</kbd>
                        </div>

                        {/* Search Results */}
                        {filtered.length > 0 ? (
                            <ul className="py-2 max-h-72 overflow-y-auto">
                                {filtered.map((t: any) => (
                                    <li key={t.id}>
                                        <button
                                            onClick={() => {
                                                navigate('/tickets')
                                                onClose()
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                                        >
                                            <Tag size={14} className="text-gray-400 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-800 dark:text-gray-200 truncate font-medium">{t.title}</p>
                                                <p className="text-xs text-gray-400">{t.user_name ?? 'Unknown'}</p>
                                            </div>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyle[t.status] ?? 'bg-gray-100 text-gray-500'}`}>
                                                {t.status}
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : q.length > 1 ? (
                            <div className="py-10 text-center text-sm text-gray-400">No results for "{q}"</div>
                        ) : (
                            <div className="px-4 py-4">
                                <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                                    <Clock size={12} /> Recent
                                </p>
                                <p className="text-sm text-gray-400">Start typing to search tickets or users...</p>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}