import React from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import CoursesPage from './pages/CoursesPage';
import ProgressPage from './pages/ProgressPage';
import QuizDashboard from './pages/QuizDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

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
      <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>Student Learning Portal</span>
      {fullName && (
        <>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Courses</Link>
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
        <Route path="/" element={<CoursesPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/quizzes" element={<QuizDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
