import api from '../lib/api'

export const getDashboardStats = (month?: number, year?: number) =>
    api.get('/dashboard/stats', { params: { month, year } }).then(r => r.data)

export const getResponseTrend = (days: string) =>
    api.get(`/dashboard/response-trend?days=${days}`).then(r => r.data)

export const getLatestTickets = () =>
    api.get('/dashboard/latest-tickets').then(r => r.data)