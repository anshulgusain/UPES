import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { FileText, Receipt, GraduationCap, Calendar, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const notices = [
  { text: 'Examination form submission deadline: 20th Jan 2024', icon: AlertCircle, color: '#ef4444' },
  { text: 'Semester 6 fee payment window opens: 1st Feb 2024',  icon: Clock,         color: '#f97316' },
  { text: 'Result declared for Semester 4 — View now',          icon: CheckCircle,   color: '#059669' },
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
      <style>{`
        .dash-banner {
          background: linear-gradient(135deg,#4f46e5,#7c3aed);
          border-radius: 14px; padding: 24px 28px;
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 20px; position: relative; overflow: hidden;
        }
        .dash-banner-decor {
          position: absolute; right: 16px; bottom: 0; opacity: 0.15;
        }
        .dash-greet  { margin:0; color:rgba(255,255,255,0.75); font-size:13px; }
        .dash-name   { margin:6px 0 4px; color:white; font-size:22px; font-weight:800; }
        .dash-prog   { margin:0 0 10px; color:rgba(255,255,255,0.8); font-size:13px; }
        .dash-tags   { display:flex; gap:8px; flex-wrap:wrap; }
        .dash-tag    {
          background:rgba(255,255,255,0.2); color:white;
          border-radius:20px; padding:3px 10px; font-size:11px; font-weight:600;
        }

        .dash-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px; margin-bottom: 20px;
        }
        .dash-stat-card {
          background: white; border-radius: 12px; padding: 18px;
          display: flex; align-items: center; gap: 14px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        }
        .dash-stat-icon {
          width: 44px; height: 44px; border-radius: 11px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .dash-stat-val   { font-size: 22px; font-weight: 800; color: #1e293b; }
        .dash-stat-lbl   { font-size: 12px; color: #64748b; }
        .dash-stat-sub   { font-size: 11px; font-weight: 600; margin-top: 2px; }

        .dash-two-col {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 18px; margin-bottom: 20px;
        }
        .dash-card {
          background: white; border-radius: 12px; padding: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        }
        .dash-card-title { margin:0 0 14px; font-size:14px; font-weight:700; color:#1e293b; }

        .dash-actions { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .dash-action-btn {
          display:flex; flex-direction:column; align-items:center; gap:8px;
          padding:14px 10px; background:white; border-radius:10px;
          cursor:pointer; font-family:inherit; transition:all 0.15s;
        }
        .dash-action-icon {
          width:38px; height:38px; border-radius:9px;
          display:flex; align-items:center; justify-content:center;
        }
        .dash-action-lbl { font-size:12px; font-weight:600; color:#374151; }

        .dash-notice-list { display:flex; flex-direction:column; gap:10px; }
        .dash-notice {
          display:flex; align-items:flex-start; gap:9px;
          padding:10px; background:#f8fafc; border-radius:9px;
        }
        .dash-notice-txt { font-size:12px; color:#374151; line-height:1.4; }

        .dash-info-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(240px,1fr)); gap: 10px;
        }
        .dash-info-row {
          display:flex; flex-direction:column; padding:11px;
          background:#f8fafc; border-radius:9px; gap:3px;
        }
        .dash-info-key { font-size:10px; color:#94a3b8; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; }
        .dash-info-val { font-size:13px; color:#1e293b; font-weight:600; }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .dash-stats { grid-template-columns: repeat(2,1fr); }
          .dash-two-col { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .dash-banner  { padding: 18px; }
          .dash-name    { font-size: 18px; }
          .dash-stats   { grid-template-columns: repeat(2,1fr); gap:10px; }
          .dash-stat-card { padding: 12px; gap: 10px; }
          .dash-stat-icon { width:36px; height:36px; }
          .dash-stat-val  { font-size: 18px; }
          .dash-actions   { grid-template-columns: repeat(2,1fr); }
          .dash-info-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      {/* Welcome banner */}
      <div className="dash-banner">
        <div style={{ position:'relative', zIndex:1 }}>
          <p className="dash-greet">{getGreeting()},</p>
          <h2 className="dash-name">{student?.name} 👋</h2>
          <p className="dash-prog">{student?.program}</p>
          <div className="dash-tags">
            <span className="dash-tag">SAP: {student?.sapId}</span>
            <span className="dash-tag">{student?.semester}</span>
            <span className="dash-tag">Section: {student?.section}</span>
          </div>
        </div>
        <div className="dash-banner-decor">
          <GraduationCap size={80} color="white" />
        </div>
      </div>

      {/* Stats */}
      <div className="dash-stats">
        {[
          { icon: FileText,      label:'Documents',    value:'8',   sub:'7 verified',   color:'#4f46e5', bg:'#eef2ff' },
          { icon: Receipt,       label:'Fee Receipts', value:'4',   sub:'All paid',     color:'#059669', bg:'#ecfdf5' },
          { icon: GraduationCap, label:'CGPA',         value:'8.4', sub:'5th Semester', color:'#d97706', bg:'#fffbeb' },
          { icon: Calendar,      label:'Attendance',   value:'82%', sub:'This sem',     color:'#7c3aed', bg:'#f5f3ff' },
        ].map(({ icon: Icon, label, value, sub, color, bg }) => (
          <div key={label} className="dash-stat-card">
            <div className="dash-stat-icon" style={{ background: bg }}>
              <Icon size={20} color={color} />
            </div>
            <div>
              <div className="dash-stat-val">{value}</div>
              <div className="dash-stat-lbl">{label}</div>
              <div className="dash-stat-sub" style={{ color }}>{sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Two column */}
      <div className="dash-two-col">
        <div className="dash-card">
          <h3 className="dash-card-title">Quick Actions</h3>
          <div className="dash-actions">
            {[
              { label:'My Documents', icon:FileText,    to:'/documents',    color:'#4f46e5' },
              { label:'Fee Receipts', icon:Receipt,     to:'/fee-receipts', color:'#059669' },
              { label:'Attendance',   icon:Calendar,    to:'/attendance',   color:'#7c3aed' },
              { label:'Results',      icon:TrendingUp,  to:'/results',      color:'#d97706' },
            ].map(({ label, icon: Icon, to, color }) => (
              <button key={label} onClick={() => navigate(to)}
                className="dash-action-btn"
                style={{ border:`1.5px solid ${color}22` }}>
                <div className="dash-action-icon" style={{ background:`${color}15` }}>
                  <Icon size={18} color={color} />
                </div>
                <span className="dash-action-lbl">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="dash-card">
          <h3 className="dash-card-title">Notices & Alerts</h3>
          <div className="dash-notice-list">
            {notices.map((n, i) => (
              <div key={i} className="dash-notice">
                <n.icon size={15} color={n.color} style={{ flexShrink:0, marginTop:1 }} />
                <span className="dash-notice-txt">{n.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Academic details */}
      <div className="dash-card">
        <h3 className="dash-card-title">Academic Details</h3>
        <div className="dash-info-grid">
          {[
            ['Roll Number', student?.rollNo],
            ['Program',     student?.program],
            ['School',      student?.school],
            ['Batch',       student?.batch],
            ['Semester',    student?.semester],
            ['Section',     student?.section],
            ['Email',       student?.email],
            ['Phone',       student?.phone],
          ].map(([k, v]) => (
            <div key={k} className="dash-info-row">
              <span className="dash-info-key">{k}</span>
              <span className="dash-info-val" style={{ wordBreak:'break-all' }}>{v || '—'}</span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}