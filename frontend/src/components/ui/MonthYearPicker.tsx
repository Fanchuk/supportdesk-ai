import { useState, useRef, useEffect } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

interface Props {
    value: { month: number; year: number }
    onChange: (val: { month: number; year: number }) => void
}

export default function MonthYearPicker({ value, onChange }: Props) {
    const [open, setOpen] = useState(false)
    const [year, setYear] = useState(value.year)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const h = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', h)
        return () => document.removeEventListener('mousedown', h)
    }, [])

    return (
        <div ref={ref} className="relative">
            <button onClick={() => setOpen(!open)} className="flex items-center gap-1 text-sm text-[#0A86F5] border border-[#0A86F5] rounded-[4px] px-3 h-8 bg-[rgba(10,134,245,0.07)] shadow-sm hover:bg-[rgba(10,134,245,0.12)]">
                {MONTHS[value.month - 1]} {value.year}
                <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="absolute right-0 top-10 z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-4 w-[220px]">
                    <div className="flex items-center justify-between mb-3">
                        <button onClick={() => setYear((y) => y - 1)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400">
                            <ChevronLeft size={16} />
                        </button>
                        <span className="text-sm font-semibold dark:text-gray-100">{year}</span>
                        <button onClick={() => setYear((y) => y + 1)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                        {MONTHS.map((m, i) => (
                            <button
                                key={m}
                                onClick={() => {
                                    onChange({ month: i + 1, year })
                                    setOpen(false)
                                }}
                                className={`py-1.5 rounded-lg text-sm transition-colors
                                    ${value.month === i + 1 && value.year === year
                                        ? 'text-white font-medium'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                                style={value.month === i + 1 && value.year === year
                                    ? { background: 'linear-gradient(135deg, #b18cff 40%, #5ac8c8 100%)' }
                                    : {}}>
                                {m}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}