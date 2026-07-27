import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import InboxSidebar from '../components/inbox/InboxSidebar'
import InboxToolbar from '../components/inbox/InboxToolbar'
import InboxList from '../components/inbox/InboxList'
import { getTickets } from '../services/tickets'

export default function InboxPage() {
  const [folder, setFolder] = useState('Inbox')
  const [search, setSearch] = useState('')
  const [checked, setChecked] = useState<Set<number>>(new Set())

  const { data = [] } = useQuery({
    queryKey: ['inbox-tickets'],
    queryFn: () => getTickets()
  })

  const toggleCheck = (id: number) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const clearChecked = () => setChecked(new Set())

  const toggleAll = () => {
    const tickets = Array.isArray(data) ? data : []
    if (checked.size === tickets.length && tickets.length > 0) {
      clearChecked()
    } else {
      setChecked(new Set(tickets.map((t: any) => t.id)))
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-[26px] font-bold text-[#1c2434] dark:text-white">Inbox</h1>

      <div className="bg-white dark:bg-gray-900 border border-transparent dark:border-gray-800 rounded-[20px] flex overflow-hidden min-h-[820px]">
        <div className="hidden md:block border-r border-gray-100 dark:border-gray-800 p-5">
          <InboxSidebar 
            active={folder} 
            onChange={(f) => {
              setFolder(f)
              setChecked(new Set())
            }} 
          />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800">
            <InboxToolbar
              search={search}
              onSearch={setSearch}
              checked={checked}
              onClearChecked={clearChecked}
              onToggleAll={toggleAll}
              totalVisible={(data as any[]).length}
            />
          </div>
          <div className="flex-1 overflow-x-auto">
            <div className="min-w-[600px]">
              <InboxList
                search={search}
                folder={folder}
                checked={checked}
                onToggleCheck={toggleCheck}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}