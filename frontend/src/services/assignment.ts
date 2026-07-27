import api from '../lib/api'

export const getAssignmentRules = () => api.get('/assignment-rules').then((r) => r.data)

export const createAssignmentRule = (data: { name: string; keywords: string[]; teamId: number }) => api.post('/assignment-rules', data).then((r) => r.data)

export const updateAssignmentRule = (id: number, data: { isActive?: boolean; name?: string; keywords?: string[]; teamId?: number }) => api.patch(`/assignment-rules/${id}`, data).then((r) => r.data)
