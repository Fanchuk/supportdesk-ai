import { useState } from 'react'
import { Eye, EyeOff, Shield, Smartphone } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { changePassword } from '../../services/auth'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

export default function SettingsSecurity() {
    const { t } = useTranslation()
    const [showCurrent, setShowCurrent] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [twoFactor, setTwoFactor] = useState(false)
    const [form, setForm] = useState({ current: '', newPass: '', confirm: '' })

    const { mutate: save, isPending } = useMutation({
        mutationFn: () => changePassword({ currentPassword: form.current, newPassword: form.newPass }),
        onSuccess: () => {
            toast.success('Password changed!')
            setForm({ current: '', newPass: '', confirm: '' })
        },
        onError: (err: any) => toast.error(err?.response?.data?.error ?? 'Failed to change password'),
    })

    const handleSave = () => {
        if (!form.current || !form.newPass || !form.confirm) return toast.error('Fill in all fields')
        if (form.newPass !== form.confirm) return toast.error('Passwords do not match')
        if (form.newPass.length < 6) return toast.error('Minimum 6 characters')
        save()
    }

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-[#202020] dark:text-gray-100 mb-6">{t('security')}</h2>

            <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">{t('changePassword')}</p>
                <div className="flex flex-col gap-4">
                    {[
                        { label: t('currentPassword'), key: 'current', show: showCurrent, toggle: () => setShowCurrent(p => !p) },
                        { label: t('newPassword'), key: 'newPass', show: showNew, toggle: () => setShowNew(p => !p) },
                        { label: t('confirmPassword'), key: 'confirm', show: showConfirm, toggle: () => setShowConfirm(p => !p) },
                    ].map(({ label, key, show, toggle }) => (
                        <div key={key} className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
                            <div className="relative">
                                <input type={show ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={form[key as keyof typeof form]}
                                    onChange={(e) => setForm(p => ({ ...p, [key]: e.target.value }))}
                                    className="w-full h-10 px-3 pr-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm outline-none focus:border-[#0A86F5] focus:ring-2 focus:ring-[#0A86F5]/20 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                />
                                <button type="button" onClick={toggle}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    {show ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between py-4 border-t border-gray-100 dark:border-gray-800 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[rgba(10,134,245,0.1)] flex items-center justify-center">
                        <Smartphone size={16} className="text-[#0A86F5]" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-[#202020] dark:text-gray-200">{t('twoFactor')}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{t('twoFactorDesc')}</p>
                    </div>
                </div>
                <button onClick={() => {
                    setTwoFactor(p => !p)
                    toast.success(twoFactor ? '2FA disabled' : '2FA enabled!')
                }}
                    className={`w-12 h-6 rounded-full relative transition-colors ${twoFactor ? 'bg-[#0A86F5]' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${twoFactor ? 'left-7' : 'left-1'}`} />
                </button>
            </div>

            <div className="py-4 border-t border-gray-100 dark:border-gray-800 mb-6">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-[rgba(10,134,245,0.1)] flex items-center justify-center">
                        <Shield size={16} className="text-[#0A86F5]" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-[#202020] dark:text-gray-200">{t('activeSessions')}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{t('activeSessionsDesc')}</p>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    {[
                        { device: 'Chrome on macOS', location: 'Lviv, Ukraine', current: true },
                        { device: 'Safari on iPhone', location: 'Lviv, Ukraine', current: false },
                    ].map((s) => (
                        <div key={s.device} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <div>
                                <p className="text-sm text-[#202020] dark:text-gray-200">{s.device}</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500">{s.location}</p>
                            </div>
                            {s.current
                                ? <span className="text-xs font-medium text-[#0A86F5] bg-[rgba(10,134,245,0.08)] px-2 py-0.5 rounded-full">{t('current')}</span>
                                : <button onClick={() => toast.success('Session terminated')} className="text-xs text-red-500 hover:underline">{t('terminate')}</button>
                            }
                        </div>
                    ))}
                </div>
            </div>

            <button onClick={handleSave} disabled={isPending}
                className="h-10 px-6 bg-[#0A86F5] hover:bg-[#0875d4] disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
            >
                {isPending ? t('changingPassword') : t('changePassword')}
            </button>
        </div>
    )
}