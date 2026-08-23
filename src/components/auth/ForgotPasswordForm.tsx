import React, { useState } from 'react';
import { ArrowLeft, Mail, CheckCircle2, RefreshCw } from 'lucide-react';

interface ForgotPasswordFormProps {
  onSubmitEmail: (email: string) => void;
  onBackToLogin: () => void;
  isSubmitting: boolean;
  submitted: boolean;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSubmitEmail,
  onBackToLogin,
  isSubmitting,
  submitted
}) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    onSubmitEmail(email.trim());
  };

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={onBackToLogin}
        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#64748B', fontSize: '0.8rem', marginBottom: '0.8rem', fontWeight: 600, background: 'transparent', border: 'none', cursor: 'pointer' }}
      >
        <ArrowLeft size={14} /> Back to Sign In
      </button>

      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.45rem', color: '#0B192C', fontWeight: 800, marginBottom: '0.2rem' }}>
          Reset your password
        </h2>
        <p style={{ color: '#64748B', fontSize: '0.85rem' }}>
          Enter the email associated with your NEC portal account.
        </p>
      </div>

      {submitted ? (
        <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '10px', padding: '1.4rem', color: '#065F46', textAlign: 'center' }}>
          <CheckCircle2 size={34} style={{ color: '#059669', margin: '0 auto 0.6rem' }} />
          <div style={{ fontWeight: 700, fontSize: '0.96rem', marginBottom: '0.3rem' }}>Instructions Sent</div>
          <p style={{ fontSize: '0.84rem', lineHeight: 1.5, color: '#047857' }}>
            If an eligible account exists, a password reset link has been sent to your email.
          </p>
          <button
            onClick={onBackToLogin}
            className="btn-navy"
            style={{ marginTop: '1.2rem', padding: '0.55rem 1.4rem', fontSize: '0.82rem' }}
          >
            Return to Login
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.2rem' }}>
            <label className="form-label">Registered Institutional Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="email"
                required
                placeholder="yourname@nrtec.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
            style={{ width: '100%', padding: '0.8rem', fontSize: '0.92rem' }}
          >
            {isSubmitting ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <RefreshCw size={15} style={{ animation: 'spin 1s linear infinite' }} /> Sending Link...
              </span>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>
      )}
    </div>
  );
};
