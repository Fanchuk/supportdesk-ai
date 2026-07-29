import { useQuery } from '@tanstack/react-query'
import { getJointStats } from '../../services/jointSessions'
import Spinner from '../ui/Spinner'

export default function JointEditingStats() {
    const { data, isLoading } = useQuery({
        queryKey: ['joint-stats'],
        queryFn: getJointStats,
        refetchInterval: 30000,
    })

    if (isLoading) return <div className="flex justify-center py-8"><Spinner size="lg" /></div>
    if (!data) return null

    const stats = [
        { label: 'Active Sessions', value: String(data.activeSessions), sub: 'tickets being edited now' },
        { label: 'Agents Online', value: String(data.agentsOnline), sub: 'available right now' },
        { label: 'Messages Today', value: String(data.messagesToday), sub: 'across all sessions' },
        { label: 'Avg Session Time', value: `${data.avgSessionMinutes}m`, sub: 'per ticket' },
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.map((s) => (
                <div key={s.label} className="bg-white border border-gray-200 rounded-2xl p-6">
                    <p className="text-sm text-gray-500">{s.label}</p>
                    <p className="text-[36px] font-semibold text-[#202020] mt-1 leading-none">{s.value}</p>
                    <div className="flex items-center gap-1 mt-3">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M3 11L8 5L13 11" stroke="#F5A933" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-xs font-semibold text-[#F5A933]">Live</span>
                        <span className="text-xs text-gray-400">{s.sub}</span>
                    </div>
                </div>
            ))}
        </div>
    )
}