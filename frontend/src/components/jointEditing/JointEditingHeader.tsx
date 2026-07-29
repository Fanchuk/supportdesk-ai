import ExportButton from "../dashboard/ExportButton"

export default function JointEditingHeader() {
    return (
        <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
                <h1 className="text-[40px] font-semibold text-[#1c1c1c] leading-none">Joint Editing</h1>
                <p className="text-base text-[#1c1c1c] mt-2">Collaborate with your team on tickets in real time.</p>
            </div>
            <ExportButton />
        </div>
    )
}