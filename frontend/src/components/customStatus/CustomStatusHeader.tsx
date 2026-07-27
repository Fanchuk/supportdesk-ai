import ExportButton from "../dashboard/ExportButton"

export default function CustomStatusHeader() {
    return (
        <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
                <h1 className="text-[40px] font-semibold text-[#1c1c1c] leading-none">Custom Ticket Status</h1>
                <p className="text-base text-[#1c1c1c] mt-2">Create and manage custom ticket statuses for your support workflow.</p>
            </div>
            <ExportButton />
        </div>
    )
}