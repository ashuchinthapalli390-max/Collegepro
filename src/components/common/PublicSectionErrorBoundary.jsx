import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * Public Section Error Boundary
 * Isolates component failures in public sections (Hero, Leadership, Departments, etc.)
 * Ensures that the header, navigation, and other sections stay alive and accessible.
 */
export default class PublicSectionErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error(
      `[PUBLIC_SECTION_ERROR] Section: "${this.props.sectionName || 'Unknown'}"\n`,
      error,
      '\nComponent Stack:\n',
      errorInfo?.componentStack
    );
  }

  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '3.5rem 1.5rem',
          textAlign: 'center',
          background: '#F8FAFC',
          borderBottom: '1px solid #E2E8F0'
        }}>
          <div style={{
            maxWidth: '550px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              {this.props.sectionTitle || 'Section Display Notice'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
              This section is currently undergoing dynamic update. Other institutional content remains available.
            </p>
            <button
              type="button"
              onClick={this.handleRetry}
              style={{
                marginTop: '0.4rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: '#0B192C',
                color: '#FFFFFF',
                border: 'none',
                padding: '0.45rem 1rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={13} /> Refresh Section
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
