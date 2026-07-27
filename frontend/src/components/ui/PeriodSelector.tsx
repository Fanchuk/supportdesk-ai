import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface Props {
    options: { label: string; value: string }[]
    value: string
    onChange: (value: string) => void
}

export default function PeriodSelector({ options, value, onChange }: Props) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const current = options.find((o) => o.value === value)

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1 text-sm text-gray-500 border border-gray-200 rounded-[4px] px-3 h-8 bg-white shadow-sm hover:bg-gray-50 transition-colors">
                {current?.label}
                <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-10 z-50 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[140px]">
                        {options.map((o) => (
                            <button
                                key={o.value}
                                onClick={() => {
                                    onChange(o.value)
                                    setOpen(false)
                                }}
                                className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-gray-50
                  ${o.value === value ? 'text-[#00b67a] font-medium' : 'text-gray-600'}`}>
                                {o.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
