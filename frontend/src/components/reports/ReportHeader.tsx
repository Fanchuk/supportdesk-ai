import ExportButton from "../dashboard/ExportButton"

const periods = ['Today', 'Week', 'Month', 'Year']

interface Props {
    period: string
    onPeriodChange: (p: string) => void
}

export default function ReportHeader({ period, onPeriodChange }: Props) {
    return (
        <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
                <h1 className="text-[40px] font-semibold text-[#1c1c1c] leading-none">Report and Statistics</h1>
                <p className="text-base text-[#1c1c1c] mt-2">Track your support team performance and ticket trends.</p>
            </div>
            <div className="flex items-center gap-3">
                <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1 gap-1">
                    {periods.map((p) => {
                        const val = p.toLowerCase()
                        return (
                            <button key={p} onClick={() => onPeriodChange(val)}
                                className={`px-4 h-8 rounded-md text-sm font-medium transition-colors ${
                                    period === val
                                        ? 'bg-[#0A86F5] text-white'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >{p}</button>
                        )
                    })}
                </div>
                <ExportButton />
            </div>
        </div>
    )
}