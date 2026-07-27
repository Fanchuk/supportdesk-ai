import { Download, Star, Clock, Send, FileText, AlertOctagon, Trash2 } from 'lucide-react'

const folders = [
  { icon: Download, label: 'Inbox' },
  { icon: Star, label: 'Starred' },
  { icon: Clock, label: 'Snoozed' },
  { icon: Send, label: 'Sent' },
  { icon: FileText, label: 'Drafts' },
  { icon: AlertOctagon, label: 'Spam' },
  { icon: Trash2, label: 'Trash' },
]

interface Props {
  active: string
  onChange: (folder: string) => void
}

export default function InboxSidebar({ active, onChange }: Props) {
  return (
    <div className="w-[240px] flex-shrink-0 flex flex-col gap-3 pr-2">
      <button className="w-full bg-[#00b67a] hover:bg-[#00a36c] text-white text-sm font-medium rounded-[3px] h-11 px-5 transition-colors">
        Compose
      </button>
      <nav className="flex flex-col">
        {folders.map(({ icon: Icon, label }) => (
          <button
            key={label}
            onClick={() => onChange(label)}
            className={`flex items-center gap-3 px-[22px] py-[10px] rounded-sm text-base font-medium w-full text-left transition-colors
              ${active === label 
                ? 'bg-[rgba(48,86,211,0.04)] dark:bg-[rgba(0,182,122,0.1)] text-[#00b67a] border-l-2 border-[#00b67a]' 
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </nav>
    </div>
  )
}