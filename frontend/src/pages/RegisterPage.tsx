import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Briefcase, Mail, Lock, User, UserPlus, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill in all fields!', { className: 'toast-custom' });
      return;
    }
    try {
      const result = await register(name, email, password);
      toast.success(result?.needsVerification ? 'Account created. Check your email to verify.' : 'Account created successfully!', { className: 'toast-custom' });
      navigate('/login');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed.';
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
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Get started</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
            Create an account to save jobs and tailor CVs
          </p>
        </div>

        {/* Social */}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
          <a href="http://127.0.0.1:8000/auth/google" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center' }}>
            Sign up with Google
          </a>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.375rem', display: 'block' }}>
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-base"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

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
                placeholder="Min 8 characters"
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
            {isLoading ? 'Registering...' : <>Sign Up <UserPlus size={16} /></>}
          </button>
        </form>

        {/* Footer Link */}
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', textAlign: 'center', margin: 0 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--color-accent)', fontWeight: 600, textDecoration: 'none' }}>
            Log in <ArrowRight size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />
          </Link>
        </p>
      </div>
    </div>
  );
}
