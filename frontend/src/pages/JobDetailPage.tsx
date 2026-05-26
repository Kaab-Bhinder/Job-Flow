import { useParams, Link, useNavigate } from 'react-router-dom';
import { useJobStore } from '../store/jobStore';
import { useTrackerStore } from '../store/trackerStore';
import { ArrowLeft, MapPin, Clock, Briefcase, Bookmark, BookmarkCheck, ExternalLink, Zap, Building2 } from 'lucide-react';
import { formatSalary, timeAgo } from '../lib/utils';
import toast from 'react-hot-toast';

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getJobById, savedJobIds, toggleSaveJob } = useJobStore();
  const { isJobTracked, addApplication } = useTrackerStore();

  const job = id ? getJobById(id) : undefined;

  if (!job) {
    return (
      <div style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Job listing not found</h2>
        <Link to="/search" className="btn btn-primary">Back to Search</Link>
      </div>
    );
  }

  const isSaved = savedJobIds.includes(job.id);
  const isTracked = isJobTracked(job.id);

  const handleTrack = () => {
    if (isTracked) {
      navigate('/tracker');
    } else {
      addApplication(job.id, 'saved');
      toast.success('Job added to your application tracker!', { className: 'toast-custom' });
    }
  };

  return (
    <div className="page-enter" style={{ padding: '5.5rem 1.5rem 3rem', maxWidth: '900px', margin: '0 auto' }}>
      {/* Back Link */}
      <Link
        to="/search"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--color-text-secondary)',
          textDecoration: 'none',
          fontSize: '0.875rem',
          fontWeight: 500,
          marginBottom: '2rem',
        }}
      >
        <ArrowLeft size={16} /> Back to Search
      </Link>

      <div className="card animate-scale-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Header Info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: 'var(--radius-xl)',
              background: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}>
              {job.companyLogo ? (
                <img
                  src={job.companyLogo}
                  alt={job.company}
                  style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling?.removeAttribute('style');
                  }}
                />
              ) : null}
              <Building2
                size={28}
                style={{
                  color: 'var(--color-text-muted)',
                  display: job.companyLogo ? 'none' : 'block',
                }}
              />
            </div>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em' }}>{job.title}</h1>
              <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>{job.company}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => toggleSaveJob(job.id)}
              className="btn btn-secondary"
              style={{
                borderRadius: 'var(--radius-md)',
                color: isSaved ? 'var(--color-accent)' : undefined,
                borderColor: isSaved ? 'var(--color-border-accent)' : undefined,
              }}
            >
              {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
              {isSaved ? 'Saved' : 'Save'}
            </button>
            <button
              onClick={handleTrack}
              className={`btn ${isTracked ? 'btn-secondary' : 'btn-primary'}`}
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              <Zap size={18} />
              {isTracked ? 'View in Tracker' : 'Track Job'}
            </button>
          </div>
        </div>

        {/* Info Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          padding: '1.25rem',
          background: 'var(--color-bg-elevated)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Salary</span>
            <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
              {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
            </span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Location</span>
            <span style={{ fontWeight: 500, color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin size={14} /> {job.location} {job.isRemote && '(Remote)'}
            </span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Job Type</span>
            <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{job.jobType}</span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Posted</span>
            <span style={{ fontWeight: 500, color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Clock size={14} /> {timeAgo(job.postedAt)}
            </span>
          </div>
        </div>

        {/* Description */}
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Job Description</h2>
          <div
            style={{
              color: 'var(--color-text-secondary)',
              lineHeight: 1.7,
              fontSize: '0.9688rem',
              whiteSpace: 'pre-line',
            }}
          >
            {job.description}
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid var(--color-border)',
          paddingTop: '1.5rem',
          marginTop: '1rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Source: </span>
            <span className="tag" style={{ background: 'var(--color-bg-elevated)', color: 'var(--color-text-secondary)', textTransform: 'capitalize' }}>
              {job.source}
            </span>
          </div>
          <a
            href={job.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ borderRadius: 'var(--radius-md)', padding: '0.75rem 1.75rem' }}
          >
            Apply on Company Site <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
