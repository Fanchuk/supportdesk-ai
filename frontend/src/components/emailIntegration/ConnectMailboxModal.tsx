import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
    open: boolean
    onClose: () => void
    onCreate: (data: { email: string; provider: string; host: string; port: number; login: string }) => void
}

export default function ConnectMailboxModal({ open, onClose, onCreate }: Props) {
    const [showPassword, setShowPassword] = useState(false)
    const [form, setForm] = useState({
        email: '', provider: 'Gmail', host: 'imap.gmail.com', port: '993', login: '', password: '',
    })

    const providerDefaults: Record<string, { host: string; port: string }> = {
        Gmail: { host: 'imap.gmail.com', port: '993' },
        Outlook: { host: 'outlook.office365.com', port: '993' },
        SMTP: { host: '', port: '587' },
    }

    const handleProviderChange = (provider: string) => {
        setForm(p => ({ ...p, provider, ...providerDefaults[provider] }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.email || !form.host || !form.port || !form.login || !form.password)
            return toast.error('Fill in all fields')
        onCreate({ email: form.email, provider: form.provider, host: form.host, port: Number(form.port), login: form.login })
        toast.success('Mailbox connected!')
        setForm({ email: '', provider: 'Gmail', host: 'imap.gmail.com', port: '993', login: '', password: '' })
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
                            <h2 className="text-lg font-semibold text-gray-900">Connect Mailbox</h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Provider</label>
                                <div className="flex gap-2">
                                    {['Gmail', 'Outlook', 'SMTP'].map(p => (
                                        <button key={p} type="button"
                                            onClick={() => handleProviderChange(p)}
                                            className={`flex-1 h-10 rounded-lg border text-sm font-medium transition-colors ${
                                                form.provider === p
                                                    ? 'border-[#0A86F5] bg-[rgba(10,134,245,0.06)] text-[#0A86F5]'
                                                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                            }`}
                                        >{p}</button>
                                    ))}
                                </div>
                            </div>

                            {[
                                { label: 'Email Address', key: 'email', placeholder: 'support@company.com', type: 'email' },
                                { label: 'IMAP Host', key: 'host', placeholder: 'imap.gmail.com', type: 'text' },
                                { label: 'Port', key: 'port', placeholder: '993', type: 'number' },
                                { label: 'Login', key: 'login', placeholder: 'your@email.com', type: 'text' },
                            ].map(({ label, key, placeholder, type }) => (
                                <div key={key} className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-gray-700">{label}</label>
                                    <input type={type} placeholder={placeholder}
                                        value={form[key as keyof typeof form]}
                                        onChange={(e) => setForm(p => ({ ...p, [key]: e.target.value }))}
                                        className="h-10 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0A86F5] focus:ring-2 focus:ring-[#0A86F5]/20 transition-all placeholder:text-gray-400"
                                    />
                                </div>
                            ))}

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Password / App Password</label>
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
                                >Connect</button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}