import React from 'react';
import { 
  AlertTriangle, 
  RefreshCw, 
  FileQuestion, 
  ShieldAlert, 
  Plus, 
  Loader2 
} from 'lucide-react';

/**
 * Standardized Module State Presentation
 * Handles LOADING (Skeletons), EMPTY, ERROR, and ACCESS_DENIED.
 */
export default function ModuleState({
  type = 'empty', // 'loading' | 'empty' | 'error' | 'access_denied'
  title,
  description,
  actionLabel,
  onAction,
  actionIcon: ActionIcon = Plus,
  style = {}
}) {
  if (type === 'loading') {
    return (
      <div style={{
        padding: '4rem 2rem',
        textAlign: 'center',
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.8rem',
        ...style
      }}>
        <Loader2 size={32} style={{ color: '#D4AF37', animation: 'spin 1s linear infinite' }} />
        <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A' }}>
          {title || 'Loading Module Records...'}
        </div>
        <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0 }}>
          {description || 'Fetching verified data from institutional repository.'}
        </p>
      </div>
    );
  }

  if (type === 'access_denied') {
    return (
      <div style={{
        padding: '3.5rem 2rem',
        textAlign: 'center',
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.8rem',
        ...style
      }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ShieldAlert size={26} />
        </div>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
          {title || 'Access Restricted'}
        </h3>
        <p style={{ fontSize: '0.82rem', color: '#64748B', maxWidth: '420px', margin: 0, lineHeight: 1.5 }}>
          {description || 'You do not have the required permissions to view or edit this module. Contact institutional administrator for authorization.'}
        </p>
      </div>
    );
  }

  if (type === 'error') {
    return (
      <div style={{
        padding: '3.5rem 2rem',
        textAlign: 'center',
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #FECACA',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.8rem',
        ...style
      }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AlertTriangle size={26} />
        </div>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
          {title || 'Data Load Error'}
        </h3>
        <p style={{ fontSize: '0.82rem', color: '#64748B', maxWidth: '420px', margin: 0, lineHeight: 1.5 }}>
          {description || 'Unable to retrieve records from the server repository. Please try again.'}
        </p>
        {onAction && (
          <button
            type="button"
            onClick={onAction}
            style={{
              marginTop: '0.4rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#070F1E',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={13} /> {actionLabel || 'Retry Query'}
          </button>
        )}
      </div>
    );
  }

  // Default: Empty State
  return (
    <div style={{
      padding: '3.5rem 2rem',
      textAlign: 'center',
      background: 'rgba(248, 250, 252, 0.7)',
      borderRadius: '16px',
      border: '1.5px dashed #CBD5E1',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.8rem',
      ...style
    }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(212, 175, 55, 0.12)', color: '#D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <FileQuestion size={26} />
      </div>
      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
        {title || 'No Records Found'}
      </h3>
      <p style={{ fontSize: '0.82rem', color: '#64748B', maxWidth: '440px', margin: 0, lineHeight: 1.5 }}>
        {description || 'No entries currently match the selected criteria or filters.'}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          style={{
            marginTop: '0.4rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'linear-gradient(135deg, #F1C40F 0%, #D4AF37 100%)',
            color: '#070F1E',
            border: 'none',
            padding: '0.55rem 1.15rem',
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(212, 175, 55, 0.3)'
          }}
        >
          <ActionIcon size={14} /> {actionLabel}
        </button>
      )}
    </div>
  );
}
