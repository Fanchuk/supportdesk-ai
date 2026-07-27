import api from '../lib/api'

export const getTickets = (params?: { status?: string; priority?: string; sort?: string }) => api.get('/tickets', { params }).then((r) => r.data)

export const getTicketById = (id: number) => api.get(`/tickets/${id}`).then((r) => r.data)

export const createTicket = (data: { title: string; description: string; priority?: string; category?: string }) => api.post('/tickets', data).then((r) => r.data)

export const updateTicket = (id: number, data: { status?: string; priority?: string; assignedToId?: number; teamId?: number }) => api.patch(`/tickets/${id}`, data).then((r) => r.data)

export const deleteTicket = (id: number) => api.delete(`/tickets/${id}`).then((r) => r.data)
