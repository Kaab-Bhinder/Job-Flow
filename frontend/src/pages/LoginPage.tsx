import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Briefcase, Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('verified') === '1') {
      toast.success('Email verified. You can log in now.', { className: 'toast-custom' });
    }
  }, [location.search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter all credentials!', { className: 'toast-custom' });
      return;
    }
    try {
      await login(email, password);
      toast.success('Logged in successfully!', { className: 'toast-custom' });
      navigate('/search');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to log in.';
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
      {/* Background Orbs */}
      <div className="orb" style={{ width: '400px', height: '400px', background: 'var(--color-accent)', top: '10%', right: '10%' }} />
      <div className="orb" style={{ width: '300px', height: '300px', background: 'var(--color-secondary)', bottom: '10%', left: '10%' }} />

      <div className="card animate-scale-in" style={{
        width: '100%',
        maxWidth: '400px',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Brand */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, var(--color-accent), var(--color-secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 4px 15px var(--color-shadow-accent)',
          }}>
            <Briefcase size={22} color="white" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Welcome back</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
            Log in to manage your job search pipeline
          </p>
        </div>

        {/* Social */}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
          <a href="http://127.0.0.1:8000/auth/google" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center' }}>
            Sign in with Google
          </a>
        </div>
        {/* Form */}
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

          <div>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.375rem', display: 'block' }}>
              Password
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

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
          >
            {isLoading ? 'Signing in...' : <>Sign In <LogIn size={16} /></>}
          </button>
        </form>

        {/* Footer Link */}
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', textAlign: 'center', margin: 0 }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--color-accent)', fontWeight: 600, textDecoration: 'none' }}>
            Sign up <ArrowRight size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />
          </Link>
        </p>
      </div>
    </div>
  );
}
