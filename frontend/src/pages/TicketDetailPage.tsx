import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getTicketById } from '../services/tickets'
import { ArrowLeft, Clock, User, Tag, Building } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import Spinner from '../components/ui/Spinner'

const statusStyle: Record<string, string> = {
  open: 'bg-[#fffbd1] text-[#ca8a04] dark:bg-yellow-500/10 dark:text-yellow-500',
  in_progress: 'bg-[#fff0ee] text-[#ef4444] dark:bg-red-500/10 dark:text-red-500',
  closed: 'bg-[#e4faef] text-[#00b67a] dark:bg-[#00b67a]/10 dark:text-[#00b67a]',
}

const priorityStyle: Record<string, string> = {
  high: 'bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-500',
  medium: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-500',
  low: 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-500',
}

export default function TicketDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: ticket, isLoading } = useQuery({
    queryKey: ['ticket', id],
    queryFn: () => getTicketById(Number(id)),
  })

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  if (!ticket) return <div className="text-center py-20 text-gray-400 dark:text-gray-500">Ticket not found</div>

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{ticket.title}</h1>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusStyle[ticket.status] ?? 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                {ticket.status}
              </span>
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${priorityStyle[ticket.priority] ?? 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                {ticket.priority}
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6 whitespace-pre-wrap">
            {ticket.description}
          </p>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: User, label: 'Created by', value: ticket.creator_name ?? '—' },
              { icon: Clock, label: 'Created', value: formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true }) },
              { icon: Tag, label: 'Category', value: ticket.category ?? '—' },
              { icon: Building, label: 'Team', value: ticket.team_name ?? '—' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-transparent dark:border-gray-800">
                <div className="w-8 h-8 rounded-lg bg-[rgba(0,182,122,0.1)] flex items-center justify-center flex-shrink-0">
                  <Icon size={14} className="text-[#00b67a]" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{label}</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {ticket.messages?.length > 0 && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Messages ({ticket.messages.length})
            </h2>
            
            <div className="flex flex-col gap-5">
              {ticket.messages.map((m: any) => {
                const isStaff = m.author_role === 'agent' || m.author_role === 'admin'
                return (
                  <div key={m.id} className={`flex gap-3 ${isStaff ? 'flex-row-reverse' : ''}`}>
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-500 font-semibold text-xs flex-shrink-0">
                      {m.author_name?.slice(0, 2).toUpperCase() || 'U'}
                    </div>
                    
                    <div className={`max-w-[75%] ${isStaff ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{m.author_name}</p>
                      <div 
                        className={`px-4 py-3 rounded-2xl text-sm ${
                          isStaff 
                            ? 'bg-[#00b67a] text-white rounded-tr-sm' 
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{m.body}</p>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {formatDistanceToNow(new Date(m.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}