import React from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import ProgressPage from './pages/ProgressPage';
import QuizDashboard from './pages/QuizDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const fullName = localStorage.getItem('fullName');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav style={{ background: '#0066cc', padding: '1rem 2rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <Link to="/" style={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem', textDecoration: 'none' }}>Student Learning Portal</Link>
      {fullName && (
        <>
          <Link to="/courses" style={{ color: 'white', textDecoration: 'none' }}>Courses</Link>
          <Link to="/progress" style={{ color: 'white', textDecoration: 'none' }}>Progress</Link>
          <Link to="/quizzes" style={{ color: 'white', textDecoration: 'none' }}>Quiz Results</Link>
          {isAdmin && <Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>Admin</Link>}
        </>
      )}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {fullName ? (
          <>
            <span style={{ color: 'white', fontSize: '0.9rem' }}>Hi, {fullName}</span>
            <button
              onClick={handleLogout}
              style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', padding: '0.4rem 1rem', borderRadius: '6px', cursor: 'pointer' }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" style={{ color: 'white', textDecoration: 'none', background: 'rgba(255,255,255,0.2)', padding: '0.4rem 1rem', borderRadius: '6px' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/courses" element={<ProtectedRoute><CoursesPage /></ProtectedRoute>} />
        <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
        <Route path="/quizzes" element={<ProtectedRoute><QuizDashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
