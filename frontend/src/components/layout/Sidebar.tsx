import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Inbox, Users, Tag, Clock, Settings, Zap, BookOpen, Lock, GitMerge, Mail, BarChart2, Shield, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { getCurrentUser } from '../../services/auth'
import SettingsModal from '../header/SettingsModal'

export default function Sidebar() {
    const { t } = useTranslation()
    const [settingsOpen, setSettingsOpen] = useState(false)

    const { data: user } = useQuery({
        queryKey: ['current-user'],
        queryFn: getCurrentUser,
    })

    const navTop = [
        { to: '/dashboard', icon: LayoutDashboard, label: t('dashboard') },
        { to: '/inbox', icon: Inbox, label: t('inbox') },
        { to: '/assignment', icon: Users, label: t('ticketAssignment') },
        { to: '/tickets', icon: Tag, label: t('ticketTopics') },
        { to: '/sla', icon: Clock, label: t('slaManagement') },
    ]

    const navBottom = [
        { to: '/custom-status', icon: Shield, label: t('customTicketStatus') },
        { to: '/automation', icon: Zap, label: t('automation') },
        { to: '/saved-answers', icon: BookOpen, label: t('savedAnswers') },
        { to: '/team-work', icon: Lock, label: t('teamWork') },
        { to: '/joint', icon: GitMerge, label: t('jointEditing') },
        { to: '/email', icon: Mail, label: t('emailIntegration') },
        { to: '/reports', icon: BarChart2, label: t('reports') },
        { to: '/settings', icon: Settings, label: t('settings') },
    ]

    return (
        <>
            <aside
                className="w-[280px] h-screen flex flex-col flex-shrink-0"
                style={{ background: 'linear-gradient(90deg, #a600ff 9%, #8b8ffd 100%)' }}
            >
                <div className="h-[80px] px-6 flex items-center gap-3">
                    <img src="/logo.svg" alt="logo" width={32} height={32} />
                    <span className="font-semibold text-xl text-white">Ticket Support</span>
                </div>

                <nav className="px-6 flex flex-col gap-1">
                    {navTop.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 text-sm font-medium no-underline transition-colors rounded-lg ${
                                    isActive ? 'text-white' : 'text-white/70 hover:text-white hover:bg-white/10'
                                }`
                            }
                            style={({ isActive }: { isActive: boolean }) =>
                                isActive ? { background: 'linear-gradient(90deg, #3a49bb 6%, #8b8ffd 100%)' } : {}
                            }
                        >
                            <Icon size={20} />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="border-t border-white/20 mx-6 my-2" />

                <nav className="px-6 flex flex-col gap-1 flex-1">
                    {navBottom.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 text-sm font-medium no-underline transition-colors rounded-lg ${
                                    isActive ? 'text-white' : 'text-white/70 hover:text-white hover:bg-white/10'
                                }`
                            }
                            style={({ isActive }: { isActive: boolean }) =>
                                isActive ? { background: 'linear-gradient(90deg, #3a49bb 6%, #8b8ffd 100%)' } : {}
                            }
                        >
                            <Icon size={20} />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div
                    onClick={() => setSettingsOpen(true)}
                    className="border-t border-white/20 px-6 py-5 flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-colors"
                >
                    <div className="w-10 h-10 rounded-full bg-white/20 flex-shrink-0 flex items-center justify-center text-white font-semibold text-sm">
                        {user?.name?.slice(0, 2).toUpperCase() ?? 'AU'}
                    </div>
                    <div className="flex-1">
                        <div className="text-xs text-white/60">{t('welcomeBack')}</div>
                        <div className="text-sm font-medium text-white">{user?.name ?? 'Admin User'}</div>
                    </div>
                    <ChevronRight size={16} className="text-white/40" />
                </div>
            </aside>

            <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
        </>
    )
}