import React, { useState } from 'react';
import api from '../services/api';

interface QuizResult {
  quizId: number;
  quizTitle: string;
  courseTitle: string;
  score: number;
  totalMarks: number;
  percentage: number;
  takenAt: string;
}

const QuizDashboard: React.FC = () => {
  const [studentId, setStudentId] = useState('');
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchResults = () => {
    if (!studentId) return;
    setLoading(true);
    setError('');
    api.get(`/Quizzes/results/${studentId}`)
      .then(res => setResults(res.data))
      .catch(() => setError('No results found for this student.'))
      .finally(() => setLoading(false));
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return '#28a745';
    if (percentage >= 50) return '#ffc107';
    return '#dc3545';
  };

  const getScoreBadge = (percentage: number) => {
    if (percentage >= 80) return { bg: '#d4edda', color: '#155724', label: 'Excellent' };
    if (percentage >= 50) return { bg: '#fff3cd', color: '#856404', label: 'Pass' };
    return { bg: '#f8d7da', color: '#721c24', label: 'Needs Work' };
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Quiz Results Dashboard</h1>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', marginBottom: '2rem' }}>
        <input
          type="number"
          placeholder="Enter Student ID"
          value={studentId}
          onChange={e => setStudentId(e.target.value)}
          style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem' }}
        />
        <button
          onClick={fetchResults}
          style={{ padding: '0.5rem 1.5rem', background: '#0066cc', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem' }}
        >
          Load Results
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {results.length > 0 && (
        <>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ flex: 1, background: '#f0f4ff', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.85rem', color: '#666' }}>Total Quizzes</p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0066cc' }}>{results.length}</p>
            </div>
            <div style={{ flex: 1, background: '#f0fff4', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.85rem', color: '#666' }}>Average Score</p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>
                {Math.round(results.reduce((a, r) => a + r.percentage, 0) / results.length)}%
              </p>
            </div>
            <div style={{ flex: 1, background: '#fffaf0', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.85rem', color: '#666' }}>Best Score</p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff9900' }}>
                {Math.max(...results.map(r => r.percentage))}%
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {results.map(r => {
              const badge = getScoreBadge(r.percentage);
              return (
                <div key={r.quizId} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div>
                      <h2 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>{r.quizTitle}</h2>
                      <p style={{ fontSize: '0.85rem', color: '#666' }}>{r.courseTitle}</p>
                    </div>
                    <span style={{ background: badge.bg, color: badge.color, padding: '2px 12px', borderRadius: '12px', fontSize: '0.85rem', height: 'fit-content' }}>
                      {badge.label}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.75rem' }}>
                    <div style={{ flex: 1, background: '#eee', borderRadius: '999px', height: '10px' }}>
                      <div style={{
                        width: `${r.percentage}%`,
                        background: getScoreColor(r.percentage),
                        height: '10px',
                        borderRadius: '999px',
                        transition: 'width 0.4s ease'
                      }} />
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold', minWidth: '80px' }}>
                      {r.score} / {r.totalMarks} ({r.percentage}%)
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem' }}>
                    Taken: {new Date(r.takenAt).toLocaleDateString()}
                  </p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default QuizDashboard;
