import React, { useState } from 'react';
import { 
  GraduationCap, 
  Calendar, 
  Download, 
  Award, 
  MapPin, 
  Phone, 
  Mail, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink,
  Clock,
  Building2,
  Lock
} from 'lucide-react';
import { COLLEGE_INFO, BRANDING_LOGOS } from '../../data/masterData.js';
import { getExamNotifications } from '../../data/portalStore.js';

export default function ExamCellAndContact({ onOpenPortal }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: 'B.Tech CSE',
    message: ''
  });

  const examNotices = getExamNotifications();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Please enter your full name and contact phone number.');
      return;
    }
    alert(`Thank you, ${formData.name}! Your admissions / general enquiry has been recorded with the NEC Central Office. Our counsellor will contact you shortly at ${formData.phone}.`);
    setFormData({ name: '', email: '', phone: '', course: 'B.Tech CSE', message: '' });
  };

  return (
    <div style={{ width: '100%' }}>
      {/* 1. DEDICATED APEX ACCREDITATIONS & RECOGNITIONS SECTION */}
      <section style={{ padding: '4.5rem 0', background: '#FFFFFF', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0', width: '100%' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="badge badge-gold" style={{ marginBottom: '0.4rem' }}>
              Statutory Quality Accreditations & Recognitions
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', color: '#0B192C', marginTop: '0.3rem' }}>
              Recognized & Accredited by National Apex Bodies
            </h2>
            <p style={{ color: '#64748B', maxWidth: '650px', margin: '0.4rem auto 0', fontSize: '0.95rem' }}>
              Benchmarked against premier technical education and institutional governance standards across India.
            </p>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '2.5rem'
          }}>
            {[
              { img: BRANDING_LOGOS.naac, label: 'NAAC "A+" Grade', desc: 'Cycle-2 Accredited' },
              { img: BRANDING_LOGOS.nba, label: 'NBA Accredited', desc: 'Tier-1 (CSE, ECE, EEE, ME)' },
              { img: BRANDING_LOGOS.aicte, label: 'AICTE Approved', desc: 'New Delhi, Govt. of India' },
              { img: BRANDING_LOGOS.nirf, label: 'NIRF Ranked', desc: 'Top Engineering Band' },
              { img: BRANDING_LOGOS.aishe, label: 'AISHE Certified', desc: 'Ministry of Education' },
              { img: BRANDING_LOGOS.iic, label: "MoE IIC Cell", desc: "Innovation Council" }
            ].map((acc, idx) => (
              <div key={idx} style={{ textAlign: 'center', width: '140px' }}>
                <div style={{
                  width: '96px',
                  height: '96px',
                  margin: '0 auto 0.6rem',
                  padding: '12px',
                  borderRadius: '16px',
                  background: '#F8FAFC',
                  border: '1.5px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-xs)'
                }}>
                  <img
                    src={acc.img}
                    alt={acc.label}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0B192C' }}>
                  {acc.label}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px' }}>
                  {acc.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. AUTONOMOUS EXAMINATION CELL */}
      <section id="exam-cell-section" style={{ padding: '4.5rem 0', background: '#F8FAFC', width: '100%' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="badge badge-navy" style={{ marginBottom: '0.5rem' }}>
              Autonomous Examination Centre
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', color: '#0B192C', marginBottom: '0.6rem' }}>
              Exam Cell & Academic Circulars
            </h2>
            <p style={{ color: '#64748B', maxWidth: '700px', margin: '0 auto', fontSize: '0.96rem' }}>
              Access autonomous examination schedules, result grade-sheets, academic calendars, and revaluation notifications.
            </p>
          </div>

          <div className="grid-2" style={{ gap: '2rem' }}>
            {/* Exam Circulars Feed */}
            <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.8rem', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.8rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#0B192C', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={18} style={{ color: '#D4AF37' }} /> Latest Examination Circulars
                </h3>
                <span className="badge badge-gold">Active Session</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                {examNotices.length === 0 ? (
                  <div style={{
                    padding: '2.5rem 1.5rem',
                    textAlign: 'center',
                    background: '#F8FAFC',
                    borderRadius: '12px',
                    border: '1px dashed #CBD5E1',
                    color: '#64748B'
                  }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.3rem' }}>
                      No Active Examination Notices
                    </div>
                    <div style={{ fontSize: '0.8rem' }}>
                      Upcoming autonomous semester schedules, timetables, and revaluation announcements will be published here.
                    </div>
                  </div>
                ) : (
                  examNotices.map(notice => (
                    <div
                      key={notice.id}
                      style={{
                        padding: '0.9rem 1.1rem',
                        borderRadius: '10px',
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '1rem'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.2rem' }}>
                          <span className="badge badge-navy" style={{ fontSize: '0.65rem' }}>{notice.category}</span>
                          {notice.regulation && <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>{notice.regulation}</span>}
                        </div>
                        <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.88rem' }}>
                          {notice.title}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '0.2rem' }}>
                          Date: {notice.date}
                        </div>
                      </div>

                      {notice.pdf && (
                        <a
                          href={`/assets/docs/${notice.pdf}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            padding: '0.4rem 0.75rem',
                            borderRadius: '6px',
                            background: '#0B192C',
                            color: '#FFF',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            whiteSpace: 'nowrap',
                            textDecoration: 'none'
                          }}
                        >
                          <Download size={12} /> PDF
                        </a>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Autonomous Action Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ background: '#0B192C', color: '#FFFFFF', padding: '1.8rem', borderRadius: '16px', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                <h3 style={{ color: '#FFFFFF', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                  Autonomous Results Server
                </h3>
                <p style={{ color: '#CBD5E1', fontSize: '0.86rem', lineHeight: 1.5, marginBottom: '1.2rem' }}>
                  Students can log in with their Roll Number and Date of Birth to check semester grade sheets, SGPA, CGPA, and revaluation progress.
                </p>
                <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => alert('Opening Autonomous Results Portal: https://results.nrtec.in')}
                    className="btn-primary"
                    style={{ padding: '0.6rem 1.2rem', fontSize: '0.82rem' }}
                  >
                    Check Results Online <ExternalLink size={13} />
                  </button>
                  <button
                    onClick={onOpenPortal}
                    className="btn-secondary"
                    style={{ padding: '0.6rem 1.2rem', fontSize: '0.82rem' }}
                  >
                    <Lock size={13} /> Faculty Marks Entry
                  </button>
                </div>
              </div>

              <div style={{ background: '#FFFFFF', padding: '1.8rem', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <h3 style={{ color: '#0B192C', fontSize: '1.15rem', marginBottom: '0.6rem' }}>
                  Controller of Examinations Secretariat
                </h3>
                <div style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.6 }}>
                  <div><strong>Office Location:</strong> Central Administration Wing, Ground Floor</div>
                  <div><strong>Exam Helpline:</strong> +91 8647 239904 / +91 9441864537</div>
                  <div><strong>Official Email:</strong> coe@nrtec.in</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CONTACT & ADMISSIONS ENQUIRY */}
      <section id="contact-section" style={{ padding: '5rem 0', background: '#FFFFFF', width: '100%' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="badge badge-navy" style={{ marginBottom: '0.5rem' }}>
              Admissions & Institutional Secretariat
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', color: '#0B192C', marginBottom: '0.6rem' }}>
              Connect with Narasaraopeta Engineering College
            </h2>
            <p style={{ color: '#64748B', maxWidth: '680px', margin: '0 auto', fontSize: '0.96rem' }}>
              Our Admissions & Public Relations office assists prospective students, parents, visiting dignitaries, and research partners.
            </p>
          </div>

          <div className="grid-2" style={{ gap: '2.5rem', alignItems: 'flex-start' }}>
            {/* Campus Contact Information */}
            <div style={{ background: '#0B192C', color: '#FFFFFF', padding: '2.5rem', borderRadius: '20px', border: '1px solid rgba(212, 175, 55, 0.3)', boxShadow: 'var(--shadow-md)' }}>
              <h3 style={{ color: '#FFFFFF', fontSize: '1.35rem', marginBottom: '1.5rem' }}>
                Institutional Contact Details
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <MapPin size={22} style={{ color: '#D4AF37', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.92rem' }}>Campus Address:</div>
                    <div style={{ color: '#CBD5E1', fontSize: '0.85rem', lineHeight: 1.5 }}>
                      Narasaraopeta Engineering College (Autonomous)<br />
                      Kotappakonda Road, Yellamanda (P.O), Narasaraopet,<br />
                      Palnadu District, Andhra Pradesh - 522601, India.
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <Phone size={22} style={{ color: '#D4AF37', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.92rem' }}>Helpline Numbers:</div>
                    <div style={{ color: '#CBD5E1', fontSize: '0.85rem' }}>
                      Principal Office: +91 8647 239903 / 239904<br />
                      Admissions Cell: +91 9440757039 / +91 9441864537<br />
                      Training & Placement: +91 9848123456
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <Mail size={22} style={{ color: '#D4AF37', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.92rem' }}>Official Emails:</div>
                    <div style={{ color: '#CBD5E1', fontSize: '0.85rem' }}>
                      Principal: principal@nrtec.in<br />
                      Admissions: admissions@nrtec.in<br />
                      Dean R&D: deanrd@nrtec.in
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Admissions Form */}
            <div style={{ background: '#FFFFFF', padding: '2.5rem', borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '1.35rem', color: '#0B192C', marginBottom: '0.3rem' }}>
                Online Admissions & Course Counselling
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Submit your enquiry below to receive official branch seat availability, fee structure, and scholarship advice.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="grid-2" style={{ gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      placeholder="student@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Program of Interest</label>
                  <select
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className="form-control"
                  >
                    <option value="B.Tech CSE">B.Tech Computer Science & Engineering</option>
                    <option value="B.Tech CSE (AI)">B.Tech CSE (Artificial Intelligence)</option>
                    <option value="B.Tech CSE (AI&ML)">B.Tech CSE (AI & Machine Learning)</option>
                    <option value="B.Tech CSE (Data Science)">B.Tech CSE (Data Science)</option>
                    <option value="B.Tech CSE (Cyber Security)">B.Tech CSE (Cyber Security)</option>
                    <option value="B.Tech ECE">B.Tech Electronics & Communication</option>
                    <option value="B.Tech EEE">B.Tech Electrical & Electronics</option>
                    <option value="B.Tech Mechanical">B.Tech Mechanical Engineering</option>
                    <option value="B.Tech Civil">B.Tech Civil Engineering</option>
                    <option value="B.Tech IT">B.Tech Information Technology</option>
                    <option value="MBA">Master of Business Administration (MBA)</option>
                    <option value="MCA">Master of Computer Applications (MCA)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Message / Rank Details</label>
                  <textarea
                    rows={3}
                    placeholder="Enter EAMCET/ECET rank or queries..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="form-control"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', padding: '0.8rem' }}
                >
                  <Send size={15} /> Submit Admissions Enquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INSTITUTIONAL FULL-WIDTH FOOTER */}
      <footer style={{ background: '#040811', color: '#94A3B8', padding: '4rem 0 2rem', borderTop: '1px solid rgba(212, 175, 55, 0.25)', width: '100%' }}>
        <div className="container">
          <div className="grid-4" style={{ gap: '2.5rem', marginBottom: '3rem' }}>
            {/* Col 1: College Branding */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
                <img
                  src={BRANDING_LOGOS.collegeLogo}
                  alt="NEC Logo"
                  style={{ width: '40px', height: '40px', borderRadius: '6px', border: '1px solid #D4AF37' }}
                />
                <div style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '0.96rem', fontFamily: 'Cinzel, serif' }}>
                  NARASARAOPETA <span style={{ color: '#D4AF37' }}>ENGINEERING COLLEGE</span>
                </div>
              </div>
              <p style={{ fontSize: '0.8rem', lineHeight: 1.6, color: '#CBD5E1', marginBottom: '0.8rem' }}>
                Autonomous institution under Gayatri Educational Development Society (GEDS). Accredited with NAAC 'A+' Grade (Cycle-2), NBA Tier-1, and affiliated to JNTUK Kakinada.
              </p>
              <div style={{ color: '#D4AF37', fontSize: '0.76rem', fontWeight: 700 }}>
                EAMCET / ECET Code: NARA
              </div>
            </div>

            {/* Col 2: Institutional Links */}
            <div>
              <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.3rem' }}>
                Quick Links
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.82rem' }}>
                <li><a href="#about" style={{ color: '#CBD5E1' }}>About Society & College</a></li>
                <li><a href="#leadership" style={{ color: '#CBD5E1' }}>Chairman & Leadership</a></li>
                <li><a href="#governance" style={{ color: '#CBD5E1' }}>Governing Body & Academic Council</a></li>
                <li><a href="#faculty" style={{ color: '#CBD5E1' }}>Faculty Directory (418 Records)</a></li>
                <li><a href="#research" style={{ color: '#CBD5E1' }}>R&D Directorate & Patents</a></li>
              </ul>
            </div>

            {/* Col 3: Popular Departments */}
            <div>
              <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.3rem' }}>
                Departments
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.82rem' }}>
                <li><a href="#departments" style={{ color: '#CBD5E1' }}>Computer Science & Engineering</a></li>
                <li><a href="#departments" style={{ color: '#CBD5E1' }}>Electronics & Communication</a></li>
                <li><a href="#departments" style={{ color: '#CBD5E1' }}>Artificial Intelligence & ML</a></li>
                <li><a href="#departments" style={{ color: '#CBD5E1' }}>Information Technology</a></li>
                <li><a href="#departments" style={{ color: '#CBD5E1' }}>Electrical & Electronics</a></li>
              </ul>
            </div>

            {/* Col 4: Secure Portal */}
            <div>
              <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.3rem' }}>
                Academic Portal
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.8rem' }}>
                Role-based management for research auto-sync, patents, and Madam notebook modules.
              </p>
              <button
                onClick={onOpenPortal}
                className="btn-primary"
                style={{ width: '100%', padding: '0.6rem', fontSize: '0.82rem', marginBottom: '0.6rem' }}
              >
                <Lock size={13} /> Portal Login
              </button>
              <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                NAAC A+ Cycle-2 • NBA Tier-1 • ISO 9001:2015
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.76rem' }}>
            <div>
              © {new Date().getFullYear()} Narasaraopeta Engineering College (Autonomous). All Rights Reserved.
            </div>
            <div style={{ color: '#D4AF37' }}>
              Academic, Research & Institutional Management Portal
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
