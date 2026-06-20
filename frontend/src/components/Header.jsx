import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Sun, Moon, CheckSquare, Menu, X, LogOut } from 'lucide-react';

const Header = ({ theme, toggleTheme, colorTheme, setColorTheme }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMobileMenu();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/70 backdrop-blur-md dark:border-slate-800/40 dark:bg-slate-950/70 transition-colors duration-300">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <NavLink to="/" className="flex items-center gap-2 text-xl font-black tracking-tight" onClick={closeMobileMenu}>
          <CheckSquare size={24} className="text-theme-primary drop-shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.3)] transition-all" />
          <span className="text-slate-900 dark:text-white transition-colors">Taskflow<span className="text-theme-primary transition-colors">.</span></span>
        </NavLink>

        {/* Desktop Navigation Links */}
        {user && (
          <nav className="hidden md:flex items-center gap-2">
            <NavLink to="/" className={({ isActive }) => `text-sm font-bold transition-all px-3.5 py-1.5 rounded-lg ${isActive ? 'bg-theme-primary-opacity text-theme-primary' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/40'}`} end>
              Dashboard
            </NavLink>
            <NavLink to="/add" className={({ isActive }) => `text-sm font-bold transition-all px-3.5 py-1.5 rounded-lg ${isActive ? 'bg-theme-primary-opacity text-theme-primary' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/40'}`}>
              Add Task
            </NavLink>
          </nav>
        )}

        {/* Right Side Controls */}
        <div className="flex items-center gap-4">
          {/* Color Palette Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-100/50 dark:bg-slate-850/40 border border-slate-200/40 dark:border-slate-800/40 p-1.5 rounded-xl">
            <button
              onClick={() => setColorTheme('indigo')}
              className={`w-4 h-4 rounded-full bg-indigo-500 border transition-all cursor-pointer ${colorTheme === 'indigo' ? 'border-slate-800 dark:border-white scale-125 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'}`}
              title="Indigo Theme"
              aria-label="Indigo Theme"
            />
            <button
              onClick={() => setColorTheme('rose')}
              className={`w-4 h-4 rounded-full bg-rose-500 border transition-all cursor-pointer ${colorTheme === 'rose' ? 'border-slate-800 dark:border-white scale-125 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'}`}
              title="Rose Theme"
              aria-label="Rose Theme"
            />
            <button
              onClick={() => setColorTheme('emerald')}
              className={`w-4 h-4 rounded-full bg-emerald-500 border transition-all cursor-pointer ${colorTheme === 'emerald' ? 'border-slate-800 dark:border-white scale-125 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'}`}
              title="Emerald Theme"
              aria-label="Emerald Theme"
            />
            <button
              onClick={() => setColorTheme('ocean')}
              className={`w-4 h-4 rounded-full bg-sky-500 border transition-all cursor-pointer ${colorTheme === 'ocean' ? 'border-slate-800 dark:border-white scale-125 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'}`}
              title="Ocean Theme"
              aria-label="Ocean Theme"
            />
          </div>

          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* User Profile and Logout */}
          {user ? (
            <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-850 pl-4">
              <span className="hidden lg:inline text-xs font-extrabold text-slate-500 dark:text-slate-400">
                Hi, {user.name.split(' ')[0]}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-805 text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 px-3 py-1.5 text-xs font-extrabold shadow-sm transition-all cursor-pointer"
                title="Logout"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-850 pl-4">
              <NavLink
                to="/login"
                className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Sign In
              </NavLink>
            </div>
          )}

          {/* Mobile Hamburguer Trigger */}
          {user && (
            <button
              onClick={toggleMobileMenu}
              className="flex md:hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {user && mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-3 transition-colors">
          <nav className="flex flex-col gap-2">
            <NavLink
              to="/"
              className={({ isActive }) => `block rounded-lg px-3 py-2 text-sm font-medium transition-all ${isActive ? 'bg-theme-primary-opacity text-theme-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              onClick={closeMobileMenu}
              end
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/add"
              className={({ isActive }) => `block rounded-lg px-3 py-2 text-sm font-medium transition-all ${isActive ? 'bg-theme-primary-opacity text-theme-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              onClick={closeMobileMenu}
            >
              Add Task
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
