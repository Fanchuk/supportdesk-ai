import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Send, Circle, Plus } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getJointSessions, getSessionMessages, sendSessionMessage } from '../../services/jointSessions'
import { useSessionChat } from '../../hooks/useSessionChat'
import Spinner from '../ui/Spinner'
import { formatDistanceToNow } from 'date-fns'
import StartSessionModal from './StartSessionModal'

const agentColors = ['bg-[rgba(79,70,229,0.15)] text-[#4f46e5]', 'bg-[rgba(249,60,101,0.15)] text-[#f93c65]', 'bg-[rgba(10,134,245,0.15)] text-[#0A86F5]', 'bg-[rgba(245,158,11,0.15)] text-[#f59e0b]']

const priorityStyle: Record<string, string> = {
    high: 'bg-red-50 text-red-500',
    medium: 'bg-yellow-50 text-yellow-600',
    low: 'bg-green-50 text-green-600',
}

const statusStyle: Record<string, string> = {
    open: 'bg-[#fffbd1] text-[#ca8a04]',
    in_progress: 'bg-[#fff0ee] text-[#ef4444]',
    closed: 'bg-[#edfff5] text-[#46E896]',
}

const statusLabel: Record<string, string> = {
    open: 'Open', in_progress: 'In Progress', closed: 'Closed',
}

function SessionChat({ sessionId }: { sessionId: number }) {
    const [input, setInput] = useState('')
    const qc = useQueryClient()

    const { data: initialMessages = [] } = useQuery({
        queryKey: ['session-messages', sessionId],
        queryFn: () => getSessionMessages(sessionId),
    })

    const { messages, setMessages, sendWs } = useSessionChat(sessionId, initialMessages)

    const { mutate: send } = useMutation({
        mutationFn: (body: string) => sendSessionMessage(sessionId, body),
        onSuccess: (newMsg) => {
            setMessages(p => [...p, newMsg])
            sendWs(newMsg)
        },
    })

    const handleSend = () => {
        const text = input.trim()
        if (!text) return
        send(text)
        setInput('')
    }

    return (
        <div className="border-t border-gray-100 px-6 py-4">
            <div className="flex flex-col gap-3 mb-4 max-h-64 overflow-y-auto">
                {(messages as any[]).map((m: any, i: number) => (
                    <div key={m.id ?? i} className="flex gap-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0 ${agentColors[i % agentColors.length]}`}>
                            {m.author_initials ?? m.authorInitials ?? '??'}
                        </div>
                        <div className="flex flex-col gap-0.5 items-start max-w-[75%]">
                            <p className="text-[11px] text-gray-400">
                                {m.author_name ?? m.authorName} · {m.created_at ? new Date(m.created_at).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }) : ''}
                            </p>
                            <div className="px-3 py-2 rounded-2xl rounded-tl-sm text-sm bg-gray-100 text-gray-800">
                                {m.body}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1 h-10 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0A86F5] transition-colors"
                />
                <button onClick={handleSend}
                    className="w-10 h-10 rounded-lg bg-[#0A86F5] hover:bg-[#0875d4] flex items-center justify-center transition-colors"
                >
                    <Send size={15} className="text-white" />
                </button>
            </div>
        </div>
    )
}

export default function JointEditingList() {
    const [expanded, setExpanded] = useState<number | null>(null)
    const [startOpen, setStartOpen] = useState(false)

    const { data: sessions = [], isLoading } = useQuery({
        queryKey: ['joint-sessions'],
        queryFn: getJointSessions,
        refetchInterval: 15000,
    })

    if (isLoading) return <div className="flex justify-center py-8"><Spinner size="lg" /></div>

    return (
        <>
            <div>
                <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                    <div>
                        <h2 className="text-[22px] font-medium text-[#212b36]">Active Sessions</h2>
                        <p className="text-base text-[#3a4452]">Tickets currently being worked on collaboratively</p>
                    </div>
                    <button onClick={() => setStartOpen(true)}
                        className="flex items-center gap-2 bg-[#0A86F5] hover:bg-[#0875d4] text-white text-sm font-medium px-4 h-10 rounded-lg transition-colors"
                    >
                        <Plus size={16} /> Start Session
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    {(sessions as any[]).map((s: any) => (
                        <div key={s.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-[#0A86F5] transition-all">
                            <div onClick={() => setExpanded(p => p === s.id ? null : s.id)}
                                className="px-6 py-5 flex items-center justify-between gap-4 cursor-pointer"
                            >
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className="flex -space-x-2 flex-shrink-0">
                                        {(s.agents as any[]).slice(0, 3).map((a: any, i: number) => (
                                            <div key={a.id} className={`w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold ${agentColors[i % agentColors.length]}`}>
                                                {a.initials}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-base font-medium text-[#202020]">#{s.ticket_id} {s.ticket_title}</p>
                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priorityStyle[s.ticket_priority]}`}>{s.ticket_priority}</span>
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusStyle[s.ticket_status]}`}>● {statusLabel[s.ticket_status]}</span>
                                            <span className="text-xs text-gray-400">
                                                Started {formatDistanceToNow(new Date(s.created_at), { addSuffix: true })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 flex-shrink-0">
                                    <div className="hidden sm:flex items-center gap-1.5">
                                        <Circle size={8} className="text-[#0A86F5] fill-[#0A86F5]" />
                                        <span className="text-xs text-gray-500">{(s.agents as any[]).length} agents</span>
                                    </div>
                                    {expanded === s.id ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                                </div>
                            </div>

                            <AnimatePresence>
                                {expanded === s.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <SessionChat sessionId={s.id} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
            <StartSessionModal open={startOpen} onClose={() => setStartOpen(false)} />
        </>
    )
}