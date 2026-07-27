import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getAutomationStats } from "../../services/automation"
import AutomationStatModal from "../../pages/AutomationStatModal"
import Spinner from "../ui/Spinner"

export default function AutomationStats() {
    const [selected, setSelected] = useState<any | null>(null)

    const { data, isLoading } = useQuery({
        queryKey: ['automation-stats'],
        queryFn: getAutomationStats
    })

    if (isLoading) return <div className="flex justify-center py-8"><Spinner size="lg" /></div>

    const stats = [
        { label: 'Active Automations', display: String(data.activeCount), value: data.activeCount, sub: `Out of ${data.totalCount} total rules` },
        { label: 'Actions This Month', display: data.actionsThisMonth.toLocaleString(), value: data.actionsThisMonth, sub: 'from last month' },
        { label: 'Time Saved', display: `${data.timeSavedHours}H`, value: data.timeSavedHours, sub: 'Estimated this month' },
    ]

    return (
        <>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((s) => (
                <div 
                key={s.label} 
                onClick={() => setSelected(s)}
                className="bg-white border border-gray-200 rounded-2xl p-6 cursor-pointer hover:border-[#00b67a] hover:shadow-sm transition-all">
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
        <AutomationStatModal stat={selected} onClose={() => setSelected(null)} />
        </>
    )
}
