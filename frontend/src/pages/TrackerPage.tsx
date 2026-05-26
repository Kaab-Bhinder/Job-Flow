import { useState } from 'react';
import { useTrackerStore } from '../store/trackerStore';
import type { TrackerStatus } from '../store/trackerStore';
import { useJobStore } from '../store/jobStore';
import { Kanban, Building2, MapPin, Plus, Trash2, Calendar, FileText, ChevronRight, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatSalary } from '../lib/utils';

const columns: { id: TrackerStatus; label: string; color: string }[] = [
  { id: 'saved', label: 'Saved', color: 'var(--color-info)' },
  { id: 'applied', label: 'Applied', color: 'var(--color-accent)' },
  { id: 'interview', label: 'Interview', color: 'var(--color-warning)' },
  { id: 'rejected', label: 'Rejected', color: 'var(--color-danger)' },
  { id: 'offer', label: 'Offer 🎉', color: 'var(--color-success)' },
];

export default function TrackerPage() {
  const { applications, moveApplication, removeApplication, updateNotes } = useTrackerStore();
  const { jobs } = useJobStore();
  
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [notesInput, setNotesInput] = useState('');
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const selectedApp = applications.find(a => a.id === selectedAppId);
  const selectedJob = selectedApp ? jobs.find(j => j.id === selectedApp.jobId) : undefined;

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: TrackerStatus) => {
    if (draggedId) {
      moveApplication(draggedId, status);
      setDraggedId(null);
      toast.success(`Application updated to ${status}!`, { className: 'toast-custom' });
    }
  };

  const openModal = (appId: string) => {
    const app = applications.find(a => a.id === appId);
    if (app) {
      setSelectedAppId(appId);
      setNotesInput(app.notes || '');
    }
  };

  const handleSaveNotes = () => {
    if (selectedAppId) {
      updateNotes(selectedAppId, notesInput);
      toast.success('Notes saved successfully!', { className: 'toast-custom' });
      setSelectedAppId(null);
    }
  };

  return (
    <div className="page-enter" style={{ padding: '5.5rem 1.5rem 3rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Kanban size={24} style={{ color: 'var(--color-accent)' }} />
            Application Tracker
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Drag and drop cards to move them through your interview stages
          </p>
        </div>
      </div>

      {/* Board Container */}
      <div
        className="board-scroll"
        style={{
          display: 'flex',
          gap: '1rem',
          overflowX: 'auto',
          paddingBottom: '1rem',
        }}
      >
        {columns.map(col => {
          const colApps = applications.filter(a => a.status === col.id);

          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(col.id)}
              style={{
                flex: '1 0 280px',
                background: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-xl)',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                minHeight: '60vh',
              }}
            >
              {/* Column Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: col.color }} />
                  <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{col.label}</span>
                </div>
                <span className="tag" style={{ background: 'var(--color-bg-elevated)', color: 'var(--color-text-secondary)' }}>
                  {colApps.length}
                </span>
              </div>

              {/* Column Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, overflowY: 'auto' }}>
                {colApps.map(app => {
                  const job = jobs.find(j => j.id === app.jobId);
                  if (!job) return null;

                  return (
                    <div
                      key={app.id}
                      draggable
                      onDragStart={() => handleDragStart(app.id)}
                      onClick={() => openModal(app.id)}
                      className="kanban-card"
                      style={{
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                        userSelect: 'none',
                      }}
                    >
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--color-bg-elevated)',
                          border: '1px solid var(--color-border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          overflow: 'hidden',
                        }}>
                          {job.companyLogo ? (
                            <img src={job.companyLogo} alt={job.company} style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                          ) : (
                            <Building2 size={16} style={{ color: 'var(--color-text-muted)' }} />
                          )}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <h4 style={{ fontSize: '0.875rem', fontWeight: 700, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {job.title}
                          </h4>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{job.company}</span>
                        </div>
                      </div>

                      {/* Card Meta */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <MapPin size={12} /> {job.location}
                        </span>
                        {app.notes && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-accent)' }}>
                            <FileText size={12} /> Notes
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {colApps.length === 0 && (
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-text-muted)',
                    fontSize: '0.8125rem',
                    border: '1px dashed var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '2rem 1rem',
                    textAlign: 'center',
                  }}>
                    Drag jobs here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail & Notes Modal */}
      {selectedApp && selectedJob && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
        }}>
          <div className="card animate-scale-in" style={{
            width: '100%',
            maxWidth: '550px',
            background: 'var(--color-bg-surface)',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}>
                {selectedJob.companyLogo ? (
                  <img src={selectedJob.companyLogo} alt={selectedJob.company} style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                ) : (
                  <Building2 size={20} style={{ color: 'var(--color-text-muted)' }} />
                )}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>{selectedJob.title}</h3>
                <span style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)' }}>{selectedJob.company}</span>
              </div>
            </div>

            {/* Quick Specs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span className="tag" style={{ background: 'var(--color-bg-elevated)', color: 'var(--color-text-secondary)' }}>
                <MapPin size={12} /> {selectedJob.location}
              </span>
              <span className="tag" style={{ background: 'var(--color-bg-elevated)', color: 'var(--color-text-secondary)' }}>
                {formatSalary(selectedJob.salaryMin, selectedJob.salaryMax, selectedJob.salaryCurrency)}
              </span>
            </div>

            {/* Notes Section */}
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.5rem', display: 'block' }}>
                Application Notes
              </label>
              <textarea
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                placeholder="Add interviews dates, contact info, or question list..."
                className="input-base"
                style={{ minHeight: '120px', resize: 'vertical' }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={() => {
                  removeApplication(selectedApp.id);
                  toast.success('Removed from tracker', { className: 'toast-custom' });
                  setSelectedAppId(null);
                }}
                className="btn btn-danger btn-sm"
              >
                <Trash2 size={14} /> Remove Tracked
              </button>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => setSelectedAppId(null)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button onClick={handleSaveNotes} className="btn btn-primary btn-sm">
                  <Check size={14} /> Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
