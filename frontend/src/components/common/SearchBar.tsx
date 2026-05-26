import { Search, MapPin, SlidersHorizontal, X } from 'lucide-react';
import { useJobStore } from '../../store/jobStore';
import { useState } from 'react';

interface SearchBarProps {
  onSearch?: () => void;
  compact?: boolean;
}

export default function SearchBar({ onSearch, compact = false }: SearchBarProps) {
  const { filters, setFilter } = useJobStore();
  const [showFilters, setShowFilters] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.();
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <div
        className={compact ? '' : 'glass'}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0',
          borderRadius: compact ? 'var(--radius-lg)' : 'var(--radius-2xl)',
          padding: compact ? '0' : '0.375rem',
          background: compact ? 'var(--color-bg-surface)' : undefined,
          border: compact ? '1px solid var(--color-border)' : undefined,
          boxShadow: compact ? 'none' : '0 8px 32px var(--color-shadow)',
          overflow: 'hidden',
        }}
      >
        {/* Keyword Input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          flex: 1,
          padding: compact ? '0.625rem 1rem' : '0.75rem 1.25rem',
          minWidth: 0,
        }}>
          <Search size={18} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Job title, keyword, or company..."
            value={filters.keyword}
            onChange={(e) => setFilter('keyword', e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              width: '100%',
              fontSize: compact ? '0.875rem' : '0.9375rem',
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-sans)',
            }}
          />
        </div>

        {/* Divider */}
        <div style={{
          width: '1px',
          height: '28px',
          background: 'var(--color-border)',
          flexShrink: 0,
        }} className="search-divider" />

        {/* Location Input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          flex: 0.7,
          padding: compact ? '0.625rem 1rem' : '0.75rem 1.25rem',
          minWidth: 0,
        }} className="search-location">
          <MapPin size={18} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Location..."
            value={filters.location}
            onChange={(e) => setFilter('location', e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              width: '100%',
              fontSize: compact ? '0.875rem' : '0.9375rem',
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-sans)',
            }}
          />
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.375rem',
          padding: '0.25rem',
          flexShrink: 0,
        }}>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-ghost btn-icon"
            style={{
              borderRadius: 'var(--radius-md)',
              color: showFilters ? 'var(--color-accent)' : 'var(--color-text-muted)',
              background: showFilters ? 'var(--color-accent-soft)' : 'transparent',
            }}
          >
            {showFilters ? <X size={18} /> : <SlidersHorizontal size={18} />}
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              borderRadius: compact ? 'var(--radius-md)' : 'var(--radius-xl)',
              padding: compact ? '0.5rem 1rem' : '0.625rem 1.5rem',
            }}
          >
            <Search size={16} />
            <span className="search-btn-text">Search</span>
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .search-divider, .search-location { display: none !important; }
          .search-btn-text { display: none; }
        }
      `}</style>
    </form>
  );
}
