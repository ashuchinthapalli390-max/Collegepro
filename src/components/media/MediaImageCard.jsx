import React from 'react';
import MediaCardShell from './MediaCardShell.jsx';
import NECImage from './NECImage.jsx';

/**
 * Domain-specific Campus Photo Card
 */
export default function MediaImageCard({
  item,
  onClick,
  aspectRatio = '16/9',
  style = {}
}) {
  if (!item) return null;

  return (
    <MediaCardShell
      title={item.title}
      category={item.category}
      description={item.description}
      onClick={onClick}
      style={style}
    >
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        <NECImage
          src={item.publicUrl || item.storagePath || item.file}
          alt={item.altText || item.title}
          aspectRatio={aspectRatio}
          fallbackTitle={item.title}
        />

        {/* Category Pill Tag Overlay */}
        {item.category && (
          <span
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              background: 'rgba(7, 15, 30, 0.85)',
              backdropFilter: 'blur(8px)',
              color: '#D4AF37',
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '3px 9px',
              borderRadius: '6px',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              zIndex: 4,
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}
          >
            {item.category}
          </span>
        )}
      </div>
    </MediaCardShell>
  );
}
