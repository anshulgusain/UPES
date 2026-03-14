import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { FileText, Receipt, GraduationCap, Calendar, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const stats = [
  { icon: FileText, label: 'Documents', value: '8', sub: '7 verified', color: '#4f46e5', bg: '#eef2ff' },
  { icon: Receipt, label: 'Fee Receipts', value: '1', sub: 'All paid', color: '#059669', bg: '#ecfdf5' },
  { icon: GraduationCap, label: 'CGPA', value: 'N.A', sub: '1st Semester', color: '#d97706', bg: '#fffbeb' },
  { icon: Calendar, label: 'Attendance', value: 'N.A', sub: 'This semester', color: '#7c3aed', bg: '#f5f3ff' },
];

const notices = [
  { type: 'alert', text: 'Examination form submission deadline: 20th Jan 2024', icon: AlertCircle, color: '#ef4444' },
  { type: 'info', text: 'Semester 6 fee payment window opens: 1st Feb 2024', icon: Clock, color: '#f97316' },
  { type: 'success', text: 'Result declared for Semester 4 — View now', icon: CheckCircle, color: '#059669' },
];

export default function Dashboard() {
  const { student } = useAuth();
  const navigate = useNavigate();

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <Layout title="Dashboard">
      {/* Welcome banner */}
      <div style={styles.welcomeBanner}>
        <div>
          <p style={styles.greetText}>{getGreeting()},</p>
          <h2 style={styles.studentNameBig}>{student?.name} 👋</h2>
          <p style={styles.programText}>{student?.program}</p>
          <div style={styles.tagRow}>
            <span style={styles.tag}>SAP: {student?.sapId}</span>
            <span style={styles.tag}>{student?.semester}</span>
            <span style={styles.tag}>Section: {student?.section}</span>
          </div>
        </div>
        <div style={styles.bannerDecor}>
          <GraduationCap size={80} color="rgba(255,255,255,0.15)" />
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        {stats.map(({ icon: Icon, label, value, sub, color, bg }) => (
          <div key={label} style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: bg }}>
              <Icon size={22} color={color} />
            </div>
            <div>
              <div style={styles.statValue}>{value}</div>
              <div style={styles.statLabel}>{label}</div>
              <div style={{ ...styles.statSub, color }}>{sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.twoCol}>
        {/* Quick actions */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Quick Actions</h3>
          <div style={styles.actionGrid}>
            {[
              { label: 'My Documents', icon: FileText, to: '/documents', color: '#4f46e5' },
              { label: 'Fee Receipts', icon: Receipt, to: '/fee-receipts', color: '#059669' },
              { label: 'Attendance', icon: Calendar, to: '/attendance', color: '#7c3aed' },
              { label: 'Results', icon: TrendingUp, to: '/results', color: '#d97706' },
            ].map(({ label, icon: Icon, to, color }) => (
              <button
                key={label}
                onClick={() => navigate(to)}
                style={{ ...styles.actionBtn, borderColor: color + '33' }}
              >
                <div style={{ ...styles.actionIcon, background: color + '15' }}>
                  <Icon size={20} color={color} />
                </div>
                <span style={styles.actionLabel}>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Notices */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Notices & Alerts</h3>
          <div style={styles.noticeList}>
            {notices.map((n, i) => (
              <div key={i} style={styles.noticeItem}>
                <n.icon size={16} color={n.color} style={{ flexShrink: 0 }} />
                <span style={styles.noticeText}>{n.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Student Info */}
      <div style={{ ...styles.card, marginTop: '20px' }}>
        <h3 style={styles.cardTitle}>Academic Details</h3>
        <div style={styles.infoGrid}>
          {[
            ['Roll Number', student?.rollNo],
            ['Program', student?.program],
            ['School', student?.school],
            ['Batch', student?.batch],
            ['Semester', student?.semester],
            ['Section', student?.section],
            ['Email', student?.email],
            ['Phone', student?.phone],
          ].map(([k, v]) => (
            <div key={k} style={styles.infoRow}>
              <span style={styles.infoKey}>{k}</span>
              <span style={styles.infoVal}>{v || '—'}</span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

const styles = {
  welcomeBanner: {
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    borderRadius: '16px', padding: '28px 32px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '24px', position: 'relative', overflow: 'hidden',
  },
  greetText: { margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '14px' },
  studentNameBig: { margin: '4px 0', color: 'white', fontSize: '26px', fontWeight: 800 },
  programText: { margin: '4px 0 10px', color: 'rgba(255,255,255,0.8)', fontSize: '14px' },
  tagRow: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  tag: {
    background: 'rgba(255,255,255,0.2)', color: 'white',
    borderRadius: '20px', padding: '3px 10px', fontSize: '12px', fontWeight: 600,
  },
  bannerDecor: { position: 'absolute', right: '24px', bottom: '0' },
  statsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))',
    gap: '16px', marginBottom: '24px',
  },
  statCard: {
    background: 'white', borderRadius: '14px', padding: '20px',
    display: 'flex', alignItems: 'center', gap: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  statIcon: {
    width: '48px', height: '48px', borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  statValue: { fontSize: '22px', fontWeight: 800, color: '#1e293b' },
  statLabel: { fontSize: '13px', color: '#64748b', fontWeight: 500 },
  statSub: { fontSize: '11px', fontWeight: 600, marginTop: '2px' },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  card: {
    background: 'white', borderRadius: '14px', padding: '22px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  cardTitle: { margin: '0 0 16px', fontSize: '15px', fontWeight: 700, color: '#1e293b' },
  actionGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  actionBtn: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
    padding: '16px 12px', background: 'white', border: '1.5px solid',
    borderRadius: '12px', cursor: 'pointer', transition: 'all 0.15s',
  },
  actionIcon: { width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontSize: '12px', fontWeight: 600, color: '#374151' },
  noticeList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  noticeItem: {
    display: 'flex', alignItems: 'flex-start', gap: '10px',
    padding: '12px', background: '#f8fafc', borderRadius: '10px',
  },
  noticeText: { fontSize: '13px', color: '#374151', lineHeight: 1.4 },
  infoGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: '12px',
  },
  infoRow: {
    display: 'flex', flexDirection: 'column', padding: '12px',
    background: '#f8fafc', borderRadius: '10px', gap: '4px',
  },
  infoKey: { fontSize: '11px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' },
  infoVal: { fontSize: '14px', color: '#1e293b', fontWeight: 600 },
};
