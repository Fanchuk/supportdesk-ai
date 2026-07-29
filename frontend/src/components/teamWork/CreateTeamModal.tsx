import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
    open: boolean
    onClose: () => void
    onCreate: (data: { name: string; description: string }) => void
}

export default function CreateTeamModal({ open, onClose, onCreate }: Props) {
    const [form, setForm] = useState({ name: '', description: '' })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.name) return toast.error('Enter a team name')
        onCreate(form)
        toast.success('Team created!')
        setForm({ name: '', description: '' })
        onClose()
    }

    return (
        <AnimatePresence>
            {open && (
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
                            <h2 className="text-lg font-semibold text-gray-900">Create Team</h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Team Name</label>
                                <input value={form.name}
                                    onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                                    placeholder="e.g. Engineering Team"
                                    className="h-10 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0A86F5] focus:ring-2 focus:ring-[#0A86F5]/20 transition-all placeholder:text-gray-400"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Description</label>
                                <input value={form.description}
                                    onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
                                    placeholder="Optional description"
                                    className="h-10 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0A86F5] focus:ring-2 focus:ring-[#0A86F5]/20 transition-all placeholder:text-gray-400"
                                />
                            </div>
                            <div className="flex gap-3 mt-2">
                                <button type="button" onClick={onClose}
                                    className="flex-1 h-10 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                                >Cancel</button>
                                <button type="submit"
                                    className="flex-1 h-10 bg-[#0A86F5] hover:bg-[#0875d4] text-white font-medium rounded-lg text-sm transition-colors"
                                >Create Team</button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}