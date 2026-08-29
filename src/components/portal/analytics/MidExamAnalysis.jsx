import React from 'react';
import { BarChart3 } from 'lucide-react';
import ConfigurationPendingModule from '../common/ConfigurationPendingModule.jsx';

export default function MidExamAnalysis({ currentUser }) {
  return (
    <ConfigurationPendingModule
      title="Mid Exam Analysis"
      subtitle="Configuration Pending"
      badge="Academic Analytics"
      badgeIcon={BarChart3}
      breadcrumbs={[
        { label: 'Portal', onClick: () => {} },
        { label: 'Academic Portfolio', onClick: () => {} },
        { label: 'Mid Exam Analysis' }
      ]}
      note="Module requirements will be configured after academic requirements are finalized."
    />
  );
}
