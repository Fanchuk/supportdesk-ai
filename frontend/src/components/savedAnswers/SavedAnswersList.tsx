import React, { useState } from 'react'
import { Plus, Copy, SlidersHorizontal, Trash2, Search, Check } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSavedAnswers, createSavedAnswer, updateSavedAnswer, deleteSavedAnswer } from '../../services/savedAnswers'
import Spinner from '../ui/Spinner'
import CreateAnswerModal from './CreateAnswerModal'
import EditAnswerModal from './EditAnswerModal'
import toast from 'react-hot-toast'

const categories = ['All', 'Greeting', 'Technical', 'Billing', 'Closing', 'Escalation']

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
        <button onClick={handleCopy} className="p-1.5 text-gray-400 hover:text-[#0A86F5] transition-colors rounded-lg hover:bg-[rgba(10,134,245,0.08)]">
            {copied ? <Check size={15} className="text-[#0A86F5]" /> : <Copy size={15} />}
        </button>
    )
}

export default function SavedAnswersList() {
    const qc = useQueryClient()
    const [activeCategory, setActiveCategory] = useState('All')
    const [search, setSearch] = useState('')
    const [createOpen, setCreateOpen] = useState(false)
    const [editAnswer, setEditAnswer] = useState<any | null>(null)

    const { data = [], isLoading } = useQuery({
        queryKey: ['saved-answers'],
        queryFn: getSavedAnswers,
    })

    const { mutate: create } = useMutation({
        mutationFn: (data: { title: string; category: string; body: string }) => createSavedAnswer(data),
        onSuccess: () => {
            toast.success('Answer created!')
            qc.invalidateQueries({ queryKey: ['saved-answers'] })
        },
        onError: () => toast.error('Failed to create'),
    })

    const { mutate: edit } = useMutation({
        mutationFn: (data: { title: string; category: string; body: string }) => updateSavedAnswer(editAnswer?.id, data),
        onSuccess: () => {
            toast.success('Answer updated!')
            qc.invalidateQueries({ queryKey: ['saved-answers'] })
            setEditAnswer(null)
        },
        onError: () => toast.error('Failed to update'),
    })

    const { mutate: remove } = useMutation({
        mutationFn: (id: number) => deleteSavedAnswer(id),
        onSuccess: () => {
            toast.success('Answer deleted')
            qc.invalidateQueries({ queryKey: ['saved-answers'] })
        },
        onError: () => toast.error('Failed to delete'),
    })

    const filtered = (data as any[]).filter((a) => {
        const matchCategory = activeCategory === 'All' || a.category === activeCategory
        const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.body.toLowerCase().includes(search.toLowerCase())
        return matchCategory && matchSearch
    })

    if (isLoading)
        return (
            <div className="flex justify-center py-8">
                <Spinner size="lg" />
            </div>
        )

    return (
        <>
            <div>
                <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                        {categories.map((c) => (
                            <button
                                key={c}
                                onClick={() => setActiveCategory(c)}
                                className={`px-4 h-9 rounded-lg text-sm font-medium transition-colors ${
                                    activeCategory === c ? 'bg-[#0A86F5] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#0A86F5] hover:text-[#0A86F5]'
                                }`}>
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
                                className="pl-8 pr-4 h-9 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0A86F5] transition-colors w-52"
                            />
                        </div>
                        <button
                            onClick={() => setCreateOpen(true)}
                            className="flex items-center gap-2 bg-[#0A86F5] hover:bg-[#0875d4] text-white text-sm font-medium px-4 h-9 rounded-lg transition-colors">
                            <Plus size={16} /> New Answer
                        </button>
                    </div>
                </div>

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
                                className="bg-white border border-gray-200 rounded-2xl px-6 py-5 cursor-pointer hover:border-[#0A86F5] hover:shadow-sm transition-all">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <p className="text-base font-medium text-[#202020]">{a.title}</p>
                                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[rgba(10,134,245,0.08)] text-[#0A86F5]">{a.category}</span>
                                        </div>
                                        <p className="text-sm text-gray-500 line-clamp-2 whitespace-pre-wrap">{a.body}</p>
                                    </div>
                                    <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                        <CopyButton text={a.body} />
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setEditAnswer(a)
                                            }}
                                            className="p-1.5 text-gray-400 hover:text-[#0A86F5] transition-colors rounded-lg hover:bg-[rgba(10,134,245,0.08)]">
                                            <SlidersHorizontal size={15} />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                remove(a.id)
                                            }}
                                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <CreateAnswerModal open={createOpen} onClose={() => setCreateOpen(false)} onCreate={create} categories={categories.filter((c) => c !== 'All')} />
            <EditAnswerModal answer={editAnswer} onClose={() => setEditAnswer(null)} onEdit={edit} categories={categories.filter((c) => c !== 'All')} />
        </>
    )
}