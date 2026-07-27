import { ChevronRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getTickets } from '../../services/tickets'

export default function InboxPagination() {
  const { data = [] } = useQuery({
    queryKey: ['inbox-tickets'],
    queryFn: () => getTickets(),
  })

  return (
    <div className="flex items-center justify-between px-4 py-4 border-t border-gray-100 dark:border-gray-800">
      <span className="text-base font-medium text-[#1c2434] dark:text-gray-200">
        1-{Math.min(data.length, 10)} of {data.length}
      </span>
      <div className="flex items-center gap-2">
        <button className="w-[30px] h-[30px] rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 rotate-180 transition-colors">
          <ChevronRight size={16} />
        </button>
        <button className="w-[30px] h-[30px] rounded-full bg-[#00b67a] hover:bg-[#00a36c] flex items-center justify-center text-white transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}