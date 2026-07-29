import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
    { day: 'Mon', received: 98, sent: 64 },
    { day: 'Tue', received: 112, sent: 78 },
    { day: 'Wed', received: 87, sent: 59 },
    { day: 'Thu', received: 134, sent: 91 },
    { day: 'Fri', received: 121, sent: 83 },
    { day: 'Sat', received: 54, sent: 31 },
    { day: 'Sun', received: 42, sent: 24 },
]

export default function EmailActivityChart() {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="mb-6">
                <h2 className="text-[18px] font-semibold text-[#202020]">Email Activity</h2>
                <p className="text-sm text-gray-400 mt-0.5">Emails received and sent over the last 7 days</p>
            </div>
            <ResponsiveContainer width="100%" height={260}>
                <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <Tooltip
                        contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: 13 }}
                        cursor={{ stroke: '#f0f0f0' }}
                    />
                    <Legend wrapperStyle={{ fontSize: 13, paddingTop: 16 }} />
                    <Line type="monotone" dataKey="received" stroke="#3b82f6" strokeWidth={2.5} dot={false} name="Received" />
                    <Line type="monotone" dataKey="sent" stroke="#0A86F5" strokeWidth={2.5} dot={false} name="Sent" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}