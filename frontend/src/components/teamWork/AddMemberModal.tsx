import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getUsers } from '../../services/teams'
import toast from 'react-hot-toast'
import Spinner from '../ui/Spinner'

interface Props {
    open: boolean
    teamName: string
    teamId: number | null
    onClose: () => void
    onAdd: (userId: number) => void
}

const roleStyle: Record<string, string> = {
    admin: 'bg-red-50 text-red-500',
    manager: 'bg-[rgba(79,70,229,0.08)] text-[#4f46e5]',
    agent: 'bg-[rgba(10,134,245,0.08)] text-[#0A86F5]',
}

export default function AddMemberModal({ open, teamName, teamId, onClose, onAdd }: Props) {
    const [selected, setSelected] = useState<number | null>(null)

    const { data: users = [], isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: getUsers,
        enabled: open,
    })

    const available = (users as any[]).filter(u => u.team_id !== teamId)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!selected) return toast.error('Select a member')
        onAdd(selected)
        setSelected(null)
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
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Add Member</h2>
                                <p className="text-sm text-gray-400 mt-0.5">to {teamName}</p>
                            </div>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                            {isLoading ? (
                                <div className="flex justify-center py-8"><Spinner size="lg" /></div>
                            ) : (
                                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
                                    {available.length === 0 ? (
                                        <p className="text-sm text-gray-400 text-center py-8">No available users</p>
                                    ) : (
                                        available.map((u: any) => (
                                            <div key={u.id} onClick={() => setSelected(u.id)}
                                                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                                                    selected === u.id
                                                        ? 'border-[#0A86F5] bg-[rgba(10,134,245,0.04)]'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-[rgba(10,134,245,0.1)] flex items-center justify-center text-[#0A86F5] font-semibold text-xs">
                                                        {u.name?.slice(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-[#202020]">{u.name}</p>
                                                        <p className="text-xs text-gray-400">{u.email}</p>
                                                    </div>
                                                </div>
                                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${roleStyle[u.role]}`}>
                                                    {u.role}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                            <div className="flex gap-3 mt-2">
                                <button type="button" onClick={onClose}
                                    className="flex-1 h-10 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                                >Cancel</button>
                                <button type="submit" disabled={!selected}
                                    className="flex-1 h-10 bg-[#0A86F5] hover:bg-[#0875d4] disabled:opacity-50 text-white font-medium rounded-lg text-sm transition-colors"
                                >Add Member</button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}