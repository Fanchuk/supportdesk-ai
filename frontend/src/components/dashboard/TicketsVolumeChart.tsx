import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { PieChart, Pie, Cell } from 'recharts'
import { getDashboardStats } from '../../services/dashboard'
import Spinner from '../ui/Spinner'
import MonthYearPicker from '../ui/MonthYearPicker'

const COLORS = { open: '#00b67a', inProgress: '#4ade80', closed: '#1c3a2e' }
const legend = [
  { label: 'Open', key: 'open', color: COLORS.open },
  { label: 'In Progress', key: 'inProgress', color: COLORS.inProgress },
  { label: 'Closed', key: 'closed', color: COLORS.closed },
]

export default function TicketsVolumeChart() {
  const now = new Date()
  const [period, setPeriod] = useState({ month: now.getMonth() + 1, year: now.getFullYear() })

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats-volume', period.month, period.year],
    queryFn: () => getDashboardStats(period.month, period.year),
  })

  const chartData = data ? [
    { name: 'Open', value: data.open, color: COLORS.open },
    { name: 'In Progress', value: data.inProgress, color: COLORS.inProgress },
    { name: 'Closed', value: data.closed, color: COLORS.closed },
  ].filter(d => d.value > 0) : []

  const total = data?.total ?? 0

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col min-h-[400px] md:h-[542px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[22px] font-normal text-black">Tickets Volumes</h2>
        <MonthYearPicker value={period} onChange={setPeriod} />
      </div>

      <div className="flex-1 flex items-center justify-center relative min-h-[250px]">
        {isLoading ? <Spinner size="lg" /> : total === 0 ? (
          <p className="text-sm text-gray-400">No tickets for this period</p>
        ) : (
          <>
            <PieChart width={328} height={322}>
              <Pie data={chartData} cx={164} cy={161} innerRadius={90} outerRadius={155} startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}>
                {chartData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
            </PieChart>
            <div className="absolute flex flex-col items-center pointer-events-none">
              <span className="text-[32px] font-bold text-[#202020]">{total}</span>
              <span className="text-sm text-gray-400">Total</span>
            </div>
            <div className="absolute bottom-0 left-0">
              <span className="bg-[#00b67a] text-white text-xs font-medium px-[15px] py-[6px] rounded-[3px]">{data?.percentOpen}% open</span>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4">
        {legend.map(l => (
          <div key={l.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
              <span className="text-sm text-gray-600">{l.label}</span>
            </div>
            <span className="text-sm font-medium text-gray-700">
              {isLoading ? '...' : data?.[l.key as keyof typeof data] ?? '—'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}