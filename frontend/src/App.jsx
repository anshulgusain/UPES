import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import FeeReceipts from './pages/FeeReceipts';
import { Profile, Courses, Attendance, Results, Support } from './pages/OtherPages';

function PrivateRoute({ children }) {
  const { student, loading } = useAuth();
  if (loading) return <div style={loadingStyle}>Loading…</div>;
  return student ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { student, loading } = useAuth();
  if (loading) return <div style={loadingStyle}>Loading…</div>;
  return student ? <Navigate to="/dashboard" replace /> : children;
}

const loadingStyle = {
  minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: '#f1f5f9', fontSize: '16px', color: '#94a3b8',
  fontFamily: "'Segoe UI', system-ui, sans-serif",
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/documents" element={<PrivateRoute><Documents /></PrivateRoute>} />
          <Route path="/fee-receipts" element={<PrivateRoute><FeeReceipts /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/courses" element={<PrivateRoute><Courses /></PrivateRoute>} />
          <Route path="/attendance" element={<PrivateRoute><Attendance /></PrivateRoute>} />
          <Route path="/results" element={<PrivateRoute><Results /></PrivateRoute>} />
          <Route path="/support" element={<PrivateRoute><Support /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
