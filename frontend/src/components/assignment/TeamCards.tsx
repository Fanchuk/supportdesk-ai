import { useState } from 'react'
import { Users } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getTeams } from '../../services/teams'
import Spinner from '../ui/Spinner'
import TeamDetailModal from '../teamWork/TeamDetailModal'

export default function TeamCards() {
    const [selected, setSelected] = useState<any | null>(null)
    const { data = [], isLoading } = useQuery({
        queryKey: ['teams'],
        queryFn: getTeams,
    })

    if (isLoading) return <div className="flex justify-center py-8"><Spinner size="lg" /></div>

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {(data as any[]).map((t) => (
                    <div
                        key={t.id}
                        onClick={() => setSelected(t)}
                        className="bg-white border border-[#e7e7e7] rounded-[20px] p-5 cursor-pointer hover:border-[#0A86F5] hover:shadow-sm transition-all"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Users size={18} className="text-[#0A86F5]" />
                            <span className="text-base font-semibold text-[#202224]">{t.name}</span>
                        </div>
                        <div className="flex flex-col gap-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Members</span>
                                <span className="font-medium">{t.members_count ?? '—'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Active Tickets</span>
                                <span className="font-medium">{t.active_tickets ?? '—'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Avg Response Time</span>
                                <span className="font-medium">
                                    {t.avg_response_hours != null ? `${t.avg_response_hours}h` : '—'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <TeamDetailModal team={selected} onClose={() => setSelected(null)} />
        </>
    )
}