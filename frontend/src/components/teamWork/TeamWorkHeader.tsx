import ExportButton from "../dashboard/ExportButton"

export default function TeamWorkHeader() {
    return (
        <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
                <h1 className="text-[40px] font-semibold text-[#1c1c1c] leading-none">Team Work</h1>
                <p className="text-base text-[#1c1c1c] mt-2">Manage your support teams and their members.</p>
            </div>
            <ExportButton />
        </div>
    )
}