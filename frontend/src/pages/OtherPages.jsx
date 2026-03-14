import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

function ComingSoon({ title }) {
  return (
    <Layout title={title}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '80px 20px', color: '#94a3b8',
        background: 'white', borderRadius: '14px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🚧</div>
        <h2 style={{ margin: '0 0 8px', color: '#1e293b', fontSize: '20px', fontWeight: 700 }}>{title}</h2>
        <p style={{ margin: 0, fontSize: '14px' }}>This section is coming soon. Stay tuned!</p>
      </div>
    </Layout>
  );
}

export function Profile() {
  const { student } = useAuth();
  return (
    <Layout title="My Profile">
      <div style={{
        background: 'white', borderRadius: '14px', padding: '32px',
        maxWidth: '600px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', fontWeight: 700, color: 'white',
          }}>
            {student?.name?.charAt(0)}
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#1e293b' }}>{student?.name}</h2>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '14px' }}>{student?.program}</p>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {Object.entries({
            'SAP ID': student?.sapId,
            'Roll Number': student?.rollNo,
            'Email': student?.email,
            'Phone': student?.phone,
            'School': student?.school,
            'Batch': student?.batch,
            'Semester': student?.semester,
            'Section': student?.section,
          }).map(([k, v]) => (
            <div key={k} style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '12px 14px', background: '#f8fafc', borderRadius: '10px',
            }}>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>{k}</span>
              <span style={{ fontSize: '13px', color: '#1e293b', fontWeight: 600 }}>{v || '—'}</span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export function Courses() { return <ComingSoon title="My Courses" />; }
export function Attendance() { return <ComingSoon title="Attendance" />; }
export function Results() { return <ComingSoon title="Results" />; }
export function Support() { return <ComingSoon title="Support" />; }
