import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  Sparkles,
  Kanban,
  Briefcase,
  TrendingUp,
  Building2,
  Users,
  Zap,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { useJobStore } from '../store/jobStore';
import { useState } from 'react';

export default function HomePage() {
  const navigate = useNavigate();
  const { setFilter } = useJobStore();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilter('keyword', keyword);
    setFilter('location', location);
    navigate('/search');
  };

  const stats = [
    { icon: Briefcase, label: 'Jobs Aggregated', value: '12,400+', color: 'var(--color-accent)' },
    { icon: Building2, label: 'Companies', value: '3,200+', color: 'var(--color-secondary)' },
    { icon: Users, label: 'Active Users', value: '8,500+', color: 'var(--color-success)' },
    { icon: TrendingUp, label: 'Placements', value: '1,800+', color: 'var(--color-warning)' },
  ];

  const features = [
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Search across multiple job boards in one place. Filter by salary, location, type, and more.',
      color: 'var(--color-accent)',
      bg: 'var(--color-accent-soft)',
    },
    {
      icon: Kanban,
      title: 'Application Tracker',
      description: 'Track every application with a visual Kanban board. From saved to offer, never lose track.',
      color: 'var(--color-warning)',
      bg: 'var(--color-warning-soft)',
    },
    {
      icon: Sparkles,
      title: 'AI CV Builder',
      description: 'Generate tailored CVs for each job using AI. Highlight the right keywords automatically.',
      color: 'var(--color-secondary)',
      bg: 'var(--color-secondary-soft)',
    },
  ];

  const trustedCompanies = ['Google', 'Stripe', 'Vercel', 'Notion', 'Figma', 'GitLab', 'Shopify', 'Discord'];

  return (
    <div style={{ overflow: 'hidden' }}>
      {/* ── Hero Section ────────────────────────────────── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '6rem 1.5rem 4rem',
      }}>
        {/* Background Orbs */}
        <div className="orb" style={{
          width: '600px', height: '600px',
          background: 'var(--color-accent)',
          top: '-200px', right: '-100px',
        }} />
        <div className="orb" style={{
          width: '500px', height: '500px',
          background: 'var(--color-secondary)',
          bottom: '-150px', left: '-100px',
        }} />
        <div className="orb" style={{
          width: '300px', height: '300px',
          background: '#ec4899',
          top: '30%', left: '50%',
          transform: 'translateX(-50%)',
        }} />

        <div style={{
          maxWidth: '800px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}>
          {/* Badge */}
          <div
            className="animate-fade-in"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.375rem 1rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--color-accent-soft)',
              border: '1px solid var(--color-border-accent)',
              color: 'var(--color-accent)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
            }}
          >
            <Zap size={14} />
            Powered by AI • Adzuna + JSearch
          </div>

          {/* Heading */}
          <h1
            className="animate-fade-in-up"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              marginBottom: '1.25rem',
            }}
          >
            Find Your Dream Job{' '}
            <span className="gradient-text">Faster</span>
          </h1>

          {/* Subtitle */}
          <p
            className="animate-fade-in-up delay-100"
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: 'var(--color-text-secondary)',
              maxWidth: '600px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.6,
            }}
          >
            Aggregate jobs from multiple sources, track applications visually, and craft 
            AI-tailored CVs — all in one beautiful platform.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="animate-fade-in-up delay-200 glass"
            style={{
              display: 'flex',
              alignItems: 'center',
              borderRadius: 'var(--radius-2xl)',
              padding: '0.375rem',
              boxShadow: '0 16px 64px var(--color-shadow), 0 0 0 1px var(--color-border)',
              maxWidth: '680px',
              margin: '0 auto',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, padding: '0.75rem 1.25rem' }}>
              <Search size={20} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Job title or keyword..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                style={{
                  border: 'none', background: 'transparent', outline: 'none',
                  width: '100%', fontSize: '1rem', color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-sans)',
                }}
              />
            </div>
            <div className="hero-search-loc" style={{
              width: '1px', height: '28px', background: 'var(--color-border)', flexShrink: 0,
            }} />
            <div className="hero-search-loc" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 0.6, padding: '0.75rem 1rem' }}>
              <input
                type="text"
                placeholder="Location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{
                  border: 'none', background: 'transparent', outline: 'none',
                  width: '100%', fontSize: '1rem', color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-sans)',
                }}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                borderRadius: 'var(--radius-xl)',
                padding: '0.75rem 1.5rem',
                fontSize: '0.9375rem',
              }}
            >
              <Search size={18} />
              <span className="hero-search-text">Search</span>
            </button>
          </form>

          {/* Quick links */}
          <div
            className="animate-fade-in-up delay-300"
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem',
              marginTop: '1.25rem',
            }}
          >
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Trending:</span>
            {['React Developer', 'Python', 'Remote', 'AI/ML'].map((term) => (
              <button
                key={term}
                onClick={() => { setKeyword(term); setFilter('keyword', term); navigate('/search'); }}
                className="tag"
                style={{
                  cursor: 'pointer',
                  background: 'var(--color-bg-elevated)',
                  color: 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-accent)';
                  e.currentTarget.style.color = 'var(--color-accent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                }}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Bar ───────────────────────────────────── */}
      <section style={{
        padding: '3rem 1.5rem',
        maxWidth: '1100px',
        margin: '0 auto',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
        }}>
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="card animate-fade-in-up"
              style={{
                padding: '1.5rem',
                textAlign: 'center',
                animationDelay: `${i * 0.1}s`,
              }}
            >
              <stat.icon size={28} style={{ color: stat.color, margin: '0 auto 0.75rem' }} />
              <div style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trusted Companies ───────────────────────────── */}
      <section style={{
        padding: '2rem 1.5rem 4rem',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Jobs from companies you love
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '2rem',
          opacity: 0.5,
          maxWidth: '700px',
          margin: '0 auto',
        }}>
          {trustedCompanies.map((name) => (
            <span key={name} style={{
              fontSize: '1.125rem',
              fontWeight: 700,
              color: 'var(--color-text-muted)',
              letterSpacing: '-0.01em',
            }}>
              {name}
            </span>
          ))}
        </div>
      </section>

      {/* ── Features ────────────────────────────────────── */}
      <section style={{
        padding: '4rem 1.5rem',
        maxWidth: '1100px',
        margin: '0 auto',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Everything you need to{' '}
            <span className="gradient-text">land the job</span>
          </h2>
          <p style={{
            color: 'var(--color-text-secondary)',
            marginTop: '0.75rem',
            maxWidth: '500px',
            margin: '0.75rem auto 0',
            fontSize: '1.0625rem',
          }}>
            Stop juggling tabs. One platform to search, track, and optimize.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}>
          {features.map((feat, i) => (
            <div
              key={feat.title}
              className="card animate-fade-in-up"
              style={{
                padding: '2rem',
                animationDelay: `${i * 0.1}s`,
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-lg)',
                background: feat.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}>
                <feat.icon size={24} style={{ color: feat.color }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.625rem' }}>
                {feat.title}
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, fontSize: '0.9375rem' }}>
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────── */}
      <section style={{
        padding: '4rem 1.5rem',
        maxWidth: '900px',
        margin: '0 auto',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            How It Works
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {[
            { step: '01', title: 'Search & Discover', desc: 'Browse thousands of jobs aggregated from Adzuna, JSearch, and more.', icon: Search },
            { step: '02', title: 'Save & Track', desc: 'Save interesting jobs and move them through your application pipeline.', icon: Kanban },
            { step: '03', title: 'Tailor & Apply', desc: 'Generate an AI-customized CV and apply with confidence.', icon: FileText },
          ].map((item, i) => (
            <div
              key={item.step}
              className="card animate-fade-in-up"
              style={{
                padding: '1.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                animationDelay: `${i * 0.15}s`,
              }}
            >
              <div style={{
                fontSize: '2rem',
                fontWeight: 900,
                color: 'var(--color-accent)',
                opacity: 0.3,
                flexShrink: 0,
                width: '60px',
                textAlign: 'center',
              }}>
                {item.step}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.375rem' }}>
                  {item.title}
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
                  {item.desc}
                </p>
              </div>
              <item.icon size={32} style={{ color: 'var(--color-text-muted)', opacity: 0.3, flexShrink: 0 }} />
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section style={{
        padding: '4rem 1.5rem 6rem',
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center',
      }}>
        <div
          className="animate-fade-in-up"
          style={{
            background: 'linear-gradient(135deg, var(--color-accent), var(--color-secondary))',
            borderRadius: 'var(--radius-2xl)',
            padding: '3.5rem 2rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute',
            top: '-50%', right: '-20%',
            width: '400px', height: '400px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-30%', left: '-10%',
            width: '300px', height: '300px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          }} />

          <h2 style={{
            fontSize: '2rem',
            fontWeight: 800,
            color: 'white',
            marginBottom: '0.75rem',
            position: 'relative',
          }}>
            Ready to streamline your job search?
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: '1.0625rem',
            marginBottom: '2rem',
            position: 'relative',
          }}>
            Join thousands of job seekers who found their next role with Job Flow.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', position: 'relative', flexWrap: 'wrap' }}>
            <Link
              to="/search"
              className="btn"
              style={{
                background: 'white',
                color: 'var(--color-accent)',
                fontWeight: 700,
                padding: '0.875rem 2rem',
                borderRadius: 'var(--radius-xl)',
                fontSize: '1rem',
              }}
            >
              Start Searching <ArrowRight size={18} />
            </Link>
            <Link
              to="/register"
              className="btn"
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '0.875rem 2rem',
                borderRadius: 'var(--radius-xl)',
                fontSize: '1rem',
              }}
            >
              Create Account <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid var(--color-border)',
        padding: '2rem 1.5rem',
        textAlign: 'center',
        fontSize: '0.8125rem',
        color: 'var(--color-text-muted)',
      }}>
        <p>© 2026 Job Flow. Built by Kaab Bhinder. All rights reserved.</p>
      </footer>

      <style>{`
        @media (max-width: 640px) {
          .hero-search-loc { display: none !important; }
          .hero-search-text { display: none; }
        }
      `}</style>
    </div>
  );
}
