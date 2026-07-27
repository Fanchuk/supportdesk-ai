import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAutomationRule } from '../services/automation'
import toast from 'react-hot-toast'

interface Props {
    open: boolean
    onClose: () => void
}

export default function CreateAutomationModal({ open, onClose }: Props) {
    const qc = useQueryClient()
    const [form, setForm] = useState({ name: '', description: '', trigger: '', action: '', conditionHours: '' })

    const { mutate, isPending } = useMutation({
        mutationFn: () =>
            createAutomationRule({
                name: form.name,
                description: form.description || undefined,
                trigger: form.trigger as any,
                action: form.action as any,
                conditionHours: form.conditionHours ? Number(form.conditionHours) : undefined,
            }),
        onSuccess: () => {
            toast.success('Automation created!')
            qc.invalidateQueries({ queryKey: ['automation-rules'] })
            setForm({ name: '', description: '', trigger: '', action: '', conditionHours: '' })
            onClose()
        },
        onError: () => toast.error('Failed to create automation'),
    })

     const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.name || !form.trigger || !form.action) return toast.error('Fill in all required fields')
        mutate()
    }

    return (
        <AnimatePresence>
            {open && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4"
                    onClick={onClose}>
                    <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }} transition={{ type: 'spring', duration: 0.4 }}
                        className="bg-white dark:bg-gray-900 border border-transparent dark:border-gray-800 rounded-2xl w-full max-w-md shadow-2xl"
                        onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Create Automation</h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                                <input
                                    value={form.name}
                                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                                    placeholder="e.g. Auto-Close Resolved Tickets"
                                    className="h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-100 text-sm outline-none focus:border-[#00b67a] focus:ring-2 focus:ring-[#00b67a]/20 transition-all placeholder:text-gray-400"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                                <input
                                    value={form.description}
                                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                                    placeholder="Optional description"
                                    className="h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-100 text-sm outline-none focus:border-[#00b67a] focus:ring-2 focus:ring-[#00b67a]/20 transition-all placeholder:text-gray-400"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Trigger</label>
                                <select
                                    value={form.trigger}
                                    onChange={(e) => setForm((p) => ({ ...p, trigger: e.target.value }))}
                                    className="h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm outline-none focus:border-[#00b67a]">
                                    <option value="">Select trigger...</option>
                                    <option value="new_ticket">New Ticket</option>
                                    <option value="time_based">Time Based</option>
                                    <option value="status_change">Status Change</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Action</label>
                                <select
                                    value={form.action}
                                    onChange={(e) => setForm((p) => ({ ...p, action: e.target.value }))}
                                    className="h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm outline-none focus:border-[#00b67a]">
                                    <option value="">Select action...</option>
                                    <option value="close_ticket">Close Ticket</option>
                                    <option value="send_email">Send Email</option>
                                    <option value="change_priority">Change Priority</option>
                                    <option value="reassign">Reassign</option>
                                </select>
                            </div>

                            {form.trigger === 'time_based' && (
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Condition Hours</label>
                                    <input
                                        type="number"
                                        value={form.conditionHours}
                                        onChange={(e) => setForm((p) => ({ ...p, conditionHours: e.target.value }))}
                                        placeholder="e.g. 4"
                                        className="h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-100 text-sm outline-none focus:border-[#00b67a] focus:ring-2 focus:ring-[#00b67a]/20 transition-all placeholder:text-gray-400"
                                    />
                                </div>
                            )}

                            <div className="flex gap-3 mt-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 h-10 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="flex-1 h-10 bg-[#00b67a] hover:bg-[#00a36c] disabled:opacity-60 text-white font-medium rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
                                    {isPending ? 'Creating...' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}