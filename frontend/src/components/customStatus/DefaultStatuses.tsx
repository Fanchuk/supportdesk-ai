const defaults = [
    { label: 'Open', color: '#ca8a04', bg: 'bg-[#fffbd1]', text: 'text-[#ca8a04]', description: 'Ticket is new and waiting for response' },
    { label: 'In Progress', color: '#ef4444', bg: 'bg-[#fff0ee]', text: 'text-[#ef4444]', description: 'Ticket is being actively worked on' },
    { label: 'Closed', color: '#00b67a', bg: 'bg-[#e4faef]', text: 'text-[#00b67a]', description: 'Ticket has been resolved and closed' },
]

export default function DefaultStatuses() {
    return (
        <div>
            <div className="mb-4">
                <h2 className="text-[22px] font-medium text-[#212b36]">Default Statuses</h2>
                <p className="text-base text-[#3a4452]">Built-in statuses that cannot be modified</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {defaults.map((s) => (
                    <div key={s.label} className="bg-white border border-gray-200 rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`text-xs font-medium px-3 py-1 rounded-full ${s.bg} ${s.text}`}>
                                ● {s.label}
                            </span>
                            <span className="text-xs text-gray-400 ml-auto">Default</span>
                        </div>
                        <p className="text-sm text-gray-500">{s.description}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}