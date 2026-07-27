import { Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { getLatestTickets } from '../../services/dashboard'

export default function ExportButton() {
    const handleExport = async () => {
        const toastId = toast.loading('Preparing export...')
        try {
            const data = await getLatestTickets()
            const headers = ['ID', 'Title', 'Status', 'Priority', 'Created By', 'Email', 'Created At']
            const rows = data.map((t: any) => [
                t.id, t.title, t.status, t.priority, 
                t.user_name ?? '', t.user_email ?? '', 
                new Date(t.created_at).toLocaleDateString()])
            const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
            const blob = new Blob([csv], { type: 'text/csv' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `tickets-${Date.now()}.csv`
            a.click()
            URL.revokeObjectURL(url)
            toast.success('Exported successfully!', { id: toastId })
        } catch {
            toast.error('Export failed', { id: toastId })
        }
    }

    return (
        <button
            onClick={handleExport}
            className="flex items-center gap-2 border border-gray-200 rounded-[4px] px-[15px] h-10 text-sm text-gray-500 bg-white shadow-sm hover:bg-gray-50 transition-colors">
            <Upload size={14} />
            Export
        </button>
    )
}
