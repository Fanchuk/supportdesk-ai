import { useQuery } from '@tanstack/react-query'
import { getSlaBreaches } from '../../services/sla'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Spinner from '../ui/Spinner'

const priorityStyle: Record<string, string> = {
    high: 'bg-red-50 text-red-500',
    medium: 'bg-yellow-50 text-yellow-600',
    low: 'bg-green-50 text-green-600',
}

export default function SlaBreaches() {
    const navigate = useNavigate()
    const { data = [], isLoading } = useQuery({ queryKey: ['sla-breaches'], queryFn: getSlaBreaches })

    if (isLoading) return <div className="flex justify-center py-8"><Spinner size="lg" /></div>

    const formatOverdue = (hours: number) => {
        const h = Math.floor(hours)
        const m = Math.round((hours - h) * 60)
        return `+${h}h ${m}m`
    }

    return (
        <div>
            <div className="mb-4">
                <h2 className="text-[22px] font-medium text-[#212b36]">SLA Breaches</h2>
                <p className="text-base text-[#3a4452]">Tickets that have exceeded their SLA targets</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                        <thead>
                            <tr className="bg-[rgba(10,134,245,0.07)]">
                                {['Ticket', 'Priority', 'Assignee', 'Breached', 'Overdue'].map((h) => (
                                    <th key={h} className="text-left text-sm font-medium text-[#0A86F5] px-6 py-3">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {(data as any[]).length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center text-sm text-gray-400">No SLA breaches</td>
                                </tr>
                            ) : (
                                (data as any[]).map((b) => (
                                    <tr key={b.id}
                                        onClick={() => navigate(`/tickets/${b.id}`)}
                                        className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <AlertTriangle size={14} className="text-red-400 flex-shrink-0" />
                                                <span className="text-sm text-[#202020] font-medium">{b.title}</span>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-0.5 ml-5">#{b.id}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priorityStyle[b.priority]}`}>
                                                {b.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[#626262]">{b.assignee_name ?? '—'}</td>
                                        <td className="px-6 py-4 text-sm text-[#626262]">
                                            {formatDistanceToNow(new Date(b.created_at), { addSuffix: true })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-1 rounded-full">
                                                {formatOverdue(Number(b.overdue_hours))}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}