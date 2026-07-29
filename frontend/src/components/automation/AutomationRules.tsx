import { useState } from 'react'
import { Plus, SlidersHorizontal, Clock, Mail, Zap } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAutomationRules, updateAutomationRule } from '../../services/automation'
import { useNavigate } from 'react-router-dom'
import Spinner from '../ui/Spinner'
import CreateAutomationModal from './CreateAutomationModal'

const triggerIcons: Record<string, any> = {
    time_based: { Icon: Clock, iconBg: 'bg-[rgba(249,60,101,0.1)]', iconColor: 'text-[#f93c65]' },
    new_ticket: { Icon: Mail, iconBg: 'bg-[rgba(79,70,229,0.1)]', iconColor: 'text-[#4f46e5]' },
    status_change: { Icon: Zap, iconBg: 'bg-[rgba(71,222,222,0.1)]', iconColor: 'text-[#47DEDE]' },
}

const triggerLabel: Record<string, string> = {
    new_ticket: 'New Tickets →',
    time_based: 'Time-Based →',
    status_change: 'Status Change →',
}

const actionLabel: Record<string, string> = {
    close_ticket: 'Close Ticket',
    send_email: 'Send Email',
    change_priority: 'Change Priority',
    reassign: 'Reassign',
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
    return (
        <button
            onClick={() => onChange(!value)}
            className={`w-12 h-6 rounded-full relative transition-colors ${value ? 'bg-[#0A86F5]' : 'bg-gray-200'}`}
        >
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${value ? 'left-7' : 'left-1'}`} />
        </button>
    )
}

export default function AutomationRules() {
    const navigate = useNavigate()
    const qc = useQueryClient()
    const [createOpen, setCreateOpen] = useState(false)

    const { data = [], isLoading } = useQuery({
        queryKey: ['automation-rules'],
        queryFn: getAutomationRules,
    })

    const { mutate: toggle } = useMutation({
        mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
            updateAutomationRule(id, { isActive }),
        onMutate: async ({ id, isActive }) => {
            await qc.cancelQueries({ queryKey: ['automation-rules'] })
            const previous = qc.getQueryData(['automation-rules'])
            qc.setQueryData(['automation-rules'], (old: any[] = []) =>
                old.map((r) => (r.id === id ? { ...r, isActive } : r))
            )
            return { previous }
        },
        onError: (_err, _vars, context) => {
            qc.setQueryData(['automation-rules'], context?.previous)
        },
        onSettled: () => qc.invalidateQueries({ queryKey: ['automation-rules'] }),
    })

    if (isLoading) return <div className="flex justify-center py-8"><Spinner size="lg" /></div>

    return (
        <>
            <div>
                <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                    <div>
                        <h2 className="text-[22px] font-medium text-[#212b36]">Automation Rules</h2>
                        <p className="text-base text-[#3a4452]">Configure automated workflows to streamline your support process</p>
                    </div>
                    <button
                        onClick={() => setCreateOpen(true)}
                        className="flex items-center gap-2 bg-[#0A86F5] hover:bg-[#0875d4] text-white text-sm font-medium px-4 h-10 rounded-lg transition-colors"
                    >
                        <Plus size={16} />
                        Create Automation
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    {(data as any[]).map((r) => {
                        const meta = triggerIcons[r.trigger] ?? triggerIcons.status_change
                        const { Icon, iconBg, iconColor } = meta
                        const tags = [
                            triggerLabel[r.trigger],
                            actionLabel[r.action],
                            r.conditionHours ? `${r.conditionHours}h condition` : null,
                        ].filter(Boolean)

                        return (
                            <div
                                key={r.id}
                                onClick={() => navigate(`/automation/${r.id}`)}
                                className="bg-white border border-gray-200 rounded-2xl px-6 py-8 flex items-start justify-between gap-4 cursor-pointer hover:border-[#0A86F5] hover:shadow-sm transition-all"
                            >
                                <div className="flex items-start gap-4 flex-1 min-w-0">
                                    <div className={`w-12 h-12 rounded-[8px] flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                                        <Icon size={20} className={iconColor} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-base font-normal text-black">{r.name}</p>
                                        <p className="text-sm text-gray-500 mt-0.5">{r.description ?? ''}</p>
                                        <div className="flex flex-wrap gap-4 mt-2">
                                            {tags.map((tag) => (
                                                <span key={tag} className="text-xs text-gray-400 font-mono">{tag}</span>
                                            ))}
                                        </div>
                                        <p className="text-sm mt-1">
                                            Executed <span className="text-[#0A86F5] font-medium">{r.executedCount ?? 0}</span> times
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                    <Toggle
                                        value={!!r.isActive}
                                        onChange={(v) => toggle({ id: r.id, isActive: v })}
                                    />
                                    <button
                                        onClick={(e) => { e.stopPropagation(); navigate(`/automation/${r.id}`) }}
                                        className="p-1 hover:text-[#0A86F5] text-gray-400 transition-colors"
                                    >
                                        <SlidersHorizontal size={16} />
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <CreateAutomationModal open={createOpen} onClose={() => setCreateOpen(false)} />
        </>
    )
}