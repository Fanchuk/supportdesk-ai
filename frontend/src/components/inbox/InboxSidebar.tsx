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
      <button 
        className="w-full text-white text-sm font-medium rounded-[3px] h-11 px-5 transition-colors"
        style={{ background: 'linear-gradient(90deg, #3a49bb 6%, #8b8ffd 100%)' }}
      >
        Compose
      </button>
      <nav className="flex flex-col">
        {folders.map(({ icon: Icon, label }) => (
          <button
            key={label}
            onClick={() => onChange(label)}
            className={`flex items-center gap-3 px-[22px] py-[10px] rounded-sm text-base font-medium w-full text-left transition-colors
              ${active === label 
                ? 'text-[#8b8ffd] border-l-2 border-[#8b8ffd] bg-[rgba(138,143,253,0.08)]' 
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