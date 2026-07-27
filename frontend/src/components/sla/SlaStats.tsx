import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getSlaStats } from '../../services/sla'
import { motion, AnimatePresence } from 'framer-motion'
import { X, TrendingUp } from 'lucide-react'
import Spinner from '../ui/Spinner'

function StatModal({ stat, onClose }: { stat: any | null; onClose: () => void }) {
    return (
        <AnimatePresence>
            {stat && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center px-4"
                    onClick={onClose}
                >
                    <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 20 }} transition={{ type: 'spring', duration: 0.4 }}
                        className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                                <p className="text-[52px] font-bold text-[#202020] leading-none">{stat.display}</p>
                            </div>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X size={20} /></button>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-[rgba(0,182,122,0.08)] rounded-xl">
                            <TrendingUp size={16} className="text-[#00b67a]" />
                            <span className="text-sm text-[#00b67a] font-medium">{stat.sub}</span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default function SlaStats() {
    const [selected, setSelected] = useState<any | null>(null)
    const { data, isLoading } = useQuery({ queryKey: ['sla-stats'], queryFn: getSlaStats })

    if (isLoading) return <div className="flex justify-center py-8"><Spinner size="lg" /></div>
    if (!data) return null

    const stats = [
        { label: 'SLA Compliance', display: `${data.compliance}%`, sub: 'of tickets met SLA' },
        { label: 'Avg First Response', display: `${data.avgFirstResponseHours}h`, sub: 'across all priorities' },
        { label: 'SLA Breaches', display: String(data.breachCount), sub: 'this month' },
        { label: 'Avg Resolution Time', display: `${data.avgResolutionHours}h`, sub: 'across all tickets' },
    ]

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map((s) => (
                    <div 
                    key={s.label} 
                    onClick={() => setSelected(s)}
                    className="bg-white border border-gray-200 rounded-2xl p-6 cursor-pointer hover:border-[#00b67a] hover:shadow-sm transition-all"
                    >
                        <p className="text-sm text-gray-500">{s.label}</p>
                        <p className="text-[36px] font-semibold text-[#202020] mt-1 leading-none">{s.display}</p>
                        <div className="flex items-center gap-1 mt-3">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M3 11L8 5L13 11" stroke="#00b67a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="text-xs font-semibold text-[#00b67a]">15%</span>
                            <span className="text-xs text-gray-400">{s.sub}</span>
                        </div>
                    </div>
                ))}
            </div>
            <StatModal stat={selected} onClose={() => setSelected(null)} />
        </>
    )
}