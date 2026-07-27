import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import Spinner from "../ui/Spinner"
import { motion } from 'framer-motion'
import { getDashboardStats } from "../../services/dashboard"
import StatsModal from "./StatsModal"

export default function StatsCards() {
    const { data, isLoading } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: getDashboardStats
    })
    const [selected, setSelected] = useState<{ label: string; value: number; percentage: number } | null>(null)

     const stats = [
         { label: 'Open tickets', value: data?.open ?? 0, percentage: data?.percentOpen ?? 0 },
         { label: 'New Tickets', value: data?.total ?? 0, percentage: 100 },
         { label: 'In Process Tickets', value: data?.inProgress ?? 0, percentage: data?.percentInProgress ?? 0 },
         { label: 'Closed Tickets', value: data?.closed ?? 0, percentage: data?.percentClosed ?? 0 },
     ]

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map((s, i) => (
                    <motion.div
                        key={s.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.08 }}
                        onClick={() => !isLoading && setSelected(s)}
                        className="bg-white border border-gray-200 rounded-2xl p-6 cursor-pointer hover:shadow-md hover:border-[#00b67a]/30 transition-all">
                        <p className="text-sm text-gray-500">{s.label}</p>
                        {isLoading ? (
                            <div className="mt-3">
                                <Spinner size="sm" />
                            </div>
                        ) : (
                            <p className="text-[36px] font-semibold text-[#202020] mt-1 leading-none">{s.value}</p>
                        )}
                        <div className="flex items-center gap-1 mt-3">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M3 11L8 5L13 11" stroke="#00b67a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="text-xs font-semibold text-[#00b67a]">{isLoading ? '...' : `${s.percentage}%`}</span>
                            <span className="text-xs text-gray-400">of total</span>
                        </div>
                    </motion.div>
                ))}
            </div>
            <StatsModal stat={selected} onClose={() => setSelected(null)} />
        </>
    )
}