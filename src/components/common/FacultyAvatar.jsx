import React, { useState } from 'react';
import { User } from 'lucide-react';

export default function FacultyAvatar({ 
  photo, 
  name = 'Faculty Member', 
  width = '100%', 
  height = '100%', 
  borderRadius = '10px',
  showLabel = true,
  className = ''
}) {
  const [imageError, setImageError] = useState(false);

  // If photo is valid and has not errored
  if (photo && !imageError) {
    let safePhoto = photo;
    try {
      safePhoto = photo.startsWith('http') ? photo : encodeURI(photo);
    } catch {
      safePhoto = photo;
    }

    return (
      <div 
        style={{ 
          width, 
          height, 
          borderRadius, 
          overflow: 'hidden', 
          background: '#0B192C',
          border: '1.5px solid rgba(212, 175, 55, 0.3)',
          flexShrink: 0
        }}
        className={className}
      >
        <img
          src={safePhoto}
          alt={name}
          loading="lazy"
          onError={() => setImageError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    );
  }

  // Neutral "No Photo" Placeholder (Strictly no AI, stock avatar, or leadership fallback)
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(135deg, #0B192C 0%, #1E3E62 100%)',
        border: '1.5px solid rgba(212, 175, 55, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#94A3B8',
        flexShrink: 0,
        position: 'relative',
        userSelect: 'none'
      }}
      className={className}
    >
      <div style={{
        width: '42px',
        height: '42px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#CBD5E1',
        marginBottom: showLabel ? '4px' : '0'
      }}>
        <User size={22} />
      </div>
      {showLabel && (
        <span style={{
          fontSize: '0.62rem',
          fontWeight: 700,
          color: '#94A3B8',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          background: 'rgba(7, 15, 30, 0.7)',
          padding: '2px 6px',
          borderRadius: '4px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          No Photo
        </span>
      )}
    </div>
  );
}
