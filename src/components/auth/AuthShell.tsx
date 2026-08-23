import React from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { BRANDING_LOGOS } from '../../data/masterData.js';

interface AuthShellProps {
  children: React.ReactNode;
  onClose?: () => void;
  cardNudge?: boolean;
}

export const AuthShell: React.FC<AuthShellProps> = ({ children, onClose, cardNudge = false }) => {
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
            aria-label="Close authentication window"
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

        {/* LEFT PANEL: Official College Branding & Cinematic Ambient Drone Backdrop */}
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

          {/* Dark Navy Gradient Overlay */}
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
            <div style={{ fontFamily: 'Cinzel, Georgia, serif', fontWeight: 800, fontSize: '1.25rem', color: '#FFFFFF', lineHeight: 1.25 }}>
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

        {/* RIGHT PANEL: Dynamic Form Content */}
        <div style={{ padding: 'clamp(1.8rem, 4vw, 3rem)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {children}
        </div>
      </div>
    </div>
  );
};
