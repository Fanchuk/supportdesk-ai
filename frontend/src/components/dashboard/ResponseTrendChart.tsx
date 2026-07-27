import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { getResponseTrend } from '../../services/dashboard'
import PeriodSelector from '../ui/PeriodSelector'
import Spinner from '../ui/Spinner'

const PERIOD_OPTIONS = [
    { label: 'Last 7 days', value: '7' },
    { label: 'Last 2 weeks', value: '14' },
    { label: 'Last month', value: '30' },
]

interface TrendData {
    day: string
    avg_minutes: string | number
    count: number
}

export default function ResponseTrendChart() {
    const [period, setPeriod] = useState('14')
    const { data = [], isLoading } = useQuery<TrendData[]>({ 
        queryKey: ['response-trend', period], 
        queryFn: () => getResponseTrend(period)
    })

    const activeIndex = data.reduce((maxI: number, item: TrendData, i: number, arr: TrendData[]) =>
        Number(item.avg_minutes) > Number(arr[maxI]?.avg_minutes) ? i : maxI, 0)

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col min-h-[400px] md:h-[542px]">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-[22px] font-normal text-black">Response Time Trend</h2>
                <PeriodSelector options={PERIOD_OPTIONS} value={period} onChange={setPeriod}/>
            </div>

            <div className="flex-1">
                {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center">
                        <Spinner size="lg" />
                    </div>
                ) : data.length === 0 ? (
                    <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">No data for the last 2 weeks</div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%" className="focus:outline-none">
                        <BarChart data={data} barSize={20} margin={{ top: 30, right: 0, left: -20, bottom: 0 }} style={{ outline: 'none' }} /* <-- Прибирає синю рамку при кліку */>
                            <CartesianGrid vertical={false} stroke="#f0f0f0" strokeDasharray="4 4" />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                            <Tooltip
                                cursor={false}
                                isAnimationActive={false}
                                content={({ active, payload }) => {
                                    if (!active || !payload?.length) return null
                                    return (
                                        <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow text-xs text-gray-700">
                                            <div className="text-gray-400 mb-0.5">{payload[0]?.payload?.day}</div>
                                            <div className="font-semibold">{payload[0].value} min avg</div>
                                            <div className="text-gray-400">{payload[0]?.payload?.count} tickets</div>
                                        </div>
                                    )
                                }}
                            />
                            <Bar dataKey="avg_minutes" radius={[20, 20, 0, 0]} minPointSize={4}>
                                {data.map((_: TrendData, i: number) => (
                                    <Cell key={i} fill={i === activeIndex ? '#00b67a' : '#e5e7eb'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </motion.div>
    )
}