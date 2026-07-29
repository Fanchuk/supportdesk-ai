import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'

interface Answer { id: number; title: string; category: string; body: string }
interface Props {
    answer: Answer | null
    onClose: () => void
    onEdit: (data: { title: string; category: string; body: string }) => void
    categories: string[]
}

export default function EditAnswerModal({ answer, onClose, onEdit, categories }: Props) {
    const [form, setForm] = useState({ title: '', category: '', body: '' })

    useEffect(() => {
        if (answer) setForm({ title: answer.title, category: answer.category, body: answer.body })
    }, [answer])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.title || !form.category || !form.body) return toast.error('Fill in all fields')
        onEdit(form)
        toast.success('Answer updated!')
    }

    return (
        <AnimatePresence>
            {answer && (
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
                            <h2 className="text-lg font-semibold text-gray-900">Edit Answer</h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Title</label>
                                <input value={form.title}
                                    onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
                                    className="h-10 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0A86F5] focus:ring-2 focus:ring-[#0A86F5]/20 transition-all"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Category</label>
                                <select value={form.category}
                                    onChange={(e) => setForm(p => ({ ...p, category: e.target.value }))}
                                    className="h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:border-[#0A86F5] transition-all"
                                >
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Answer Text</label>
                                <textarea value={form.body}
                                    onChange={(e) => setForm(p => ({ ...p, body: e.target.value }))}
                                    rows={5}
                                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0A86F5] focus:ring-2 focus:ring-[#0A86F5]/20 transition-all resize-none"
                                />
                            </div>
                            <div className="flex gap-3 mt-2">
                                <button type="button" onClick={onClose}
                                    className="flex-1 h-10 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                                >Cancel</button>
                                <button type="submit"
                                    className="flex-1 h-10 bg-[#0A86F5] hover:bg-[#0875d4] text-white font-medium rounded-lg text-sm transition-colors"
                                >Save Changes</button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}