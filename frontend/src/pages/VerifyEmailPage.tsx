import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CheckCircle2, MailWarning } from 'lucide-react';

export default function VerifyEmailPage() {
  const location = useLocation();
  const [status, setStatus] = useState<'loading' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email address...');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Verification token is missing.');
      return;
    }

    window.location.replace(`http://127.0.0.1:8000/auth/verify?token=${encodeURIComponent(token)}`);
  }, [location.search]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '2rem',
      }}
    >
      <div className="card" style={{ maxWidth: 480, width: '100%', padding: '2rem', textAlign: 'center' }}>
        {status === 'loading' ? <CheckCircle2 size={40} style={{ margin: '0 auto 1rem', color: 'var(--color-accent)' }} /> : <MailWarning size={40} style={{ margin: '0 auto 1rem', color: 'var(--color-danger, #ef4444)' }} />}
        <h1 style={{ margin: 0, marginBottom: '0.75rem' }}>{status === 'loading' ? 'Verifying email' : 'Verification issue'}</h1>
        <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>{message}</p>
      </div>
    </div>
  );
}
