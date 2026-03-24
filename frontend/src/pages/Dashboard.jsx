import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { FileText, Receipt, GraduationCap, BookOpen,
         AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const notices = [
  { text: '1st Semester classes commence from May 2025', icon: CheckCircle, color: '#059669' },
  { text: 'Orientation Program scheduled before semester start — check email', icon: AlertCircle, color: '#f97316' },
  { text: 'Submit pending Character Certificate before 30th April', icon: Clock, color: '#ef4444' },
];

const feeBreakdown = [
  { label: 'Tuition Fee (MBA Subjects)',       amount: 420000, color: '#4f46e5' },
  { label: 'Academic / Institutional Fee',     amount:  83000, color: '#7c3aed' },
  { label: 'Admission Fee',                    amount:  25000, color: '#059669' },
  { label: 'Registration / Enrollment Fee',    amount:  12500, color: '#0891b2' },
  { label: 'Security Deposit (Refundable)',     amount:  20000, color: '#d97706' },
];

export default function Dashboard() {
  const { student } = useAuth();
  const navigate    = useNavigate();

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
          border-radius:14px; padding:24px 28px;
          display:flex; justify-content:space-between; align-items:center;
          margin-bottom:20px; position:relative; overflow:hidden;
        }
        .dash-greet { margin:0; color:rgba(255,255,255,0.75); font-size:13px; }
        .dash-name  { margin:6px 0 4px; color:white; font-size:22px; font-weight:800; }
        .dash-prog  { margin:0 0 10px; color:rgba(255,255,255,0.8); font-size:13px; }
        .dash-tags  { display:flex; gap:8px; flex-wrap:wrap; }
        .dash-tag   { background:rgba(255,255,255,0.2); color:white; border-radius:20px; padding:3px 10px; font-size:11px; font-weight:600; }
        .dash-decor { position:absolute; right:16px; bottom:0; opacity:0.12; }

        .dash-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:20px; }
        .dash-stat  { background:white; border-radius:12px; padding:18px; display:flex; align-items:center; gap:14px; box-shadow:0 1px 3px rgba(0,0,0,0.06); }
        .dash-stat-icon { width:44px; height:44px; border-radius:11px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .dash-stat-val  { font-size:20px; font-weight:800; color:#1e293b; }
        .dash-stat-lbl  { font-size:12px; color:#64748b; }
        .dash-stat-sub  { font-size:11px; font-weight:600; margin-top:2px; }

        .dash-new-badge { background:#ecfdf5; color:#059669; border:1px solid #a7f3d0; border-radius:20px; padding:2px 10px; font-size:11px; font-weight:700; display:inline-block; margin-top:4px; }

        .dash-two { display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-bottom:20px; }
        .dash-card { background:white; border-radius:12px; padding:20px; box-shadow:0 1px 3px rgba(0,0,0,0.06); }
        .dash-card-title { margin:0 0 14px; font-size:14px; font-weight:700; color:#1e293b; }

        .dash-actions { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .dash-act-btn { display:flex; flex-direction:column; align-items:center; gap:8px; padding:14px 10px; background:white; border-radius:10px; cursor:pointer; font-family:inherit; transition:all 0.15s; }
        .dash-act-icon { width:38px; height:38px; border-radius:9px; display:flex; align-items:center; justify-content:center; }
        .dash-act-lbl { font-size:12px; font-weight:600; color:#374151; }

        .notice-list { display:flex; flex-direction:column; gap:10px; }
        .notice-item { display:flex; align-items:flex-start; gap:9px; padding:10px; background:#f8fafc; border-radius:9px; }
        .notice-txt  { font-size:12px; color:#374151; line-height:1.4; }

        /* Fee breakdown */
        .fee-banner { background:linear-gradient(135deg,#059669,#0d9488); border-radius:14px; padding:20px 24px; margin-bottom:20px; }
        .fee-banner-top { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px; }
        .fee-banner-lbl { color:rgba(255,255,255,0.8); font-size:12px; margin-bottom:3px; }
        .fee-banner-amt { color:white; font-size:28px; font-weight:900; }
        .fee-paid-badge { background:rgba(255,255,255,0.2); color:white; border-radius:20px; padding:5px 14px; font-size:12px; font-weight:700; display:flex; align-items:center; gap:5px; }
        .fee-rows { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:8px; }
        .fee-row-item { background:rgba(255,255,255,0.15); border-radius:9px; padding:10px 12px; }
        .fee-row-lbl { font-size:11px; color:rgba(255,255,255,0.75); margin-bottom:3px; }
        .fee-row-amt { font-size:15px; font-weight:800; color:white; }

        /* Subjects */
        .subjects-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:14px; }
        .subject-card { background:white; border-radius:12px; padding:18px; box-shadow:0 1px 3px rgba(0,0,0,0.06); }
        .subject-card-title { font-size:13px; font-weight:700; color:#1e293b; margin:0 0 10px; display:flex; align-items:center; gap:7px; }
        .sem-badge { font-size:10px; font-weight:700; padding:2px 8px; border-radius:20px; }
        .subject-item { display:flex; align-items:center; gap:7px; padding:6px 0; border-bottom:1px solid #f1f5f9; font-size:12px; color:#374151; }
        .subject-item:last-child { border-bottom:none; }
        .subject-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }

        .info-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:10px; }
        .info-row  { display:flex; flex-direction:column; padding:11px; background:#f8fafc; border-radius:9px; gap:3px; }
        .info-key  { font-size:10px; color:#94a3b8; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; }
        .info-val  { font-size:13px; color:#1e293b; font-weight:600; word-break:break-all; }

        @media (max-width:900px) {
          .dash-stats { grid-template-columns:repeat(2,1fr); }
          .dash-two   { grid-template-columns:1fr; }
          .fee-rows   { grid-template-columns:repeat(2,1fr); }
        }
        @media (max-width:480px) {
          .dash-banner { padding:18px; }
          .dash-name   { font-size:18px; }
          .dash-stats  { grid-template-columns:repeat(2,1fr); gap:10px; }
          .dash-stat   { padding:12px; gap:10px; }
          .dash-stat-val { font-size:16px; }
          .fee-banner  { padding:16px; }
          .fee-banner-amt { font-size:22px; }
          .fee-rows    { grid-template-columns:1fr 1fr; }
          .subjects-grid { grid-template-columns:1fr; }
          .info-grid   { grid-template-columns:1fr 1fr; }
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
            <span className="dash-tag">Batch: {student?.batch}</span>
            <span className="dash-tag">Section: {student?.section}</span>
          </div>
        </div>
        <div className="dash-decor"><GraduationCap size={90} color="white"/></div>
      </div>

      {/* Stats — no CGPA/attendance for new joinee */}
      <div className="dash-stats">
        {[
          { icon:FileText,    label:'Documents',     value:'8',          sub:'7 verified',          color:'#4f46e5', bg:'#eef2ff' },
          { icon:Receipt,     label:'Fee Status',    value:'Paid ✓',     sub:'₹5,60,500 cleared',   color:'#059669', bg:'#ecfdf5' },
          { icon:BookOpen,    label:'Subjects',      value:'9',          sub:'Sem 1 subjects',      color:'#0891b2', bg:'#e0f2fe' },
          { icon:GraduationCap, label:'Semester',    value:'1st',        sub:'Starts 4th April 2026',     color:'#7c3aed', bg:'#f5f3ff' },
        ].map(({ icon:Icon, label, value, sub, color, bg }) => (
          <div key={label} className="dash-stat">
            <div className="dash-stat-icon" style={{ background:bg }}>
              <Icon size={20} color={color}/>
            </div>
            <div>
              <div className="dash-stat-val">{value}</div>
              <div className="dash-stat-lbl">{label}</div>
              <div className="dash-stat-sub" style={{ color }}>{sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* New Joinee notice */}
      <div style={{ background:'#eff6ff', border:'1.5px solid #bfdbfe', borderRadius:'12px', padding:'14px 18px', marginBottom:'20px', display:'flex', alignItems:'center', gap:'10px' }}>
        <CheckCircle size={18} color="#2563eb" style={{ flexShrink:0 }}/>
        <div>
          <span style={{ fontSize:'13px', fontWeight:700, color:'#1d4ed8' }}>Welcome to UPES! You are a new joinee. </span>
          <span style={{ fontSize:'13px', color:'#3b82f6' }}>Attendance & CGPA will appear once your 1st semester begins in May 2025.</span>
        </div>
      </div>

      {/* Fee paid banner */}
      <div className="fee-banner">
        <div className="fee-banner-top">
          <div>
            <div className="fee-banner-lbl">Total Fee Paid — Year 1</div>
            <div className="fee-banner-amt">₹5,60,500</div>
          </div>
          <div className="fee-paid-badge">
            <CheckCircle size={14}/> Fully Paid
          </div>
        </div>
        <div className="fee-rows">
          {feeBreakdown.map(({ label, amount }) => (
            <div key={label} className="fee-row-item">
              <div className="fee-row-lbl">{label}</div>
              <div className="fee-row-amt">₹{amount.toLocaleString('en-IN')}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions + Notices */}
      <div className="dash-two">
        <div className="dash-card">
          <h3 className="dash-card-title">Quick Actions</h3>
          <div className="dash-actions">
            {[
              { label:'My Documents', icon:FileText,   to:'/documents',    color:'#4f46e5' },
              { label:'Fee Receipts', icon:Receipt,    to:'/fee-receipts', color:'#059669' },
              { label:'My Courses',   icon:BookOpen,   to:'/courses',      color:'#0891b2' },
              { label:'Results',      icon:TrendingUp, to:'/results',      color:'#7c3aed' },
            ].map(({ label, icon:Icon, to, color }) => (
              <button key={label} onClick={() => navigate(to)}
                className="dash-act-btn"
                style={{ border:`1.5px solid ${color}22` }}>
                <div className="dash-act-icon" style={{ background:`${color}15` }}>
                  <Icon size={18} color={color}/>
                </div>
                <span className="dash-act-lbl">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="dash-card">
          <h3 className="dash-card-title">Notices & Alerts</h3>
          <div className="notice-list">
            {notices.map((n,i) => (
              <div key={i} className="notice-item">
                <n.icon size={15} color={n.color} style={{ flexShrink:0, marginTop:1 }}/>
                <span className="notice-txt">{n.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Semester subjects */}
      <div className="dash-card" style={{ marginBottom:'20px' }}>
        <h3 className="dash-card-title">📚 MBA Curriculum — All Semesters</h3>
        <div className="subjects-grid">
          {[
            { sem:'Semester 1', note:'May 2025 • Current', color:'#4f46e5', bg:'#eef2ff',
              subjects:['Organizational Behaviour','Marketing Management','Managerial Economics','Accounting for Managers','Quantitative Techniques','Business Communication','Introduction to Supply Chain','Operations Management','Business Environment'] },
            { sem:'Semester 2', note:'Nov 2025', color:'#0891b2', bg:'#e0f2fe',
              subjects:['Logistics Management','Inventory Management','Procurement & Sourcing','Transportation Management','Warehouse Management','Supply Chain Analytics','Research Methodology'] },
            { sem:'Semester 3', note:'May 2026', color:'#7c3aed', bg:'#f5f3ff',
              subjects:['Demand Planning & Forecasting','Lean Supply Chain','Global Logistics / International Trade','Supply Chain Strategy','Electives (Maritime / Energy Supply Chain)'] },
            { sem:'Semester 4', note:'Nov 2026 • Final', color:'#059669', bg:'#ecfdf5',
              subjects:['Supply Chain Risk Management','Innovation & Entrepreneurship','ESG (Environmental, Social, Governance)','Dissertation / Major Project'] },
          ].map(({ sem, note, color, bg, subjects }) => (
            <div key={sem} className="subject-card">
              <div className="subject-card-title">
                {sem}
                <span className="sem-badge" style={{ background:bg, color }}>{note}</span>
              </div>
              {subjects.map(s => (
                <div key={s} className="subject-item">
                  <div className="subject-dot" style={{ background:color }}/>
                  {s}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Academic details */}
      <div className="dash-card">
        <h3 className="dash-card-title">Academic Details</h3>
        <div className="info-grid">
          {[
            ['Roll Number', student?.rollNo],
            ['Program',     student?.program],
            ['School',      student?.school],
            ['Batch',       student?.batch],
            ['Semester',    student?.semester],
            ['Section',     student?.section],
            ['Email',       student?.email],
            ['Phone',       student?.phone],
            ['CGPA',        'Will update after Sem 1 exams'],
            ['Attendance',  'Classes begin May 2025'],
          ].map(([k,v]) => (
            <div key={k} className="info-row">
              <span className="info-key">{k}</span>
              <span className="info-val">{v||'—'}</span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
