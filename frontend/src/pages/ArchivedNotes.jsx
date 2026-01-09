import { useNotes } from '../hooks/useNotes';
import { useCategories } from '../hooks/useCategories';
import { NoteCard } from '../components/NoteCard';

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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">📦 Archived Notes</h1>
                <p className="text-gray-600">View and manage your archived notes</p>
            </div>

            {loading && (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                    <p className="mt-4 text-gray-600">Loading archived notes...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
                    Error: {error}
                </div>
            )}

            <div className="space-y-4">
                {notes.length === 0 && !loading && (
                    <div className="text-center py-16 bg-white rounded-lg shadow-md">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="mt-4 text-gray-600">No archived notes. Archive notes from the main page to see them here.</p>
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
