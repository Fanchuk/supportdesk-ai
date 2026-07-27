import ExportButton from "../dashboard/ExportButton"

export default function AutomationHeader() {
    return (
        <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
                <h1 className="text-[40px] font-semibold text-[#1c1c1c] leading-none">Automation</h1>
                <p className="text-base text-[#1c1c1c] mt-2">Automate recurring tasks and perform multiple actions on a ticket with a single click.</p>
            </div>
            <ExportButton />
        </div>
    )
}