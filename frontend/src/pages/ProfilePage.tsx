import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Shield, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ProfilePage() {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const initials =
        user?.name
            ?.split(' ')
            .map((n: string) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase() || 'AU'

    const fields = [
        { icon: Mail, label: 'Email', value: user?.email || '—' },
        { icon: Shield, label: 'Role', value: user?.role || '—' },
        { icon: Calendar, label: 'Member since', value: 'July 2026' },
    ]

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6 transition-colors">
                <ArrowLeft size={16} />
                Back
            </button>

            <motion.div initial= {{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="h-24 bg-gradient-to-r from-[#00b67a] to-[#4ade80]" />

                <div className="px-8 pb-8">
                    <div className="-mt-12 mb-6 flex items-end justify-between">
                        <div className="w-20 h-20 rounded-2xl bg-white dark:bg-gray-900 border-4 border-white dark:border-gray-900 shadow-md flex items-center justify-center text-[#00b67a] font-bold text-2xl">
                            {initials}
                        </div>
                        <button className="h-9 px-4 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            Edit Profile
                        </button>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{user?.name || 'Admin User'}</h1>
                    <p className="text-sm text-gray-400 mb-8 capitalize">{user?.role || 'agent'}</p>

                    <div className="flex flex-col gap-4">
                        {fields.map(({ icon: Icon, label, value }) => (
                            <div key={label} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-transparent dark:border-gray-800">
                                <div className="w-9 h-9 rounded-lg bg-[rgba(0,182,122,0.1)] flex items-center justify-center flex-shrink-0">
                                    <Icon size={16} className="text-[#00b67a]" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">{label}</p>
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 capitalize">{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
