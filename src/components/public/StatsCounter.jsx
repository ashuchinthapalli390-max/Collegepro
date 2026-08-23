import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Building, 
  FileText, 
  Lightbulb, 
  Briefcase, 
  Handshake, 
  MapPin, 
  GraduationCap 
} from 'lucide-react';
import { FACULTY_DATA, DEPARTMENTS } from '../../data/masterData.js';
import { getPublications, getPatents, getMoUs } from '../../data/portalStore.js';
import { MotionNumber } from '../motion/index.js';
import { staggerContainer, staggerChild } from '../../lib/motion/variants.js';

export default function StatsCounter() {
  const [stats, setStats] = useState({
    faculty: FACULTY_DATA.length,
    departments: DEPARTMENTS.length,
    publications: 0,
    patents: 0,
    mous: 0,
    acres: 40
  });

  useEffect(() => {
    try {
      const livePubs = getPublications().length;
      const livePatents = getPatents().length;
      const liveMoUs = getMoUs().length;
      setStats({
        faculty: FACULTY_DATA.length,
        departments: DEPARTMENTS.length,
        publications: livePubs,
        patents: livePatents,
        mous: liveMoUs,
        acres: 40
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  const statCards = [
    { label: "Verified Faculty Members", rawVal: stats.faculty, suffix: "", icon: Users, desc: "PhD, M.Tech & Senior Scholars across 13 departments", color: "#D4AF37" },
    { label: "Academic Departments", rawVal: stats.departments, suffix: "", icon: Building, desc: "Engineering, Computing, Management & Sciences", color: "#60A5FA" },
    { label: "Research Publications", rawVal: stats.publications, suffix: "", icon: FileText, desc: "Peer-reviewed publications recorded in institutional repository", color: "#34D399" },
    { label: "Patents Portfolio", rawVal: stats.patents, suffix: "", icon: Lightbulb, desc: "Official patent filings and granted intellectual property", color: "#FBBF24" },
    { label: "Active Industry MoUs", rawVal: stats.mous, suffix: "", icon: Handshake, desc: "Active industry collaborations and skill training partnerships", color: "#F472B6" },
    { label: "Campus Infrastructure", rawVal: stats.acres, suffix: "+ Acres", icon: MapPin, desc: "Wi-Fi enabled green tech campus & sports facilities", color: "#38BDF8" },
    { label: "Autonomous CBCS Batches", textVal: "R23 / R20", icon: GraduationCap, desc: "Industry-aligned autonomous regulations", color: "#F87171" }
  ];

  return (
    <section style={{
      background: 'linear-gradient(180deg, #070F1E 0%, #0B192C 100%)',
      padding: '4rem 0',
      position: 'relative',
      borderBottom: '1px solid rgba(212, 175, 55, 0.2)'
    }}>
      <div className="container">
        <motion.div 
          style={{ textAlign: 'center', marginBottom: '3rem' }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4 }}
        >
          <span className="badge badge-gold" style={{ marginBottom: '0.6rem' }}>
            Institutional Highlights & Scale
          </span>
          <h2 style={{ color: '#FFFFFF', fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', marginBottom: '0.8rem' }}>
            A Legacy of Excellence in Numbers
          </h2>
          <p style={{ color: '#94A3B8', maxWidth: '650px', margin: '0 auto', fontSize: '1rem' }}>
            Live metrics calculated directly from our verified institutional database, research repositories, and placement records.
          </p>
        </motion.div>

        <motion.div 
          className="grid-4" 
          style={{ gap: '1.5rem' }}
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {statCards.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                variants={staggerChild}
                whileHover={{ y: -4, scale: 1.012 }}
                transition={{ duration: 0.2 }}
                className="glass-card-dark"
                style={{
                  padding: '1.8rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Background ambient glow */}
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '-20px',
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  background: item.color,
                  opacity: 0.15,
                  filter: 'blur(20px)'
                }} />

                <div>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.2rem',
                    border: `1px solid ${item.color}40`
                  }}>
                    <Icon size={24} style={{ color: item.color }} />
                  </div>

                  <div style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '2.2rem',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    lineHeight: 1.1,
                    marginBottom: '0.4rem',
                    background: `linear-gradient(135deg, #FFFFFF 60%, ${item.color} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '0.2rem'
                  }}>
                    {item.textVal ? item.textVal : (
                      <>
                        <MotionNumber value={item.rawVal} />
                        {item.suffix && <span>{item.suffix}</span>}
                      </>
                    )}
                  </div>

                  <div style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: '#E2E8F0',
                    marginBottom: '0.4rem'
                  }}>
                    {item.label}
                  </div>
                </div>

                <div style={{
                  fontSize: '0.8rem',
                  color: '#94A3B8',
                  lineHeight: 1.4,
                  marginTop: '0.8rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingTop: '0.6rem'
                }}>
                  {item.desc}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
