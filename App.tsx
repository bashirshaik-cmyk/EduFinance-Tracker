import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LearnerDashboard from './pages/LearnerDashboard';
import Login from './pages/Login';
import { Button } from './components/ui/Button';

const ThemeToggle: React.FC<{ theme: string; toggleTheme: () => void }> = ({ theme, toggleTheme }) => {
    return (
        <Button onClick={toggleTheme} variant="ghost" size="icon" className="fixed top-4 right-4 z-50">
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </Button>
    );
};

const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;


const App: React.FC = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const handleLogin = () => setIsAuthenticated(true);
    const handleLogout = () => setIsAuthenticated(false);

    return (
        <>
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            <HashRouter>
                <Routes>
                    <Route 
                        path="/" 
                        element={
                            !isAuthenticated ? (
                                <Login onLoginSuccess={handleLogin} />
                            ) : (
                                <Navigate to="/dashboard" replace />
                            )
                        } 
                    />
                    <Route 
                        path="/dashboard"
                        element={
                            isAuthenticated ? (
                                <LearnerDashboard onLogout={handleLogout} />
                            ) : (
                                <Navigate to="/" replace />
                            )
                        }
                    />
                     <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </HashRouter>
        </>
    );
};

export default App;