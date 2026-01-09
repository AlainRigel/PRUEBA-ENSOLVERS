import { useState } from 'react';

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
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
            <input
                type="text"
                placeholder="Note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            />
            <textarea
                placeholder="Note content..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows="4"
                className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-vertical min-h-[100px] transition-all"
            />
            <div className="flex gap-2">
                <button
                    type="submit"
                    className="px-6 py-2.5 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 active:scale-95 transition-all shadow-sm hover:shadow-md"
                >
                    {initialData ? 'Update' : 'Create'} Note
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 active:scale-95 transition-all"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};
