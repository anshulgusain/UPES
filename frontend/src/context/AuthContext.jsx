import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('upes_token');
    const savedStudent = localStorage.getItem('upes_student');
    if (token && savedStudent) {
      setStudent(JSON.parse(savedStudent));
    }
    setLoading(false);
  }, []);

  const login = async (sapId, password) => {
    const res = await apiLogin(sapId, password);
    localStorage.setItem('upes_token', res.data.token);
    localStorage.setItem('upes_student', JSON.stringify(res.data.student));
    setStudent(res.data.student);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('upes_token');
    localStorage.removeItem('upes_student');
    setStudent(null);
  };

  return (
    <AuthContext.Provider value={{ student, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
