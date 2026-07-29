import api from '../lib/api'

export const getReportStats = (period: string) =>
    api.get(`/reports/stats?period=${period}`).then(r => r.data)

export const getTicketsByDay = (period: string) =>
    api.get(`/reports/tickets-by-day?period=${period}`).then(r => r.data)

export const getResponseByCategory = (period: string) =>
    api.get(`/reports/response-by-category?period=${period}`).then(r => r.data)

export const getAgentsStats = (period: string) =>
    api.get(`/reports/agents?period=${period}`).then(r => r.data)