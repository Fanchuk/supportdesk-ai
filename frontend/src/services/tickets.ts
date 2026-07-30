import api from '../lib/api'

export interface TicketsPagination {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
}

export interface TicketsResponse {
    data: any[]
    pagination: TicketsPagination
}

export const getTickets = (params?: {
    status?: string
    priority?: string
    sort?: string
    page?: number
    limit?: number
}) => api.get('/tickets', { params }).then(r => r.data as TicketsResponse)

export const getTicketById = (id: number) => api.get(`/tickets/${id}`).then((r) => r.data)

export const createTicket = (data: { title: string; description: string; priority?: string; category?: string }) => api.post('/tickets', data).then((r) => r.data)

export const updateTicket = (id: number, data: { status?: string; priority?: string; assignedToId?: number; teamId?: number }) => api.patch(`/tickets/${id}`, data).then((r) => r.data)

export const deleteTicket = (id: number) => api.delete(`/tickets/${id}`).then((r) => r.data)