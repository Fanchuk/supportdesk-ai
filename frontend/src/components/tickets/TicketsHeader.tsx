import { useState, useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'

interface Props {
    sort: 'newest' | 'oldest'
    onSortChange: (v: 'newest' | 'oldest') => void
}

export default function TicketsHeader({ sort, onSortChange }: Props) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    return (
        <div className="flex items-center justify-between flex-wrap gap-3">
            <h1 className="text-[30px] font-semibold text-[#202020] dark:text-gray-100 tracking-[0.01em]">Requests</h1>
            <div className="relative" ref={ref}>
                <button 
                onClick={() => setOpen(p => !p)}
                className="flex items-center gap-2 border border-[#0A86F5] rounded-[6px] px-4 h-9 text-sm font-medium text-[#0A86F5] bg-[rgba(10,134,245,0.07)] dark:bg-transparent hover:bg-[rgba(10,134,245,0.12)] transition-colors">
                    {sort === 'newest' ? 'Newest First' : 'Oldest First'}
                    <ChevronDown size={16} />
                </button>
                {open && (
                    <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-[6px] shadow-md z-10 overflow-hidden">
                        {(['newest', 'oldest'] as const).map((v) => (
                            <button
                                key={v}
                                onClick={() => { onSortChange(v); setOpen(false) }}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 ${sort === v ? 'text-[#0A86F5] font-medium' : 'text-[#202020] dark:text-gray-300'}`}
                            >
                                {v === 'newest' ? 'Newest First' : 'Oldest First'}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}