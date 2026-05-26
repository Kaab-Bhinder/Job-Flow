import { Link, useLocation } from 'react-router-dom';
import {
  Search,
  Bookmark,
  Kanban,
  FileText,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  Briefcase,
} from 'lucide-react';
import { useState } from 'react';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import { getInitials } from '../../lib/utils';

const navLinks = [
  { to: '/search', label: 'Search', icon: Search },
  { to: '/saved', label: 'Saved', icon: Bookmark },
  { to: '/tracker', label: 'Tracker', icon: Kanban },
  { to: '/cv-builder', label: 'CV Builder', icon: FileText },
];

export default function Navbar() {
  const location = useLocation();
  const { isDark, toggle } = useThemeStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="glass" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      borderBottom: '1px solid var(--color-border)',
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 1.5rem',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.625rem',
          textDecoration: 'none',
          color: 'var(--color-text-primary)',
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, var(--color-accent), var(--color-secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px var(--color-shadow-accent)',
          }}>
            <Briefcase size={18} color="white" />
          </div>
          <span style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
          }}>
            Job<span style={{ color: 'var(--color-accent)' }}>Flow</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
        }} className="desktop-nav">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.875rem',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                  background: isActive ? 'var(--color-accent-soft)' : 'transparent',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--color-text-primary)';
                    e.currentTarget.style.background = 'var(--color-bg-elevated)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--color-text-secondary)';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <Icon size={16} />
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Theme Toggle */}
          <button
            onClick={toggle}
            className="btn btn-ghost btn-icon"
            aria-label="Toggle theme"
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {isAuthenticated && user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {/* Avatar */}
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: 'var(--radius-full)',
                background: 'linear-gradient(135deg, var(--color-accent), var(--color-secondary))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'white',
                cursor: 'pointer',
              }}>
                {getInitials(user.fullName)}
              </div>
              <button
                onClick={logout}
                className="btn btn-ghost btn-icon"
                aria-label="Logout"
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-ghost btn-sm">Log in</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign up</Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="btn btn-ghost btn-icon mobile-menu-btn"
            style={{ display: 'none', borderRadius: 'var(--radius-full)' }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div
          className="mobile-nav"
          style={{
            padding: '0.5rem 1rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            borderTop: '1px solid var(--color-border)',
          }}
        >
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                  background: isActive ? 'var(--color-accent-soft)' : 'transparent',
                }}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
