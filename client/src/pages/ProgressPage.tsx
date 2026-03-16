import React, { useEffect, useState } from 'react';
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

const ProgressPage: React.FC = () => {
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const studentId = localStorage.getItem('studentId');

  useEffect(() => {
    if (!studentId) return;
    api.get(`/Students/${studentId}/progress`)
      .then(res => setProgress(res.data))
      .catch(() => setError('Failed to load progress.'))
      .finally(() => setLoading(false));
  }, [studentId]);

  if (loading) return <p style={{ padding: '2rem' }}>Loading progress...</p>;
  if (error) return <p style={{ padding: '2rem', color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>My Progress</h1>
      {progress.length === 0 && (
        <p style={{ color: '#666', marginTop: '1rem' }}>You have not enrolled in any courses yet.</p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
        {progress.map(p => (
          <div key={p.courseId} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h2 style={{ fontSize: '1.1rem' }}>{p.courseTitle}</h2>
              <Badge label={p.isCompleted ? 'Completed' : 'In Progress'} type={p.isCompleted ? 'completed' : 'inprogress'} />
            </div>
            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.75rem' }}>
              {p.lessonsCompleted} of {p.totalLessons} lessons completed
            </p>
            <div style={{ background: '#eee', borderRadius: '999px', height: '10px' }}>
              <div style={{
                width: `${p.percentage}%`,
                background: p.isCompleted ? '#155724' : '#856404',
                height: '10px', borderRadius: '999px', transition: 'width 0.4s ease'
              }} />
            </div>
            <p style={{ fontSize: '0.85rem', color: '#444', marginTop: '0.4rem' }}>{p.percentage}%</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressPage;
