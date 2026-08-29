import React from 'react';
import { FileSpreadsheet } from 'lucide-react';
import ConfigurationPendingModule from '../common/ConfigurationPendingModule.jsx';

export default function ExternalExamAnalysis({ currentUser }) {
  return (
    <ConfigurationPendingModule
      title="External Exam Analysis"
      subtitle="Configuration Pending"
      badge="Academic Analytics"
      badgeIcon={FileSpreadsheet}
      breadcrumbs={[
        { label: 'Portal', onClick: () => {} },
        { label: 'Academic Portfolio', onClick: () => {} },
        { label: 'External Exam Analysis' }
      ]}
      note="Module requirements will be configured after academic requirements are finalized."
    />
  );
}
