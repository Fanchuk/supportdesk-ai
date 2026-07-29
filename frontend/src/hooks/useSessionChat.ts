import { useEffect, useRef, useState } from 'react'

export function useSessionChat(sessionId: number | null, initialMessages: any[]) {
    const [messages, setMessages] = useState(initialMessages)
    const ws = useRef<WebSocket | null>(null)

    useEffect(() => {
        setMessages(initialMessages)
    }, [initialMessages])

    useEffect(() => {
        if (!sessionId) return

        const token = localStorage.getItem('token')
        ws.current = new WebSocket(`ws://localhost:3000?token=${token}`)

        ws.current.onopen = () => {
            ws.current?.send(JSON.stringify({ type: 'join', sessionId }))
        }

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data)
            if (data.type === 'message') {
                setMessages(p => [...p, data.message])
            }
        }

        return () => ws.current?.close()
    }, [sessionId])

    const sendWs = (message: any) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ type: 'message', sessionId, message }))
        }
    }

    return { messages, setMessages, sendWs }
}