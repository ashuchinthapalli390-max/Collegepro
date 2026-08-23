import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
import { VERIFIED_MEDIA } from '../../config/verifiedMedia.js';
import NECImage from '../common/NECImage.jsx';

export default function StatsCounter() {
  const [stats, setStats] = useState({
    faculty: (FACULTY_DATA || []).length,
    departments: (DEPARTMENTS || []).length,
    publications: (getPublications() || []).length,
    patents: (getPatents() || []).length,
    mous: (getMoUs() || []).length,
    acres: 40
  });

  useEffect(() => {
    try {
      const livePubs = (getPublications() || []).length;
      const livePatents = (getPatents() || []).length;
      const liveMoUs = (getMoUs() || []).length;
      setStats({
        faculty: (FACULTY_DATA || []).length,
        departments: (DEPARTMENTS || []).length,
        publications: livePubs,
        patents: livePatents,
        mous: liveMoUs,
        acres: 40
      });
    } catch (e) {
      console.warn('StatsCounter live sync notice:', e);
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
            Verified institutional metrics calculated directly from our active master records, autonomous departments, and campus infrastructure.
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

        {/* ────────────────────────────────────────────────────────── */}
        {/* VERIFIED ACCREDITATIONS & NATIONAL RANKINGS SHOWCASE */}
        {/* ────────────────────────────────────────────────────────── */}
        <div style={{ marginTop: '4rem', borderTop: '1px solid rgba(212, 175, 55, 0.25)', paddingTop: '3.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="badge badge-gold" style={{ marginBottom: '0.6rem' }}>
              National Quality Benchmarks
            </span>
            <h3 style={{ color: '#FFFFFF', fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)', marginBottom: '0.6rem' }}>
              Recognitions, Accreditations & Survey Standings
            </h3>
            <p style={{ color: '#94A3B8', maxWidth: '620px', margin: '0 auto', fontSize: '0.92rem' }}>
              Autonomous institution recognized by statutory national evaluation boards with premier survey rankings.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center' }}>
            {/* Accreditation Badges Banner Card */}
            <div style={{ background: '#FFFFFF', borderRadius: '18px', padding: '1.8rem', border: '1px solid rgba(212, 175, 55, 0.35)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ width: '100%', maxWidth: '420px', marginBottom: '1rem' }}>
                <NECImage
                  src={VERIFIED_MEDIA.branding.accreditationBadges.src}
                  alt={VERIFIED_MEDIA.branding.accreditationBadges.alt}
                  width={802}
                  height={311}
                  objectFit="contain"
                  style={{ width: '100%', height: 'auto', maxHeight: '140px' }}
                />
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.3rem' }}>
                Premier National Accreditations
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                NAAC A+ Grade (Cycle-2) • Tier-1 NBA Accredited Programs • JNTUK Autonomous Permanent Affiliation
              </p>
            </div>

            {/* India Today 2026 Ranking Card */}
            <div style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)', borderRadius: '18px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ width: '100%', maxWidth: '200px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(212, 175, 55, 0.35)', boxShadow: '0 8px 25px rgba(0,0,0,0.4)', marginBottom: '1rem' }}>
                <NECImage
                  src={VERIFIED_MEDIA.homepage.indiaTodayRanking.src}
                  alt={VERIFIED_MEDIA.homepage.indiaTodayRanking.alt}
                  width={360}
                  height={640}
                  aspectRatio="9 / 16"
                  objectFit="contain"
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.2rem' }}>
                India Today Best Colleges 2026
              </h4>
              <span style={{ fontSize: '0.76rem', color: '#D4AF37', fontWeight: 700 }}>National Engineering Band</span>
            </div>

            {/* Times Engineering 2026 Ranking Card */}
            <div style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)', borderRadius: '18px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ width: '100%', maxWidth: '200px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(212, 175, 55, 0.35)', boxShadow: '0 8px 25px rgba(0,0,0,0.4)', marginBottom: '1rem' }}>
                <NECImage
                  src={VERIFIED_MEDIA.homepage.timesRanking.src}
                  alt={VERIFIED_MEDIA.homepage.timesRanking.alt}
                  width={360}
                  height={640}
                  aspectRatio="9 / 16"
                  objectFit="contain"
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.2rem' }}>
                Times Engineering Survey 2026
              </h4>
              <span style={{ fontSize: '0.76rem', color: '#D4AF37', fontWeight: 700 }}>Top Ranked Tech Institute</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
