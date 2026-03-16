import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Badge from '../components/Badge';

interface Progress {
  courseId: number;
  courseTitle: string;
  totalLessons: number;
  lessonsCompleted: number;
  isCompleted: boolean;
  percentage: number;
}

const HomePage: React.FC = () => {
  const fullName = localStorage.getItem('fullName');
  const studentId = localStorage.getItem('studentId');
  const [progress, setProgress] = useState<Progress[]>([]);
  const [totalCourses, setTotalCourses] = useState(0);

  useEffect(() => {
    if (!studentId) return;
    Promise.all([
      api.get(`/Students/${studentId}/progress`),
      api.get('/Courses')
    ]).then(([progressRes, coursesRes]) => {
      setProgress(progressRes.data);
      setTotalCourses(coursesRes.data.length);
    }).catch(() => {});
  }, [studentId]);

  const completed = progress.filter(p => p.isCompleted).length;
  const inProgress = progress.filter(p => !p.isCompleted && p.lessonsCompleted > 0).length;

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Welcome back, {fullName}! 👋</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Here's an overview of your learning journey.</p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem' }}>
        <div style={{ flex: 1, background: '#f0f4ff', borderRadius: '8px', padding: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Enrolled Courses</p>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#0066cc' }}>{progress.length}</p>
        </div>
        <div style={{ flex: 1, background: '#f0fff4', borderRadius: '8px', padding: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Completed</p>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#155724' }}>{completed}</p>
        </div>
        <div style={{ flex: 1, background: '#fff3cd', borderRadius: '8px', padding: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>In Progress</p>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#856404' }}>{inProgress}</p>
        </div>
        <div style={{ flex: 1, background: '#f5f0ff', borderRadius: '8px', padding: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Available Courses</p>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#6f42c1' }}>{totalCourses}</p>
        </div>
      </div>

      {progress.length > 0 && (
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.2rem' }}>Continue Learning</h2>
            <Link to="/progress" style={{ color: '#0066cc', fontSize: '0.9rem', textDecoration: 'none' }}>View all →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {progress.slice(0, 3).map(p => (
              <div key={p.courseId} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1rem' }}>{p.courseTitle}</h3>
                  <Badge label={p.isCompleted ? 'Completed' : 'In Progress'} type={p.isCompleted ? 'completed' : 'inprogress'} />
                </div>
                <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>
                  {p.lessonsCompleted} of {p.totalLessons} lessons
                </p>
                <div style={{ background: '#eee', borderRadius: '999px', height: '8px' }}>
                  <div style={{
                    width: `${p.percentage}%`,
                    background: p.isCompleted ? '#155724' : '#856404',
                    height: '8px', borderRadius: '999px', transition: 'width 0.4s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Quick Links</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/courses" style={{ flex: 1, background: '#0066cc', color: 'white', padding: '1rem', borderRadius: '8px', textDecoration: 'none', textAlign: 'center', fontSize: '0.95rem' }}>
            Browse Courses
          </Link>
          <Link to="/progress" style={{ flex: 1, background: '#28a745', color: 'white', padding: '1rem', borderRadius: '8px', textDecoration: 'none', textAlign: 'center', fontSize: '0.95rem' }}>
            My Progress
          </Link>
          <Link to="/quizzes" style={{ flex: 1, background: '#ff9900', color: 'white', padding: '1rem', borderRadius: '8px', textDecoration: 'none', textAlign: 'center', fontSize: '0.95rem' }}>
            Quiz Results
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
