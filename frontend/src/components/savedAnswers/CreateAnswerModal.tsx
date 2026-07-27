import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
    open: boolean
    onClose: () => void
    onCreate: (data: { title: string; category: string; body: string }) => void
    categories: string[]
}

export default function CreateAnswerModal({ open, onClose, onCreate, categories }: Props) {
    const [form, setForm] = useState({ title: '', category: '', body: '' })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.title || !form.category || !form.body) return toast.error('Fill in all fields')
        onCreate(form)
        toast.success('Answer created!')
        setForm({ title: '', category: '', body: '' })
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
                            <h2 className="text-lg font-semibold text-gray-900">New Saved Answer</h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Title</label>
                                <input value={form.title}
                                    onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
                                    placeholder="e.g. Welcome Greeting"
                                    className="h-10 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#00b67a] focus:ring-2 focus:ring-[#00b67a]/20 transition-all placeholder:text-gray-400"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Category</label>
                                <select value={form.category}
                                    onChange={(e) => setForm(p => ({ ...p, category: e.target.value }))}
                                    className="h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:border-[#00b67a] transition-all"
                                >
                                    <option value="">Select category...</option>
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Answer Text</label>
                                <textarea value={form.body}
                                    onChange={(e) => setForm(p => ({ ...p, body: e.target.value }))}
                                    placeholder="Type your reusable answer here..."
                                    rows={5}
                                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#00b67a] focus:ring-2 focus:ring-[#00b67a]/20 transition-all placeholder:text-gray-400 resize-none"
                                />
                            </div>
                            <div className="flex gap-3 mt-2">
                                <button type="button" onClick={onClose}
                                    className="flex-1 h-10 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                                >Cancel</button>
                                <button type="submit"
                                    className="flex-1 h-10 bg-[#00b67a] hover:bg-[#00a36c] text-white font-medium rounded-lg text-sm transition-colors"
                                >Create Answer</button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}