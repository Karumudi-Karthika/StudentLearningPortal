import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface Progress {
  courseId: number;
  courseTitle: string;
  totalLessons: number;
  lessonsCompleted: number;
  isCompleted: boolean;
  percentage: number;
}

const ProgressPage: React.FC = () => {
  const [studentId, setStudentId] = useState('');
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProgress = () => {
    if (!studentId) return;
    setLoading(true);
    setError('');
    api.get(`/Students/${studentId}/progress`)
      .then(res => setProgress(res.data))
      .catch(() => setError('Student not found or has no enrollments.'))
      .finally(() => setLoading(false));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Progress Tracker</h1>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', marginBottom: '2rem' }}>
        <input
          type="number"
          placeholder="Enter Student ID"
          value={studentId}
          onChange={e => setStudentId(e.target.value)}
          style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem' }}
        />
        <button
          onClick={fetchProgress}
          style={{ padding: '0.5rem 1.5rem', background: '#0066cc', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem' }}
        >
          Load Progress
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {progress.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {progress.map(p => (
            <div key={p.courseId} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <h2 style={{ fontSize: '1.1rem' }}>{p.courseTitle}</h2>
                <span style={{
                  background: p.isCompleted ? '#d4edda' : '#fff3cd',
                  color: p.isCompleted ? '#155724' : '#856404',
                  padding: '2px 10px',
                  borderRadius: '12px',
                  fontSize: '0.85rem'
                }}>
                  {p.isCompleted ? 'Completed' : 'In Progress'}
                </span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.75rem' }}>
                {p.lessonsCompleted} of {p.totalLessons} lessons completed
              </p>
              <div style={{ background: '#eee', borderRadius: '999px', height: '10px' }}>
                <div style={{
                  width: `${p.percentage}%`,
                  background: p.isCompleted ? '#28a745' : '#0066cc',
                  height: '10px',
                  borderRadius: '999px',
                  transition: 'width 0.4s ease'
                }} />
              </div>
              <p style={{ fontSize: '0.85rem', color: '#444', marginTop: '0.4rem' }}>{p.percentage}%</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgressPage;
