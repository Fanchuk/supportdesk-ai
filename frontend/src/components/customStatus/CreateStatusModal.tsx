import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'

const colorPresets = ['#ef4444', '#F5A933', '#6366f1', '#6b7280', '#47DEDE', '#0A86F5', '#ec4899', '#8b5cf6']

interface Props {
    open: boolean
    onClose: () => void
    onCreate: (data: { label: string; color: string; description: string }) => void
}

export default function CreateStatusModal({ open, onClose, onCreate }: Props) {
    const [form, setForm] = useState({ label: '', color: '#6366f1', description: '' })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.label) return toast.error('Enter a status name')
        onCreate(form)
        toast.success('Status created!')
        setForm({ label: '', color: '#6366f1', description: '' })
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
                            <h2 className="text-lg font-semibold text-gray-900">Create Custom Status</h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Status Name</label>
                                <input value={form.label}
                                    onChange={(e) => setForm(p => ({ ...p, label: e.target.value }))}
                                    placeholder="e.g. Waiting for Customer"
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

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Color</label>
                                <div className="flex items-center gap-3 flex-wrap">
                                    {colorPresets.map((c) => (
                                        <button key={c} type="button"
                                            onClick={() => setForm(p => ({ ...p, color: c }))}
                                            className={`w-7 h-7 rounded-full transition-transform ${form.color === c ? 'scale-125 ring-2 ring-offset-2' : 'hover:scale-110'}`}
                                            style={{ backgroundColor: c, ringColor: c }}
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
                                    className="flex-1 h-10 bg-[#0A86F5] hover:bg-[#0875d4] text-white font-medium rounded-lg text-sm transition-colors"
                                >Create Status</button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}