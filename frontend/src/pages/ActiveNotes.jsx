import { useState } from 'react';
import { useNotes } from '../hooks/useNotes';
import { useCategories } from '../hooks/useCategories';
import { NoteForm } from '../components/NoteForm';
import { NoteCard } from '../components/NoteCard';
import { CategoryManager } from '../components/CategoryManager';
import './ActiveNotes.css';

export const ActiveNotes = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const {
        notes,
        loading,
        error,
        createNote,
        updateNote,
        deleteNote,
        archiveNote,
        addCategoryToNote,
        removeCategoryFromNote,
    } = useNotes(false, selectedCategory);

    const {
        categories,
        createCategory,
        updateCategory,
        deleteCategory,
    } = useCategories();

    const handleCreateNote = async (data) => {
        try {
            await createNote(data);
        } catch (error) {
            alert('Error creating note: ' + error.message);
        }
    };

    return (
        <div className="active-notes-page">
            <div className="page-header">
                <h1>📝 My Notes</h1>
                <p className="page-subtitle">Create and manage your notes</p>
            </div>

            <div className="content-layout">
                <div className="main-content">
                    <NoteForm onSubmit={handleCreateNote} />

                    <div className="filter-section">
                        <h3>Filter by Category</h3>
                        <div className="category-filters">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`filter-btn ${selectedCategory === null ? 'active' : ''}`}
                            >
                                All Notes
                            </button>
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                                    style={{
                                        borderColor: category.color || '#6366f1',
                                        color: selectedCategory === category.id ? 'white' : category.color || '#6366f1',
                                        backgroundColor: selectedCategory === category.id ? category.color || '#6366f1' : 'transparent'
                                    }}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading && <div className="loading">Loading notes...</div>}
                    {error && <div className="error">Error: {error}</div>}

                    <div className="notes-grid">
                        {notes.length === 0 && !loading && (
                            <div className="empty-state">
                                <p>No active notes yet. Create your first note above!</p>
                            </div>
                        )}
                        {notes.map(note => (
                            <NoteCard
                                key={note.id}
                                note={note}
                                onUpdate={updateNote}
                                onDelete={deleteNote}
                                onArchive={archiveNote}
                                categories={categories}
                                onAddCategory={addCategoryToNote}
                                onRemoveCategory={removeCategoryFromNote}
                            />
                        ))}
                    </div>
                </div>

                <aside className="sidebar">
                    <CategoryManager
                        categories={categories}
                        onCreate={createCategory}
                        onUpdate={updateCategory}
                        onDelete={deleteCategory}
                    />
                </aside>
            </div>
        </div>
    );
};
