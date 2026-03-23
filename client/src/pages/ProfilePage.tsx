import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

interface QuizResult {
  quizId: number;
  quizTitle: string;
  courseTitle: string;
  score: number;
  totalMarks: number;
  percentage: number;
  takenAt: string;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const fullName = localStorage.getItem('fullName') || '';
  const studentId = localStorage.getItem('studentId') || '';
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const [progress, setProgress] = useState<Progress[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;
    Promise.all([
      api.get(`/Students/${studentId}/progress`),
      api.get(`/Quizzes/results/${studentId}`)
    ]).then(([progressRes, quizRes]) => {
      setProgress(progressRes.data);
      setQuizResults(quizRes.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [studentId]);

  const completed = progress.filter(p => p.isCompleted).length;
  const inProgress = progress.filter(p => !p.isCompleted && p.lessonsCompleted > 0).length;
  const avgQuizScore = quizResults.length > 0
    ? Math.round(quizResults.reduce((a, r) => a + r.percentage, 0) / quizResults.length)
    : 0;
  const bestScore = quizResults.length > 0
    ? Math.max(...quizResults.map(r => r.percentage))
    : 0;

  const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  if (loading) return <p style={{ padding: '2rem' }}>Loading profile...</p>;

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>

      {/* Profile header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', background: '#f8f9ff', borderRadius: '12px', padding: '1.5rem' }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: '#0066cc', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.8rem', fontWeight: 'bold', flexShrink: 0
        }}>
          {initials}
        </div>
        <div>
          <h1 style={{ fontSize: '1.6rem', marginBottom: '0.25rem' }}>{fullName}</h1>
          <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Student ID: {studentId}</p>
          <Badge label={isAdmin ? 'Admin' : 'Student'} type={isAdmin ? 'admin' : 'student'} />
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#f0f4ff', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.4rem' }}>Enrolled</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0066cc' }}>{progress.length}</p>
        </div>
        <div style={{ background: '#f0fff4', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.4rem' }}>Completed</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#155724' }}>{completed}</p>
        </div>
        <div style={{ background: '#fff3cd', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.4rem' }}>In Progress</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#856404' }}>{inProgress}</p>
        </div>
        <div style={{ background: '#f5f0ff', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.4rem' }}>Quiz Attempts</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#6f42c1' }}>{quizResults.length}</p>
        </div>
      </div>

      {/* Quiz stats */}
      {quizResults.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: '#f0fff4', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.4rem' }}>Average Quiz Score</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>{avgQuizScore}%</p>
          </div>
          <div style={{ background: '#fffaf0', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.4rem' }}>Best Quiz Score</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff9900' }}>{bestScore}%</p>
          </div>
        </div>
      )}

      {/* Course progress */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.2rem' }}>My Courses</h2>
          <button onClick={() => navigate('/courses')} style={{ background: 'none', border: 'none', color: '#0066cc', cursor: 'pointer', fontSize: '0.9rem' }}>
            Browse more →
          </button>
        </div>
        {progress.length === 0 ? (
          <p style={{ color: '#666', fontSize: '0.9rem' }}>No courses enrolled yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {progress.map(p => (
              <div
                key={p.courseId}
                onClick={() => navigate(`/courses/${p.courseId}`)}
                style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', cursor: 'pointer', transition: 'border-color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#0066cc')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#ddd')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '0.95rem' }}>{p.courseTitle}</h3>
                  <Badge label={p.isCompleted ? 'Completed' : 'In Progress'} type={p.isCompleted ? 'completed' : 'inprogress'} />
                </div>
                <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>
                  {p.lessonsCompleted} of {p.totalLessons} lessons
                </p>
                <div style={{ background: '#eee', borderRadius: '999px', height: '6px' }}>
                  <div style={{
                    width: `${p.percentage}%`,
                    background: p.isCompleted ? '#155724' : '#0066cc',
                    height: '6px', borderRadius: '999px'
                  }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quiz history */}
      {quizResults.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.2rem' }}>Quiz History</h2>
            <button onClick={() => navigate('/quizzes')} style={{ background: 'none', border: 'none', color: '#0066cc', cursor: 'pointer', fontSize: '0.9rem' }}>
              View all →
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {quizResults.slice(0, 3).map((r, i) => (
              <div key={i} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '0.95rem', fontWeight: 'bold' }}>{r.quizTitle}</p>
                  <p style={{ fontSize: '0.8rem', color: '#666' }}>{r.courseTitle} · {new Date(r.takenAt).toLocaleDateString()}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: r.percentage >= 80 ? '#155724' : r.percentage >= 50 ? '#856404' : '#721c24' }}>
                    {r.percentage}%
                  </p>
                  <p style={{ fontSize: '0.8rem', color: '#666' }}>{r.score}/{r.totalMarks}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
