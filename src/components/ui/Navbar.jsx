import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Sparkles, LayoutDashboard, History, Menu, X, LogOut, Key, Shield, Users, User, Moon, Sun, Home, CreditCard, BarChart3 } from 'lucide-react';

const NavLink = ({ to, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="text-neutral-600 dark:text-gray-300 hover:text-neutral-900 dark:hover:text-white transition-colors font-medium"
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, children, icon: Icon, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-3 px-4 py-3 text-neutral-600 dark:text-gray-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5 rounded-lg transition-all"
  >
    {Icon && <Icon className="h-5 w-5 text-neutral-500 dark:text-gray-400" />}
    <span className="font-medium">{children}</span>
  </Link>
);

const Navbar = () => {
  const { theme, toggleTheme, user, logout } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-background/80 backdrop-blur-md border-b border-neutral-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                ⚡ PlagZap
              </span>
            </Link>

            {/* Desktop Navigation */}
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
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-neutral-100 dark:bg-background/50 border border-neutral-200 dark:border-white/10 rounded-lg">
                      <User className="h-4 w-4 text-neutral-500 dark:text-gray-400" />
                      <span className="text-sm text-neutral-700 dark:text-white">{user.name}</span>
                    </div>
                    <button
                      onClick={logout}
                      className="hidden md:flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="hidden sm:inline">Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="hidden md:block px-4 py-2 text-neutral-600 dark:text-gray-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="hidden md:block px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all"
                    >
                      Sign Up
                    </Link>
                  </>
                )}

                {/* Theme Toggle - Always visible */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-neutral-100 dark:bg-background/50 border border-neutral-200 dark:border-white/10 hover:bg-neutral-200 dark:hover:bg-background transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <Sun className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <Moon className="h-5 w-5 text-neutral-600" />
                  )}
                </button>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="md:hidden p-2 rounded-lg bg-neutral-100 dark:bg-background/50 border border-neutral-200 dark:border-white/10 hover:bg-neutral-200 dark:hover:bg-background transition-colors"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5 text-neutral-600 dark:text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMobileMenu}
      />

      {/* Mobile Slide-out Menu */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw] bg-white dark:bg-background border-l border-neutral-200 dark:border-white/10 shadow-2xl transform transition-transform duration-300 ease-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-white/10">
          <span className="text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            ⚡ PlagZap
          </span>
          <button
            onClick={closeMobileMenu}
            className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5 text-neutral-500 dark:text-gray-400" />
          </button>
        </div>

        {/* User Info (if logged in) */}
        {user && (
          <div className="px-4 py-4 border-b border-neutral-200 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-neutral-900 dark:text-white">{user.name}</p>
                <p className="text-sm text-neutral-500 dark:text-gray-400">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Navigation Links */}
        <div className="flex-1 overflow-y-auto py-4 px-2">
          <div className="space-y-1">
            <MobileNavLink to="/" icon={Home} onClick={closeMobileMenu}>
              Home
            </MobileNavLink>
            
            {user && (
              <>
                <MobileNavLink to="/dashboard" icon={LayoutDashboard} onClick={closeMobileMenu}>
                  Dashboard
                </MobileNavLink>
                <MobileNavLink to="/analyzer" icon={BarChart3} onClick={closeMobileMenu}>
                  Analyzer
                </MobileNavLink>
                <MobileNavLink to="/history" icon={History} onClick={closeMobileMenu}>
                  History
                </MobileNavLink>
                <MobileNavLink to="/team" icon={Users} onClick={closeMobileMenu}>
                  Team
                </MobileNavLink>
              </>
            )}
            
            {user?.role === 'admin' && (
              <MobileNavLink to="/admin" icon={Shield} onClick={closeMobileMenu}>
                Admin
              </MobileNavLink>
            )}
            
            <MobileNavLink to="/pricing" icon={CreditCard} onClick={closeMobileMenu}>
              Pricing
            </MobileNavLink>
          </div>

          {/* Divider */}
          <div className="my-4 border-t border-neutral-200 dark:border-white/10" />

          {/* Theme Toggle in Mobile Menu */}
          <button
            onClick={() => {
              toggleTheme();
            }}
            className="flex items-center gap-3 w-full px-4 py-3 text-neutral-600 dark:text-gray-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5 rounded-lg transition-all"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="h-5 w-5 text-yellow-500" />
                <span className="font-medium">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="h-5 w-5 text-neutral-500" />
                <span className="font-medium">Dark Mode</span>
              </>
            )}
          </button>
        </div>

        {/* Mobile Menu Footer */}
        <div className="p-4 border-t border-neutral-200 dark:border-white/10">
          {user ? (
            <button
              onClick={() => {
                logout();
                closeMobileMenu();
              }}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </button>
          ) : (
            <div className="space-y-2">
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="block w-full px-4 py-3 text-center text-neutral-600 dark:text-gray-300 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-white/10 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/5 transition-all"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={closeMobileMenu}
                className="block w-full px-4 py-3 text-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all font-medium"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
