import { useState } from 'react';
import { useJobStore } from '../store/jobStore';
import JobCard from '../components/common/JobCard';
import SearchBar from '../components/common/SearchBar';
import FilterPanel from '../components/common/FilterPanel';
import { Briefcase, SlidersHorizontal, LayoutGrid, List } from 'lucide-react';

export default function SearchPage() {
  const { getFilteredJobs, filters, hasMore, loadMore, refreshJobs, isLoadingMore, isRefreshing, totalJobs, jobs: loadedJobs } = useJobStore();
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const jobs = getFilteredJobs();

  const activeFilterCount = [
    filters.keyword,
    filters.location,
    filters.jobType,
    filters.category,
    filters.isRemote !== null,
    filters.salaryMin > 0,
    filters.salaryMax < 500000,
  ].filter(Boolean).length;

  return (
    <div className="page-enter" style={{ padding: '5.5rem 1.5rem 3rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Briefcase size={24} style={{ color: 'var(--color-accent)' }} />
          Search Jobs
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Discover opportunities from Adzuna, JSearch, and more
        </p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '1.5rem' }}>
        <SearchBar compact />
      </div>

      {/* Toolbar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            <strong style={{ color: 'var(--color-text-primary)' }}>{jobs.length}</strong> shown
            {totalJobs > jobs.length ? ` of ${totalJobs}` : ''}
          </span>
          {activeFilterCount > 0 && (
            <span className="tag" style={{
              background: 'var(--color-accent-soft)',
              color: 'var(--color-accent)',
            }}>
              {activeFilterCount} active filter{activeFilterCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.375rem' }}>
          <button
            onClick={() => refreshJobs?.()}
            className="btn btn-secondary btn-sm"
            disabled={isRefreshing}
            style={{ opacity: isRefreshing ? 0.7 : 1 }}
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh jobs'}
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-secondary btn-sm"
            style={{
              color: showFilters ? 'var(--color-accent)' : undefined,
              borderColor: showFilters ? 'var(--color-border-accent)' : undefined,
            }}
          >
            <SlidersHorizontal size={15} /> Filters
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '0.375rem 0.5rem' }}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '0.375rem 0.5rem' }}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: showFilters ? '300px 1fr' : '1fr',
        gap: '1.5rem',
        alignItems: 'start',
      }} className="search-layout">
        {/* Filters Sidebar */}
        <FilterPanel isOpen={showFilters} onClose={() => setShowFilters(false)} />

        {/* Results */}
        <div>
          {jobs.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: viewMode === 'grid'
                ? 'repeat(auto-fill, minmax(320px, 1fr))'
                : '1fr',
              gap: '1rem',
            }}>
              {jobs.map((job, i) => (
                <JobCard key={job.id} job={job} index={i} />
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              color: 'var(--color-text-muted)',
              background: 'var(--color-bg-surface)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--color-border)',
            }}>
              <Briefcase size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
                No jobs found
              </h3>
              <p>Try adjusting your search terms or filters</p>
            </div>
          )}

          {hasMore && loadedJobs.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
              <button
                onClick={() => loadMore?.()}
                className="btn btn-primary"
                disabled={isLoadingMore}
                style={{ minWidth: '180px', opacity: isLoadingMore ? 0.8 : 1 }}
              >
                {isLoadingMore ? 'Loading more...' : 'Load more jobs'}
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .search-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
