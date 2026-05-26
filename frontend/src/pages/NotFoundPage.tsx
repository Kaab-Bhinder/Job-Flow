import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="page-enter" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
      textAlign: 'center',
      flexDirection: 'column',
      gap: '1.5rem',
    }}>
      <div style={{
        fontSize: '6rem',
        fontWeight: 900,
        lineHeight: 1,
        background: 'linear-gradient(135deg, var(--color-accent), var(--color-secondary))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        404
      </div>
      <div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Lost in space?</h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>The page you are looking for doesn't exist or was moved.</p>
      </div>
      <Link to="/" className="btn btn-primary" style={{ borderRadius: 'var(--radius-md)' }}>
        <ArrowLeft size={16} /> Go Home
      </Link>
    </div>
  );
}
