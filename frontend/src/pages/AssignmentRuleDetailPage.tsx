import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getAssignmentRules } from '../services/assignment'
import { ArrowLeft, Tag, Users, Hash, ToggleLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import Spinner from '../components/ui/Spinner'

export default function AssignmentRuleDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    const { data: rules = [], isLoading } = useQuery({
        queryKey: ['assignment-rules'],
        queryFn: getAssignmentRules,
    })

    const rule = (rules as any[]).find((r) => String(r.id) === id)

    if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
    if (!rule) return <div className="text-center py-20 text-gray-400 dark:text-gray-500">Rule not found</div>

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
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{rule.name}</h1>
                        <span className={`text-xs font-medium px-3 py-1 rounded-full flex-shrink-0 ${rule.is_active || rule.isActive ? 'bg-[#e4faef] text-[#00b67a] dark:bg-[#00b67a]/10' : 'bg-gray-100 text-gray-400 dark:bg-gray-800'}`}>
                            {rule.is_active || rule.isActive ? '● Active' : '○ Inactive'}
                        </span>
                    </div>

                    {rule.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6 whitespace-pre-wrap">
                            {rule.description}
                        </p>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { icon: Users, label: 'Assigned Team', value: rule.team_name ?? '—' },
                            { icon: Hash, label: 'Tickets Assigned', value: rule.tickets_assigned ?? '—' },
                            { icon: ToggleLeft, label: 'Status', value: (rule.is_active || rule.isActive) ? 'Active' : 'Inactive' },
                            { icon: Tag, label: 'Created', value: rule.created_at ? formatDistanceToNow(new Date(rule.created_at), { addSuffix: true }) : '—' },
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

                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        Keywords ({rule.keywords?.length ?? 0})
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {(rule.keywords as string[])?.map((k) => (
                            <span key={k} className="px-3 py-1 bg-[rgba(0,182,122,0.08)] dark:bg-[rgba(0,182,122,0.15)] text-[#00b67a] text-sm font-mono rounded-lg">
                                {k}
                            </span>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    )
}