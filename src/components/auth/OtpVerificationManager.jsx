import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import OtpInput from './otp/OtpInput.jsx';
import OtpProcessingOrbit from './otp/OtpProcessingOrbit.jsx';
import OtpSuccessState from './otp/OtpSuccessState.jsx';
import OtpErrorScatter from './otp/OtpErrorScatter.jsx';
import OtpExpiredState from './otp/OtpExpiredState.jsx';
import OtpResendState from './otp/OtpResendState.jsx';
import OtpLockedState from './otp/OtpLockedState.jsx';
import { verifyOtpChallenge, resendOtpChallenge } from '../../data/portalStore.js';

export default function OtpVerificationManager({
  user,
  maskedEmail = 'd*************g@gmail.com',
  onSuccess,
  onBackToSignIn
}) {
  const [uiState, setUiState] = useState('typing'); // OtpUiState: typing | processing | success | error | expired | resending | sent | locked
  const [otpValue, setOtpValue] = useState('');
  const [isMerging, setIsMerging] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState(5);
  const [secondsRemaining, setSecondsRemaining] = useState(300); // 5 minutes
  const [resendCooldown, setResendCooldown] = useState(45); // 45s resend timer
  const requestLockRef = useRef(false);

  // 1. Session Expiry & Resend Timers
  useEffect(() => {
    if (uiState === 'success' || uiState === 'locked') return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setUiState('expired');
          return 0;
        }
        return prev - 1;
      });

      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [uiState]);

  // Format MM:SS
  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // 2. Main Verification Handler
  const handleOtpComplete = async (code) => {
    if (requestLockRef.current || uiState === 'processing' || uiState === 'success') return;
    requestLockRef.current = true;
    setUiState('processing');

    // Simulate natural processing delay for circular orbit animation
    await new Promise((r) => setTimeout(r, 1100));

    const result = verifyOtpChallenge(user?.id, code);

    if (result.success) {
      // Create persistent HttpOnly server session
      try {
        await fetch('/api/auth/session/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user?.id,
            authMethod: 'GOOGLE',
            rememberDevice: true
          })
        });
      } catch (err) {
        console.error('Session persistence creation error:', err);
      }

      // Trigger merge phase into central circle
      setIsMerging(true);
      await new Promise((r) => setTimeout(r, 450));
      setUiState('success');

      // Allow success animation to complete before dashboard entry
      setTimeout(() => {
        requestLockRef.current = false;
        onSuccess(result.user);
      }, 750);
    } else {
      setIsMerging(false);
      requestLockRef.current = false;

      const remaining = typeof result.attemptsRemaining === 'number' ? result.attemptsRemaining : attemptsRemaining - 1;
      setAttemptsRemaining(remaining);

      if (result.code === 'OTP_LOCKED' || remaining <= 0) {
        setUiState('locked');
      } else if (result.code === 'OTP_EXPIRED') {
        setUiState('expired');
      } else {
        setUiState('error');
      }
    }
  };

  // 3. Re-enter Code Action (Reconstructs 6 boxes)
  const handleReenterCode = () => {
    setOtpValue('');
    setUiState('typing');
  };

  // 4. Resend Code Action
  const handleResendCode = async () => {
    if (resendCooldown > 0 || uiState === 'resending') return;
    setUiState('resending');

    const res = resendOtpChallenge(user?.id);

    if (res.success && res.challengeCode) {
      try {
        const emailRes = await fetch('/api/auth/otp/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user?.email,
            code: res.challengeCode
          })
        });

        const emailData = await emailRes.json();

        if (emailRes.ok && emailData.success) {
          setUiState('sent');
          setResendCooldown(45);
          setSecondsRemaining(300);
          setAttemptsRemaining(5);

          setTimeout(() => {
            setOtpValue('');
            setUiState('typing');
          }, 1200);
          return;
        }
      } catch (err) {
        // Fall through to error
      }
    }

    setUiState('error');
  };

  return (
    <div style={{ padding: 'clamp(1.5rem, 4vw, 2.5rem)', minHeight: '440px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      {/* Back Button */}
      {uiState !== 'success' && uiState !== 'processing' && (
        <button
          type="button"
          onClick={onBackToSignIn}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: '#64748B',
            fontSize: '0.82rem',
            fontWeight: 600,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            marginBottom: '1.2rem'
          }}
        >
          <ArrowLeft size={15} /> Back to Sign In
        </button>
      )}

      {/* Screen Title & Subtitle */}
      <div style={{ marginBottom: '0.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#0B192C', fontWeight: 800, marginBottom: '0.25rem' }}>
          Verify your email
        </h2>
        <p style={{ color: '#64748B', fontSize: '0.88rem', margin: 0, lineHeight: 1.5 }}>
          We sent a 6-digit verification code to<br />
          <strong style={{ color: '#0B192C' }}>{maskedEmail}</strong>
        </p>
      </div>

      {/* State Machine Visual Stage with Framer Motion AnimatePresence */}
      <div style={{ minHeight: '170px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AnimatePresence mode="wait">
          {uiState === 'typing' && (
            <motion.div
              key="typing-stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ width: '100%' }}
            >
              <OtpInput
                value={otpValue}
                onChange={setOtpValue}
                onComplete={handleOtpComplete}
                isDisabled={false}
                autoFocus={true}
              />
            </motion.div>
          )}

          {uiState === 'processing' && (
            <motion.div
              key="processing-stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ width: '100%' }}
            >
              <OtpProcessingOrbit isMerging={isMerging} />
            </motion.div>
          )}

          {uiState === 'success' && (
            <motion.div
              key="success-stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ width: '100%' }}
            >
              <OtpSuccessState />
            </motion.div>
          )}

          {uiState === 'error' && (
            <motion.div
              key="error-stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ width: '100%' }}
            >
              <OtpErrorScatter
                attemptsRemaining={attemptsRemaining}
                onReenterCode={handleReenterCode}
              />
            </motion.div>
          )}

          {uiState === 'expired' && (
            <motion.div
              key="expired-stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ width: '100%' }}
            >
              <OtpExpiredState onSendNewCode={handleResendCode} />
            </motion.div>
          )}

          {(uiState === 'resending' || uiState === 'sent') && (
            <motion.div
              key="resending-stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ width: '100%' }}
            >
              <OtpResendState isSent={uiState === 'sent'} />
            </motion.div>
          )}

          {uiState === 'locked' && (
            <motion.div
              key="locked-stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ width: '100%' }}
            >
              <OtpLockedState onBackToSignIn={onBackToSignIn} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Timers: 04:59 and Resend code in 00:45 */}
      {uiState === 'typing' && (
        <div style={{
          marginTop: '1.2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.82rem',
          color: '#64748B',
          borderTop: '1px solid #F1F5F9',
          paddingTop: '1rem'
        }}>
          {/* Main Expiration Countdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
            <span style={{ color: secondsRemaining < 60 ? '#DC2626' : '#0B192C', fontFamily: 'monospace', fontSize: '0.92rem', fontWeight: 800 }}>
              {formatTime(secondsRemaining)}
            </span>
          </div>

          {/* Resend Cooldown or Action */}
          <div>
            {resendCooldown > 0 ? (
              <span style={{ color: '#94A3B8' }}>
                Resend code in <strong style={{ fontFamily: 'monospace', color: '#64748B' }}>{formatTime(resendCooldown)}</strong>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResendCode}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0B192C',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0
                }}
              >
                Resend code
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
