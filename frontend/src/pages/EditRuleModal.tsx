import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { updateAssignmentRule } from '../services/assignment'
import { getTeams } from '../services/teams'
import toast from 'react-hot-toast'

interface Props {
    rule: any | null
    onClose: () => void
}

export default function EditRuleModal({ rule, onClose }: Props) {
    const qc = useQueryClient()
    const [form, setForm] = useState({ name: '', keywords: '', teamId: '' })

    useEffect(() => {
        if (rule) {
            setForm({
                name: rule.name ?? '',
                keywords: (rule.keywords as string[])?.join(', ') ?? '',
                teamId: rule.team_id ? String(rule.team_id) : (rule.teamId ? String(rule.teamId) : '')
            })
        }
    }, [rule])

    const { data: teams = [] } = useQuery({
        queryKey: ['teams'],
        queryFn: getTeams,
    })

    const { mutate, isPending } = useMutation({
        mutationFn: () =>
            updateAssignmentRule(rule?.id, {
                name: form.name,
                keywords: form.keywords.split(',').map((k) => k.trim()).filter(Boolean),
                teamId: Number(form.teamId),
            }),
        onSuccess: () => {
            toast.success('Rule updated successfully!')
            qc.invalidateQueries({ queryKey: ['assignment-rules'] })
            onClose()
        },
        onError: () => toast.error('Failed to update rule'),
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.name || !form.keywords || !form.teamId) {
            return toast.error('Fill in all fields')
        }
        mutate()
    }

    return (
        <AnimatePresence>
            {rule && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4"
                    onClick={onClose}
                >
                    <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }} transition={{ type: 'spring', duration: 0.4 }}
                        className="bg-white dark:bg-gray-900 border border-transparent dark:border-gray-800 rounded-2xl w-full max-w-md shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Edit Assignment Rule
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Rule Name
                                </label>
                                <input
                                    value={form.name}
                                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                                    placeholder="e.g. Billing Issue → Finance Team"
                                    className="h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-100 text-sm outline-none focus:border-[#00b67a] focus:ring-2 focus:ring-[#00b67a]/20 transition-all placeholder:text-gray-400"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Keywords (comma separated)
                                </label>
                                <input
                                    value={form.keywords}
                                    onChange={(e) => setForm((p) => ({ ...p, keywords: e.target.value }))}
                                    placeholder="billing, invoice, payment"
                                    className="h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-100 text-sm outline-none focus:border-[#00b67a] focus:ring-2 focus:ring-[#00b67a]/20 transition-all placeholder:text-gray-400"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Assign to Team
                                </label>
                                <select
                                    value={form.teamId}
                                    onChange={(e) => setForm((p) => ({ ...p, teamId: e.target.value }))}
                                    className="h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm outline-none focus:border-[#00b67a]"
                                >
                                    <option value="">Select team...</option>
                                    {(teams as any[]).map((t: any) => (
                                        <option key={t.id} value={t.id}>
                                            {t.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-3 mt-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 h-10 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="flex-1 h-10 bg-[#00b67a] hover:bg-[#00a36c] disabled:opacity-60 text-white font-medium rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                                >
                                    {isPending ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}