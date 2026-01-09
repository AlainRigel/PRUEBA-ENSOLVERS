import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Notes API
export const notesAPI = {
    getAll: (archived = null, categoryId = null) => {
        const params = {};
        if (archived !== null) params.archived = archived;
        if (categoryId) params.category_id = categoryId;
        return api.get('/notes', { params });
    },

    getById: (id) => api.get(`/notes/${id}`),

    create: (data) => api.post('/notes', data),

    update: (id, data) => api.put(`/notes/${id}`, data),

    delete: (id) => api.delete(`/notes/${id}`),

    archive: (id) => api.patch(`/notes/${id}/archive`),

    unarchive: (id) => api.patch(`/notes/${id}/unarchive`),

    addCategory: (noteId, categoryId) =>
        api.post(`/notes/${noteId}/categories/${categoryId}`),

    removeCategory: (noteId, categoryId) =>
        api.delete(`/notes/${noteId}/categories/${categoryId}`),
};

// Categories API
export const categoriesAPI = {
    getAll: () => api.get('/categories'),

    getById: (id) => api.get(`/categories/${id}`),

    create: (data) => api.post('/categories', data),

    update: (id, data) => api.put(`/categories/${id}`, data),

    delete: (id) => api.delete(`/categories/${id}`),
};

export default api;
