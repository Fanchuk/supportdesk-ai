import api from '../lib/api'

export const getJointStats = () => api.get('/joint-sessions/stats').then(r => r.data)
export const getJointSessions = () => api.get('/joint-sessions').then(r => r.data)
export const getSessionMessages = (id: number) => api.get(`/joint-sessions/${id}/messages`).then(r => r.data)
export const sendSessionMessage = (id: number, body: string) =>
    api.post(`/joint-sessions/${id}/messages`, { body }).then(r => r.data)
export const createJointSession = (ticketId: number) =>
    api.post('/joint-sessions', { ticketId }).then(r => r.data)