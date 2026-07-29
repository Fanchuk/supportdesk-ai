import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAutomationRules, updateAutomationRule } from '../services/automation'
import { ArrowLeft, Zap, Clock, Mail, ToggleLeft, Hash, AlarmClock } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import Spinner from '../components/ui/Spinner'
import toast from 'react-hot-toast'

const triggerLabel: Record<string, string> = {
    new_ticket: 'New Ticket',
    time_based: 'Time Based',
    status_change: 'Status Change',
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

export default function AutomationDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const qc = useQueryClient()

    const { data: rules = [], isLoading } = useQuery({
        queryKey: ['automation-rules'],
        queryFn: getAutomationRules,
    })

    const rule = (rules as any[]).find((r) => String(r.id) === id)

    const { mutate: toggle } = useMutation({
        mutationFn: (isActive: boolean) => updateAutomationRule(Number(id), { isActive }),
        onSuccess: () => {
            toast.success('Automation updated!')
            qc.invalidateQueries({ queryKey: ['automation-rules'] })
        },
        onError: () => toast.error('Failed to update automation'),
    })

    if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
    if (!rule) return <div className="text-center py-20 text-gray-400">Automation not found</div>

    const isActive = rule.isActive ?? rule.is_active ?? false

    return (
        <div className="max-w-3xl mx-auto pb-10">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
            >
                <ArrowLeft size={16} /> Back
            </button>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <h1 className="text-xl font-semibold text-gray-900">{rule.name}</h1>
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <span className={`text-xs font-medium px-3 py-1 rounded-full ${isActive ? 'bg-[#e8f3ff] text-[#0A86F5]' : 'bg-gray-100 text-gray-400'}`}>
                                {isActive ? '● Active' : '○ Inactive'}
                            </span>
                            <Toggle value={isActive} onChange={(v) => toggle(v)} />
                        </div>
                    </div>

                    {rule.description && (
                        <p className="text-sm text-gray-600 leading-relaxed mb-6">{rule.description}</p>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { icon: Zap, label: 'Trigger', value: triggerLabel[rule.trigger] ?? rule.trigger },
                            { icon: Mail, label: 'Action', value: actionLabel[rule.action] ?? rule.action },
                            { icon: Hash, label: 'Executed', value: `${rule.executedCount ?? rule.executed_count ?? 0} times` },
                            { icon: Clock, label: 'Created', value: rule.createdAt ?? rule.created_at ? formatDistanceToNow(new Date(rule.createdAt ?? rule.created_at), { addSuffix: true }) : '—' },
                            ...(rule.conditionHours ?? rule.condition_hours
                                ? [{ icon: AlarmClock, label: 'Condition Hours', value: `${rule.conditionHours ?? rule.condition_hours}h` }]
                                : []
                            ),
                            { icon: ToggleLeft, label: 'Status', value: isActive ? 'Active' : 'Inactive' },
                        ].map(({ icon: Icon, label, value }) => (
                            <div key={label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                <div className="w-8 h-8 rounded-lg bg-[rgba(10,134,245,0.1)] flex items-center justify-center flex-shrink-0">
                                    <Icon size={14} className="text-[#0A86F5]" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">{label}</p>
                                    <p className="text-sm font-medium text-gray-800">{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <h2 className="text-base font-semibold text-gray-900 mb-4">Execution Summary</h2>
                    <div className="flex items-center justify-between p-4 bg-[rgba(10,134,245,0.05)] border border-[rgba(10,134,245,0.15)] rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-[rgba(10,134,245,0.1)] flex items-center justify-center">
                                <Zap size={16} className="text-[#0A86F5]" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Total executions</p>
                                <p className="text-sm font-medium text-gray-800">{rule.executedCount ?? rule.executed_count ?? 0} times</p>
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-[#0A86F5]">{rule.executedCount ?? rule.executed_count ?? 0}</p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}