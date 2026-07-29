import api from '../lib/api'

export const getEmailIntegrations = () => api.get('/email-integrations').then(r => r.data)

export const createEmailIntegration = (data: {
    email: string; provider: string; host: string; port: number; login: string
}) => api.post('/email-integrations', data).then(r => r.data)

export const updateEmailIntegration = (id: number, data: {
    email?: string; provider?: string; host?: string; port?: number; isActive?: boolean
}) => api.patch(`/email-integrations/${id}`, data).then(r => r.data)

export const deleteEmailIntegration = (id: number) =>
    api.delete(`/email-integrations/${id}`).then(r => r.data)