import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Toast from './components/Toast';
import Dashboard from './pages/Dashboard';
import TaskForm from './pages/TaskForm';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  // Theme Management
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const [colorTheme, setColorTheme] = useState(() => {
    return localStorage.getItem('colorTheme') || 'indigo';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('theme-indigo', 'theme-rose', 'theme-emerald', 'theme-ocean');
    root.classList.add(`theme-${colorTheme}`);
    localStorage.setItem('colorTheme', colorTheme);
  }, [colorTheme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Toast System
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-darkBg dark:text-gray-100 transition-colors duration-300 flex flex-col relative overflow-hidden">
          {/* Decorative Background Glowing Blobs */}
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-400/8 dark:bg-indigo-500/5 blur-[120px] pointer-events-none z-0"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-400/8 dark:bg-purple-500/5 blur-[120px] pointer-events-none z-0"></div>

          {/* Header Navigation */}
          <div className="relative z-10">
            <Header theme={theme} toggleTheme={toggleTheme} colorTheme={colorTheme} setColorTheme={setColorTheme} />
          </div>

          {/* Main Layout Container */}
          <main className="flex-grow mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8 relative z-10">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login addToast={addToast} />} />
              <Route path="/register" element={<Register addToast={addToast} />} />

              {/* Protected Routes */}
              <Route path="/" element={<ProtectedRoute><Dashboard addToast={addToast} /></ProtectedRoute>} />
              <Route path="/add" element={<ProtectedRoute><TaskForm addToast={addToast} /></ProtectedRoute>} />
              <Route path="/edit/:id" element={<ProtectedRoute><TaskForm addToast={addToast} /></ProtectedRoute>} />

              {/* Redirect any unmatched route back to dashboard */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Floating Toast Notification Containers */}
          <div className="fixed top-20 right-4 z-50 flex flex-col gap-3 pointer-events-auto">
            {toasts.map(toast => (
              <Toast
                key={toast.id}
                id={toast.id}
                message={toast.message}
                type={toast.type}
                onClose={removeToast}
              />
            ))}
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
