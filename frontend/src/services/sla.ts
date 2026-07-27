import api from '../lib/api'

export const getSlaStats = () => api.get('/sla/stats').then(r => r.data)
export const getSlaPolicies = () => api.get('/sla/policies').then(r => r.data)
export const getSlaBreaches = () => api.get('/sla/breaches').then(r => r.data)
export const updateSlaPolicy = (id: number, data: Partial<{ isActive: boolean; name: string; priority: string; firstResponseHours: number; resolutionHours: number }>) =>
    api.patch(`/sla/policies/${id}`, data).then(r => r.data)
export const createSlaPolicy = (data: { name: string; priority: string; firstResponseHours: number; resolutionHours: number }) =>
    api.post('/sla/policies', data).then(r => r.data)