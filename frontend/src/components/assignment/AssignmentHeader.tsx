import ExportButton from "../dashboard/ExportButton"

export default function AssignmentHeader() {
    return (
        <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
                <h1 className="text-[40px] font-semibold text-[#1c1c1c] leading-none">Ticket Assignment</h1>
                <p className="text-base text-[#1c1c1c] mt-2">Automatically assign tickets to agents and groups based on keywords, requests or characteristics.</p>
            </div>
            <ExportButton />
        </div>
    )
}