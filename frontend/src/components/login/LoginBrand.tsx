export default function LoginBrand() {
    return (
        <div className="hidden lg:flex lg:w-1/2 bg-[#00b67a] flex-col justify-between p-12 relative overflow-hidden">
            <div className="relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                            <circle cx="16" cy="16" r="16" fill="#00b67a" />
                            <path d="M8 16l5 5 11-11" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <span className="text-white font-semibold text-xl">Ticket Support</span>
                </div>
            </div>

            <div className="relative z-10">
                <h2 className="text-white text-[42px] font-bold leading-tight mb-4">
                    Manage support
                    <br />
                    tickets smarter
                </h2>
                <p className="text-white/80 text-lg leading-relaxed max-w-sm">AI-powered ticket routing, real-time analytics, and automated workflows — all in one place.</p>
                <div className="mt-10 flex flex-col gap-4">
                    {[
                        { num: '2,548', label: 'Tickets resolved this month' },
                        { num: '98%', label: 'Customer satisfaction rate' },
                        { num: '1.8h', label: 'Average response time' },
                    ].map((s) => (
                        <div key={s.label} className="flex items-center gap-4">
                            <span className="text-white font-bold text-2xl w-20">{s.num}</span>
                            <span className="text-white/70 text-sm">{s.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-white/10" />
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10" />
            <div className="absolute top-1/2 -left-16 w-32 h-32 rounded-full bg-white/10" />
        </div>
    )
}
