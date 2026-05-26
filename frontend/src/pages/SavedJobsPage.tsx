import { useJobStore } from '../store/jobStore';
import JobCard from '../components/common/JobCard';
import { Bookmark, Search } from 'lucide-react';
import { useState } from 'react';

export default function SavedJobsPage() {
  const { jobs, savedJobIds } = useJobStore();
  const [searchTerm, setSearchTerm] = useState('');

  const savedJobs = jobs.filter((job) => savedJobIds.includes(job.id));
  const filteredSavedJobs = savedJobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-enter" style={{ padding: '5.5rem 1.5rem 3rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bookmark size={24} style={{ color: 'var(--color-accent)' }} />
          Saved Jobs
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Keep track of positions you're interested in
        </p>
      </div>

      {/* Toolbar & Search */}
      {savedJobs.length > 0 && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
        }}>
          {/* Quick Search */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '0.5rem 1rem',
            width: '100%',
            maxWidth: '320px',
          }}>
            <Search size={16} style={{ color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              placeholder="Search saved jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                width: '100%',
                fontSize: '0.875rem',
                color: 'var(--color-text-primary)',
              }}
            />
          </div>

          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            Total saved: <strong style={{ color: 'var(--color-text-primary)' }}>{savedJobs.length}</strong>
          </span>
        </div>
      )}

      {/* Grid or Empty */}
      {filteredSavedJobs.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1rem',
        }}>
          {filteredSavedJobs.map((job, i) => (
            <JobCard key={job.id} job={job} index={i} />
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '5rem 2rem',
          color: 'var(--color-text-muted)',
          background: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
        }}>
          <Bookmark size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
            {savedJobs.length === 0 ? 'No saved jobs' : 'No match found'}
          </h3>
          <p>
            {savedJobs.length === 0
              ? 'Bookmark jobs from the search results page to see them here'
              : 'Try clearing your search term'}
          </p>
        </div>
      )}
    </div>
  );
}
