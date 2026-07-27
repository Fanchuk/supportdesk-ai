import { useState } from 'react'
import { Plus, Copy, SlidersHorizontal, Trash2, Search, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import CreateAnswerModal from './CreateAnswerModal'
import EditAnswerModal from './EditAnswerModal'

const categories = ['All', 'Greeting', 'Technical', 'Billing', 'Closing', 'Escalation']

const initialAnswers = [
    {
        id: 1,
        title: 'Welcome Greeting',
        category: 'Greeting',
        body: 'Hello! Thank you for contacting our support team. My name is [Agent Name] and I will be happy to assist you today. Could you please provide more details about your issue?',
    },
    {
        id: 2,
        title: 'Password Reset Instructions',
        category: 'Technical',
        body: 'To reset your password, please follow these steps:\n1. Go to the login page\n2. Click "Forgot Password"\n3. Enter your email address\n4. Check your inbox for the reset link\n5. Follow the instructions in the email.',
    },
    {
        id: 3,
        title: 'Billing Inquiry Response',
        category: 'Billing',
        body: 'Thank you for reaching out about your billing concern. I understand how important this is to you. Could you please provide your account number or the email associated with your account so I can look into this right away?',
    },
    {
        id: 4,
        title: 'Issue Escalation Notice',
        category: 'Escalation',
        body: 'I understand your frustration and I want to make sure this gets resolved as quickly as possible. I am escalating your ticket to our senior support team who specializes in this type of issue. You can expect a response within 2-4 hours.',
    },
    {
        id: 5,
        title: 'Closing Message',
        category: 'Closing',
        body: 'I am glad we could resolve your issue today! If you have any further questions or need assistance in the future, please don\'t hesitate to reach out. Have a wonderful day!',
    },
    {
        id: 6,
        title: 'Refund Processing',
        category: 'Billing',
        body: 'I have initiated the refund process for your account. Please note that refunds typically take 5-7 business days to appear on your statement depending on your bank. You will receive a confirmation email shortly.',
    },
]

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation()
        navigator.clipboard.writeText(text)
        setCopied(true)
        toast.success('Copied to clipboard!')
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <button
            onClick={handleCopy}
            className="p-1.5 text-gray-400 hover:text-[#00b67a] transition-colors rounded-lg hover:bg-[rgba(0,182,122,0.08)]"
        >
            {copied ? <Check size={15} className="text-[#00b67a]" /> : <Copy size={15} />}
        </button>
    )
}

export default function SavedAnswersList() {
    const [answers, setAnswers] = useState(initialAnswers)
    const [activeCategory, setActiveCategory] = useState('All')
    const [search, setSearch] = useState('')
    const [createOpen, setCreateOpen] = useState(false)
    const [editAnswer, setEditAnswer] = useState<typeof initialAnswers[0] | null>(null)

    const filtered = answers.filter((a) => {
        const matchCategory = activeCategory === 'All' || a.category === activeCategory
        const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
            a.body.toLowerCase().includes(search.toLowerCase())
        return matchCategory && matchSearch
    })

    const handleCreate = (data: { title: string; category: string; body: string }) => {
        setAnswers(p => [...p, { id: Date.now(), ...data }])
    }

    const handleEdit = (data: { title: string; category: string; body: string }) => {
        setAnswers(p => p.map(a => a.id === editAnswer?.id ? { ...a, ...data } : a))
        setEditAnswer(null)
    }

    const handleDelete = (id: number) => {
        setAnswers(p => p.filter(a => a.id !== id))
        toast.success('Answer deleted')
    }

    return (
        <>
            <div>
                {/* Toolbar */}
                <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                        {categories.map((c) => (
                            <button
                                key={c}
                                onClick={() => setActiveCategory(c)}
                                className={`px-4 h-9 rounded-lg text-sm font-medium transition-colors ${
                                    activeCategory === c
                                        ? 'bg-[#00b67a] text-white'
                                        : 'bg-white border border-gray-200 text-gray-600 hover:border-[#00b67a] hover:text-[#00b67a]'
                                }`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search answers..."
                                className="pl-8 pr-4 h-9 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#00b67a] transition-colors w-52"
                            />
                        </div>
                        <button
                            onClick={() => setCreateOpen(true)}
                            className="flex items-center gap-2 bg-[#00b67a] text-white text-sm font-medium px-4 h-9 rounded-lg hover:bg-[#00a36c] transition-colors"
                        >
                            <Plus size={16} /> New Answer
                        </button>
                    </div>
                </div>

                {/* List */}
                <div className="flex flex-col gap-4">
                    {filtered.length === 0 ? (
                        <div className="bg-white border border-dashed border-gray-200 rounded-2xl px-6 py-16 text-center">
                            <p className="text-sm text-gray-400">No saved answers found.</p>
                        </div>
                    ) : (
                        filtered.map((a) => (
                            <div
                                key={a.id}
                                onClick={() => setEditAnswer(a)}
                                className="bg-white border border-gray-200 rounded-2xl px-6 py-5 cursor-pointer hover:border-[#00b67a] hover:shadow-sm transition-all"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <p className="text-base font-medium text-[#202020]">{a.title}</p>
                                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[rgba(0,182,122,0.08)] text-[#00b67a]">
                                                {a.category}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 line-clamp-2 whitespace-pre-wrap">{a.body}</p>
                                    </div>
                                    <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                        <CopyButton text={a.body} />
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setEditAnswer(a) }}
                                            className="p-1.5 text-gray-400 hover:text-[#00b67a] transition-colors rounded-lg hover:bg-[rgba(0,182,122,0.08)]"
                                        >
                                            <SlidersHorizontal size={15} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(a.id) }}
                                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <CreateAnswerModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onCreate={handleCreate}
                categories={categories.filter(c => c !== 'All')}
            />
            <EditAnswerModal
                answer={editAnswer}
                onClose={() => setEditAnswer(null)}
                onEdit={handleEdit}
                categories={categories.filter(c => c !== 'All')}
            />
        </>
    )
}