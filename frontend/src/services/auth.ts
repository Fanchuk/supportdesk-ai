import api from '../lib/api'

export const login = (data: { email: string; password: string }) => api.post('/auth/login', data).then((r) => r.data)

export const register = (data: { name: string; email: string; password: string; role?: string }) => api.post('/auth/register', data).then((r) => r.data)

export const getCurrentUser = () => api.get('/auth/me').then((r) => r.data)

export const updateProfile = (data: { name?: string; email?: string }) => api.patch('/auth/me', data).then((r) => r.data)

export const changePassword = (data: { currentPassword: string; newPassword: string }) => api.patch('/auth/me', data).then((r) => r.data)
