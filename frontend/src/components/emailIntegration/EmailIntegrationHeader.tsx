import ExportButton from "../dashboard/ExportButton"

export default function EmailIntegrationHeader() {
    return (
        <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
                <h1 className="text-[40px] font-semibold text-[#1c1c1c] leading-none">Email Integration</h1>
                <p className="text-base text-[#1c1c1c] mt-2">Connect and manage mailboxes to handle support tickets via email.</p>
            </div>
            <ExportButton />
        </div>
    )
}