import { useNavigate } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
            <div className="text-center max-w-md">
                <div className="relative inline-flex items-center justify-center w-40 h-40 mb-8">
                    <div className="absolute inset-0 rounded-full bg-[rgba(0,182,122,0.08)] animate-pulse" />
                    <div className="absolute inset-4 rounded-full bg-[rgba(0,182,122,0.12)]" />
                    <span className="relative text-6xl font-black text-[#00b67a] tracking-tighter">404</span>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-3">Page not found</h1>
                <p className="text-gray-500 text-base leading-relaxed mb-8">The page you're looking for doesn't exist or has been moved to another URL.</p>

                <div className="flex items-center justify-center gap-3 flex-wrap">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 h-11 px-5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 transition-colors">
                        <ArrowLeft size={16} />
                        Go back
                    </button>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 h-11 px-5 bg-[#00b67a] hover:bg-[#00a36c] rounded-lg text-sm font-medium text-white transition-colors">
                        <Home size={16} />
                        Back to Dashboard
                    </button>
                </div>

                <div className="mt-12 flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#00b67a]" />
                    <div className="w-2 h-2 rounded-full bg-gray-200" />
                    <div className="w-2 h-2 rounded-full bg-gray-200" />
                </div>
            </div>
        </div>
    )
}
