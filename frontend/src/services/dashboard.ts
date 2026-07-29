import api from '../lib/api'

export interface DashboardStats {
    open: number
    inProgress: number
    closed: number
    total: number
    percentOpen: number
    percentInProgress: number
    percentClosed: number
}

export const getDashboardStats = (month?: number, year?: number): Promise<DashboardStats> =>
    api.get('/dashboard/stats', { params: { month, year } }).then(r => r.data)

export const getResponseTrend = (days: string) =>
    api.get(`/dashboard/response-trend?days=${days}`).then(r => r.data)

export const getLatestTickets = () =>
    api.get('/dashboard/latest-tickets').then(r => r.data)