import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Sparkles, LayoutDashboard, History, Menu, X, LogOut, Key, Shield, Users, User, Home, CreditCard, BarChart3, Gift } from 'lucide-react';
import NotificationBell from '../NotificationBell';

const NavLink = ({ to, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] transition-colors font-medium text-sm xl:text-base"
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, children, icon: Icon, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-3 px-3 sm:px-4 py-3 sm:py-3.5 text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] hover:bg-[var(--accent)] rounded-lg transition-all touch-manipulation"
  >
    {Icon && <Icon className="h-5 w-5 text-[var(--muted-foreground)] flex-shrink-0" />}
    <span className="font-medium text-sm sm:text-base">{children}</span>
  </Link>
);

const Navbar = () => {
  const { user, logout } = useAppContext();
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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-4 xl:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo - Responsive sizing */}
            <Link to="/" className="flex items-center gap-1.5 sm:gap-2 group flex-shrink-0">
              <span className="text-lg sm:text-xl lg:text-xl xl:text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                ⚡ PlagZap
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-3 xl:gap-6">
              {/* Navigation Links - Hidden on mobile/tablet, visible on desktop */}
              <div className="hidden lg:flex gap-3 xl:gap-6">
                <NavLink to="/">Home</NavLink>
                {user && <NavLink to="/dashboard">Dashboard</NavLink>}
                <NavLink to="/analyzer">Analyzer</NavLink>
                <NavLink to="/writer">AI Writer</NavLink>
                {user && <NavLink to="/rewards">Rewards</NavLink>}
                {user && <NavLink to="/history">History</NavLink>}
                {user && <NavLink to="/team">Team</NavLink>}
                {user?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
                <NavLink to="/pricing">Pricing</NavLink>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 lg:gap-2 xl:gap-3">
                {user ? (
                  <>
                    {/* User Info - Hidden on small screens, visible on larger screens */}
                    <div className="hidden lg:flex items-center gap-1.5 xl:gap-2 px-2 xl:px-3 py-1.5 bg-background/50 border border-[var(--border)] rounded-lg">
                      <User className="h-4 w-4 text-[var(--muted-foreground)]" />
                      <span className="text-foreground text-xs xl:text-sm max-w-[80px] xl:max-w-[120px] truncate">{user.name}</span>
                    </div>
                    {/* Logout button - Hidden on mobile, visible on desktop */}
                    <button
                      onClick={logout}
                      className="hidden lg:flex items-center gap-1.5 xl:gap-2 px-2 xl:px-3 py-1.5 xl:py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="hidden xl:inline text-sm">Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    {/* Login/Signup - Hidden on mobile/tablet, visible on desktop */}
                    <Link
                      to="/login"
                      className="hidden lg:block px-2.5 xl:px-4 py-1.5 xl:py-2 text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] transition-colors text-xs xl:text-sm"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="hidden lg:block px-2.5 xl:px-4 py-1.5 xl:py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all text-xs xl:text-sm font-medium"
                    >
                      Sign Up
                    </Link>
                  </>
                )}

                {/* Notification Bell - Show for logged-in users */}
                {user && <NotificationBell />}

                {/* Mobile Menu Button - Visible on mobile/tablet, hidden on desktop */}
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden p-1.5 sm:p-2 rounded-lg bg-background/50 border border-[var(--border)] hover:bg-background transition-colors flex-shrink-0"
                  aria-label="Open menu"
                >
                  <Menu className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMobileMenu}
      />

      {/* Mobile Slide-out Menu */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-96 sm:max-w-[85vw] bg-[var(--menu-bg)] border-l border-[var(--menu-border)] shadow-2xl transform transition-transform duration-300 ease-out lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[var(--menu-border)]">
          <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            ⚡ PlagZap
          </span>
          <button
            onClick={closeMobileMenu}
            className="p-2 rounded-lg hover:bg-[var(--accent)] transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5 text-[var(--muted-foreground)]" />
          </button>
        </div>

        {/* User Info (if logged in) */}
        {user && (
          <div className="px-4 sm:px-5 py-4 sm:py-5 border-b border-[var(--menu-border)]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                <User className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground text-sm sm:text-base truncate">{user.name}</p>
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)] truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Navigation Links */}
        <div className="flex-1 overflow-y-auto py-3 sm:py-4 px-2 sm:px-3">
          <div className="space-y-1">
            <MobileNavLink to="/" icon={Home} onClick={closeMobileMenu}>
              Home
            </MobileNavLink>
            
            <MobileNavLink to="/analyzer" icon={BarChart3} onClick={closeMobileMenu}>
              Analyzer
            </MobileNavLink>
            <MobileNavLink to="/writer" icon={Sparkles} onClick={closeMobileMenu}>
              AI Writer
            </MobileNavLink>
            
            {user && (
              <>
                <MobileNavLink to="/dashboard" icon={LayoutDashboard} onClick={closeMobileMenu}>
                  Dashboard
                </MobileNavLink>
                <MobileNavLink to="/rewards" icon={Gift} onClick={closeMobileMenu}>
                  Rewards
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

        </div>

        {/* Mobile Menu Footer */}
        <div className="p-3 sm:p-4 border-t border-[var(--menu-border)]">
          {user ? (
            <button
              onClick={() => {
                logout();
                closeMobileMenu();
              }}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 sm:py-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors touch-manipulation"
            >
              <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="font-medium text-sm sm:text-base">Logout</span>
            </button>
          ) : (
            <div className="space-y-2">
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="block w-full px-4 py-3 sm:py-3.5 text-center text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] border border-[var(--border)] rounded-lg hover:bg-[var(--accent)] transition-all text-sm sm:text-base touch-manipulation"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={closeMobileMenu}
                className="block w-full px-4 py-3 sm:py-3.5 text-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all font-medium text-sm sm:text-base touch-manipulation"
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
