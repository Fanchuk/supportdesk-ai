import ExportButton from "../dashboard/ExportButton"

export default function SlaHeader() {
    return (
        <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
                <h1 className="text-[40px] font-semibold text-[#1c1c1c] leading-none">SLA Management</h1>
                <p className="text-base text-[#1c1c1c] mt-2">Monitor and manage service level agreements across your support team.</p>
            </div>
            <ExportButton />
        </div>
    )
}
