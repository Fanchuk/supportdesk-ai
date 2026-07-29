import { useQuery } from '@tanstack/react-query'
import { getTicketsByDay, getResponseByCategory } from '../../services/reports'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Spinner from '../ui/Spinner'

interface Props {
    period: string
}

export default function ReportCharts({ period }: Props) {
    const { data: byDay = [], isLoading: loadingDay } = useQuery({
        queryKey: ['tickets-by-day', period],
        queryFn: () => getTicketsByDay(period),
    })

    const { data: byCategory = [], isLoading: loadingCat } = useQuery({
        queryKey: ['response-by-category', period],
        queryFn: () => getResponseByCategory(period),
    })

    const dayData = (byDay as any[]).map(r => ({
        day: r.day,
        open: Number(r.open),
        resolved: Number(r.resolved),
    }))

    const catData = (byCategory as any[]).map(r => ({
        category: r.category,
        avgHours: Number(r.avg_hours),
    }))

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h2 className="text-[18px] font-semibold text-[#202020] mb-1">Tickets by Day</h2>
                <p className="text-sm text-gray-400 mb-6">Open vs resolved tickets this week</p>
                {loadingDay ? <div className="flex justify-center py-8"><Spinner size="lg" /></div> : (
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={dayData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: 13 }} />
                            <Legend wrapperStyle={{ fontSize: 13, paddingTop: 16 }} />
                            <Bar dataKey="open" name="Open" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="resolved" name="Resolved" fill="#0A86F5" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h2 className="text-[18px] font-semibold text-[#202020] mb-1">Avg Response Time</h2>
                <p className="text-sm text-gray-400 mb-6">Average hours to respond by category</p>
                {loadingCat ? <div className="flex justify-center py-8"><Spinner size="lg" /></div> : (
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={catData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                            <XAxis type="number" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} unit="h" />
                            <YAxis dataKey="category" type="category" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={70} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: 13 }} formatter={(v) => [`${v}h`, 'Avg Response']} />
                            <Bar dataKey="avgHours" name="Avg Response" fill="#6366f1" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    )
}