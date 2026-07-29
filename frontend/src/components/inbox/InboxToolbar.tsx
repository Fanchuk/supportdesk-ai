import { Trash2, RefreshCw, MoreHorizontal, Search, X } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteTicket } from '../../services/tickets'
import toast from 'react-hot-toast'

interface Props {
  search: string
  onSearch: (v: string) => void
  checked: Set<number>
  onClearChecked: () => void
  onToggleAll: () => void
  totalVisible: number
}

export default function InboxToolbar({ search, onSearch, checked, onClearChecked, onToggleAll, totalVisible }: Props) {
  const qc = useQueryClient()

  const { mutate: deleteBulk } = useMutation({
    mutationFn: async () => {
      await Promise.all([...checked].map(id => deleteTicket(id)))
    },
    onSuccess: () => {
      toast.success(`${checked.size} ticket(s) deleted`)
      onClearChecked()
      qc.invalidateQueries({ queryKey: ['inbox-tickets'] })
    },
    onError: () => toast.error('Delete failed'),
  })

  return (
      <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-3">
              <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 accent-[#8b8ffd]"
                  onChange={onToggleAll}
                  checked={checked.size === totalVisible && totalVisible > 0}
              />

              {checked.size > 0 ? (
                  <>
                      <button onClick={() => deleteBulk()} className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                          <Trash2 size={16} />
                      </button>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{checked.size} selected</span>
                  </>
              ) : (
                  <>
                      <button className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                          <Trash2 size={16} />
                      </button>
                      <button
                          onClick={async () => {
                              await qc.invalidateQueries({ queryKey: ['inbox-tickets'] })
                              toast.success('Inbox refreshed')
                          }}
                          className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                          <RefreshCw size={16} />
                      </button>
                      <button className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                          <MoreHorizontal size={16} />
                      </button>
                  </>
              )}
          </div>

          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-lg px-3 h-9 w-64 transition-colors focus-within:border-[#8b8ffd] dark:focus-within:border-[#8b8ffd]">
              <Search size={14} className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
              <input
                  value={search}
                  onChange={(e) => onSearch(e.target.value)}
                  placeholder="Search for user, email address..."
                  className="bg-transparent text-sm text-gray-600 dark:text-gray-200 outline-none w-full placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
              {search && (
                  <button onClick={() => onSearch('')} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-xs flex items-center justify-center">
                      <X size={14} />
                  </button>
              )}
          </div>
      </div>
  )
}