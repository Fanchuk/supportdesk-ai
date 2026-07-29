import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Users, Ticket, Clock } from 'lucide-react'

interface Props {
    team: any | null
    onClose: () => void
}

export default function TeamDetailModal({ team, onClose }: Props) {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [onClose])

    return (
        <AnimatePresence>
            {team && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center px-4"
                    onClick={onClose}>
                    <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }} transition={{ type: 'spring', duration: 0.4 }}
                        className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl"
                        onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[rgba(10,134,245,0.1)] flex items-center justify-center">
                                    <Users size={18} className="text-[#0A86F5]" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Team</p>
                                    <p className="text-lg font-semibold text-[#202020]">{team.name}</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                                <X size={20} />
                            </button>
                        </div>

                        {team.description && <p className="text-sm text-gray-500 mb-6">{team.description}</p>}

                        <div className="flex flex-col gap-3">
                            {[
                                { icon: Users, label: 'Members', value: team.members_count ?? '—' },
                                { icon: Ticket, label: 'Active Tickets', value: team.active_tickets ?? '—' },
                                { icon: Clock, label: 'Avg Response Time', value: team.avg_response_hours != null ? `${team.avg_response_hours}h` : '—' },
                            ].map(({ icon: Icon, label, value }) => (
                                <div key={label} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-2">
                                        <Icon size={14} className="text-[#0A86F5]" />
                                        <span className="text-sm text-gray-500">{label}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-[#202020]">{value}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}