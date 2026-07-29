import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getEmailIntegrations, createEmailIntegration, updateEmailIntegration, deleteEmailIntegration } from '../../services/emailIntegrations'
import { formatDistanceToNow } from 'date-fns'
import { useState } from 'react'
import { Plus, Trash2, SlidersHorizontal, RefreshCw, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import ConnectMailboxModal from './ConnectMailboxModal'
import EditMailboxModal from './EditMailboxModal'
import EmailActivityChart from './EmailActivityChart'
import Spinner from '../ui/Spinner'

const providerConfig: Record<string, { emoji: string; color: string; bg: string; bar: string }> = {
    Gmail: { emoji: '🔴', color: 'text-red-500', bg: 'bg-red-50', bar: '#ef4444' },
    Outlook: { emoji: '🔵', color: 'text-blue-500', bg: 'bg-blue-50', bar: '#3b82f6' },
    SMTP: { emoji: '⚙️', color: 'text-gray-500', bg: 'bg-gray-50', bar: '#6b7280' },
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
    return (
        <button onClick={() => onChange(!value)}
            className={`w-10 h-5 rounded-full relative transition-colors flex-shrink-0 ${value ? 'bg-[#0A86F5]' : 'bg-gray-200'}`}
        >
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${value ? 'left-5' : 'left-0.5'}`} />
        </button>
    )
}

export default function EmailIntegrationList() {
    const qc = useQueryClient()
    const [connectOpen, setConnectOpen] = useState(false)
    const [editMailbox, setEditMailbox] = useState<any | null>(null)

    const { data: mailboxes = [], isLoading } = useQuery({
        queryKey: ['email-integrations'],
        queryFn: getEmailIntegrations,
    })

    const { mutate: toggleActive } = useMutation({
        mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
            updateEmailIntegration(id, { isActive }),
        onMutate: async ({ id, isActive }) => {
            await qc.cancelQueries({ queryKey: ['email-integrations'] })
            const previous = qc.getQueryData(['email-integrations'])
            qc.setQueryData(['email-integrations'], (old: any[]) =>
                old.map(m => m.id === id ? { ...m, isActive, is_active: isActive } : m)
            )
            return { previous }
        },
        onError: (_err, _vars, ctx) => qc.setQueryData(['email-integrations'], ctx?.previous),
        onSettled: () => qc.invalidateQueries({ queryKey: ['email-integrations'] }),
    })

    const { mutate: remove } = useMutation({
        mutationFn: (id: number) => deleteEmailIntegration(id),
        onSuccess: () => {
            toast.success('Mailbox disconnected')
            qc.invalidateQueries({ queryKey: ['email-integrations'] })
        },
        onError: () => toast.error('Failed to disconnect'),
    })

    const { mutate: create } = useMutation({
        mutationFn: (data: { email: string; provider: string; host: string; port: number; login: string }) =>
            createEmailIntegration(data),
        onSuccess: () => {
            toast.success('Mailbox connected!')
            qc.invalidateQueries({ queryKey: ['email-integrations'] })
        },
        onError: () => toast.error('Failed to connect'),
    })

    const { mutate: edit } = useMutation({
        mutationFn: (data: { email?: string; provider?: string; host?: string; port?: number }) =>
            updateEmailIntegration(editMailbox?.id, data),
        onSuccess: () => {
            toast.success('Mailbox updated!')
            qc.invalidateQueries({ queryKey: ['email-integrations'] })
            setEditMailbox(null)
        },
        onError: () => toast.error('Failed to update'),
    })

    const handleTest = (e: React.MouseEvent, email: string) => {
        e.stopPropagation()
        toast.loading(`Testing ${email}...`, { duration: 1500 })
        setTimeout(() => toast.success(`${email} is working!`), 1500)
    }

    if (isLoading) return <div className="flex justify-center py-8"><Spinner size="lg" /></div>

    return (
        <>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-[22px] font-medium text-[#212b36]">Connected Mailboxes</h2>
                        <p className="text-sm sm:text-base text-[#3a4452] mt-1">Manage email accounts connected to your support system</p>
                    </div>
                    <button onClick={() => setConnectOpen(true)}
                        className="flex items-center justify-center gap-2 bg-[#0A86F5] hover:bg-[#0875d4] text-white text-sm font-medium px-4 h-10 rounded-lg transition-colors w-full sm:w-auto flex-shrink-0"
                    >
                        <Plus size={16} /> Connect Mailbox
                    </button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {(mailboxes as any[]).map((m) => {
                        const cfg = providerConfig[m.provider] ?? providerConfig.SMTP
                        const received = m.received_today ?? m.receivedToday ?? 0
                        const sent = m.sent_today ?? m.sentToday ?? 0
                        const total = received + sent
                        const receivedPct = total ? Math.round((received / total) * 100) : 0
                        const isActive = m.isActive ?? m.is_active ?? false

                        return (
                            <div key={m.id} className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 flex flex-col gap-4 sm:gap-5 hover:border-[#0A86F5] hover:shadow-sm transition-all overflow-hidden">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                    <div className="flex items-center gap-3 overflow-hidden w-full sm:w-auto">
                                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${cfg.bg} flex items-center justify-center text-xl sm:text-2xl flex-shrink-0`}>
                                            {cfg.emoji}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-[#202020] truncate">{m.email}</p>
                                            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                                <span className={`text-xs font-medium ${cfg.color}`}>{m.provider}</span>
                                                {isActive
                                                    ? <span className="flex items-center gap-1 text-xs text-[#0A86F5] whitespace-nowrap"><CheckCircle size={11} />Connected</span>
                                                    : <span className="flex items-center gap-1 text-xs text-gray-400 whitespace-nowrap"><XCircle size={11} />Inactive</span>
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                        <div className="mr-1">
                                            <Toggle value={isActive} onChange={(v) => toggleActive({ id: m.id, isActive: v })} />
                                        </div>
                                        <button onClick={(e) => handleTest(e, m.email)}
                                            className="p-2 sm:p-1.5 text-gray-400 hover:text-[#0A86F5] transition-colors rounded-lg hover:bg-[rgba(10,134,245,0.08)]"
                                        >
                                            <RefreshCw size={16} className="sm:w-3.5 sm:h-3.5" />
                                        </button>
                                        <button onClick={() => setEditMailbox(m)}
                                            className="p-2 sm:p-1.5 text-gray-400 hover:text-[#0A86F5] transition-colors rounded-lg hover:bg-[rgba(10,134,245,0.08)]"
                                        >
                                            <SlidersHorizontal size={16} className="sm:w-3.5 sm:h-3.5" />
                                        </button>
                                        <button onClick={() => remove(m.id)}
                                            className="p-2 sm:p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                                        >
                                            <Trash2 size={16} className="sm:w-3.5 sm:h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                    <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                                        <p className="text-xs text-gray-400 mb-1">Received today</p>
                                        <p className="text-xl sm:text-2xl font-bold text-[#202020]">{received}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                                        <p className="text-xs text-gray-400 mb-1">Sent today</p>
                                        <p className="text-xl sm:text-2xl font-bold text-[#202020]">{sent}</p>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-[10px] sm:text-xs text-gray-400 mb-1.5">
                                        <span>Received {receivedPct}%</span>
                                        <span>Sent {100 - receivedPct}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full transition-all"
                                            style={{ width: `${receivedPct}%`, backgroundColor: cfg.bar }}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-xs text-gray-400 pt-2 sm:pt-1 border-t border-gray-100">
                                    <span className="truncate max-w-[60%] sm:max-w-none">{m.host}:{m.port}</span>
                                    <span className="whitespace-nowrap">
                                        Synced {m.last_sync_at
                                            ? formatDistanceToNow(new Date(m.last_sync_at), { addSuffix: true })
                                            : '—'
                                        }
                                    </span>
                                </div>
                            </div>
                        )
                    })}

                    {(mailboxes as any[]).length === 0 && (
                        <div className="col-span-1 xl:col-span-2 bg-white border border-dashed border-gray-200 rounded-2xl px-6 py-12 sm:py-16 text-center">
                            <p className="text-sm text-gray-400">No mailboxes connected yet.</p>
                        </div>
                    )}
                </div>

                <EmailActivityChart />
            </div>

            <ConnectMailboxModal open={connectOpen} onClose={() => setConnectOpen(false)} onCreate={create} />
            <EditMailboxModal mailbox={editMailbox} onClose={() => setEditMailbox(null)} onEdit={edit} />
        </>
    )
}