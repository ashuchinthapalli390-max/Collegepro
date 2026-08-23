import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface OtpVerificationFormProps {
  maskedEmail: string;
  onVerifyOtp: (otp: string) => void;
  onResendOtp: () => void;
  onBackToLogin: () => void;
  isSubmitting: boolean;
  errorMessage?: string;
  isSuccess?: boolean;
}

export const OtpVerificationForm: React.FC<OtpVerificationFormProps> = ({
  maskedEmail,
  onVerifyOtp,
  onResendOtp,
  onBackToLogin,
  isSubmitting,
  errorMessage,
  isSuccess = false
}) => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [resendCooldown, setResendCooldown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 60-second cooldown countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setInterval(() => setResendCooldown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleDigitChange = (index: number, value: string) => {
    const digit = value.replace(/[^0-9]/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);

    // Auto-advance to next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit on 6th digit
    if (digit && index === 5 && newDigits.every(d => d !== '')) {
      onVerifyOtp(newDigits.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const newDigits = [...digits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pasted[i] || '';
      }
      setDigits(newDigits);
      if (pasted.length === 6) {
        onVerifyOtp(pasted);
      } else {
        inputRefs.current[Math.min(5, pasted.length)]?.focus();
      }
    }
  };

  const handleResendClick = () => {
    if (resendCooldown > 0) return;
    setResendCooldown(60);
    setDigits(['', '', '', '', '', '']);
    onResendOtp();
  };

  return (
    <div>
      {/* Back button */}
      <button
        onClick={onBackToLogin}
        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#64748B', fontSize: '0.8rem', marginBottom: '0.8rem', fontWeight: 600, background: 'transparent', border: 'none', cursor: 'pointer' }}
      >
        <ArrowLeft size={14} /> Back to Sign In
      </button>

      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.45rem', color: '#0B192C', fontWeight: 800, marginBottom: '0.2rem' }}>
          Verify your email
        </h2>
        <p style={{ color: '#64748B', fontSize: '0.85rem' }}>
          We sent a 6-digit verification code to <strong style={{ color: '#0B192C' }}>{maskedEmail}</strong>
        </p>
      </div>

      {/* Error / Success message */}
      {errorMessage && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '8px', padding: '0.65rem 0.9rem', color: '#DC2626', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.2rem' }}>
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {isSuccess && (
        <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '8px', padding: '0.65rem 0.9rem', color: '#065F46', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.2rem' }}>
          <CheckCircle2 size={15} style={{ color: '#059669', flexShrink: 0 }} />
          <span>Code verified successfully. Loading your portal...</span>
        </div>
      )}

      {/* 6 Square Digits */}
      <div 
        onPaste={handlePaste}
        style={{ display: 'flex', gap: '0.55rem', justifyContent: 'center', margin: '1.5rem 0' }}
      >
        {digits.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => (inputRefs.current[idx] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleDigitChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            style={{
              width: '46px',
              height: '52px',
              textAlign: 'center',
              fontSize: '1.4rem',
              fontWeight: 800,
              borderRadius: '8px',
              border: digit ? '2px solid #D4AF37' : '1.5px solid #CBD5E1',
              background: digit ? '#FEFBF2' : '#FFFFFF',
              color: '#0B192C',
              outline: 'none',
              boxShadow: digit ? '0 0 0 2px rgba(212, 175, 55, 0.2)' : 'none',
              transition: 'border 0.2s, background 0.2s'
            }}
          />
        ))}
      </div>

      {/* Verify Button */}
      <button
        type="button"
        onClick={() => onVerifyOtp(digits.join(''))}
        disabled={isSubmitting || digits.some(d => d === '')}
        className="btn-primary"
        style={{ width: '100%', padding: '0.8rem', fontSize: '0.92rem', marginBottom: '1rem' }}
      >
        {isSubmitting ? (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <RefreshCw size={15} style={{ animation: 'spin 1s linear infinite' }} /> Checking code...
          </span>
        ) : (
          'Verify & Enter Portal'
        )}
      </button>

      {/* Resend & Countdown */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#64748B' }}>
        <span>Didn't receive the code?</span>
        {resendCooldown > 0 ? (
          <span style={{ color: '#94A3B8' }}>
            Resend code in <strong>00:{String(resendCooldown).padStart(2, '0')}</strong>
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResendClick}
            style={{ color: '#D4AF37', fontWeight: 700, textDecoration: 'underline', background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            Resend code
          </button>
        )}
      </div>
    </div>
  );
};
