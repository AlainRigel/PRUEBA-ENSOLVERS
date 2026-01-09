import { useState } from 'react';
import './NoteCard.css';

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
        <div className="note-card">
            {isEditing ? (
                <div className="note-edit">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="note-input"
                    />
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows="4"
                        className="note-textarea"
                    />
                    <div className="note-actions">
                        <button onClick={handleUpdate} className="btn btn-primary btn-sm">
                            Save
                        </button>
                        <button onClick={handleCancel} className="btn btn-secondary btn-sm">
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <h3 className="note-title">{note.title}</h3>
                    <p className="note-content">{note.content}</p>

                    <div className="note-categories">
                        {note.categories.map(category => (
                            <span
                                key={category.id}
                                className="category-tag"
                                style={{ backgroundColor: category.color || '#6366f1' }}
                            >
                                {category.name}
                                <button
                                    onClick={() => onRemoveCategory(note.id, category.id)}
                                    className="category-remove"
                                    title="Remove category"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                        {availableCategories.length > 0 && (
                            <div className="category-add-wrapper">
                                <button
                                    onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                                    className="btn-add-category"
                                    title="Add category"
                                >
                                    + Add Category
                                </button>
                                {showCategoryMenu && (
                                    <div className="category-menu">
                                        {availableCategories.map(category => (
                                            <button
                                                key={category.id}
                                                onClick={() => {
                                                    onAddCategory(note.id, category.id);
                                                    setShowCategoryMenu(false);
                                                }}
                                                className="category-menu-item"
                                            >
                                                <span
                                                    className="category-color"
                                                    style={{ backgroundColor: category.color || '#6366f1' }}
                                                />
                                                {category.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="note-meta">
                        <span className="note-date">
                            {formatDate(note.updated_at)}
                        </span>
                    </div>

                    <div className="note-actions">
                        <button onClick={() => setIsEditing(true)} className="btn btn-secondary btn-sm">
                            Edit
                        </button>
                        {note.is_archived ? (
                            <button onClick={() => onUnarchive(note.id)} className="btn btn-success btn-sm">
                                Unarchive
                            </button>
                        ) : (
                            <button onClick={() => onArchive(note.id)} className="btn btn-warning btn-sm">
                                Archive
                            </button>
                        )}
                        <button onClick={() => onDelete(note.id)} className="btn btn-danger btn-sm">
                            Delete
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};
