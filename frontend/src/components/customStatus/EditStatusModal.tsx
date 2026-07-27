import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'

const colorPresets = ['#ef4444', '#f59e0b', '#6366f1', '#6b7280', '#00b67a', '#3b82f6', '#ec4899', '#8b5cf6']

interface Status { id: number; label: string; color: string; description: string; isActive: boolean }
interface Props {
    status: Status | null
    onClose: () => void
    onEdit: (data: { label: string; color: string; description: string }) => void
}

export default function EditStatusModal({ status, onClose, onEdit }: Props) {
    const [form, setForm] = useState({ label: '', color: '#6366f1', description: '' })

    useEffect(() => {
        if (status) setForm({ label: status.label, color: status.color, description: status.description })
    }, [status])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.label) return toast.error('Enter a status name')
        onEdit(form)
        toast.success('Status updated!')
    }

    return (
        <AnimatePresence>
            {status && (
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
                            <h2 className="text-lg font-semibold text-gray-900">Edit Status</h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Status Name</label>
                                <input value={form.label}
                                    onChange={(e) => setForm(p => ({ ...p, label: e.target.value }))}
                                    className="h-10 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#00b67a] focus:ring-2 focus:ring-[#00b67a]/20 transition-all"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Description</label>
                                <input value={form.description}
                                    onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
                                    className="h-10 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#00b67a] focus:ring-2 focus:ring-[#00b67a]/20 transition-all"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Color</label>
                                <div className="flex items-center gap-3 flex-wrap">
                                    {colorPresets.map((c) => (
                                        <button key={c} type="button"
                                            onClick={() => setForm(p => ({ ...p, color: c }))}
                                            className={`w-7 h-7 rounded-full transition-transform ${form.color === c ? 'scale-125 ring-2 ring-offset-2' : 'hover:scale-110'}`}
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                    <input type="color" value={form.color}
                                        onChange={(e) => setForm(p => ({ ...p, color: e.target.value }))}
                                        className="w-7 h-7 rounded-full cursor-pointer border-0 p-0 bg-transparent"
                                    />
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-xs font-medium px-3 py-1 rounded-full"
                                        style={{ backgroundColor: `${form.color}18`, color: form.color }}
                                    >
                                        ● {form.label || 'Preview'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-2">
                                <button type="button" onClick={onClose}
                                    className="flex-1 h-10 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                                >Cancel</button>
                                <button type="submit"
                                    className="flex-1 h-10 bg-[#00b67a] hover:bg-[#00a36c] text-white font-medium rounded-lg text-sm transition-colors"
                                >Save Changes</button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}