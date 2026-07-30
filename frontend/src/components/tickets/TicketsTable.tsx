import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getTickets } from '../../services/tickets'
import { formatDistanceToNow } from 'date-fns'
import Spinner from '../ui/Spinner'
import { useNavigate } from 'react-router-dom'
import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'

interface Props {
    sort: 'newest' | 'oldest'
    onCreateClick: () => void
}

const statusStyle: Record<string, string> = {
    open: 'bg-[#fffbd1] text-[#ca8a04]',
    in_progress: 'bg-[#fff0ee] text-[#ef4444]',
    closed: 'bg-[#edfff5] text-[#46E896]',
}

const statusLabel: Record<string, string> = {
    open: 'Open',
    in_progress: 'In Progress',
    closed: 'Closed',
}

const PER_PAGE = 10

export default function TicketsTable({ sort, onCreateClick }: Props) {
    const navigate = useNavigate()
    const [page, setPage] = useState(1)

    const { data, isLoading } = useQuery({
        queryKey: ['tickets', sort, page],
        queryFn: () => getTickets({ sort: sort === 'newest' ? 'desc' : 'asc', page, limit: PER_PAGE }),
        placeholderData: (prev) => prev,
    })

    useEffect(() => {
        setPage(1)
    }, [sort])

    const tickets = data?.data ?? []
    const pagination = data?.pagination

    return (
        <div className="bg-white dark:bg-gray-900 rounded-[6px] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4">
                <h2 className="text-[20px] font-semibold text-[#202020] dark:text-gray-100 tracking-[0.01em]">
                    Latest Tickets
                    {pagination && (
                        <span className="ml-2 text-sm font-normal text-gray-400">({pagination.total})</span>
                    )}
                </h2>
                <button onClick={onCreateClick}
                    className="flex items-center gap-2 border border-[#0A86F5] rounded-[6px] px-4 h-9 text-sm font-medium text-[#0A86F5] bg-[rgba(10,134,245,0.07)] hover:bg-[rgba(10,134,245,0.12)] transition-colors"
                >
                    Create Ticket <Plus size={16} />
                </button>
            </div>

            <div className="overflow-x-auto">
                {isLoading ? (
                    <div className="py-16 flex justify-center"><Spinner size="lg" /></div>
                ) : (
                    <table className="w-full min-w-[640px]">
                        <thead>
                            <tr className="bg-[rgba(10,134,245,0.07)]">
                                {['Ticket ID', 'Name', 'Email', 'Subject', 'Created', 'Status'].map((h) => (
                                    <th key={h} className="text-left text-sm font-medium text-[#0A86F5] px-6 py-3">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center text-sm text-gray-400">
                                        No tickets found
                                    </td>
                                </tr>
                            ) : (
                                tickets.map((t: any) => (
                                    <tr key={t.id}
                                        onClick={() => navigate(`/tickets/${t.id}`)}
                                        className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                                    >
                                        <td className="px-6 py-4 text-sm text-[#626262] dark:text-gray-400">#{t.id}</td>
                                        <td className="px-6 py-4 text-sm text-[#626262] dark:text-gray-400">{t.user_name ?? '—'}</td>
                                        <td className="px-6 py-4 text-sm text-[#626262] dark:text-gray-400">{t.user_email ?? '—'}</td>
                                        <td className="px-6 py-4 text-sm text-[#626262] dark:text-gray-400">{t.title}</td>
                                        <td className="px-6 py-4 text-sm text-[#626262] dark:text-gray-400">
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

            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-800">
                    <span className="text-sm font-medium text-[#1c2434] dark:text-gray-300">
                        {tickets.length === 0 ? '0' : `${(page - 1) * PER_PAGE + 1}–${Math.min(page * PER_PAGE, pagination.total)}`} of {pagination.total}
                    </span>
                    <Pagination
                        current={page}
                        total={pagination.total}
                        pageSize={PER_PAGE}
                        onChange={(p) => setPage(p)}
                        showLessItems
                        className="rc-pagination-green"
                    />
                </div>
            )}
        </div>
    )
}