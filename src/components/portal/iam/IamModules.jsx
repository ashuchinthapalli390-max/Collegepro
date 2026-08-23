import React, { useState } from 'react';
import { 
  Grid, 
  Smartphone, 
  Sliders, 
  ShieldCheck, 
  Check, 
  X, 
  Trash2, 
  Save, 
  Lock, 
  Key, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { 
  getRolePermissions, 
  saveRolePermissions, 
  ALL_PERMISSIONS, 
  getActiveSessions, 
  revokeSession, 
  revokeAllOtherSessions,
  getAuthSettings,
  updateAuthSettings
} from '../../../data/portalStore.js';

export function IamMatrixManager({ currentUser }) {
  const [matrix, setMatrix] = useState(getRolePermissions());
  const roles = ['SUPER_ADMIN', 'ADMIN', 'DEAN', 'HOD', 'FACULTY'];

  const togglePerm = (role, permId) => {
    if (role === 'SUPER_ADMIN') return; // Super admin always has all permissions
    setMatrix(prev => {
      const current = prev[role] || [];
      const updated = current.includes(permId) ? current.filter(p => p !== permId) : [...current, permId];
      return { ...prev, [role]: updated };
    });
  };

  const handleSave = () => {
    saveRolePermissions(matrix, currentUser);
    alert('RBAC Permissions Matrix saved successfully across all institutional roles!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem', color: '#64748B', marginBottom: '0.25rem' }}>
            <span>Dashboard</span>
            <ChevronRight size={12} />
            <span>Administration & IAM</span>
            <ChevronRight size={12} />
            <span style={{ color: '#0F172A', fontWeight: 700 }}>Permissions Matrix</span>
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem 0', fontFamily: 'Cinzel, Georgia, serif' }}>
            Role-Based Access Control (RBAC) Matrix
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0 }}>
            Configure granular module permissions for Super Admin, College Admin, Deans, HODs, and Faculty.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: 'linear-gradient(135deg, #F1C40F 0%, #D4AF37 100%)', color: '#070F1E', padding: '0.55rem 1.05rem', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem', border: 'none', cursor: 'pointer' }}
        >
          <Save size={15} /> Save Matrix Changes
        </button>
      </div>

      <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '0.72rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '0.85rem 1rem' }}>Capability / Resource</th>
              {roles.map(r => (
                <th key={r} style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>{r}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ALL_PERMISSIONS.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #F1F5F9' }} className="hover:bg-slate-50">
                <td style={{ padding: '0.75rem 1rem' }}>
                  <div style={{ fontWeight: 800, color: '#0F172A' }}>{p.label}</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Module: {p.module}</div>
                </td>
                {roles.map(role => {
                  const allowed = role === 'SUPER_ADMIN' || (matrix[role] && matrix[role].includes(p.id));
                  return (
                    <td key={role} style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                      <button
                        type="button"
                        disabled={role === 'SUPER_ADMIN'}
                        onClick={() => togglePerm(role, p.id)}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          border: allowed ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
                          background: allowed ? '#ECFDF5' : '#F8FAFC',
                          color: allowed ? '#047857' : '#94A3B8',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: role === 'SUPER_ADMIN' ? 'default' : 'pointer'
                        }}
                      >
                        {allowed ? <Check size={16} /> : <X size={16} />}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function IamSessionsManager({ currentUser }) {
  const [sessions, setSessions] = useState(getActiveSessions());

  const handleRevoke = (sessionId) => {
    revokeSession(sessionId, currentUser);
    setSessions(getActiveSessions());
    alert('Session revoked immediately.');
  };

  const handleRevokeAll = () => {
    if (confirm('Revoke all sessions except current?')) {
      revokeAllOtherSessions(currentUser);
      setSessions(getActiveSessions());
      alert('All other active sessions revoked.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem', color: '#64748B', marginBottom: '0.25rem' }}>
            <span>Dashboard</span>
            <ChevronRight size={12} />
            <span>Administration & IAM</span>
            <ChevronRight size={12} />
            <span style={{ color: '#0F172A', fontWeight: 700 }}>Active Sessions</span>
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem 0', fontFamily: 'Cinzel, Georgia, serif' }}>
            Active Sessions & Device Security
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0 }}>
            Real-time tracking of authenticated devices, IP addresses, browser tokens, and concurrent sessions.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRevokeAll}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '0.5rem 0.85rem', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
        >
          <Trash2 size={14} /> Terminate All Other Sessions
        </button>
      </div>

      <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '0.72rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '0.75rem 1rem' }}>User & Email</th>
              <th style={{ padding: '0.75rem 1rem' }}>Role</th>
              <th style={{ padding: '0.75rem 1rem' }}>Device & Browser</th>
              <th style={{ padding: '0.75rem 1rem' }}>IP Address</th>
              <th style={{ padding: '0.75rem 1rem' }}>Started At</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <div style={{ fontWeight: 800, color: '#0F172A' }}>{s.userName || s.name || 'User'}</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{s.email}</div>
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{ padding: '0.15rem 0.5rem', borderRadius: '4px', background: '#EFF6FF', color: '#1D4ED8', fontSize: '0.7rem', fontWeight: 700 }}>
                    {s.role}
                  </span>
                </td>
                <td style={{ padding: '0.85rem 1rem', color: '#334155' }}>
                  {s.device || s.userAgent || 'Chrome on Windows 11'}
                </td>
                <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', color: '#64748B' }}>
                  {s.ipAddress || '192.168.1.102'}
                </td>
                <td style={{ padding: '0.85rem 1rem', fontSize: '0.74rem', color: '#64748B' }}>
                  {new Date(s.createdAt || Date.now()).toLocaleTimeString()}
                </td>
                <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                  <button
                    type="button"
                    onClick={() => handleRevoke(s.id)}
                    style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function IamSettingsManager({ currentUser }) {
  const [settings, setSettings] = useState(getAuthSettings());

  const handleSave = () => {
    updateAuthSettings(settings, currentUser);
    alert('IAM Security & Authentication policies updated successfully!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem', color: '#64748B', marginBottom: '0.25rem' }}>
            <span>Dashboard</span>
            <ChevronRight size={12} />
            <span>Administration & IAM</span>
            <ChevronRight size={12} />
            <span style={{ color: '#0F172A', fontWeight: 700 }}>Auth & OTP Policies</span>
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem 0', fontFamily: 'Cinzel, Georgia, serif' }}>
            IAM Security, MFA & Password Policies
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0 }}>
            Configure institutional OTP timeouts, session TTL, password complexity rules, and rate limits.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: 'linear-gradient(135deg, #F1C40F 0%, #D4AF37 100%)', color: '#070F1E', padding: '0.55rem 1.05rem', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem', border: 'none', cursor: 'pointer' }}
        >
          <Save size={15} /> Save Security Policies
        </button>
      </div>

      <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9', paddingBottom: '1rem' }}>
          <div>
            <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.9rem' }}>Enforce 2-Step Email OTP for All Roles</div>
            <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Requires 6-digit verification code sent to verified @nrtec.in email.</div>
          </div>
          <input
            type="checkbox"
            checked={settings.requireEmailOtp !== false}
            onChange={(e) => setSettings({ ...settings, requireEmailOtp: e.target.checked })}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9', paddingBottom: '1rem' }}>
          <div>
            <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.9rem' }}>Max Concurrent Sessions per User</div>
            <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Automatically revokes oldest session when limit is exceeded.</div>
          </div>
          <select
            value={settings.maxConcurrentSessions || 3}
            onChange={(e) => setSettings({ ...settings, maxConcurrentSessions: parseInt(e.target.value) })}
            style={{ padding: '0.4rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.8rem' }}
          >
            <option value={1}>1 Device (Strict)</option>
            <option value={2}>2 Devices</option>
            <option value={3}>3 Devices (Recommended)</option>
            <option value={5}>5 Devices</option>
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.9rem' }}>Session Idle Timeout</div>
            <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Logs user out after continuous inactivity.</div>
          </div>
          <select
            value={settings.sessionTimeoutMinutes || 60}
            onChange={(e) => setSettings({ ...settings, sessionTimeoutMinutes: parseInt(e.target.value) })}
            style={{ padding: '0.4rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.8rem' }}
          >
            <option value={15}>15 Minutes</option>
            <option value={30}>30 Minutes</option>
            <option value={60}>60 Minutes (1 Hour)</option>
            <option value={120}>120 Minutes (2 Hours)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
