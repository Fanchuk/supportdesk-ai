import { Plus } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getTickets } from '../../services/tickets'
import { formatDistanceToNow } from 'date-fns'
import Spinner from '../ui/Spinner'
import { useNavigate } from 'react-router-dom'

interface Props {
    sort: 'newest' | 'oldest'
    onCreateClick: () => void
}

const statusStyle: Record<string, string> = {
    open: 'bg-[#fffbd1] text-[#ca8a04]',
    in_progress: 'bg-[#fff0ee] text-[#ef4444]',
    closed: 'bg-[#e4faef] text-[#00b67a]',
}

const statusLabel: Record<string, string> = {
    open: 'Open',
    in_progress: 'In Progress',
    closed: 'Closed',
}

export default function TicketsTable({ sort, onCreateClick }: Props) {
    const navigate = useNavigate()
    const { data = [], isLoading } = useQuery({
        queryKey: ['tickets'],
        queryFn: () => getTickets(),
    })

    const sorted = [...(data as any[])].sort((a, b) => {
        const diff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        return sort === 'newest' ? -diff : diff
    })

    return (
        <div className="bg-white rounded-[6px] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4">
                <h2 className="text-[20px] font-semibold text-[#202020] tracking-[0.01em]">Latest Tickets</h2>
                <button onClick={onCreateClick} className="flex items-center gap-2 border border-gray-200 rounded-[6px] px-4 h-9 text-sm font-medium text-[#202020] bg-white hover:bg-gray-50">
                    Create Ticket
                    <Plus size={16} />
                </button>
            </div>

            <div className="overflow-x-auto">
                {isLoading ? (
                    <div className="py-16 flex justify-center"><Spinner size="lg" /></div>
                ) : (
                    <table className="w-full min-w-[640px]">
                        <thead>
                            <tr className="bg-[rgba(0,182,122,0.1)]">
                                {['Ticket ID', 'Name', 'Email', 'Subject', 'Created', 'Status'].map((h) => (
                                    <th key={h} className="text-left text-sm font-medium text-[#00b67a] px-6 py-3">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {sorted.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center text-sm text-gray-400">No tickets found</td>
                                </tr>
                            ) : (
                                (sorted as any[]).map((t: any) => (
                                    <tr
                                        key={t.id}
                                        onClick={() => navigate(`/tickets/${t.id}`)}
                                        className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                                    >
                                        <td className="px-6 py-4 text-sm text-[#626262]">#{t.id}</td>
                                        <td className="px-6 py-4 text-sm text-[#626262]">{t.user_name ?? '—'}</td>
                                        <td className="px-6 py-4 text-sm text-[#626262]">{t.user_email ?? '—'}</td>
                                        <td className="px-6 py-4 text-sm text-[#626262]">{t.title}</td>
                                        <td className="px-6 py-4 text-sm text-[#626262]">
                                            {formatDistanceToNow(new Date(t.created_at), { addSuffix: true })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-medium px-[10px] py-[2px] rounded-full ${statusStyle[t.status] ?? 'bg-gray-100 text-gray-500'}`}>
                                                ● {statusLabel[t.status] ?? t.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}