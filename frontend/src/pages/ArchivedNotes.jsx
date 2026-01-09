import { useNotes } from '../hooks/useNotes';
import { useCategories } from '../hooks/useCategories';
import { NoteCard } from '../components/NoteCard';
import './ArchivedNotes.css';

export const ArchivedNotes = () => {
    const {
        notes,
        loading,
        error,
        updateNote,
        deleteNote,
        unarchiveNote,
        addCategoryToNote,
        removeCategoryFromNote,
    } = useNotes(true);

    const { categories } = useCategories();

    return (
        <div className="archived-notes-page">
            <div className="page-header">
                <h1>📦 Archived Notes</h1>
                <p className="page-subtitle">View and manage your archived notes</p>
            </div>

            {loading && <div className="loading">Loading archived notes...</div>}
            {error && <div className="error">Error: {error}</div>}

            <div className="notes-grid">
                {notes.length === 0 && !loading && (
                    <div className="empty-state">
                        <p>No archived notes. Archive notes from the main page to see them here.</p>
                    </div>
                )}
                {notes.map(note => (
                    <NoteCard
                        key={note.id}
                        note={note}
                        onUpdate={updateNote}
                        onDelete={deleteNote}
                        onUnarchive={unarchiveNote}
                        categories={categories}
                        onAddCategory={addCategoryToNote}
                        onRemoveCategory={removeCategoryFromNote}
                    />
                ))}
            </div>
        </div>
    );
};
