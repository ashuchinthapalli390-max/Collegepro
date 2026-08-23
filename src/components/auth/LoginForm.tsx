import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, AlertTriangle, RefreshCw, AlertCircle } from 'lucide-react';

interface LoginFormProps {
  onSubmitCredentials: (identifier: string, pass: string, remember: boolean) => void;
  onGoogleSignIn: () => void;
  onForgotPassword: () => void;
  isSubmitting: boolean;
  errorMessage?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmitCredentials,
  onGoogleSignIn,
  onForgotPassword,
  isSubmitting,
  errorMessage
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) return;
    onSubmitCredentials(identifier.trim(), password, rememberDevice);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.8rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#0B192C', fontWeight: 800, marginBottom: '0.25rem' }}>
          Welcome Back
        </h2>
        <p style={{ color: '#64748B', fontSize: '0.88rem' }}>
          Login to NEC Academic & Research Portal
        </p>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div style={{
          background: '#FEF2F2',
          border: '1px solid #FCA5A5',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          color: '#DC2626',
          fontSize: '0.84rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1.4rem'
        }}>
          <AlertCircle size={17} style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Email or Username */}
        <div className="form-group" style={{ marginBottom: '1.1rem' }}>
          <label className="form-label">Email or Username</label>
          <div style={{ position: 'relative' }}>
            <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              required
              placeholder="Enter your email or username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2.5rem' }}
              autoComplete="username"
            />
          </div>
        </div>

        {/* Password */}
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label className="form-label">Password</label>
          <div style={{ position: 'relative' }}>
            <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyUp={(e) => setCapsLockActive(e.getModifierState('CapsLock'))}
              className="form-control"
              style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {capsLockActive && (
            <div style={{ fontSize: '0.72rem', color: '#D97706', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
              <AlertTriangle size={12} /> Caps Lock is ON
            </div>
          )}
        </div>

        {/* Options Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <input
              type="checkbox"
              id="rememberDevice"
              checked={rememberDevice}
              onChange={(e) => setRememberDevice(e.target.checked)}
              style={{ accentColor: '#0B192C', width: '15px', height: '15px' }}
            />
            <label htmlFor="rememberDevice" style={{ fontSize: '0.82rem', color: '#475569', cursor: 'pointer' }}>
              Remember this device
            </label>
          </div>

          <button
            type="button"
            onClick={onForgotPassword}
            style={{ fontSize: '0.82rem', color: '#2B5784', fontWeight: 600, background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            Forgot Password?
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary"
          style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.2rem' }}
        >
          {isSubmitting ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <RefreshCw size={15} style={{ animation: 'spin 1s linear infinite' }} /> Verifying...
            </span>
          ) : (
            'Login'
          )}
        </button>
      </form>

      {/* OR Divider */}
      <div style={{ display: 'flex', alignItems: 'center', margin: '0.8rem 0 1.2rem', gap: '0.8rem' }}>
        <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
        <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600 }}>OR</span>
        <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
      </div>

      {/* Google Button */}
      <button
        type="button"
        onClick={onGoogleSignIn}
        disabled={isSubmitting}
        style={{
          width: '100%',
          padding: '0.75rem',
          borderRadius: '8px',
          border: '1.5px solid #CBD5E1',
          background: '#FFFFFF',
          color: '#0F172A',
          fontWeight: 600,
          fontSize: '0.88rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.65rem',
          cursor: 'pointer',
          transition: 'background 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
        onMouseLeave={(e) => e.currentTarget.style.background = '#FFFFFF'}
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
        </svg>
        <span>Continue with Google</span>
      </button>
    </div>
  );
};
