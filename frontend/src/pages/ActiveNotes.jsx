import { useState } from 'react';
import { useNotes } from '../hooks/useNotes';
import { useCategories } from '../hooks/useCategories';
import { NoteForm } from '../components/NoteForm';
import { NoteCard } from '../components/NoteCard';
import { CategoryManager } from '../components/CategoryManager';

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">📝 My Notes</h1>
                <p className="text-gray-600">Create and manage your notes</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
                <div className="min-w-0">
                    <NoteForm onSubmit={handleCreateNote} />

                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Category</h3>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`px-4 py-2 rounded-full font-medium transition-all ${selectedCategory === null
                                        ? 'bg-primary-500 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                All Notes
                            </button>
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`px-4 py-2 rounded-full font-medium transition-all ${selectedCategory === category.id
                                            ? 'text-white shadow-md'
                                            : 'bg-white border-2 hover:shadow-md'
                                        }`}
                                    style={{
                                        borderColor: category.color || '#6366f1',
                                        backgroundColor: selectedCategory === category.id ? category.color || '#6366f1' : 'white',
                                        color: selectedCategory === category.id ? 'white' : category.color || '#6366f1'
                                    }}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading && (
                        <div className="text-center py-12 bg-white rounded-lg shadow-md">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                            <p className="mt-4 text-gray-600">Loading notes...</p>
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="mt-4 text-gray-600">No active notes yet. Create your first note above!</p>
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

                <aside className="lg:sticky lg:top-24 h-fit">
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
