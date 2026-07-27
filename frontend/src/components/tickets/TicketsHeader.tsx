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
            <h1 className="text-[30px] font-semibold text-[#202020] tracking-[0.01em]">Requests</h1>
            <div className="relative" ref={ref}>
                <button 
                onClick={() => setOpen(p => !p)}
                className="flex items-center gap-2 border border-[#d9d9d9] rounded-[6px] px-4 h-9 text-sm font-medium text-[#202020] bg-white">
                    {sort === 'newest' ? 'Newest First' : 'Oldest First'}
                    <ChevronDown size={16} />
                </button>
                {open && (
                    <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-[6px] shadow-md z-10 overflow-hidden">
                        {(['newest', 'oldest'] as const).map((v) => (
                            <button
                                key={v}
                                onClick={() => { onSortChange(v); setOpen(false) }}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sort === v ? 'text-[#00b67a] font-medium' : 'text-[#202020]'}`}
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
