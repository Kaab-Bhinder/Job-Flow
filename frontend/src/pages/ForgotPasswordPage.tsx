import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Send, X, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

type ForgotPopup = {
  title: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [popup, setPopup] = useState<ForgotPopup | null>(null);
  const { forgotPassword, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email.', { className: 'toast-custom' });
      return;
    }

    try {
      const response = await forgotPassword(email);
      if (response.reason === 'google_signin') {
        setPopup({
          title: 'Use Google sign-in',
          message: response.message || 'This account uses Google sign-in. Please continue with Google.',
          actionLabel: 'Sign in with Google',
          actionHref: 'http://127.0.0.1:8000/auth/google',
        });
        return;
      }

      if (response.reason === 'email_not_found') {
        setPopup({
          title: 'Email not found',
          message: response.message || 'No account found for that email.',
          actionLabel: 'Back to login',
          actionHref: '/login',
        });
        return;
      }

      setSubmitted(true);
      toast.success(response.message || 'A reset link has been sent to your email.', { className: 'toast-custom' });
      if (response.resetUrl) {
        toast('Dev reset link created. Check the backend response or open the link directly in this session.', { className: 'toast-custom' });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to request password reset.';
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
              <Mail size={22} color="white" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>Forgot password</h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: '0.25rem 0 0' }}>
                We’ll send a reset link to your email.
              </p>
            </div>
          </div>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.375rem', display: 'block' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
              {isLoading ? 'Sending...' : <>Send reset link <Send size={16} /></>}
            </button>
          </form>
        ) : (
          <div style={{ padding: '1rem 0', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            If an account exists for that email, a reset link has been sent.
            <div style={{ marginTop: '1rem' }}>
              <button className="btn btn-secondary" onClick={() => navigate('/login')}>
                Return to login
              </button>
            </div>
          </div>
        )}

        {popup && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            zIndex: 50,
          }}>
            <div className="card" style={{
              width: '100%',
              maxWidth: '420px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>{popup.title}</h3>
                  <p style={{ margin: '0.5rem 0 0', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{popup.message}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPopup(null)}
                  aria-label="Close popup"
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {popup.actionHref && popup.actionLabel && (
                  <a
                    href={popup.actionHref}
                    className="btn btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', textDecoration: 'none' }}
                  >
                    {popup.actionLabel === 'Sign in with Google' ? <LogIn size={16} /> : null}
                    {popup.actionLabel}
                  </a>
                )}
                <button className="btn btn-secondary" onClick={() => setPopup(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
