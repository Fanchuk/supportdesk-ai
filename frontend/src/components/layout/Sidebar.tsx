import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Inbox, Users, Tag, Clock, Settings, Zap, BookOpen, Lock, GitMerge, Mail, BarChart2, Shield, ChevronRight } from 'lucide-react'

const navTop = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/inbox', icon: Inbox, label: 'Inbox' },
    { to: '/assignment', icon: Users, label: 'Ticket Assignment' },
    { to: '/tickets', icon: Tag, label: 'Ticket Topics' },
    { to: '/sla', icon: Clock, label: 'SLA Management' },
]

const navBottom = [
    { to: '/custom-status', icon: Shield, label: 'Custom Ticket Status' },
    { to: '/automation', icon: Zap, label: 'Automation' },
    { to: '/saved-answers', icon: BookOpen, label: 'Saved Answers' },
    { to: '/team', icon: Lock, label: 'Team work' },
    { to: '/joint', icon: GitMerge, label: 'Joint Editing' },
    { to: '/email', icon: Mail, label: 'Email Integration' },
    { to: '/reports', icon: BarChart2, label: 'Report and Statistics' },
    { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
    return (
        <aside className="w-[280px] h-screen border-r border-gray-200 bg-white flex flex-col flex-shrink-0">
            {/* Logo */}
            <div className="h-[80px] px-6 flex items-center gap-3">
                <img src="/logo.svg" alt="logo" width={32} height={32} />
                <span className="font-semibold text-xl text-gray-900">Ticket Support</span>
            </div>

            {/* Nav Top */}
            <nav className="px-6 flex flex-col gap-1">
                {navTop.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 text-sm font-medium no-underline transition-colors
              ${isActive ? 'bg-[rgba(0,182,122,0.1)] text-[#00b67a] rounded-lg' : 'text-gray-500 rounded-full hover:bg-gray-50'}`
                        }>
                        <Icon size={20} />
                        {label}
                    </NavLink>
                ))}
            </nav>

            {/* Divider */}
            <div className="border-t border-gray-200 mx-6 my-2" />

            {/* Nav Bottom */}
            <nav className="px-6 flex flex-col gap-1 flex-1">
                {navBottom.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 text-sm font-medium no-underline transition-colors
              ${isActive ? 'bg-[rgba(0,182,122,0.1)] text-[#00b67a] rounded-lg' : 'text-gray-500 rounded-full hover:bg-gray-50'}`
                        }>
                        <Icon size={20} />
                        {label}
                    </NavLink>
                ))}
            </nav>

            {/* User */}
            <div className="border-t border-gray-200 px-6 py-5 flex items-center gap-3 cursor-pointer hover:bg-gray-50">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                    <div className="w-full h-full bg-green-100 flex items-center justify-center text-green-600 font-semibold text-sm">SM</div>
                </div>
                <div className="flex-1">
                    <div className="text-xs text-gray-500">Welcome back 👋</div>
                    <div className="text-sm font-medium text-gray-900">SM Ashik</div>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
            </div>
        </aside>
    )
}
