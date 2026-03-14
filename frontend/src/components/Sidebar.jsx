import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, FileText, Receipt, User,
  LogOut, GraduationCap, Bell, BookOpen,
  ClipboardList, HelpCircle, ChevronRight, X,
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',    to: '/dashboard' },
  { icon: FileText,        label: 'My Documents', to: '/documents' },
  { icon: Receipt,         label: 'Fee Receipts', to: '/fee-receipts' },
  { icon: BookOpen,        label: 'Courses',      to: '/courses' },
  { icon: ClipboardList,   label: 'Attendance',   to: '/attendance' },
  { icon: GraduationCap,   label: 'Results',      to: '/results' },
  { icon: User,            label: 'Profile',      to: '/profile' },
  { icon: HelpCircle,      label: 'Support',      to: '/support' },
];

export default function Sidebar({ onClose, isMobile }) {
  const { student, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavClick = () => {
    if (isMobile && onClose) onClose();
  };

  return (
    <>
      <style>{`
        .sidebar {
          width: 240px;
          min-height: 100vh;
          height: 100%;
          background: linear-gradient(180deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%);
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          flex-shrink: 0;
        }
        .sidebar-logo {
          display: flex; align-items: center; gap: 12px;
          padding: 22px 18px 18px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          flex-shrink: 0;
        }
        .sidebar-logo-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg,#4f46e5,#7c3aed);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .sidebar-logo-upes { font-size: 20px; font-weight: 800; line-height: 1; }
        .sidebar-logo-sub { font-size: 10px; color: rgba(255,255,255,0.5); letter-spacing: 1px; margin-top: 2px; }
        .sidebar-close-btn {
          margin-left: auto; background: none; border: none;
          color: rgba(255,255,255,0.6); cursor: pointer; padding: 4px;
          display: flex; align-items: center;
        }
        .sidebar-badge {
          display: flex; align-items: center; gap: 10px;
          margin: 14px 12px;
          background: rgba(255,255,255,0.08);
          border-radius: 12px; padding: 12px;
          flex-shrink: 0;
        }
        .sidebar-avatar {
          width: 38px; height: 38px; border-radius: 50%;
          background: linear-gradient(135deg,#f97316,#ec4899);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 700; color: white; flex-shrink: 0;
        }
        .sidebar-student-name { font-size: 13px; font-weight: 700; color: white; line-height: 1.2; }
        .sidebar-student-sap  { font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 2px; }
        .sidebar-nav { flex: 1; padding: 8px 10px; display: flex; flex-direction: column; gap: 2px; }
        .sidebar-nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 10px;
          color: rgba(255,255,255,0.65); text-decoration: none;
          font-size: 13.5px; font-weight: 500; transition: all 0.15s;
        }
        .sidebar-nav-item:hover { background: rgba(99,102,241,0.15); color: white; }
        .sidebar-nav-item.active { background: rgba(99,102,241,0.25); color: white; }
        .sidebar-nav-arrow { opacity: 0.4; margin-left: auto; }
        .sidebar-bottom {
          padding: 12px 12px 20px;
          border-top: 1px solid rgba(255,255,255,0.1);
          flex-shrink: 0;
        }
        .sidebar-logout {
          display: flex; align-items: center; gap: 10px;
          width: 100%;
          background: rgba(239,68,68,0.15);
          border: 1px solid rgba(239,68,68,0.3);
          border-radius: 10px; padding: 10px 14px;
          color: #f87171; cursor: pointer;
          font-size: 13.5px; font-weight: 600;
        }
        .sidebar-version { text-align: center; font-size: 10px; color: rgba(255,255,255,0.25); margin-top: 10px; }
      `}</style>

      <aside className="sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <GraduationCap size={20} color="white" />
          </div>
          <div>
            <div className="sidebar-logo-upes">
              <span style={{ color: '#f97316' }}>U</span>
              <span style={{ color: 'white' }}>PES</span>
            </div>
            <div className="sidebar-logo-sub">MyUPES Portal</div>
          </div>
          {isMobile && (
            <button className="sidebar-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          )}
        </div>

        {/* Student badge */}
        <div className="sidebar-badge">
          <div className="sidebar-avatar">
            {student?.name?.charAt(0) || 'S'}
          </div>
          <div style={{ minWidth: 0 }}>
            <div className="sidebar-student-name" style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {student?.name}
            </div>
            <div className="sidebar-student-sap">SAP: {student?.sapId}</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {navItems.map(({ icon: Icon, label, to }) => (
            <NavLink
              key={to} to={to}
              onClick={handleNavClick}
              className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}
            >
              <Icon size={18} />
              <span style={{ flex: 1 }}>{label}</span>
              <ChevronRight size={14} className="sidebar-nav-arrow" />
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="sidebar-bottom">
          <button onClick={handleLogout} className="sidebar-logout">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
          <div className="sidebar-version">v2.4.1 · 2024</div>
        </div>
      </aside>
    </>
  );
}