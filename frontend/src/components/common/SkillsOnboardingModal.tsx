import { useEffect, useState } from 'react';
import { Sparkles, X, CheckCircle2 } from 'lucide-react';
import { splitSkills } from '../../lib/utils';

interface SkillsOnboardingModalProps {
  open: boolean;
  onSave: (skills: string[]) => Promise<void> | void;
  onSkip: () => void;
  initialSkills?: string[];
  userName?: string;
}

export default function SkillsOnboardingModal({
  open,
  onSave,
  onSkip,
  initialSkills = [],
  userName,
}: SkillsOnboardingModalProps) {
  const [skillsInput, setSkillsInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setSkillsInput(initialSkills.join(', '));
    }
  }, [open, initialSkills]);

  if (!open) return null;

  const parsedSkills = splitSkills(skillsInput);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(parsedSkills);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(2, 6, 23, 0.68)',
      backdropFilter: 'blur(8px)',
      zIndex: 1100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
    }}>
      <div className="card animate-scale-in" style={{
        width: '100%',
        maxWidth: '620px',
        padding: '1.5rem',
        border: '1px solid var(--color-border)',
        boxShadow: '0 32px 90px rgba(0, 0, 0, 0.35)',
        position: 'relative',
      }}>
        <button
          onClick={onSkip}
          className="btn btn-ghost btn-icon"
          aria-label="Dismiss onboarding"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            borderRadius: 'var(--radius-full)',
          }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: 'var(--radius-xl)',
            background: 'linear-gradient(135deg, var(--color-accent), var(--color-secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 8px 24px var(--color-shadow-accent)',
          }}>
            <Sparkles size={24} color="white" />
          </div>
          <div style={{ flex: 1, paddingRight: '2rem' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-accent)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Personalize your feed
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
              {userName ? `Welcome, ${userName}` : 'Welcome to JobFlow'}
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Add the skills you want to see first. We’ll rank matching jobs higher and keep the feed focused on what fits you best.
            </p>

            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
              Skills
            </label>
            <textarea
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="React, TypeScript, Node.js, Python, AWS"
              rows={4}
              className="input-base"
              style={{ width: '100%', minHeight: '110px', resize: 'vertical', lineHeight: 1.5 }}
            />

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
              {['React', 'TypeScript', 'Python', 'Node.js', 'AWS', 'UI/UX'].map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => {
                    const current = splitSkills(skillsInput);
                    if (!current.some((item) => item.toLowerCase() === skill.toLowerCase())) {
                      setSkillsInput([...current, skill].join(', '));
                    }
                  }}
                  className="tag"
                  style={{
                    cursor: 'pointer',
                    background: 'var(--color-accent-soft)',
                    color: 'var(--color-accent)',
                    border: '1px solid var(--color-border-accent)',
                  }}
                >
                  + {skill}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="btn btn-primary"
                style={{ minWidth: '160px' }}
              >
                {isSaving ? 'Saving...' : <><CheckCircle2 size={16} /> Save skills</>}
              </button>
              <button
                onClick={onSkip}
                className="btn btn-secondary"
                type="button"
              >
                Skip for now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
