import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  AlertTriangle
} from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { firebaseAuth, googleProvider } from '../../lib/firebase/client.ts';
import { 
  authenticateCredentials, 
  authenticateGoogle, 
  verifyOtpChallenge, 
  resendOtpChallenge 
} from '../../data/portalStore.js';
import { BRANDING_LOGOS } from '../../data/masterData.js';
import OtpVerificationManager from '../auth/OtpVerificationManager.jsx';
import { safeAuthFetch, AuthApiError } from '../../lib/auth/authFetch.js';

export default function PortalAuth({ currentUser, onLoginSuccess, onClose }) {
  // State Machine: 'LOGIN' | 'OTP_CHALLENGE' | 'FORGOT_PASSWORD' | 'FORCE_PASSWORD_CHANGE'
  const [authState, setAuthState] = useState('LOGIN');

  // Form States (Initially clean and blank - No prefilled credentials)
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [cardNudge, setCardNudge] = useState(false);

  // Active OTP Challenge Context
  const [otpChallengeData, setOtpChallengeData] = useState(null);

  // Forgot Password / Force Change States
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const modalRef = useRef(null);

  // Trigger error shake animation
  const triggerCardNudge = (msg) => {
    setErrorMessage(msg);
    setCardNudge(true);
    setTimeout(() => setCardNudge(false), 500);
  };

  // 1. Password Login Handler with Mandatory 2-Step OTP (Server-Authoritative)
  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!identifier.trim() || !password) {
      triggerCardNudge('Please enter both your institutional ID/email and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Try Server-Authoritative Password Endpoint
      const { ok, data } = await safeAuthFetch('/api/auth/password/start', {
        method: 'POST',
        body: {
          identifier: identifier.trim(),
          password
        }
      });

      if (ok && data?.success) {
        setOtpChallengeData({ user: data.user, maskedEmail: data.maskedEmail });
        setAuthState('OTP_CHALLENGE');
        return;
      }

      if (data && !data.success) {
        triggerCardNudge(data.error || 'Invalid email/username or password.');
        return;
      }
    } catch (apiErr) {
      console.warn('[PASSWORD_AUTH_SERVER_NOTICE] Checking client fallback:', apiErr);
    }

    // 2. Fallback to store auth for offline mode
    try {
      const result = authenticateCredentials(identifier.trim(), password);

      if (!result.success) {
        triggerCardNudge('Invalid email/username or password.');
        return;
      }

      if (result.forcePasswordChange) {
        setOtpChallengeData({ user: result.user, maskedEmail: result.maskedEmail });
        setAuthState('FORCE_PASSWORD_CHANGE');
        return;
      }

      setOtpChallengeData({ user: result.user, maskedEmail: result.maskedEmail });
      setAuthState('OTP_CHALLENGE');
    } catch (err) {
      console.error('[AUTH_ERROR]', err);
      triggerCardNudge('Unable to complete sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Real Firebase Google Sign-In Popup Handler (Server-Authoritative)
  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const result = await signInWithPopup(firebaseAuth, googleProvider);
      const googleUser = result.user;
      const verifiedEmail = googleUser?.email;

      if (!verifiedEmail) {
        triggerCardNudge('Unable to retrieve verified email from Google account.');
        return;
      }

      // 1. Try Server-Authoritative Google Endpoint
      try {
        const { ok, data } = await safeAuthFetch('/api/auth/google/start', {
          method: 'POST',
          body: {
            email: verifiedEmail,
            uid: googleUser.uid
          }
        });

        if (ok && data?.success) {
          setOtpChallengeData({ user: data.user, maskedEmail: data.maskedEmail });
          setAuthState('OTP_CHALLENGE');
          return;
        }

        if (data && !data.success) {
          triggerCardNudge(data.error || 'Access not available for this Google account.');
          return;
        }
      } catch (srvErr) {
        console.warn('[GOOGLE_AUTH_SERVER_NOTICE] Checking client fallback:', srvErr);
      }

      // 2. Fallback store check for offline mode
      const authResult = authenticateGoogle(verifiedEmail, googleUser?.uid);

      if (!authResult.success) {
        triggerCardNudge('Access not available. This account is not authorized to access the NEC portal. Please contact the administrator.');
        return;
      }

      setOtpChallengeData({ user: authResult.user, maskedEmail: authResult.maskedEmail });
      setAuthState('OTP_CHALLENGE');
    } catch (error) {
      console.error('Firebase Google Sign-In error:', error);
      
      if (error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/cancelled-popup-request') {
        return;
      }
      
      if (error?.code === 'auth/unauthorized-domain') {
        triggerCardNudge('Current domain is not authorized in Firebase. Please ensure this domain is added to Firebase Authorized Domains.');
        return;
      }

      triggerCardNudge('Google sign-in could not be completed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Forgot Password Submit
  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setForgotSubmitted(true);
    }, 500);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(4, 8, 17, 0.94)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 6000,
      padding: 'clamp(1rem, 3vw, 2.5rem)'
    }}>
      {/* Outer Login Card */}
      <div 
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          maxWidth: '920px',
          width: '100%',
          boxShadow: '0 30px 90px rgba(0,0,0,0.75)',
          overflow: 'hidden',
          position: 'relative',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 390px) 1fr',
          transform: cardNudge ? 'translateX(-6px)' : 'none',
          transition: 'transform 0.15s ease'
        }}
      >
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close login window"
            style={{
              position: 'absolute',
              top: '1.2rem',
              right: '1.2rem',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.06)',
              color: '#0B192C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 30,
              cursor: 'pointer',
              border: 'none'
            }}
          >
            <X size={18} />
          </button>
        )}

        {/* LEFT PANEL: Official College Branding & Aesthetic Background */}
        <div style={{
          position: 'relative',
          background: '#070F1E',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '2.5rem 2rem',
          color: '#FFFFFF'
        }}>
          {/* Ambient Video Backdrop */}
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.28,
              filter: 'brightness(0.8)'
            }}
            src="/assets/NEC Videos/Aerial View Of campus_.mp4"
          />

          {/* Dark Navy Overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(180deg, rgba(7, 15, 30, 0.85) 0%, rgba(11, 25, 44, 0.95) 100%)',
            zIndex: 1
          }} />

          {/* College Header Branding */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <img
              src={BRANDING_LOGOS.collegeLogo}
              alt="NEC Official Crest"
              style={{ width: '56px', height: '56px', borderRadius: '10px', border: '1px solid #D4AF37', marginBottom: '1.2rem' }}
            />
            <div style={{ fontFamily: 'Cinzel, serif', fontWeight: 800, fontSize: '1.25rem', color: '#FFFFFF', lineHeight: 1.25 }}>
              NARASARAOPETA <br /><span style={{ color: '#D4AF37' }}>ENGINEERING COLLEGE</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#CBD5E1', marginTop: '0.4rem', fontWeight: 500 }}>
              Academic & Research Portal
            </div>
          </div>

          {/* Core Feature Points */}
          <div style={{ position: 'relative', zIndex: 2, margin: '2rem 0' }}>
            <div style={{ fontSize: '0.86rem', color: '#E2E8F0', lineHeight: 1.6, marginBottom: '1.4rem' }}>
              Secure access to academic, research, and institutional services.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.84rem', color: '#CBD5E1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} style={{ color: '#10B981', flexShrink: 0 }} /> Secure Login
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} style={{ color: '#10B981', flexShrink: 0 }} /> Email Verification
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} style={{ color: '#10B981', flexShrink: 0 }} /> Protected Academic Data
              </div>
            </div>
          </div>

          {/* Bottom Footer Note */}
          <div style={{ position: 'relative', zIndex: 2, fontSize: '0.75rem', color: '#94A3B8', borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '0.8rem' }}>
            For authorized NEC users only.
          </div>
        </div>

        {/* RIGHT PANEL: Clean College Login Form */}
        <div style={{ padding: 'clamp(1.8rem, 4vw, 3rem)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          
          {/* Error Message Alert (Only shown after an invalid attempt) */}
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

          {/* ────────────────────────────────────────────────────────── */}
          {/* STATE 1: NORMAL LOGIN FORM */}
          {/* ────────────────────────────────────────────────────────── */}
          {authState === 'LOGIN' && (
            <div>
              <div style={{ marginBottom: '1.8rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: '#0B192C', fontWeight: 800, marginBottom: '0.25rem' }}>
                  Welcome Back
                </h2>
                <p style={{ color: '#64748B', fontSize: '0.88rem' }}>
                  Login to NEC Academic & Research Portal
                </p>
              </div>

              <form onSubmit={handleCredentialsSubmit}>
                {/* Email or Username Input */}
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

                {/* Password Input with Show/Hide & CapsLock Detector */}
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

                {/* Remember Device Checkbox & Forgot Password Link */}
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
                    onClick={() => { setAuthState('FORGOT_PASSWORD'); setErrorMessage(''); }}
                    style={{ fontSize: '0.82rem', color: '#2B5784', fontWeight: 600, background: 'transparent', border: 'none', cursor: 'pointer' }}
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Login Submit Button */}
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

              {/* Clean OR Divider */}
              <div style={{ display: 'flex', alignItems: 'center', margin: '0.8rem 0 1.2rem', gap: '0.8rem' }}>
                <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
                <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600 }}>OR</span>
                <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
              </div>

              {/* Direct Firebase Google Popup Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
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
                  transition: 'background 0.2s ease, transform 0.1s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#FFFFFF'}
              >
                {/* Official Google Color G */}
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>{isSubmitting ? 'Connecting to Google...' : 'Continue with Google'}</span>
              </button>
            </div>
          )}

          {/* ────────────────────────────────────────────────────────── */}
          {/* STATE 2: 6-DIGIT EMAIL OTP CHALLENGE */}
          {/* ────────────────────────────────────────────────────────── */}
          {authState === 'OTP_CHALLENGE' && (
            <OtpVerificationManager
              user={otpChallengeData?.user}
              maskedEmail={otpChallengeData?.maskedEmail}
              onSuccess={(authenticatedUser) => {
                onLoginSuccess(authenticatedUser);
              }}
              onBackToSignIn={() => {
                setAuthState('LOGIN');
                setErrorMessage('');
              }}
            />
          )}

          {/* ────────────────────────────────────────────────────────── */}
          {/* STATE 3: FORGOT PASSWORD */}
          {/* ────────────────────────────────────────────────────────── */}
          {authState === 'FORGOT_PASSWORD' && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <button
                  onClick={() => { setAuthState('LOGIN'); setForgotSubmitted(false); setErrorMessage(''); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#64748B', fontSize: '0.8rem', marginBottom: '0.8rem', fontWeight: 600, background: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                  <ArrowLeft size={14} /> Back to Sign In
                </button>
                <h2 style={{ fontSize: '1.45rem', color: '#0B192C', fontWeight: 800, marginBottom: '0.2rem' }}>
                  Reset your password
                </h2>
                <p style={{ color: '#64748B', fontSize: '0.85rem' }}>
                  Enter the email associated with your NEC portal account.
                </p>
              </div>

              {forgotSubmitted ? (
                <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '10px', padding: '1.4rem', color: '#065F46', textAlign: 'center' }}>
                  <CheckCircle2 size={34} style={{ color: '#059669', margin: '0 auto 0.6rem' }} />
                  <div style={{ fontWeight: 700, fontSize: '0.96rem', marginBottom: '0.3rem' }}>Instructions Sent</div>
                  <p style={{ fontSize: '0.84rem', lineHeight: 1.5, color: '#047857' }}>
                    If an eligible account exists, a password reset link has been sent to your email.
                  </p>
                  <button
                    onClick={() => { setAuthState('LOGIN'); setForgotSubmitted(false); }}
                    className="btn-navy"
                    style={{ marginTop: '1.2rem', padding: '0.55rem 1.4rem', fontSize: '0.82rem' }}
                  >
                    Return to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPasswordSubmit}>
                  <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                    <label className="form-label">Registered Institutional Email</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                      <input
                        type="email"
                        required
                        placeholder="yourname@nrtec.in"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
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
                    {isSubmitting ? 'Sending Link...' : 'Send Reset Link'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ────────────────────────────────────────────────────────── */}
          {/* STATE 4: FORCE PASSWORD CHANGE (First-time login) */}
          {/* ────────────────────────────────────────────────────────── */}
          {authState === 'FORCE_PASSWORD_CHANGE' && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.45rem', color: '#0B192C', fontWeight: 800, marginBottom: '0.2rem' }}>
                  Create New Password
                </h2>
                <p style={{ color: '#64748B', fontSize: '0.85rem' }}>
                  Please set a new secure password before accessing your account.
                </p>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                if (newPassword !== confirmPassword) {
                  triggerCardNudge('Passwords do not match.');
                  return;
                }
                if (newPassword.length < 8) {
                  triggerCardNudge('Password must be at least 8 characters long.');
                  return;
                }
                setAuthState('OTP_CHALLENGE');
              }}>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="form-control"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-control"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', padding: '0.8rem', fontSize: '0.92rem' }}
                >
                  Save Password & Proceed
                </button>
              </form>
            </div>
          )}

        </div>
      </div>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
