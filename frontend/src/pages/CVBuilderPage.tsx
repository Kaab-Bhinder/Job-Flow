import { useState } from 'react';
import { useJobStore } from '../store/jobStore';
import { Sparkles, FileText, Upload, ChevronRight, Check, ArrowRight, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CVBuilderPage() {
  const { jobs } = useJobStore();
  const [selectedJobId, setSelectedJobId] = useState('');
  const [cvText, setCvText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [tailoredCv, setTailoredCv] = useState('');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  const selectedJob = jobs.find(j => j.id === selectedJobId);

  const handleGenerate = () => {
    if (!selectedJobId) {
      toast.error('Please select a job listing first!', { className: 'toast-custom' });
      return;
    }
    if (!cvText.trim()) {
      toast.error('Please paste or write your current CV!', { className: 'toast-custom' });
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setTailoredCv(
        `--- TAILORED CV FOR ${selectedJob?.company.toUpperCase()} ---\n\n` +
        `Objective:\nResult-driven engineer focusing on React, TypeScript, and modern styling solutions. Excited to apply for the ${selectedJob?.title} position at ${selectedJob?.company} and help accelerate team growth.\n\n` +
        `Relevant Skills Highlighted:\n${selectedJob?.tags.join(', ')}\n\n` +
        `Professional Experience:\n` +
        `* Leveraged TypeScript and best practices to optimize front-facing applications.\n` +
        `* Designed components utilizing highly unified CSS design tokens matching advanced modern aesthetics.\n\n` +
        `Original Content:\n${cvText}`
      );
      setActiveTab('preview');
      toast.success('CV tailored successfully by AI!', { className: 'toast-custom' });
    }, 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([tailoredCv], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Tailored_CV_${selectedJob?.company}.txt`;
    document.body.appendChild(element);
    element.click();
    toast.success('Downloaded CV txt!', { className: 'toast-custom' });
  };

  return (
    <div className="page-enter" style={{ padding: '5.5rem 1.5rem 3rem', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={24} style={{ color: 'var(--color-accent)' }} />
          AI CV Customizer
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Select a target job and optimize your resume to highlight matching skills and keywords
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: tailoredCv ? '1fr 1fr' : '1fr',
        gap: '1.5rem',
        alignItems: 'start',
      }} className="cv-layout">
        
        {/* Left Side: Setup or Original */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={18} style={{ color: 'var(--color-accent)' }} />
            Original Resume & Target
          </h2>

          {/* Job Selector */}
          <div>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.5rem', display: 'block' }}>
              Target Job listing
            </label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="input-base"
              style={{ cursor: 'pointer' }}
            >
              <option value="">Select a job listing...</option>
              {jobs.map(j => (
                <option key={j.id} value={j.id}>{j.title} at {j.company}</option>
              ))}
            </select>
          </div>

          {/* CV Paste */}
          <div>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.5rem', display: 'block' }}>
              Paste Your Current CV / Resume Text
            </label>
            <textarea
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              placeholder="Paste your resume content here..."
              className="input-base"
              style={{ minHeight: '250px', resize: 'vertical' }}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {isGenerating ? (
              <>Optimizing resume with AI...</>
            ) : (
              <>
                <Sparkles size={16} /> Tailor Resume <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>

        {/* Right Side: Tailored Result */}
        {tailoredCv && (
          <div className="card animate-scale-in" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} style={{ color: 'var(--color-success)' }} />
                AI-Tailored Resume
              </h2>
              <button onClick={handleDownload} className="btn btn-secondary btn-sm">
                <Download size={14} /> Download TXT
              </button>
            </div>

            <div style={{
              background: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              color: 'var(--color-text-primary)',
              fontSize: '0.875rem',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              maxHeight: '430px',
              overflowY: 'auto',
              fontFamily: 'monospace',
            }}>
              {tailoredCv}
            </div>

            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Check size={14} color="var(--color-success)" />
              <span>Keywords optimized for: <strong>{selectedJob?.tags.join(', ')}</strong></span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .cv-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
