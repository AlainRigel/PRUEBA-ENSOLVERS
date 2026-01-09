import { useState, useEffect } from 'react';
import { notesAPI } from '../services/api';

export const useNotes = (archived = null, categoryId = null) => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchNotes = async () => {
        try {
            setLoading(true);
            const response = await notesAPI.getAll(archived, categoryId);
            setNotes(response.data);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching notes:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, [archived, categoryId]);

    const createNote = async (data) => {
        try {
            const response = await notesAPI.create(data);
            setNotes([response.data, ...notes]);
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const updateNote = async (id, data) => {
        try {
            const response = await notesAPI.update(id, data);
            setNotes(notes.map(note => note.id === id ? response.data : note));
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const deleteNote = async (id) => {
        try {
            await notesAPI.delete(id);
            setNotes(notes.filter(note => note.id !== id));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const archiveNote = async (id) => {
        try {
            await notesAPI.archive(id);
            setNotes(notes.filter(note => note.id !== id));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const unarchiveNote = async (id) => {
        try {
            await notesAPI.unarchive(id);
            setNotes(notes.filter(note => note.id !== id));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const addCategoryToNote = async (noteId, categoryId) => {
        try {
            const response = await notesAPI.addCategory(noteId, categoryId);
            setNotes(notes.map(note => note.id === noteId ? response.data : note));
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const removeCategoryFromNote = async (noteId, categoryId) => {
        try {
            const response = await notesAPI.removeCategory(noteId, categoryId);
            setNotes(notes.map(note => note.id === noteId ? response.data : note));
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    return {
        notes,
        loading,
        error,
        fetchNotes,
        createNote,
        updateNote,
        deleteNote,
        archiveNote,
        unarchiveNote,
        addCategoryToNote,
        removeCategoryFromNote,
    };
};
