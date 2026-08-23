import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronRight, Download, FileSpreadsheet, FileText, Check } from 'lucide-react';
import {
  breadcrumbContainerVariants,
  breadcrumbItemVariants,
  titleVariants,
  subtitleVariants,
  actionClusterVariants,
  actionButtonVariants
} from '../../lib/motion/variants.js';

export default function ModulePageHeader({
  breadcrumbs = [],
  title,
  subtitle,
  onExportCSV,
  onExportExcel,
  onExportPDF,
  primaryAction,
  customActions
}) {
  const shouldReduce = useReducedMotion();
  const [exportingType, setExportingType] = useState(null);
  const [successType, setSuccessType] = useState(null);

  const handleExport = async (type, fn) => {
    if (!fn) return;
    try {
      setExportingType(type);
      await Promise.resolve(fn());
      setExportingType(null);
      setSuccessType(type);
      setTimeout(() => setSuccessType(null), 2000);
    } catch (err) {
      console.error('Export error:', err);
      setExportingType(null);
    }
  };

  const PrimaryIcon = primaryAction?.icon;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: '100%', marginBottom: '0.5rem' }}>
      {/* 1. Breadcrumbs Trail */}
      {breadcrumbs.length > 0 && (
        <motion.div
          variants={shouldReduce ? undefined : breadcrumbContainerVariants}
          initial={shouldReduce ? false : "hidden"}
          animate="visible"
          style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.35rem', fontSize: '0.74rem', color: '#64748B' }}
        >
          {breadcrumbs.map((item, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            const label = typeof item === 'string' ? item : item.label;
            const onClick = typeof item === 'object' ? item.onClick : null;

            return (
              <React.Fragment key={idx}>
                <motion.span
                  variants={shouldReduce ? undefined : breadcrumbItemVariants}
                  onClick={onClick}
                  style={{
                    color: isLast ? '#0F172A' : '#64748B',
                    fontWeight: isLast ? 800 : 500,
                    cursor: onClick ? 'pointer' : 'default'
                  }}
                >
                  {label}
                </motion.span>
                {!isLast && <ChevronRight size={12} style={{ color: '#94A3B8' }} />}
              </React.Fragment>
            );
          })}
        </motion.div>
      )}

      {/* 2. Main Title Row & Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ maxWidth: '780px' }}>
          <motion.h1
            variants={shouldReduce ? undefined : titleVariants}
            initial={shouldReduce ? false : "hidden"}
            animate="visible"
            style={{
              fontSize: 'clamp(1.35rem, 2.8vw, 1.65rem)',
              fontWeight: 800,
              color: '#0F172A',
              margin: '0 0 0.25rem 0',
              fontFamily: 'Cinzel, Georgia, serif',
              letterSpacing: '-0.01em'
            }}
          >
            {title}
          </motion.h1>

          {subtitle && (
            <motion.p
              variants={shouldReduce ? undefined : subtitleVariants}
              initial={shouldReduce ? false : "hidden"}
              animate="visible"
              style={{ fontSize: '0.82rem', color: '#64748B', margin: 0, lineHeight: 1.45 }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        {/* Action Button Cluster */}
        <motion.div
          variants={shouldReduce ? undefined : actionClusterVariants}
          initial={shouldReduce ? false : "hidden"}
          animate="visible"
          style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}
        >
          {/* Export CSV */}
          {onExportCSV && (
            <motion.button
              type="button"
              variants={shouldReduce ? undefined : actionButtonVariants}
              whileHover={shouldReduce ? undefined : "hover"}
              whileTap={shouldReduce ? undefined : "tap"}
              onClick={() => handleExport('csv', onExportCSV)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.48rem 0.85rem',
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: successType === 'csv' ? '#059669' : '#334155',
                cursor: 'pointer'
              }}
            >
              {successType === 'csv' ? (
                <Check size={14} style={{ color: '#059669' }} />
              ) : (
                <Download size={14} />
              )}
              {exportingType === 'csv' ? 'Preparing...' : successType === 'csv' ? 'Ready ✓' : 'CSV'}
            </motion.button>
          )}

          {/* Export Excel */}
          {onExportExcel && (
            <motion.button
              type="button"
              variants={shouldReduce ? undefined : actionButtonVariants}
              whileHover={shouldReduce ? undefined : "hover"}
              whileTap={shouldReduce ? undefined : "tap"}
              onClick={() => handleExport('excel', onExportExcel)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.48rem 0.85rem',
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: successType === 'excel' ? '#059669' : '#10B981',
                cursor: 'pointer'
              }}
            >
              {successType === 'excel' ? (
                <Check size={14} style={{ color: '#059669' }} />
              ) : (
                <FileSpreadsheet size={14} />
              )}
              {exportingType === 'excel' ? 'Preparing...' : successType === 'excel' ? 'Ready ✓' : 'Excel'}
            </motion.button>
          )}

          {/* Export PDF */}
          {onExportPDF && (
            <motion.button
              type="button"
              variants={shouldReduce ? undefined : actionButtonVariants}
              whileHover={shouldReduce ? undefined : "hover"}
              whileTap={shouldReduce ? undefined : "tap"}
              onClick={() => handleExport('pdf', onExportPDF)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.48rem 0.85rem',
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: successType === 'pdf' ? '#059669' : '#DC2626',
                cursor: 'pointer'
              }}
            >
              {successType === 'pdf' ? (
                <Check size={14} style={{ color: '#059669' }} />
              ) : (
                <FileText size={14} />
              )}
              {exportingType === 'pdf' ? 'Preparing...' : successType === 'pdf' ? 'Ready ✓' : 'PDF'}
            </motion.button>
          )}

          {/* Custom Actions */}
          {customActions}

          {/* Primary CTA */}
          {primaryAction && (
            <motion.button
              type="button"
              variants={shouldReduce ? undefined : actionButtonVariants}
              whileHover={shouldReduce ? undefined : { scale: 1.025, y: -2, boxShadow: '0 6px 16px rgba(212, 175, 55, 0.35)' }}
              whileTap={shouldReduce ? undefined : { scale: 0.97 }}
              onClick={primaryAction.onClick}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.52rem 1.1rem',
                background: primaryAction.variant === 'navy' 
                  ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' 
                  : 'linear-gradient(135deg, #D4AF37 0%, #B38600 100%)',
                color: primaryAction.variant === 'navy' ? '#FFFFFF' : '#070F1E',
                border: primaryAction.variant === 'navy' ? '1px solid #334155' : '1px solid #F1C40F',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
            >
              {PrimaryIcon && (
                <motion.span
                  whileHover={shouldReduce ? undefined : { rotate: 90 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'inline-flex' }}
                >
                  <PrimaryIcon size={16} />
                </motion.span>
              )}
              {primaryAction.label}
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
