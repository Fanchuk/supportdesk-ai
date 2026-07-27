import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateSlaPolicy } from '../services/sla'
import toast from 'react-hot-toast'

export default function EditPolicyModal({ policy, onClose }: { policy: any | null; onClose: () => void }) {
    const qc = useQueryClient()
    const [form, setForm] = useState({ name: '', priority: '', firstResponseHours: '', resolutionHours: '' })

    useEffect(() => {
        if (policy) setForm({
            name: policy.name ?? '',
            priority: policy.priority ?? '',
            firstResponseHours: String(policy.firstResponseHours ?? policy.first_response_hours ?? ''),
            resolutionHours: String(policy.resolutionHours ?? policy.resolution_hours ?? ''),
        })
    }, [policy])

    const { mutate, isPending } = useMutation({
        mutationFn: () => updateSlaPolicy(policy.id, {
            name: form.name,
            priority: form.priority,
            firstResponseHours: Number(form.firstResponseHours),
            resolutionHours: Number(form.resolutionHours),
        } as any),
        onSuccess: () => {
            toast.success('Policy updated!')
            qc.invalidateQueries({ queryKey: ['sla-policies'] })
            onClose()
        },
        onError: () => toast.error('Failed to update policy'),
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.name || !form.priority || !form.firstResponseHours || !form.resolutionHours)
            return toast.error('Fill in all fields')
        mutate()
    }

    return (
        <AnimatePresence>
            {policy && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4"
                    onClick={onClose}
                >
                    <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 20 }} transition={{ type: 'spring', duration: 0.4 }}
                        className="bg-white rounded-2xl w-full max-w-md shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900">Edit SLA Policy</h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                            {[
                                { label: 'Policy Name', key: 'name', type: 'text' },
                                { label: 'First Response (hours)', key: 'firstResponseHours', type: 'number' },
                                { label: 'Resolution Time (hours)', key: 'resolutionHours', type: 'number' },
                            ].map(({ label, key, type }) => (
                                <div key={key} className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-gray-700">{label}</label>
                                    <input type={type}
                                        value={form[key as keyof typeof form]}
                                        onChange={(e) => setForm(p => ({ ...p, [key]: e.target.value }))}
                                        className="h-10 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#00b67a] focus:ring-2 focus:ring-[#00b67a]/20 transition-all"
                                    />
                                </div>
                            ))}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Priority</label>
                                <select value={form.priority} onChange={(e) => setForm(p => ({ ...p, priority: e.target.value }))}
                                    className="h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:border-[#00b67a]"
                                >
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                </select>
                            </div>
                            <div className="flex gap-3 mt-2">
                                <button type="button" onClick={onClose}
                                    className="flex-1 h-10 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                                >Cancel</button>
                                <button type="submit" disabled={isPending}
                                    className="flex-1 h-10 bg-[#00b67a] hover:bg-[#00a36c] disabled:opacity-60 text-white font-medium rounded-lg text-sm transition-colors"
                                >{isPending ? 'Saving...' : 'Save Changes'}</button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}