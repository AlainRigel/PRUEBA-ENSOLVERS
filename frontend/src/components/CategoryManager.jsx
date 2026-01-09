import { useState } from 'react';

export const CategoryManager = ({ categories, onCreate, onUpdate, onDelete }) => {
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [name, setName] = useState('');
    const [color, setColor] = useState('#6366f1');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await onUpdate(editingId, { name, color });
                setEditingId(null);
            } else {
                await onCreate({ name, color });
            }
            setName('');
            setColor('#6366f1');
            setShowForm(false);
        } catch (error) {
            alert('Error: ' + (error.response?.data?.detail || error.message));
        }
    };

    const handleEdit = (category) => {
        setEditingId(category.id);
        setName(category.name);
        setColor(category.color || '#6366f1');
        setShowForm(true);
    };

    const handleCancel = () => {
        setEditingId(null);
        setName('');
        setColor('#6366f1');
        setShowForm(false);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-colors"
                >
                    {showForm ? 'Cancel' : '+ New Category'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
                    <input
                        type="text"
                        placeholder="Category name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                    <div className="flex items-center gap-3">
                        <label className="text-sm text-gray-700 font-medium">Color:</label>
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-colors"
                        >
                            {editingId ? 'Update' : 'Create'}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <div className="space-y-2">
                {categories.map(category => (
                    <div
                        key={category.id}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <span
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: category.color || '#6366f1' }}
                            />
                            <span className="font-medium text-gray-900">{category.name}</span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(category)}
                                className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition-colors"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => {
                                    if (confirm(`Delete category "${category.name}"?`)) {
                                        onDelete(category.id);
                                    }
                                }}
                                className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
