export default function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizes = {
        sm: 'w-5 h-5',
        md: 'w-9 h-9',
        lg: 'w-14 h-14',
    }
    const borders = {
        sm: 'border-2',
        md: 'border-[3px]',
        lg: 'border-4',
    }

    return (
        <div className="flex items-center justify-center">
            <div className={`${sizes[size]} relative`}>
                <div className={`absolute inset-0 rounded-full ${borders[size]} border-[#0A86F5]/10`} />
                <div className={`absolute inset-0 rounded-full ${borders[size]} border-[#0A86F5]/20`} />
                <div className={`absolute inset-0 rounded-full ${borders[size]} border-transparent border-t-[#0A86F5] border-r-[#0A86F5]/40 animate-spin`}
                    style={{ animationDuration: '0.7s' }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`rounded-full bg-[#0A86F5] ${size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-1.5 h-1.5' : 'w-2 h-2'} animate-pulse`} />
                </div>
            </div>
        </div>
    )
}