import React from 'react';
import { FileSpreadsheet, Clock, Info, ShieldCheck } from 'lucide-react';
import { 
  MotionPage, 
  ModulePageHeader, 
  MotionCard 
} from '../motion/index.js';

export default function ExternalExamAnalysis({ currentUser }) {
  return (
    <MotionPage style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <ModulePageHeader
        badge="Academic Analytics"
        badgeIcon={FileSpreadsheet}
        title="External Exam Analysis"
        description="End-semester university examination results, pass trends, and SGPA/CGPA institutional assessment."
      />

      <MotionCard
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '3.5rem 2rem',
          gap: '1.25rem',
          background: 'rgba(15, 23, 42, 0.65)',
          border: '1px dashed rgba(59, 130, 246, 0.35)',
          borderRadius: '16px'
        }}
      >
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: 'rgba(59, 130, 246, 0.12)',
          border: '1px solid rgba(59, 130, 246, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#3B82F6'
        }}>
          <Clock size={32} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxWidth: '480px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            background: 'rgba(59, 130, 246, 0.15)',
            color: '#60A5FA',
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.5px',
            alignSelf: 'center'
          }}>
            <Info size={13} />
            CONFIGURATION PENDING
          </div>
          
          <h3 style={{
            fontFamily: 'Cinzel, Georgia, serif',
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#FFFFFF',
            marginTop: '0.5rem'
          }}>
            External Exam Analysis Module
          </h3>
          
          <p style={{
            fontSize: '0.88rem',
            color: '#94A3B8',
            lineHeight: 1.6
          }}>
            Academic analysis structure will be configured after requirements are finalized. 
            Grade distribution analysis, credit pass verification, and university evaluation templates will be activated once criteria are defined.
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.75rem',
          color: '#64748B',
          marginTop: '0.5rem'
        }}>
          <ShieldCheck size={14} style={{ color: '#10B981' }} />
          <span>Emerging Technologies Academic Governance System</span>
        </div>
      </MotionCard>
    </MotionPage>
  );
}
