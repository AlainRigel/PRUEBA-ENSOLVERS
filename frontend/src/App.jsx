import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import { ActiveNotes } from './pages/ActiveNotes';
import { ArchivedNotes } from './pages/ArchivedNotes';

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen flex flex-col bg-gray-50">
                <nav className="bg-white shadow-sm sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <Link to="/" className="text-2xl font-bold text-gray-900 hover:text-primary-600 transition-colors">
                                📝 Notes App
                            </Link>
                            <div className="flex gap-2">
                                <NavLink
                                    to="/"
                                    end
                                    className={({ isActive }) =>
                                        `px-4 py-2 rounded-lg font-medium transition-all ${isActive
                                            ? 'bg-primary-500 text-white shadow-md'
                                            : 'text-gray-600 hover:bg-gray-100'
                                        }`
                                    }
                                >
                                    Active Notes
                                </NavLink>
                                <NavLink
                                    to="/archived"
                                    className={({ isActive }) =>
                                        `px-4 py-2 rounded-lg font-medium transition-all ${isActive
                                            ? 'bg-primary-500 text-white shadow-md'
                                            : 'text-gray-600 hover:bg-gray-100'
                                        }`
                                    }
                                >
                                    Archived
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </nav>

                <main className="flex-1">
                    <Routes>
                        <Route path="/" element={<ActiveNotes />} />
                        <Route path="/archived" element={<ArchivedNotes />} />
                    </Routes>
                </main>

                <footer className="bg-white border-t border-gray-200 py-6">
                    <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-600">
                        Full Stack Notes Application - Built with FastAPI + React + Tailwind CSS
                    </div>
                </footer>
            </div>
        </BrowserRouter>
    );
}

export default App;
