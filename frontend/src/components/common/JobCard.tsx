import { Link } from 'react-router-dom';
import { MapPin, Clock, Bookmark, BookmarkCheck, Building2, Wifi } from 'lucide-react';
import type { Job } from '../../lib/mockData';
import { formatSalary, timeAgo } from '../../lib/utils';
import { useJobStore } from '../../store/jobStore';

interface JobCardProps {
  job: Job;
  index?: number;
}

export default function JobCard({ job, index = 0 }: JobCardProps) {
  const { savedJobIds, toggleSaveJob } = useJobStore();
  const isSaved = savedJobIds.includes(job.id);

  return (
    <div
      className="card card-interactive animate-fade-in-up"
      style={{
        padding: '1.25rem',
        animationDelay: `${index * 0.05}s`,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.875rem',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
          {/* Company Logo */}
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            overflow: 'hidden',
          }}>
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={job.company}
                style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).nextElementSibling?.removeAttribute('style');
                }}
              />
            ) : null}
            <Building2
              size={20}
              style={{
                color: 'var(--color-text-muted)',
                display: job.companyLogo ? 'none' : 'block',
              }}
            />
          </div>

          <div style={{ minWidth: 0, flex: 1 }}>
            <Link
              to={`/jobs/${job.id}`}
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                textDecoration: 'none',
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-text-primary)';
              }}
            >
              {job.title}
            </Link>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--color-text-secondary)',
              marginTop: '0.125rem',
            }}>
              {job.company}
            </p>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleSaveJob(job.id);
          }}
          className="btn btn-ghost btn-icon"
          style={{
            borderRadius: 'var(--radius-full)',
            color: isSaved ? 'var(--color-accent)' : 'var(--color-text-muted)',
            flexShrink: 0,
          }}
          aria-label={isSaved ? 'Unsave job' : 'Save job'}
        >
          {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </button>
      </div>

      {/* Meta */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        fontSize: '0.8125rem',
        color: 'var(--color-text-muted)',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <MapPin size={14} /> {job.location}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Clock size={14} /> {timeAgo(job.postedAt)}
        </span>
        {job.isRemote && (
          <span
            className="tag"
            style={{
              color: 'var(--color-success)',
              background: 'var(--color-success-soft)',
              padding: '0.125rem 0.5rem',
            }}
          >
            <Wifi size={12} /> Remote
          </span>
        )}
      </div>

      {/* Salary */}
      <div style={{
        fontSize: '0.9375rem',
        fontWeight: 700,
        background: 'linear-gradient(135deg, var(--color-accent), var(--color-secondary))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
      </div>

      {/* Tags */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.375rem',
      }}>
        {job.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="tag"
            style={{
              background: 'var(--color-bg-elevated)',
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border)',
            }}
          >
            {tag}
          </span>
        ))}
        <span
          className="tag"
          style={{
            background: 'var(--color-accent-soft)',
            color: 'var(--color-accent)',
          }}
        >
          {job.jobType}
        </span>
      </div>
    </div>
  );
}
