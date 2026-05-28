import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [token, setToken] = useState('');
  const { resetPassword, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryToken = params.get('token') || '';
    setToken(queryToken);
    if (!queryToken) {
      toast.error('Missing reset token.', { className: 'toast-custom' });
    }
  }, [location.search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error('Missing reset token.', { className: 'toast-custom' });
      return;
    }
    if (!password || password.length < 8) {
      toast.error('Password must be at least 8 characters.', { className: 'toast-custom' });
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.', { className: 'toast-custom' });
      return;
    }

    try {
      await resetPassword(token, password);
      setSubmitted(true);
      toast.success('Password updated successfully.', { className: 'toast-custom' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to reset password.';
      toast.error(message.replace(/^Error:\s*/i, ''), { className: 'toast-custom' });
    }
  };

  return (
    <div className="page-enter" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '5rem 1.5rem 3rem',
      position: 'relative',
    }}>
      <div className="orb" style={{ width: '380px', height: '380px', background: 'var(--color-accent)', top: '10%', right: '8%' }} />
      <div className="orb" style={{ width: '280px', height: '280px', background: 'var(--color-secondary)', bottom: '12%', left: '8%' }} />

      <div className="card animate-scale-in" style={{
        width: '100%',
        maxWidth: '430px',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        position: 'relative',
        zIndex: 1,
      }}>
        <div>
          <Link to="/login" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginBottom: '1rem' }}>
            <ArrowLeft size={14} /> Back to login
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, var(--color-accent), var(--color-secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px var(--color-shadow-accent)',
            }}>
              <Lock size={22} color="white" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>Reset password</h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: '0.25rem 0 0' }}>
                Choose a new password for your account.
              </p>
            </div>
          </div>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.375rem', display: 'block' }}>
                New Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-base"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.375rem', display: 'block' }}>
                Confirm New Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-base"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
            >
              {isLoading ? 'Updating...' : 'Update password'}
            </button>
          </form>
        ) : (
          <div style={{ padding: '1rem 0', color: 'var(--color-text-secondary)', lineHeight: 1.6, textAlign: 'center' }}>
            <CheckCircle2 size={34} style={{ color: 'var(--color-success)', margin: '0 auto 0.75rem' }} />
            Your password has been updated.
            <div style={{ marginTop: '1rem' }}>
              <button className="btn btn-primary" onClick={() => navigate('/login')}>
                Go to login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
