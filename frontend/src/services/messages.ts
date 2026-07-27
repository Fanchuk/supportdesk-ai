import api from '../lib/api'

export const sendMessage = (ticketId: number, body: string) => api.post(`/tickets/${ticketId}/messages`, { body }).then((r) => r.data)

export const getAiReply = (ticketId: number) => api.post(`/tickets/${ticketId}/messages/ai-reply`).then((r) => r.data)
