import { useState } from 'react'
import { Plus, SlidersHorizontal, Trash2 } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCustomStatuses, createCustomStatus, updateCustomStatus, deleteCustomStatus } from '../../services/customStatuses'
import Spinner from '../ui/Spinner'
import CreateStatusModal from './CreateStatusModal'
import EditStatusModal from './EditStatusModal'
import toast from 'react-hot-toast'

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
    return (
        <button onClick={() => onChange(!value)}
            className={`w-12 h-6 rounded-full relative transition-colors ${value ? 'bg-[#0A86F5]' : 'bg-gray-200'}`}
        >
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${value ? 'left-7' : 'left-1'}`} />
        </button>
    )
}

export default function CustomStatuses() {
    const qc = useQueryClient()
    const [createOpen, setCreateOpen] = useState(false)
    const [editStatus, setEditStatus] = useState<any | null>(null)

    const { data = [], isLoading } = useQuery({
        queryKey: ['custom-statuses'],
        queryFn: getCustomStatuses,
    })

    const { mutate: toggle } = useMutation({
        mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
            updateCustomStatus(id, { isActive }),
        onMutate: async ({ id, isActive }) => {
            await qc.cancelQueries({ queryKey: ['custom-statuses'] })
            const previous = qc.getQueryData(['custom-statuses'])
            qc.setQueryData(['custom-statuses'], (old: any[]) =>
                old.map(s => s.id === id ? { ...s, isActive, is_active: isActive } : s)
            )
            return { previous }
        },
        onError: (_err, _vars, ctx) => qc.setQueryData(['custom-statuses'], ctx?.previous),
        onSettled: () => qc.invalidateQueries({ queryKey: ['custom-statuses'] }),
    })

    const { mutate: remove } = useMutation({
        mutationFn: (id: number) => deleteCustomStatus(id),
        onSuccess: () => {
            toast.success('Status deleted')
            qc.invalidateQueries({ queryKey: ['custom-statuses'] })
        },
        onError: () => toast.error('Failed to delete'),
    })

    const { mutate: create } = useMutation({
        mutationFn: (data: { label: string; color: string; description: string }) =>
            createCustomStatus(data),
        onSuccess: () => {
            toast.success('Status created!')
            qc.invalidateQueries({ queryKey: ['custom-statuses'] })
        },
        onError: () => toast.error('Failed to create'),
    })

    const { mutate: edit } = useMutation({
        mutationFn: (data: { label: string; color: string; description: string }) =>
            updateCustomStatus(editStatus?.id, data),
        onSuccess: () => {
            toast.success('Status updated!')
            qc.invalidateQueries({ queryKey: ['custom-statuses'] })
            setEditStatus(null)
        },
        onError: () => toast.error('Failed to update'),
    })

    if (isLoading) return <div className="flex justify-center py-8"><Spinner size="lg" /></div>

    return (
        <>
            <div>
                <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                    <div>
                        <h2 className="text-[22px] font-medium text-[#212b36]">Custom Statuses</h2>
                        <p className="text-base text-[#3a4452]">Define additional statuses for your workflow</p>
                    </div>
                    <button onClick={() => setCreateOpen(true)}
                        className="flex items-center gap-2 bg-[#0A86F5] hover:bg-[#0875d4] text-white text-sm font-medium px-4 h-10 rounded-lg transition-colors"
                    >
                        <Plus size={16} /> Create Status
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    {(data as any[]).map((s) => (
                        <div key={s.id}
                            onClick={() => setEditStatus(s)}
                            className="bg-white border border-gray-200 rounded-2xl px-6 py-5 flex items-center justify-between gap-4 cursor-pointer hover:border-[#0A86F5] hover:shadow-sm transition-all"
                        >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div className="w-12 h-12 rounded-[8px] flex items-center justify-center flex-shrink-0"
                                    style={{ backgroundColor: `${s.color}18` }}
                                >
                                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: s.color }} />
                                </div>
                                <div className="min-w-0">
                                    <span className="text-xs font-medium px-3 py-1 rounded-full"
                                        style={{ backgroundColor: `${s.color}18`, color: s.color }}
                                    >
                                        ● {s.label}
                                    </span>
                                    <p className="text-sm text-gray-500 mt-1">{s.description ?? ''}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                <Toggle
                                    value={s.isActive ?? s.is_active ?? false}
                                    onChange={(v) => toggle({ id: s.id, isActive: v })}
                                />
                                <button onClick={(e) => { e.stopPropagation(); setEditStatus(s) }}
                                    className="p-1 text-gray-400 hover:text-[#0A86F5] transition-colors"
                                >
                                    <SlidersHorizontal size={16} />
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); remove(s.id) }}
                                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {(data as any[]).length === 0 && (
                        <div className="bg-white border border-dashed border-gray-200 rounded-2xl px-6 py-16 text-center">
                            <p className="text-sm text-gray-400">No custom statuses yet. Create your first one.</p>
                        </div>
                    )}
                </div>
            </div>

            <CreateStatusModal open={createOpen} onClose={() => setCreateOpen(false)} onCreate={create} />
            <EditStatusModal status={editStatus} onClose={() => setEditStatus(null)} onEdit={edit} />
        </>
    )
}