import { X, RotateCcw, Wifi, WifiOff } from 'lucide-react';
import { useJobStore } from '../../store/jobStore';
import { jobCategories, jobTypes, sortOptions } from '../../lib/mockData';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterPanel({ isOpen, onClose }: FilterPanelProps) {
  const { filters, setFilter, resetFilters } = useJobStore();

  if (!isOpen) return null;

  return (
    <div
      className="animate-fade-in"
      style={{
        background: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Filters</h3>
        <div style={{ display: 'flex', gap: '0.375rem' }}>
          <button onClick={resetFilters} className="btn btn-ghost btn-sm" style={{ fontSize: '0.8125rem' }}>
            <RotateCcw size={14} /> Reset
          </button>
          <button onClick={onClose} className="btn btn-ghost btn-icon btn-sm" style={{ borderRadius: 'var(--radius-full)' }}>
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Job Type */}
      <div>
        <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.5rem', display: 'block' }}>
          Job Type
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
          {jobTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFilter('jobType', filters.jobType === type ? '' : type)}
              className="tag"
              style={{
                cursor: 'pointer',
                border: '1px solid',
                borderColor: filters.jobType === type ? 'var(--color-accent)' : 'var(--color-border)',
                background: filters.jobType === type ? 'var(--color-accent-soft)' : 'var(--color-bg-elevated)',
                color: filters.jobType === type ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                padding: '0.375rem 0.75rem',
                transition: 'all 0.2s ease',
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.5rem', display: 'block' }}>
          Category
        </label>
        <select
          value={filters.category}
          onChange={(e) => setFilter('category', e.target.value)}
          className="input-base"
          style={{ cursor: 'pointer' }}
        >
          <option value="">All Categories</option>
          {jobCategories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Remote Toggle */}
      <div>
        <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.5rem', display: 'block' }}>
          Work Type
        </label>
        <div style={{ display: 'flex', gap: '0.375rem' }}>
          {[
            { value: null, label: 'All', icon: null },
            { value: true, label: 'Remote', icon: Wifi },
            { value: false, label: 'On-site', icon: WifiOff },
          ].map((opt) => (
            <button
              key={String(opt.value)}
              onClick={() => setFilter('isRemote', filters.isRemote === opt.value ? null : opt.value)}
              className="tag"
              style={{
                cursor: 'pointer',
                border: '1px solid',
                borderColor: filters.isRemote === opt.value ? 'var(--color-accent)' : 'var(--color-border)',
                background: filters.isRemote === opt.value ? 'var(--color-accent-soft)' : 'var(--color-bg-elevated)',
                color: filters.isRemote === opt.value ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                padding: '0.375rem 0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                transition: 'all 0.2s ease',
              }}
            >
              {opt.icon && <opt.icon size={14} />}
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Salary Range */}
      <div>
        <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.5rem', display: 'block' }}>
          Salary Range
        </label>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            type="number"
            placeholder="Min"
            value={filters.salaryMin || ''}
            onChange={(e) => setFilter('salaryMin', Number(e.target.value) || 0)}
            className="input-base"
            style={{ flex: 1 }}
          />
          <span style={{ color: 'var(--color-text-muted)' }}>—</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.salaryMax < 500000 ? filters.salaryMax : ''}
            onChange={(e) => setFilter('salaryMax', Number(e.target.value) || 500000)}
            className="input-base"
            style={{ flex: 1 }}
          />
        </div>
      </div>

      {/* Sort */}
      <div>
        <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.5rem', display: 'block' }}>
          Sort By
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => setFilter('sortBy', e.target.value)}
          className="input-base"
          style={{ cursor: 'pointer' }}
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
