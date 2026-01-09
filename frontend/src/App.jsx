import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import { ActiveNotes } from './pages/ActiveNotes';
import { ArchivedNotes } from './pages/ArchivedNotes';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <div className="app">
                <nav className="navbar">
                    <div className="nav-container">
                        <Link to="/" className="nav-brand">
                            📝 Notes App
                        </Link>
                        <div className="nav-links">
                            <NavLink
                                to="/"
                                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                                end
                            >
                                Active Notes
                            </NavLink>
                            <NavLink
                                to="/archived"
                                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                            >
                                Archived
                            </NavLink>
                        </div>
                    </div>
                </nav>

                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<ActiveNotes />} />
                        <Route path="/archived" element={<ArchivedNotes />} />
                    </Routes>
                </main>

                <footer className="footer">
                    <p>Full Stack Notes Application - Built with FastAPI + React</p>
                </footer>
            </div>
        </BrowserRouter>
    );
}

export default App;
