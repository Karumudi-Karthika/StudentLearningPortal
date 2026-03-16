import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import CoursesPage from './pages/CoursesPage';
import ProgressPage from './pages/ProgressPage';
import QuizDashboard from './pages/QuizDashboard';
import AdminDashboard from './pages/AdminDashboard';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <nav style={{ background: '#0066cc', padding: '1rem 2rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>Student Learning Portal</span>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Courses</Link>
        <Link to="/progress" style={{ color: 'white', textDecoration: 'none' }}>Progress</Link>
        <Link to="/quizzes" style={{ color: 'white', textDecoration: 'none' }}>Quiz Results</Link>
        <Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>Admin</Link>
      </nav>
      <Routes>
        <Route path="/" element={<CoursesPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/quizzes" element={<QuizDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
