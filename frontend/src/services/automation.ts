import api from '../lib/api'

export const getAutomationRules = () => api.get('/automation-rules').then((r) => r.data)

export const createAutomationRule = (data: {
    name: string
    description?: string
    trigger: 'new_ticket' | 'time_based' | 'status_change'
    action: 'close_ticket' | 'send_email' | 'change_priority' | 'reassign'
    conditionHours?: number
}) => api.post('/automation-rules', data).then((r) => r.data)

export const updateAutomationRule = (id: number, data: { isActive?: boolean; name?: string }) => api.patch(`/automation-rules/${id}`, data).then((r) => r.data)

export const getAutomationStats = () => api.get('/automation-rules/stats').then((r) => r.data)
