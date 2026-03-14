import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, FileText, Receipt, User,
  LogOut, GraduationCap, Bell, BookOpen,
  ClipboardList, HelpCircle, ChevronRight,
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
  { icon: FileText, label: 'My Documents', to: '/documents' },
  { icon: Receipt, label: 'Fee Receipts', to: '/fee-receipts' },
  { icon: BookOpen, label: 'Courses', to: '/courses' },
  { icon: ClipboardList, label: 'Attendance', to: '/attendance' },
  { icon: GraduationCap, label: 'Results', to: '/results' },
  { icon: User, label: 'Profile', to: '/profile' },
  { icon: HelpCircle, label: 'Support', to: '/support' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { student, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 40, display: 'none',
          }}
          className="mobile-overlay"
        />
      )}

      <aside style={styles.sidebar}>
        {/* Logo */}
        <div style={styles.logoArea}>
          <div style={styles.logoIcon}>
            <GraduationCap size={20} color="white" />
          </div>
          <div>
            <div style={styles.logoText}>
              <span style={{ color: '#f97316' }}>U</span>
              <span style={{ color: 'white' }}>PES</span>
            </div>
            <div style={styles.logoSub}>MyUPES Portal</div>
          </div>
        </div>

        {/* Student badge */}
        <div style={styles.studentBadge}>
          <div style={styles.avatar}>
            {student?.name?.charAt(0) || 'S'}
          </div>
          <div>
            <div style={styles.studentName}>{student?.name}</div>
            <div style={styles.studentSap}>SAP: {student?.sapId}</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={styles.nav}>
          {navItems.map(({ icon: Icon, label, to }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {}),
              })}
            >
              <Icon size={18} />
              <span style={styles.navLabel}>{label}</span>
              <ChevronRight size={14} style={styles.navArrow} />
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div style={styles.bottomArea}>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
          <div style={styles.versionTag}>v2.4.1 · 2024</div>
        </div>
      </aside>
    </>
  );
}

const styles = {
  sidebar: {
    width: '240px',
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
    display: 'flex',
    flexDirection: 'column',
    padding: '0',
    flexShrink: 0,
    position: 'sticky',
    top: 0,
    height: '100vh',
    overflowY: 'auto',
  },
  logoArea: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '22px 18px 18px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  logoIcon: {
    width: '36px', height: '36px', borderRadius: '10px',
    background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  logoText: { fontSize: '20px', fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1 },
  logoSub: { fontSize: '10px', color: 'rgba(255,255,255,0.5)', letterSpacing: '1px', marginTop: '2px' },
  studentBadge: {
    display: 'flex', alignItems: 'center', gap: '10px',
    margin: '16px 12px',
    background: 'rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '12px',
  },
  avatar: {
    width: '38px', height: '38px', borderRadius: '50%',
    background: 'linear-gradient(135deg,#f97316,#ec4899)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '16px', fontWeight: 700, color: 'white', flexShrink: 0,
  },
  studentName: { fontSize: '13px', fontWeight: 700, color: 'white', lineHeight: 1.2 },
  studentSap: { fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' },
  nav: { flex: 1, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '2px' },
  navItem: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '10px 12px', borderRadius: '10px',
    color: 'rgba(255,255,255,0.65)', textDecoration: 'none',
    fontSize: '13.5px', fontWeight: 500, transition: 'all 0.15s',
    position: 'relative',
  },
  navItemActive: {
    background: 'rgba(99,102,241,0.25)',
    color: 'white',
  },
  navLabel: { flex: 1 },
  navArrow: { opacity: 0.4 },
  bottomArea: {
    padding: '12px 12px 20px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
  },
  logoutBtn: {
    display: 'flex', alignItems: 'center', gap: '10px',
    width: '100%', background: 'rgba(239,68,68,0.15)',
    border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px',
    padding: '10px 14px', color: '#f87171', cursor: 'pointer',
    fontSize: '13.5px', fontWeight: 600, transition: 'all 0.15s',
  },
  versionTag: {
    textAlign: 'center', fontSize: '10px',
    color: 'rgba(255,255,255,0.25)', marginTop: '10px',
  },
};
