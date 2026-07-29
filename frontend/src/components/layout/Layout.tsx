import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout() {
    return (
        <div className="flex h-screen bg-white dark:bg-gray-950 overflow-hidden">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-7">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}