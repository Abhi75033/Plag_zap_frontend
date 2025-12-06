import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Sparkles, LayoutDashboard, History, Menu, X, LogOut, Key, Shield, Users, User, Moon, Sun } from 'lucide-react';

const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="text-gray-300 hover:text-white transition-colors font-medium"
  >
    {children}
  </Link>
);

const Navbar = () => {
  const { theme, toggleTheme, user, logout } = useAppContext();
  
  console.log('Current User in Navbar:', user);
  console.log('User Role:', user?.role);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              ⚡ PlagZap
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-6">
              <NavLink to="/">Home</NavLink>
              {user && <NavLink to="/dashboard">Dashboard</NavLink>}
              {user && <NavLink to="/analyzer">Analyzer</NavLink>}
              {user && <NavLink to="/history">History</NavLink>}
              {user && <NavLink to="/team">Team</NavLink>}
              {user?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
              <NavLink to="/pricing">Pricing</NavLink>
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-background/50 border border-white/10 rounded-lg">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{user.name}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all"
                  >
                    Sign Up
                  </Link>
                </>
              )}

              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-background/50 border border-white/10 hover:bg-background transition-colors"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
