import { useState } from 'react'
import ReportHeader from '../components/reports/ReportHeader'
import ReportStats from '../components/reports/ReportStats'
import ReportCharts from '../components/reports/ReportCharts'
import AgentsTable from '../components/reports/AgentsTable'

export default function ReportStatisticsPage() {
    const [period, setPeriod] = useState('week')

    return (
        <div className="flex flex-col gap-6">
            <ReportHeader period={period} onPeriodChange={setPeriod} />
            <ReportStats period={period} />
            <ReportCharts period={period} />
            <AgentsTable period={period} />
        </div>
    )
}