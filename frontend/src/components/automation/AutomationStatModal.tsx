import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, TrendingUp } from 'lucide-react'

interface Props {
    stat: { label: string; value: number; display: string; sub: string } | null
    onClose: () => void
}

export default function AutomationStatModal({ stat, onClose }: Props) {
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
                    onClick={onClose}
                >
                    <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }} transition={{ type: 'spring', duration: 0.4 }}
                        className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                                <p className="text-[52px] font-bold text-[#202020] leading-none">{stat.display}</p>
                            </div>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex items-center gap-2 mb-6 p-3 rounded-xl" style={{ background: 'rgba(10,134,245,0.08)' }}>
                            <TrendingUp size={16} className="text-[#0A86F5]" />
                            <span className="text-sm text-[#0A86F5] font-medium">{stat.sub}</span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}