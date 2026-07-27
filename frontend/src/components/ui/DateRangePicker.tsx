import { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Calendar } from 'lucide-react'
import { format } from 'date-fns'

export default function DateRangePicker() {
    const [startDate, setStartDate] = useState<Date | null>(new Date('2025-09-30'))
    const [endDate, setEndDate] = useState<Date | null>(new Date('2025-10-04'))
    const [open, setOpen] = useState(false)

    const label = startDate && endDate ? `${format(startDate, 'MMM d, yyyy')} – ${format(endDate, 'MMM d, yyyy')}` : 'Select dates'

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 border border-gray-200 rounded-[4px] px-[15px] h-10 text-sm text-gray-500 bg-white shadow-sm hover:bg-gray-50 transition-colors">
                <Calendar size={14} />
                {label}
            </button>
            {open && (
                <div className="absolute right-0 top-12 z-50 bg-white border border-gray-200 rounded-xl shadow-lg p-4">
                    <DatePicker
                        selected={startDate}
                        onChange={(dates) => {
                            const [start, end] = dates as [Date | null, Date | null]
                            setStartDate(start)
                            setEndDate(end)
                            if (start && end) setOpen(false)
                        }}
                        startDate={startDate}
                        endDate={endDate}
                        selectsRange
                        inline
                        calendarClassName="!font-sans"
                    />
                </div>
            )}
        </div>
    )
}
