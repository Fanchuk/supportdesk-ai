import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, TrendingUp } from 'lucide-react'


interface Props {
    stat: { label: string; value: number; percentage: number } | null
    onClose: () => void
}

export default function StatsModal({ stat, onClose }: Props) {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [onClose])

    return (
        <AnimatePresence>
            {stat && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center px-4"
                    onClick={onClose}>
                    <motion.div initial={ { opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }} transition={{ type: 'spring', duration: 0.4 }}
                        className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl"
                        onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                                <p className="text-[52px] font-bold text-[#202020] leading-none">{stat.value}</p>
                            </div>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex items-center gap-2 mb-6 p-3 bg-[rgba(0,182,122,0.08)] rounded-xl">
                            <TrendingUp size={16} className="text-[#00b67a]" />
                            <span className="text-sm text-[#00b67a] font-medium">{stat.percentage}% of total tickets</span>
                        </div>

                        <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(stat.percentage, 100)}%` }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                                className="h-2 bg-[#00b67a] rounded-full"
                            />
                        </div>
                        <p className="text-xs text-gray-400 text-right">{stat.percentage}%</p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}