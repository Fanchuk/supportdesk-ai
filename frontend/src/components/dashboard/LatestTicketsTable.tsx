import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { getLatestTickets } from '../../services/dashboard'
import Spinner from '../ui/Spinner'

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

export default function LatestTicketsTable() {
    const { data = [], isLoading } = useQuery({ queryKey: ['latest-tickets'], queryFn: getLatestTickets })

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white border border-gray-200 rounded-2xl p-4 md:p-6 shadow-[0_1px_2px_-1px_rgba(0,0,0,0.1),0_1px_3px_0_rgba(0,0,0,0.1)] overflow-x-auto">
            <h2 className="text-[22px] font-normal text-black mb-4">Latest Tickets</h2>
            <div className="min-w-[640px]">
                {isLoading ? (
                    <div className="py-12 flex justify-center">
                        <Spinner size="lg" />
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[rgba(0,182,122,0.1)] rounded-md">
                                {['Ticket ID', 'Name', 'Email', 'Subject', 'Created', 'Status'].map((h) => (
                                    <th key={h} className="text-left text-sm font-medium text-[#00b67a] px-6 py-3 first:rounded-l-md last:rounded-r-md">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((t: any, i: number) => (
                                <motion.tr
                                    key={t.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.2, delay: i * 0.04 }}
                                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-600">#{t.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">{t.user_name ?? '—'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{t.user_email ?? '—'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">{t.title}</td>
                                    <td className="px-6 py-4 text-sm text-gray-400">{formatDistanceToNow(new Date(t.created_at), { addSuffix: true })}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-medium px-[10px] py-[2px] rounded-full ${statusStyle[t.status] ?? 'bg-gray-100 text-gray-500'}`}>
                                            ● {statusLabel[t.status] ?? t.status}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </motion.div>
    )
}
