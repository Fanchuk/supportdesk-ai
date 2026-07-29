import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAgentsStats } from '../../services/reports'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Ticket, Clock, CheckCircle } from 'lucide-react'
import Spinner from '../ui/Spinner'

interface Props {
    period: string
}

const roleStyle: Record<string, string> = {
    admin: 'bg-red-50 text-red-500',
    manager: 'bg-[rgba(79,70,229,0.08)] text-[#4f46e5]',
    agent: 'bg-[rgba(10,134,245,0.08)] text-[#0A86F5]',
}

function AgentModal({ agent, onClose }: { agent: any | null; onClose: () => void }) {
    return (
        <AnimatePresence>
            {agent && (
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
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-[rgba(10,134,245,0.1)] flex items-center justify-center text-[#0A86F5] font-bold text-sm">
                                    {agent.name?.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-lg font-semibold text-[#202020]">{agent.name}</p>
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${roleStyle[agent.role]}`}>
                                        {agent.role}
                                    </span>
                                </div>
                            </div>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-3">
                            {[
                                { icon: CheckCircle, label: 'Resolved Tickets', value: agent.resolved ?? 0, color: 'text-[#0A86F5]' },
                                { icon: Ticket, label: 'Open Tickets', value: agent.open ?? 0, color: 'text-yellow-500' },
                                { icon: Clock, label: 'Avg Response Time', value: `${agent.avg_response_hours ?? 0}h`, color: 'text-[#4f46e5]' },
                            ].map(({ icon: Icon, label, value, color }) => (
                                <div key={label} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-2">
                                        <Icon size={14} className={color} />
                                        <span className="text-sm text-gray-500">{label}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-[#202020]">{value}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default function AgentsTable({ period }: Props) {
    const [selected, setSelected] = useState<any | null>(null)
    const { data: agents = [], isLoading } = useQuery({
        queryKey: ['agents-stats', period],
        queryFn: () => getAgentsStats(period),
    })

    if (isLoading) return <div className="flex justify-center py-8"><Spinner size="lg" /></div>

    return (
        <>
            <div>
                <div className="mb-4">
                    <h2 className="text-[22px] font-medium text-[#212b36]">Agent Performance</h2>
                    <p className="text-base text-[#3a4452]">Individual stats for each support agent</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                            <thead>
                                <tr className="bg-[rgba(10,134,245,0.07)]">
                                    {['Agent', 'Role', 'Resolved', 'Open', 'Avg Response'].map(h => (
                                        <th key={h} className="text-left text-sm font-medium text-[#0A86F5] px-6 py-3">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {(agents as any[]).map((a) => (
                                    <tr key={a.id}
                                        onClick={() => setSelected(a)}
                                        className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[rgba(10,134,245,0.1)] flex items-center justify-center text-[#0A86F5] font-semibold text-xs flex-shrink-0">
                                                    {a.name?.slice(0, 2).toUpperCase()}
                                                </div>
                                                <span className="text-sm font-medium text-[#202020]">{a.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${roleStyle[a.role]}`}>
                                                {a.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-semibold text-[#0A86F5]">{a.resolved ?? 0}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-[#626262]">{a.open ?? 0}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-[#626262]">{a.avg_response_hours ?? 0}h</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <AgentModal agent={selected} onClose={() => setSelected(null)} />
        </>
    )
}