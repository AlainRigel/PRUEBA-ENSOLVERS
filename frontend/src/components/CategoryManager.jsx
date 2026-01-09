import { useState } from 'react';
import './CategoryManager.css';

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
        <div className="category-manager">
            <div className="category-header">
                <h3>Categories</h3>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn btn-primary btn-sm"
                >
                    {showForm ? 'Cancel' : '+ New Category'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="category-form">
                    <input
                        type="text"
                        placeholder="Category name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="category-input"
                    />
                    <div className="color-picker-wrapper">
                        <label>Color:</label>
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="color-picker"
                        />
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary btn-sm">
                            {editingId ? 'Update' : 'Create'}
                        </button>
                        <button type="button" onClick={handleCancel} className="btn btn-secondary btn-sm">
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <div className="category-list">
                {categories.map(category => (
                    <div key={category.id} className="category-item">
                        <div className="category-info">
                            <span
                                className="category-color-dot"
                                style={{ backgroundColor: category.color || '#6366f1' }}
                            />
                            <span className="category-name">{category.name}</span>
                        </div>
                        <div className="category-actions">
                            <button
                                onClick={() => handleEdit(category)}
                                className="btn btn-secondary btn-xs"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => {
                                    if (confirm(`Delete category "${category.name}"?`)) {
                                        onDelete(category.id);
                                    }
                                }}
                                className="btn btn-danger btn-xs"
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
