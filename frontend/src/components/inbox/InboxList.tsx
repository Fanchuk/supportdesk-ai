import { Star } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getTickets } from '../../services/tickets'
import { formatDistanceToNow } from 'date-fns'
import Spinner from '../ui/Spinner'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'

const statusStyle: Record<string, string> = {
  open: 'bg-[#fffbd1] text-[#ca8a04]',
  in_progress: 'bg-[#fff0ee] text-[#ef4444]',
  closed: 'bg-[#e4faef] text-[#00b67a]',
}

const PER_PAGE = 8

interface Props {
  search: string
  folder: string
  checked: Set<number>
  onToggleCheck: (id: number) => void
}

export default function InboxList({ search, folder, checked, onToggleCheck }: Props) {
  const [page, setPage] = useState(1)
  const [starred, setStarred] = useState<Set<number>>(new Set())
  const navigate = useNavigate()

  useEffect(() => {
    setPage(1)
  }, [search, folder])

  const { data = [], isLoading } = useQuery({
    queryKey: ['inbox-tickets'],
    queryFn: () => getTickets(),
  })

  const toggleStar = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    setStarred(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const filtered = (data as any[]).filter((t: any) => {
    const matchSearch = !search ||
      t.title?.toLowerCase().includes(search.toLowerCase()) ||
      t.user_name?.toLowerCase().includes(search.toLowerCase()) ||
      t.user_email?.toLowerCase().includes(search.toLowerCase())

    const matchFolder =
      folder === 'Starred' ? starred.has(t.id) :
      folder === 'Sent' ? t.status === 'closed' :
      folder === 'Drafts' ? t.status === 'in_progress' :
      folder === 'Spam' || folder === 'Trash' ? false :
      true

    return matchSearch && matchFolder
  })

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  if (isLoading) return <div className="py-16 flex justify-center"><Spinner size="lg" /></div>

  return (
    <>
      <div className="flex flex-col">
        <div className="grid grid-cols-[auto_auto_1fr_auto] items-center gap-4 px-4 py-3 border-b border-gray-100 text-sm text-gray-400">
          <span className="w-4" />
          <span className="w-4" />
          <span>Sender</span>
          <div className="grid grid-cols-[1fr_auto_auto] gap-8 min-w-[400px]">
            <span>Subject</span>
            <span>Status</span>
            <span>Date</span>
          </div>
        </div>

        {paginated.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">No tickets found</div>
        ) : (
          paginated.map((ticket: any) => (
            <div
              key={ticket.id}
              onClick={() => navigate(`/tickets/${ticket.id}`)}
              className={`grid grid-cols-[auto_auto_1fr_auto] items-center gap-4 px-4 py-[15px] border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer
                ${checked.has(ticket.id) ? 'bg-[rgba(138,143,253,0.05)]' : ''}`}
            >
              <input
                type="checkbox"
                checked={checked.has(ticket.id)}
                onChange={e => { e.stopPropagation(); onToggleCheck(ticket.id) }}
                onClick={e => e.stopPropagation()}
                className="w-4 h-4 rounded border-gray-300 accent-[#8b8ffd]"
              />
              <button onClick={e => toggleStar(e, ticket.id)}>
                <Star size={16} className={starred.has(ticket.id) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
              </button>
              <span className="text-base font-medium text-gray-700 truncate">{ticket.user_name ?? 'Unknown'}</span>
              <div className="grid grid-cols-[1fr_auto_auto] gap-8 min-w-[400px]">
                <span className="text-[13px] text-gray-500 truncate">{ticket.title}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${statusStyle[ticket.status] ?? 'bg-gray-100 text-gray-500'}`}>
                  {ticket.status}
                </span>
                <span className="text-sm text-gray-400 whitespace-nowrap">
                  {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex items-center justify-between px-4 py-4 border-t border-gray-100">
        <span className="text-sm font-medium text-[#1c2434]">
          {filtered.length === 0 ? '0' : `${(page - 1) * PER_PAGE + 1}-${Math.min(page * PER_PAGE, filtered.length)}`} of {filtered.length}
        </span>
        <Pagination
          current={page}
          total={filtered.length}
          pageSize={PER_PAGE}
          onChange={(p) => setPage(p)}
          showLessItems
          className="rc-pagination-green"
        />
      </div>
    </>
  )
}