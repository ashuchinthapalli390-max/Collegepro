import React from 'react';
import { AlertTriangle, RefreshCw, Layers } from 'lucide-react';
import { resetUiPreferences } from '../../lib/storage/preferenceStorage.js';

/**
 * Module-Level Error Boundary
 * Confines crashes strictly to the specific active module.
 * Preserves Header, Sidebar, Breadcrumb, and Global Navigation.
 */
export default class ModuleErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // Comprehensive developer logging without exposing credentials
    console.error(
      `[MODULE_RENDER_ERROR] Module: "${this.props.moduleName || 'Unknown'}" | ResetKey: "${this.props.resetKey || 'N/A'}"\n`,
      error,
      '\nComponent Stack:\n',
      errorInfo?.componentStack
    );
  }

  componentDidUpdate(prevProps) {
    // Automatically reset error state when user switches modules or routes
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false, error: null, errorInfo: null });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleResetAndRetry = () => {
    resetUiPreferences();
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      const moduleTitle = this.props.moduleTitle || this.props.moduleName || 'Academic Module';

      return (
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '2.5rem 2rem',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
          textAlign: 'center',
          maxWidth: '700px',
          margin: '2rem auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '14px',
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#EF4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <AlertTriangle size={28} />
          </div>

          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.4rem 0' }}>
              Unable to Load {moduleTitle}
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.86rem', maxWidth: '480px', margin: '0 auto', lineHeight: 1.5 }}>
              A localized display issue occurred while rendering this module. Your other tabs and overall session remain active.
            </p>
          </div>

          {/* Development-only error details */}
          {(typeof import.meta !== 'undefined' && import.meta.env?.DEV) && this.state.error && (
            <div style={{
              background: '#F8FAFC',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              fontSize: '0.75rem',
              color: '#DC2626',
              fontFamily: 'monospace',
              maxWidth: '100%',
              overflowX: 'auto',
              textAlign: 'left',
              margin: '0.5rem 0'
            }}>
              <strong>{this.state.error.name}:</strong> {this.state.error.message}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={this.handleRetry}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: 'linear-gradient(135deg, #F1C40F 0%, #D4AF37 100%)',
                border: 'none',
                color: '#070F1E',
                padding: '0.6rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(212, 175, 55, 0.35)'
              }}
            >
              <RefreshCw size={14} /> Try Again
            </button>

            <button
              type="button"
              onClick={this.handleResetAndRetry}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: '#F1F5F9',
                border: '1px solid #CBD5E1',
                color: '#334155',
                padding: '0.6rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              <Layers size={14} /> Reset View Cache
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
