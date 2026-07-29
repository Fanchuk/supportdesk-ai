import { useState } from 'react'
import { Plus, Users, ChevronDown, ChevronUp, Mail, Shield, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTeams, createTeam, addTeamMember, removeTeamMember } from '../../services/teams'
import Spinner from '../ui/Spinner'
import CreateTeamModal from './CreateTeamModal'
import AddMemberModal from './AddMemberModal'
import toast from 'react-hot-toast'

const roleStyle: Record<string, string> = {
    admin: 'bg-red-50 text-red-500',
    manager: 'bg-[rgba(79,70,229,0.08)] text-[#4f46e5]',
    agent: 'bg-[rgba(10,134,245,0.08)] text-[#0A86F5]',
}

export default function TeamWorkList() {
    const qc = useQueryClient()
    const [expanded, setExpanded] = useState<number | null>(null)
    const [createOpen, setCreateOpen] = useState(false)
    const [addMemberTeam, setAddMemberTeam] = useState<any | null>(null)

    const { data: teams = [], isLoading } = useQuery({
        queryKey: ['teams'],
        queryFn: getTeams
    })

    const { data: teamDetail } = useQuery({
        queryKey: ['team', expanded],
        queryFn: () => import('../../services/teams').then(m => m.getTeamById(expanded!)),
        enabled: expanded !== null
    })

    const { mutate: create } = useMutation({
        mutationFn: (data: { name: string; description: string }) => createTeam(data),
        onSuccess: () => {
            toast.success('Team created!')
            qc.invalidateQueries({ queryKey: ['teams'] })
        },
        onError: () => toast.error('Failed to create team'),
    })

    const { mutate: addMember } = useMutation({
        mutationFn: ({ teamId, userId }: { teamId: number; userId: number }) =>
            addTeamMember(teamId, userId),
        onSuccess: () => {
            toast.success('Member added!')
            qc.invalidateQueries({ queryKey: ['team', expanded] })
            qc.invalidateQueries({ queryKey: ['teams'] })
        },
        onError: () => toast.error('Failed to add member'),
    })

    const { mutate: removeMember } = useMutation({
        mutationFn: ({ teamId, userId }: { teamId: number; userId: number }) =>
            removeTeamMember(teamId, userId),
        onSuccess: () => {
            toast.success('Member removed')
            qc.invalidateQueries({ queryKey: ['team', expanded] })
            qc.invalidateQueries({ queryKey: ['teams'] })
        },
        onError: () => toast.error('Failed to remove member'),
    })

    if (isLoading) return <div className="flex justify-center py-8"><Spinner size="lg" /></div>

    const members: any[] = teamDetail?.members ?? []

    return (
        <>
          <div>
                <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                    <div>
                        <h2 className="text-[22px] font-medium text-[#212b36]">Teams</h2>
                        <p className="text-base text-[#3a4452]">View and manage your support teams</p>
                    </div>
                    <button
                        onClick={() => setCreateOpen(true)}
                        className="flex items-center gap-2 bg-[#0A86F5] hover:bg-[#0875d4] text-white text-sm font-medium px-4 h-10 rounded-lg transition-colors"
                    >
                        <Plus size={16} /> Create Team
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    {(teams as any[]).map((team) => (
                        <div key={team.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-[#0A86F5] transition-all">
                            <div
                                onClick={() => setExpanded(prev => prev === team.id ? null : team.id)}
                                className="px-6 py-5 flex items-center justify-between gap-4 cursor-pointer"
                            >
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className="w-12 h-12 rounded-[8px] bg-[rgba(10,134,245,0.1)] flex items-center justify-center flex-shrink-0">
                                        <Users size={20} className="text-[#0A86F5]" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-base font-semibold text-[#202020]">{team.name}</p>
                                        <p className="text-sm text-gray-500 mt-0.5">{team.description ?? ''}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 flex-shrink-0">
                                    <div className="text-center hidden sm:block">
                                        <p className="text-lg font-semibold text-[#202020]">{team.members_count ?? 0}</p>
                                        <p className="text-xs text-gray-400">Members</p>
                                    </div>
                                    <div className="text-center hidden sm:block">
                                        <p className="text-lg font-semibold text-[#202020]">{team.active_tickets ?? 0}</p>
                                        <p className="text-xs text-gray-400">Active Tickets</p>
                                    </div>
                                    {expanded === team.id
                                        ? <ChevronUp size={18} className="text-gray-400" />
                                        : <ChevronDown size={18} className="text-gray-400" />
                                    }
                                </div>
                            </div>

                            <AnimatePresence>
                                {expanded === team.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="border-t border-gray-100 px-6 py-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <p className="text-sm font-medium text-gray-700">
                                                    Members ({members.length})
                                                </p>
                                                <button
                                                    onClick={() => setAddMemberTeam(team)}
                                                    className="flex items-center gap-1.5 text-xs font-medium text-[#0A86F5] hover:underline"
                                                >
                                                    <Plus size={13} /> Add Member
                                                </button>
                                            </div>

                                            {members.length === 0 ? (
                                                <div className="py-8 text-center">
                                                    <p className="text-sm text-gray-400">No members in this team yet.</p>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col gap-2">
                                                    {members.map((m: any) => (
                                                        <div key={m.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-[rgba(10,134,245,0.1)] flex items-center justify-center text-[#0A86F5] font-semibold text-xs flex-shrink-0">
                                                                    {m.name?.slice(0, 2).toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium text-[#202020]">{m.name}</p>
                                                                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                                                                        <Mail size={11} />
                                                                        {m.email}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${roleStyle[m.role]}`}>
                                                                    <Shield size={10} />
                                                                    {m.role}
                                                                </span>
                                                                <button
                                                                    onClick={() => removeMember({ teamId: team.id, userId: m.id })}
                                                                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>

            <CreateTeamModal
            open={createOpen}
            onClose={() => setCreateOpen(false)}
            onCreate={create}
            />
            <AddMemberModal
            open={!!addMemberTeam}
            teamName={addMemberTeam?.name ?? ''}
            teamId={addMemberTeam?.id ?? null}
            onClose={() => setAddMemberTeam(null)}
            onAdd={(userId) => {
                if (addMemberTeam) {
                    addMember({ teamId: addMemberTeam.id, userId })
                    setAddMemberTeam(null)
                }
            }}
            />
        </>
    )
}