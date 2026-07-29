import api from '../lib/api'

export const getTeams = () => api.get('/teams').then(r => r.data)
export const getTeamById = (id: number) => api.get(`/teams/${id}`).then(r => r.data)
export const createTeam = (data: { name: string; description?: string }) =>
    api.post('/teams', data).then(r => r.data)
export const addTeamMember = (teamId: number, userId: number) =>
    api.post(`/teams/${teamId}/members`, { userId }).then(r => r.data)
export const removeTeamMember = (teamId: number, userId: number) =>
    api.delete(`/teams/${teamId}/members/${userId}`).then(r => r.data)
export const getUsers = () => api.get('/users').then(r => r.data)