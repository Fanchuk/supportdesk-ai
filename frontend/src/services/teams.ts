import api from '../lib/api'

export const getTeams = () => api.get('/teams').then((r) => r.data)

export const getTeamById = (id: number) => api.get(`/teams/${id}`).then((r) => r.data)

export const createTeam = (data: { name: string; description?: string }) => api.post('/teams', data).then((r) => r.data)
