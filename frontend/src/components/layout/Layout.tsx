import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="flex h-screen bg-white dark:bg-gray-950 overflow-hidden">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className={`
                fixed lg:relative inset-y-0 left-0 z-40 lg:z-auto
                transform transition-transform duration-300 ease-in-out lg:transform-none
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>

            <div className="flex flex-col flex-1 overflow-hidden min-w-0">
                <Header onMenuClick={() => setSidebarOpen(p => !p)} />
                <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 lg:p-7">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}