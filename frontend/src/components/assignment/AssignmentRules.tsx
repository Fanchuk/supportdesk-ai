import { Plus, SlidersHorizontal } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAssignmentRules, updateAssignmentRule } from '../../services/assignment'
import Spinner from '../ui/Spinner'
import CreateRuleModal from './CreateRuleModal'
import EditRuleModal from '../../pages/EditRuleModal'

const iconColors = [
    { iconBg: 'bg-[rgba(249,60,101,0.1)]', iconColor: 'text-[#f93c65]' },
    { iconBg: 'bg-[rgba(79,70,229,0.1)]', iconColor: 'text-[#4f46e5]' },
    { iconBg: 'bg-[rgba(10,134,245,0.1)]', iconColor: 'text-[#0A86F5]' },
]

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
    return (
        <button onClick={() => onChange(!value)} className={`w-12 h-6 rounded-full relative transition-colors ${value ? 'bg-[#0A86F5]' : 'bg-gray-200'}`}>
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${value ? 'left-7' : 'left-1'}`} />
        </button>
    )
}

export default function AssignmentRules() {
    const navigate = useNavigate()
    const qc = useQueryClient()
    const [createOpen, setCreateOpen] = useState(false)
    const [editRule, setEditRule] = useState<any | null>(null)

    const { data = [], isLoading } = useQuery({
        queryKey: ['assignment-rules'],
        queryFn: getAssignmentRules,
    })

    const { mutate: toggle } = useMutation({
        mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) => updateAssignmentRule(id, { isActive }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['assignment-rules'] }),
    })

    if (isLoading)
        return (
            <div className="flex justify-center py-8">
                <Spinner size="lg" />
            </div>
        )

    return (
        <>
            <div>
                <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                    <div>
                        <h2 className="text-[22px] font-medium text-[#212b36]">Assignment Rules</h2>
                        <p className="text-base text-[#3a4452]">Configure automatic ticket routing based on conditions</p>
                    </div>
                    <button onClick={() => setCreateOpen(true)} className="flex items-center gap-2 bg-[#0A86F5] hover:bg-[#0875d4] text-white text-sm font-medium px-4 h-10 rounded-lg transition-colors">
                        <Plus size={16} />
                        New Rules
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    {(data as any[]).map((r, i) => {
                        const { iconBg, iconColor } = iconColors[i % iconColors.length]
                        return (
                            <div
                                key={r.id}
                                onClick={() => navigate(`/assignment-rules/${r.id}`)}
                                className="bg-white border border-gray-200 rounded-2xl px-6 py-8 flex items-start justify-between gap-4 cursor-pointer hover:border-[#0A86F5] hover:shadow-sm transition-all">
                                <div className="flex items-start gap-4 flex-1 min-w-0">
                                    <div className={`w-12 h-12 rounded-[8px] flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={iconColor}>
                                            <rect x="3" y="3" width="8" height="8" rx="1" fill="currentColor" opacity="0.8" />
                                            <rect x="13" y="3" width="8" height="8" rx="1" fill="currentColor" />
                                            <rect x="3" y="13" width="8" height="8" rx="1" fill="currentColor" />
                                            <rect x="13" y="13" width="8" height="8" rx="1" fill="currentColor" opacity="0.5" />
                                        </svg>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-base font-normal text-black">{r.name}</p>
                                        <p className="text-sm text-gray-500 mt-0.5">{r.description ?? ''}</p>
                                        <div className="flex flex-wrap gap-4 mt-2">
                                            {((r.keywords as string[]) ?? []).map((k) => (
                                                <span key={k} className="text-xs text-gray-400 font-mono">
                                                    {k}
                                                </span>
                                            ))}
                                        </div>
                                        <p className="text-sm mt-1">
                                            Assign to: <span className="text-[#0A86F5] font-medium">{r.team_name ?? '—'}</span>{' '}
                                            <span className="text-gray-500">{r.tickets_assigned} tickets assigned</span>
                                        </p>
                                    </div>
                                </div>
                                <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-3 flex-shrink-0">
                                    <Toggle value={r.isActive ?? r.is_active ?? false} onChange={(v) => toggle({ id: r.id, isActive: v })} />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setEditRule(r)
                                        }}
                                        className="p-1 hover:text-[#0A86F5] text-gray-400 transition-colors">
                                        <SlidersHorizontal size={16} className="text-gray-400" />
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <CreateRuleModal open={createOpen} onClose={() => setCreateOpen(false)} />
            <EditRuleModal rule={editRule} onClose={() => setEditRule(null)} />
        </>
    )
}