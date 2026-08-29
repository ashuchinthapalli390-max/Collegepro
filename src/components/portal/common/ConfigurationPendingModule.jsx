import React from 'react';
import { Clock, Info, ShieldCheck, FileSpreadsheet, BarChart3 } from 'lucide-react';
import { 
  MotionPage, 
  ModulePageHeader, 
  MotionCard 
} from '../../motion/index.js';

export default function ConfigurationPendingModule({
  title = 'Module Analysis',
  subtitle = 'Configuration Pending',
  badge = 'Academic Module',
  badgeIcon = BarChart3,
  breadcrumbs = [
    { label: 'Portal', onClick: () => {} },
    { label: 'Academic Portfolio', onClick: () => {} },
    { label: title }
  ],
  note = 'Module requirements will be configured after academic requirements are finalized.'
}) {
  const BadgeIcon = badgeIcon;

  return (
    <MotionPage style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <ModulePageHeader
        title={title}
        subtitle="Departmental and institutional academic assessment framework."
        breadcrumbs={breadcrumbs}
      />

      <MotionCard
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '4rem 2rem',
          gap: '1.25rem',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}
      >
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: '#FEFCE8',
          border: '1px solid #FEF08A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#B45309'
        }}>
          <Clock size={30} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '520px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.3rem 0.85rem',
            borderRadius: '9999px',
            background: '#FEF3C7',
            color: '#92400E',
            fontSize: '0.74rem',
            fontWeight: 800,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            alignSelf: 'center',
            border: '1px solid #FDE68A'
          }}>
            <Info size={13} />
            {subtitle}
          </div>
          
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            color: '#0F172A',
            margin: '0.35rem 0 0'
          }}>
            {title}
          </h3>
          
          <p style={{
            fontSize: '0.88rem',
            color: '#64748B',
            lineHeight: 1.6,
            margin: 0
          }}>
            {note}
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.74rem',
          color: '#94A3B8',
          marginTop: '0.5rem',
          padding: '0.4rem 0.85rem',
          background: '#F8FAFC',
          borderRadius: '9999px',
          border: '1px solid #E2E8F0'
        }}>
          <ShieldCheck size={14} style={{ color: '#10B981' }} />
          <span>Emerging Technologies Academic Portal</span>
        </div>
      </MotionCard>
    </MotionPage>
  );
}
