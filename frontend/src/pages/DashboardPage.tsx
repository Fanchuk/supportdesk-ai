import StatsCards from '../components/dashboard/StatsCards'
import TicketsVolumeChart from '../components/dashboard/TicketsVolumeChart'
import ResponseTrendChart from '../components/dashboard/ResponseTrendChart'
import LatestTicketsTable from '../components/dashboard/LatestTicketsTable'
import DateRangePicker from '../components/ui/DateRangePicker'
import ExportButton from '../components/dashboard/ExportButton'

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[28px] md:text-[40px] font-semibold text-[#1c1c1c] leading-none">Admin Dashboard</h1>
          <p className="text-sm text-gray-400 mt-2">Monitor your support ticket system with real-time data</p>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <DateRangePicker />
          <ExportButton />
        </div>
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <TicketsVolumeChart />
        <ResponseTrendChart />
      </div>

      <LatestTicketsTable />
    </div>
  )
}