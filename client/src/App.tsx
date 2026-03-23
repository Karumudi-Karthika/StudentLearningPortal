import React from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import ProgressPage from './pages/ProgressPage';
import QuizDashboard from './pages/QuizDashboard';
import QuizPage from './pages/QuizPage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CertificatePage from './pages/CertificatePage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProtectedRoute from './components/ProtectedRoute';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const fullName = localStorage.getItem('fullName');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const initials = fullName ? fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '';

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
          <Link to="/leaderboard" style={{ color: 'white', textDecoration: 'none' }}>🏆 Leaderboard</Link>
          {isAdmin && <Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>Admin</Link>}
        </>
      )}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {fullName ? (
          <>
            <Link to="/profile" style={{ textDecoration: 'none' }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.25)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer'
              }}>
                {initials}
              </div>
            </Link>
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
        <Route path="/courses/:courseId" element={<ProtectedRoute><CourseDetailPage /></ProtectedRoute>} />
        <Route path="/quiz/:quizId" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
        <Route path="/certificate/:courseId" element={<ProtectedRoute><CertificatePage /></ProtectedRoute>} />
        <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
        <Route path="/quizzes" element={<ProtectedRoute><QuizDashboard /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
