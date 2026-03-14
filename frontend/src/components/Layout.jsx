import Sidebar from './Sidebar';
import { Bell, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Layout({ children, title }) {
  const { student } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={styles.root}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div style={styles.main}>
        {/* Top bar */}
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <button onClick={() => setSidebarOpen(true)} style={styles.menuBtn}>
              <Menu size={20} />
            </button>
            <div>
              <h1 style={styles.pageTitle}>{title}</h1>
              <p style={styles.breadcrumb}>MyUPES Portal › {title}</p>
            </div>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.notifBtn}>
              <Bell size={18} />
              <span style={styles.notifDot} />
            </div>
            <div style={styles.headerAvatar}>
              {student?.name?.charAt(0) || 'S'}
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}

const styles = {
  root: { display: 'flex', minHeight: '100vh', background: '#f1f5f9', fontFamily: "'Segoe UI', system-ui, sans-serif" },
  main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 28px', background: 'white',
    borderBottom: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    position: 'sticky', top: 0, zIndex: 10,
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '14px' },
  menuBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    color: '#64748b', display: 'none', padding: '4px',
  },
  pageTitle: { margin: 0, fontSize: '18px', fontWeight: 700, color: '#1e293b' },
  breadcrumb: { margin: 0, fontSize: '11px', color: '#94a3b8' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  notifBtn: {
    position: 'relative', cursor: 'pointer',
    color: '#64748b', padding: '6px',
    background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0',
    display: 'flex', alignItems: 'center',
  },
  notifDot: {
    position: 'absolute', top: '4px', right: '4px',
    width: '7px', height: '7px', borderRadius: '50%',
    background: '#ef4444', border: '1.5px solid white',
  },
  headerAvatar: {
    width: '36px', height: '36px', borderRadius: '50%',
    background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '14px', fontWeight: 700, color: 'white', cursor: 'pointer',
  },
  content: { padding: '28px', flex: 1, overflowY: 'auto' },
};
