import { useState, useEffect } from 'react'
import { Camera } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCurrentUser, updateProfile } from '../../services/auth'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import Spinner from '../ui/Spinner'

export default function SettingsProfile() {
    const { t } = useTranslation()
    const qc = useQueryClient()
    const [form, setForm] = useState({ name: '', email: '', role: '' })

    const { data: user, isLoading } = useQuery({
        queryKey: ['current-user'],
        queryFn: getCurrentUser,
    })

    useEffect(() => {
        if (user) setForm({ name: user.name ?? '', email: user.email ?? '', role: user.role ?? '' })
    }, [user])

    const { mutate: save, isPending } = useMutation({
        mutationFn: () => updateProfile({ name: form.name, email: form.email }),
        onSuccess: () => {
            toast.success('Profile updated!')
            qc.invalidateQueries({ queryKey: ['current-user'] })
        },
        onError: () => toast.error('Failed to update profile'),
    })

    if (isLoading) return <div className="flex justify-center py-8"><Spinner size="lg" /></div>

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-[#202020] dark:text-gray-100 mb-6">{t('profile')}</h2>

            <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-[rgba(10,134,245,0.1)] flex items-center justify-center text-[#0A86F5] font-bold text-xl">
                        {form.name?.slice(0, 2).toUpperCase()}
                    </div>
                    <button className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#0A86F5] flex items-center justify-center">
                        <Camera size={12} className="text-white" />
                    </button>
                </div>
                <div>
                    <p className="text-sm font-medium text-[#202020] dark:text-gray-200">{form.name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{form.role}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {[
                    { label: t('fullName'), key: 'name', type: 'text', disabled: false },
                    { label: t('email'), key: 'email', type: 'email', disabled: false },
                    { label: t('role'), key: 'role', type: 'text', disabled: true },
                ].map(({ label, key, type, disabled }) => (
                    <div key={key} className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
                        <input type={type}
                            value={form[key as keyof typeof form]}
                            disabled={disabled}
                            onChange={(e) => setForm(p => ({ ...p, [key]: e.target.value }))}
                            className={`h-10 px-3 rounded-lg border text-sm outline-none transition-all ${
                                disabled
                                    ? 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                                    : 'border-gray-200 dark:border-gray-700 bg-transparent dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-[#0A86F5] focus:ring-2 focus:ring-[#0A86F5]/20'
                            }`}
                        />
                    </div>
                ))}
            </div>

            <button onClick={() => save()} disabled={isPending}
                className="h-10 px-6 bg-[#0A86F5] hover:bg-[#0875d4] disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
            >
                {isPending ? t('saving') : t('saveChanges')}
            </button>
        </div>
    )
}