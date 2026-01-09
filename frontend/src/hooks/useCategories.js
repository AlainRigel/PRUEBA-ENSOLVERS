import { useState, useEffect } from 'react';
import { categoriesAPI } from '../services/api';

export const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await categoriesAPI.getAll();
            setCategories(response.data);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching categories:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const createCategory = async (data) => {
        try {
            const response = await categoriesAPI.create(data);
            setCategories([...categories, response.data]);
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const updateCategory = async (id, data) => {
        try {
            const response = await categoriesAPI.update(id, data);
            setCategories(categories.map(cat => cat.id === id ? response.data : cat));
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const deleteCategory = async (id) => {
        try {
            await categoriesAPI.delete(id);
            setCategories(categories.filter(cat => cat.id !== id));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    return {
        categories,
        loading,
        error,
        fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory,
    };
};
