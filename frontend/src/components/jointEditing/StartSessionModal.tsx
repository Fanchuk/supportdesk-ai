import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createJointSession } from '../../services/jointSessions'
import { getTickets } from '../../services/tickets'
import toast from 'react-hot-toast'
import Spinner from '../ui/Spinner'

interface Props { open: boolean; onClose: () => void }

export default function StartSessionModal({ open, onClose }: Props) {
    const qc = useQueryClient()
    const [ticketId, setTicketId] = useState<number | ''>('')

    const { data: tickets = [], isLoading } = useQuery({
        queryKey: ['tickets'],
        queryFn: () => getTickets(),
        enabled: open,
    })

    const { mutate, isPending } = useMutation({
        mutationFn: () => createJointSession(Number(ticketId)),
        onSuccess: () => {
            toast.success('Session started!')
            qc.invalidateQueries({ queryKey: ['joint-sessions'] })
            qc.invalidateQueries({ queryKey: ['joint-stats'] })
            setTicketId('')
            onClose()
        },
        onError: () => toast.error('Failed to start session'),
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!ticketId) return toast.error('Select a ticket')
        mutate()
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
                            <h2 className="text-lg font-semibold text-gray-900">Start Joint Session</h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Select Ticket</label>
                                {isLoading ? <Spinner size="lg" /> : (
                                    <select value={ticketId}
                                        onChange={(e) => setTicketId(Number(e.target.value))}
                                        className="h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:border-[#0A86F5] transition-all"
                                    >
                                        <option value="">Select ticket...</option>
                                        {(tickets as any[]).map((t: any) => (
                                            <option key={t.id} value={t.id}>#{t.id} {t.title}</option>
                                        ))}
                                    </select>
                                )}
                            </div>
                            <div className="flex gap-3 mt-2">
                                <button type="button" onClick={onClose}
                                    className="flex-1 h-10 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                                >Cancel</button>
                                <button type="submit" disabled={isPending || !ticketId}
                                    className="flex-1 h-10 bg-[#0A86F5] hover:bg-[#0875d4] disabled:opacity-50 text-white font-medium rounded-lg text-sm transition-colors"
                                >{isPending ? 'Starting...' : 'Start Session'}</button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}