import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

interface Mailbox { id: number; email: string; provider: string; host: string; port: number }
interface Props {
    mailbox: Mailbox | null
    onClose: () => void
    onEdit: (data: { email: string; provider: string; host: string; port: number }) => void
}

export default function EditMailboxModal({ mailbox, onClose, onEdit }: Props) {
    const [showPassword, setShowPassword] = useState(false)
    const [form, setForm] = useState({ email: '', provider: '', host: '', port: '', password: '' })

    useEffect(() => {
        if (mailbox) setForm({
            email: mailbox.email,
            provider: mailbox.provider,
            host: mailbox.host,
            port: String(mailbox.port),
            password: '',
        })
    }, [mailbox])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.email || !form.host || !form.port) return toast.error('Fill in all fields')
        onEdit({ email: form.email, provider: form.provider, host: form.host, port: Number(form.port) })
        toast.success('Mailbox updated!')
    }

    return (
        <AnimatePresence>
            {mailbox && (
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
                            <h2 className="text-lg font-semibold text-gray-900">Edit Mailbox</h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                            {[
                                { label: 'Email Address', key: 'email', type: 'email' },
                                { label: 'Provider', key: 'provider', type: 'text' },
                                { label: 'IMAP Host', key: 'host', type: 'text' },
                                { label: 'Port', key: 'port', type: 'number' },
                            ].map(({ label, key, type }) => (
                                <div key={key} className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-gray-700">{label}</label>
                                    <input type={type}
                                        value={form[key as keyof typeof form]}
                                        onChange={(e) => setForm(p => ({ ...p, [key]: e.target.value }))}
                                        className="h-10 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0A86F5] focus:ring-2 focus:ring-[#0A86F5]/20 transition-all"
                                    />
                                </div>
                            ))}

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">New Password (leave blank to keep)</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={form.password}
                                        onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
                                        className="w-full h-10 px-3 pr-10 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0A86F5] focus:ring-2 focus:ring-[#0A86F5]/20 transition-all placeholder:text-gray-400"
                                    />
                                    <button type="button"
                                        onClick={() => setShowPassword(p => !p)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
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