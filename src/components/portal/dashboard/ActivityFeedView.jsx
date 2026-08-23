import React, { useState } from 'react';
import { 
  Activity, 
  Search, 
  Filter, 
  ShieldCheck, 
  User, 
  Calendar, 
  Clock, 
  ChevronRight,
  Download
} from 'lucide-react';
import { getAuditLogs, getLoginEvents, exportToCSV } from '../../../data/portalStore.js';

export default function ActivityFeedView({ currentUser }) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const auditLogs = getAuditLogs();
  const loginEvents = getLoginEvents();

  // Combine and sort chronological activities
  const combinedActivities = [
    ...auditLogs.map(a => ({
      id: `audit-${a.id}`,
      type: 'AUDIT',
      title: a.action,
      detail: a.details || `${a.module} record ${a.recordId || ''}`,
      user: a.user || a.performedBy || 'System User',
      timestamp: a.timestamp || a.date || new Date().toISOString(),
      badgeColor: '#2563EB',
      badgeBg: '#EFF6FF'
    })),
    ...loginEvents.map(l => ({
      id: `login-${l.id}`,
      type: 'LOGIN',
      title: `Authentication (${l.method || 'Password + OTP'})`,
      detail: `User ${l.email || l.username} logged in from IP ${l.ipAddress || '127.0.0.1'}`,
      user: l.name || l.email,
      timestamp: l.timestamp || new Date().toISOString(),
      badgeColor: '#059669',
      badgeBg: '#ECFDF5'
    }))
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const filtered = combinedActivities.filter(item => {
    const q = search.toLowerCase().trim();
    const matchQ = !q || item.title.toLowerCase().includes(q) || item.detail.toLowerCase().includes(q) || item.user.toLowerCase().includes(q);
    const matchType = filterType === 'ALL' || item.type === filterType;
    return matchQ && matchType;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem', color: '#64748B', marginBottom: '0.25rem' }}>
            <span>Dashboard</span>
            <ChevronRight size={12} />
            <span>Governance</span>
            <ChevronRight size={12} />
            <span style={{ color: '#0F172A', fontWeight: 700 }}>Recent Activity</span>
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem 0', fontFamily: 'Cinzel, Georgia, serif' }}>
            Institutional Activity & Security Audit Feed
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0 }}>
            Immutable audit records of faculty updates, research uploads, approvals, and authentication events.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => exportToCSV('audit')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 0.85rem', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, color: '#334155', cursor: 'pointer' }}
          >
            <Download size={14} /> Export Audit Log
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div style={{ background: '#FFFFFF', padding: '0.9rem', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search activity by user, action, module..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: '220px', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
        >
          <option value="ALL">All Activities</option>
          <option value="AUDIT">Record Mutations & Approvals</option>
          <option value="LOGIN">IAM Authentication Events</option>
        </select>
      </div>

      {/* Timeline List */}
      <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '1.25rem' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem' }}>
            No recent activity records match your search filter.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {filtered.map((item, idx) => (
              <div key={item.id || idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', padding: '0.75rem 0', borderBottom: idx < filtered.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: item.badgeBg, color: item.badgeColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                  <Activity size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.85rem' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={12} /> {new Date(item.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#475569', margin: '0.2rem 0' }}>
                    {item.detail}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#D4AF37', fontWeight: 700 }}>
                    Actor: {item.user}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
