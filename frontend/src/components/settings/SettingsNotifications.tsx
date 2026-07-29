import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
    return (
        <button onClick={() => onChange(!value)}
            className={`w-12 h-6 rounded-full relative transition-colors ${value ? 'bg-[#0A86F5]' : 'bg-gray-200 dark:bg-gray-700'}`}
        >
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${value ? 'left-7' : 'left-1'}`} />
        </button>
    )
}

export default function SettingsNotifications() {
    const { t } = useTranslation()

    const notificationItems = [
        { key: 'newTicket', label: t('newTicket'), description: t('newTicketDesc') },
        { key: 'ticketAssigned', label: t('ticketAssigned'), description: t('ticketAssignedDesc') },
        { key: 'ticketResolved', label: t('ticketResolved'), description: t('ticketResolvedDesc') },
        { key: 'mention', label: t('mentions'), description: t('mentionsDesc') },
        { key: 'slaBreached', label: t('slaBreach'), description: t('slaBreachDesc') },
        { key: 'weeklyReport', label: t('weeklyReport'), description: t('weeklyReportDesc') },
    ]

    const [settings, setSettings] = useState({
        newTicket: true, ticketAssigned: true, ticketResolved: false,
        mention: true, slaBreached: true, weeklyReport: false,
    })

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-[#202020] dark:text-gray-100 mb-6">{t('notifications')}</h2>
            <div className="flex flex-col gap-4 mb-6">
                {notificationItems.map((item) => (
                    <div key={item.key} className="flex items-center justify-between gap-4 py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
                        <div>
                            <p className="text-sm font-medium text-[#202020] dark:text-gray-200">{item.label}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{item.description}</p>
                        </div>
                        <Toggle
                            value={settings[item.key as keyof typeof settings]}
                            onChange={(v) => setSettings(p => ({ ...p, [item.key]: v }))}
                        />
                    </div>
                ))}
            </div>
            <button onClick={() => toast.success('Notification settings saved!')}
                className="h-10 px-6 bg-[#0A86F5] hover:bg-[#0875d4] text-white text-sm font-medium rounded-lg transition-colors"
            >
                {t('saveChanges')}
            </button>
        </div>
    )
}