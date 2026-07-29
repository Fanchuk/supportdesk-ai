export default function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }
    return (
        <div className="flex items-center justify-center">
            <div className={`${sizes[size]} relative`}>
                <div className={`${sizes[size]} rounded-full border-2 border-gray-100`} />
                <div className={`${sizes[size]} rounded-full border-2 border-t-[#0A86F5] animate-spin absolute inset-0`} />
            </div>
        </div>
    )
}