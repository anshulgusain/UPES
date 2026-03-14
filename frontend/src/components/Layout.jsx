import { useState } from 'react';
import Sidebar from './Sidebar';
import { Bell, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children, title }) {
  const { student } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <style>{`
        .layout-root {
          display: flex;
          min-height: 100vh;
          background: #f1f5f9;
          font-family: 'Segoe UI', system-ui, sans-serif;
        }
        .layout-sidebar-desktop {
          display: flex;
          flex-shrink: 0;
        }
        .layout-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-width: 0;
        }
        .layout-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 28px;
          background: white;
          border-bottom: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .layout-header-left { display: flex; align-items: center; gap: 14px; }
        .layout-menu-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: #64748b;
          padding: 6px;
          border-radius: 8px;
          align-items: center;
          justify-content: center;
        }
        .layout-page-title { margin: 0; font-size: 18px; font-weight: 700; color: #1e293b; }
        .layout-breadcrumb { margin: 0; font-size: 11px; color: #94a3b8; }
        .layout-header-right { display: flex; align-items: center; gap: 12px; }
        .layout-notif {
          position: relative; cursor: pointer; color: #64748b;
          padding: 6px; background: #f8fafc; border-radius: 8px;
          border: 1px solid #e2e8f0; display: flex; align-items: center;
        }
        .layout-notif-dot {
          position: absolute; top: 4px; right: 4px;
          width: 7px; height: 7px; border-radius: 50%;
          background: #ef4444; border: 1.5px solid white;
        }
        .layout-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: linear-gradient(135deg,#4f46e5,#7c3aed);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 700; color: white; cursor: pointer;
          flex-shrink: 0;
        }
        .layout-content {
          padding: 24px 28px;
          flex: 1;
          overflow-y: auto;
        }

        /* Mobile overlay */
        .sidebar-overlay {
          display: none;
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.55);
          z-index: 40;
        }
        .sidebar-overlay.open { display: block; }

        /* Mobile sidebar drawer */
        .sidebar-drawer {
          position: fixed;
          top: 0; left: 0; bottom: 0;
          z-index: 50;
          transform: translateX(-100%);
          transition: transform 0.25s ease;
        }
        .sidebar-drawer.open { transform: translateX(0); }

        @media (max-width: 768px) {
          .layout-sidebar-desktop { display: none; }
          .layout-menu-btn { display: flex !important; }
          .layout-header { padding: 12px 16px; }
          .layout-content { padding: 16px; }
          .layout-page-title { font-size: 16px; }
        }
      `}</style>

      <div className="layout-root">
        {/* Desktop sidebar — always visible */}
        <div className="layout-sidebar-desktop">
          <Sidebar />
        </div>

        {/* Mobile sidebar — drawer */}
        <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
          onClick={() => setSidebarOpen(false)} />
        <div className={`sidebar-drawer ${sidebarOpen ? 'open' : ''}`}>
          <Sidebar onClose={() => setSidebarOpen(false)} isMobile />
        </div>

        {/* Main content */}
        <div className="layout-main">
          <header className="layout-header">
            <div className="layout-header-left">
              <button className="layout-menu-btn" onClick={() => setSidebarOpen(true)}>
                <Menu size={22} />
              </button>
              <div>
                <h1 className="layout-page-title">{title}</h1>
                <p className="layout-breadcrumb">MyUPES Portal › {title}</p>
              </div>
            </div>
            <div className="layout-header-right">
              <div className="layout-notif">
                <Bell size={18} />
                <span className="layout-notif-dot" />
              </div>
              <div className="layout-avatar">
                {student?.name?.charAt(0) || 'S'}
              </div>
            </div>
          </header>

          <main className="layout-content">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}