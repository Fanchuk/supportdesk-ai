import api from '../lib/api'

export const getCustomStatuses = () => api.get('/custom-statuses').then(r => r.data)

export const createCustomStatus = (data: { label: string; color: string; description?: string }) =>
    api.post('/custom-statuses', data).then(r => r.data)

export const updateCustomStatus = (id: number, data: { label?: string; color?: string; description?: string; isActive?: boolean }) =>
    api.patch(`/custom-statuses/${id}`, data).then(r => r.data)

export const deleteCustomStatus = (id: number) =>
    api.delete(`/custom-statuses/${id}`).then(r => r.data)