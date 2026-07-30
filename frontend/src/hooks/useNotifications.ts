import { useEffect, useState } from 'react'

export interface Notification {
    id: string
    title: string
    message: string
    time: Date
    read: boolean
}

export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([])

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) return

        const ws = new WebSocket(`ws://localhost:3000?token=${token}`)

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data)
                if (data.type === 'notification') {
                    setNotifications(p => [{
                        id: Date.now().toString(),
                        title: data.title ?? 'New notification',
                        message: data.message ?? '',
                        time: new Date(),
                        read: false,
                    }, ...p].slice(0, 20))
                }
            } catch (error) {
                console.error('Failed to process notification:', error)
            }
        }

        ws.onerror = (error) => {
            console.error('WebSocket error:', error)
        }

        return () => {
            ws.onerror = null
            ws.onmessage = null
            ws.close()
        }
    }, [])

    const markAllRead = () =>
        setNotifications(p => p.map(n => ({ ...n, read: true })))

    const unreadCount = notifications.filter(n => !n.read).length

    return { notifications, unreadCount, markAllRead }
}