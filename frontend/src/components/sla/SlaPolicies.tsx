import { useState } from 'react'
import { Plus, SlidersHorizontal, Shield } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSlaPolicies, updateSlaPolicy } from '../../services/sla'
import Spinner from '../ui/Spinner'
import CreatePolicyModal from '../../pages/CreatePolicyModal'
import EditPolicyModal from '../../pages/EditPolicyModal'

const priorityStyle: Record<string, string> = {
    high: 'bg-red-50 text-red-500',
    medium: 'bg-yellow-50 text-yellow-600',
    low: 'bg-green-50 text-green-600',
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
    return (
        <button onClick={() => onChange(!value)}
            className={`w-12 h-6 rounded-full relative transition-colors ${value ? 'bg-[#00b67a]' : 'bg-gray-200'}`}
        >
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${value ? 'left-7' : 'left-1'}`} />
        </button>
    )
}

export default function SlaPolicies() {
    const qc = useQueryClient()
    const [createOpen, setCreateOpen] = useState(false)
    const [editPolicy, setEditPolicy] = useState<any | null>(null)

    const { data, isLoading } = useQuery({
        queryKey: ['sla-policies'],
        queryFn: getSlaPolicies
    })

    const { mutate: toggle } = useMutation({
        mutationFn: ({id,  isActive }: { id: number; isActive: boolean }) =>
            updateSlaPolicy(id, { isActive }),
        onMutate: async ({ id, isActive }) => {
            await qc.cancelQueries({ queryKey: ['sla-policies'] })
            const previous = qc.getQueryData(['sla-policies'])

            qc.setQueryData(['sla-policies'], (old: any[]) =>
            old.map((p) => p.id === id ? { ...p, isActive } : p)
        )

        return { previous }
        },
        onError: (_err, _vars, ctx) =>
            qc.setQueryData(['sla-policies'], ctx?.previous),
        onSettled: () => qc.invalidateQueries({ queryKey: ['sla-policies'] })
    })

    if (isLoading) return <div className="flex justify-center py-8"><Spinner size="lg" /></div>

    return (
        <>
            <div>
                <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                    <div>
                        <h2 className="text-[22px] font-medium text-[#212b36]">SLA Policies</h2>
                        <p className="text-base text-[#3a4452]">Define response and resolution time targets by priority</p>
                    </div>
                    <button onClick={() => setCreateOpen(true)}
                        className="flex items-center gap-2 bg-[#00b67a] text-white text-sm font-medium px-4 h-10 rounded-lg hover:bg-[#00a36c] transition-colors"
                    >
                        <Plus size={16} /> New Policy
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    {(data as any[]).map((p) => (
                        <div key={p.id}
                            onClick={() => setEditPolicy(p)}
                            className="bg-white border border-gray-200 rounded-2xl px-6 py-6 flex items-center justify-between gap-4 cursor-pointer hover:border-[#00b67a] hover:shadow-sm transition-all"
                        >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div className="w-12 h-12 rounded-[8px] bg-[rgba(0,182,122,0.1)] flex items-center justify-center flex-shrink-0">
                                    <Shield size={20} className="text-[#00b67a]" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="text-base font-medium text-black">{p.name}</p>
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priorityStyle[p.priority]}`}>
                                            {p.priority}
                                        </span>
                                    </div>
                                    <div className="flex gap-6 mt-2 text-sm text-gray-500">
                                        <span>First response: <span className="font-medium text-[#202020]">{p.firstResponseHours ?? p.first_response_hours}h</span></span>
                                        <span>Resolution: <span className="font-medium text-[#202020]">{p.resolutionHours ?? p.resolution_hours}h</span></span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                <Toggle value={p.isActive ?? p.is_active ?? false} onChange={(v) => toggle({ id: p.id, isActive: v })} />
                                <button onClick={(e) => { e.stopPropagation(); setEditPolicy(p) }}
                                    className="p-1 text-gray-400 hover:text-[#00b67a] transition-colors"
                                >
                                    <SlidersHorizontal size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <CreatePolicyModal open={createOpen} onClose={() => setCreateOpen(false)} />
            <EditPolicyModal policy={editPolicy} onClose={() => setEditPolicy(null)} />
        </>
    )
}