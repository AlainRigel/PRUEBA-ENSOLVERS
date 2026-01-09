import { useState } from 'react';
import './NoteForm.css';

export const NoteForm = ({ onSubmit, initialData = null, onCancel }) => {
    const [title, setTitle] = useState(initialData?.title || '');
    const [content, setContent] = useState(initialData?.content || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title.trim() && content.trim()) {
            onSubmit({ title, content });
            if (!initialData) {
                setTitle('');
                setContent('');
            }
        }
    };

    return (
        <form className="note-form" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="note-input"
            />
            <textarea
                placeholder="Note content..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows="4"
                className="note-textarea"
            />
            <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                    {initialData ? 'Update' : 'Create'} Note
                </button>
                {onCancel && (
                    <button type="button" onClick={onCancel} className="btn btn-secondary">
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};
