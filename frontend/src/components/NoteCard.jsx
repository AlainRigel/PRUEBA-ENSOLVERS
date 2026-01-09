import { useState } from 'react';

export const NoteCard = ({
    note,
    onUpdate,
    onDelete,
    onArchive,
    onUnarchive,
    categories,
    onAddCategory,
    onRemoveCategory
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.content);
    const [showCategoryMenu, setShowCategoryMenu] = useState(false);

    const handleUpdate = () => {
        onUpdate(note.id, { title, content });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTitle(note.title);
        setContent(note.content);
        setIsEditing(false);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const availableCategories = categories.filter(
        cat => !note.categories.some(noteCat => noteCat.id === cat.id)
    );

    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            {isEditing ? (
                <div className="space-y-3">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-vertical"
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={handleUpdate}
                            className="px-4 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-colors"
                        >
                            Save
                        </button>
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{note.title}</h3>
                    <p className="text-gray-600 mb-4 whitespace-pre-wrap leading-relaxed">{note.content}</p>

                    <div className="flex flex-wrap gap-2 mb-4 items-center">
                        {note.categories.map(category => (
                            <span
                                key={category.id}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-sm font-medium shadow-sm"
                                style={{ backgroundColor: category.color || '#6366f1' }}
                            >
                                {category.name}
                                <button
                                    onClick={() => onRemoveCategory(note.id, category.id)}
                                    className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                                    title="Remove category"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </span>
                        ))}
                        {availableCategories.length > 0 && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                                    className="px-3 py-1 border-2 border-dashed border-gray-300 text-gray-600 text-sm rounded-full hover:border-gray-400 hover:text-gray-700 transition-colors"
                                    title="Add category"
                                >
                                    + Add Category
                                </button>
                                {showCategoryMenu && (
                                    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[150px]">
                                        {availableCategories.map(category => (
                                            <button
                                                key={category.id}
                                                onClick={() => {
                                                    onAddCategory(note.id, category.id);
                                                    setShowCategoryMenu(false);
                                                }}
                                                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                                            >
                                                <span
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: category.color || '#6366f1' }}
                                                />
                                                <span className="text-sm text-gray-700">{category.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="pt-3 mb-4 border-t border-gray-200">
                        <span className="text-sm text-gray-500">
                            {formatDate(note.updated_at)}
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Edit
                        </button>
                        {note.is_archived ? (
                            <button
                                onClick={() => onUnarchive(note.id)}
                                className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                            >
                                Unarchive
                            </button>
                        ) : (
                            <button
                                onClick={() => onArchive(note.id)}
                                className="px-4 py-2 bg-amber-500 text-white text-sm rounded-lg hover:bg-amber-600 transition-colors"
                            >
                                Archive
                            </button>
                        )}
                        <button
                            onClick={() => onDelete(note.id)}
                            className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};
