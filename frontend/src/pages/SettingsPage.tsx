import { useTranslation } from 'react-i18next'
import SettingsProfile from '../components/settings/SettingsProfile'
import SettingsNotifications from '../components/settings/SettingsNotifications'
import SettingsAppearance from '../components/settings/SettingsAppearance'
import SettingsSecurity from '../components/settings/SettingsSecurity'

export default function SettingsPage() {
    const { t } = useTranslation()
    return (
        <div className="max-w-3xl mx-auto flex flex-col gap-6 pb-10">
            <div>
                <h1 className="text-[40px] font-semibold text-[#1c1c1c] dark:text-gray-100 leading-none">{t('settings')}</h1>
                <p className="text-base text-[#1c1c1c] dark:text-gray-500 mt-2">{t('settingsSubtitle')}</p>
            </div>
            <SettingsProfile />
            <SettingsNotifications />
            <SettingsAppearance />
            <SettingsSecurity />
        </div>
    )
}