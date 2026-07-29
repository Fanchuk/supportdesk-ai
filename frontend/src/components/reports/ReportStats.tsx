import { useQuery } from '@tanstack/react-query'
import { getReportStats } from '../../services/reports'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, TrendingUp, TrendingDown } from 'lucide-react'
import Spinner from '../ui/Spinner'

interface Props {
    period: string
}

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
                                <p className="text-[52px] font-bold text-[#202020] leading-none">{stat.value}</p>
                            </div>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
                                <X size={20} />
                            </button>
                        </div>
                        <div className={`flex items-center gap-2 p-3 rounded-xl ${stat.positive ? 'bg-[rgba(10,134,245,0.08)]' : 'bg-red-50'}`}>
                            {stat.positive
                                ? <TrendingUp size={16} className="text-[#0A86F5]" />
                                : <TrendingDown size={16} className="text-red-500" />
                            }
                            <span className={`text-sm font-medium ${stat.positive ? 'text-[#0A86F5]' : 'text-red-500'}`}>
                                {stat.sub}
                            </span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default function ReportStats({ period }: Props) {
    const [selected, setSelected] = useState<any | null>(null)
    const { data, isLoading } = useQuery({
        queryKey: ['report-stats', period],
        queryFn: () => getReportStats(period),
    })

    if (isLoading) return <div className="flex justify-center py-8"><Spinner size="lg" /></div>
    if (!data) return null

    const resolutionRate = data.total ? Math.round((data.resolved / data.total) * 100) : 0

    const stats = [
        { label: 'Total Tickets', value: String(data.total), change: '+12%', positive: true, sub: 'Total tickets in system' },
        { label: 'Resolved', value: String(data.resolved), change: `${resolutionRate}%`, positive: true, sub: `${resolutionRate}% resolution rate` },
        { label: 'Avg Response Time', value: `${data.avgResponseHours}h`, change: '-18%', positive: true, sub: 'Average hours to respond' },
        { label: 'Open Tickets', value: String(data.open), change: '+3%', positive: false, sub: 'Tickets still open' },
    ]

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map((s) => (
                    <div key={s.label} onClick={() => setSelected(s)}
                        className="bg-white border border-gray-200 rounded-2xl p-6 cursor-pointer hover:border-[#0A86F5] hover:shadow-sm transition-all"
                    >
                        <p className="text-sm text-gray-500">{s.label}</p>
                        <p className="text-[36px] font-semibold text-[#202020] mt-1 leading-none">{s.value}</p>
                        <div className="flex items-center gap-1 mt-3">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path
                                    d={s.positive ? 'M3 11L8 5L13 11' : 'M3 5L8 11L13 5'}
                                    stroke={s.positive ? '#0A86F5' : '#ef4444'}
                                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                                />
                            </svg>
                            <span className={`text-xs font-semibold ${s.positive ? 'text-[#0A86F5]' : 'text-red-500'}`}>{s.change}</span>
                            <span className="text-xs text-gray-400">vs last period</span>
                        </div>
                    </div>
                ))}
            </div>
            <StatModal stat={selected} onClose={() => setSelected(null)} />
        </>
    )
}