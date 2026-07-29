import api from '../lib/api'

export const getSavedAnswers = () => api.get('/saved-answers').then(r => r.data)

export const createSavedAnswer = (data: { title: string; category: string; body: string }) =>
    api.post('/saved-answers', data).then(r => r.data)

export const updateSavedAnswer = (id: number, data: { title?: string; category?: string; body?: string }) =>
    api.patch(`/saved-answers/${id}`, data).then(r => r.data)

export const deleteSavedAnswer = (id: number) =>
    api.delete(`/saved-answers/${id}`).then(r => r.data)