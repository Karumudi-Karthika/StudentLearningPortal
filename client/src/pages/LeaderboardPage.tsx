import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface LeaderboardEntry {
  studentId: number;
  fullName: string;
  totalAttempts: number;
  averageScore: number;
  bestScore: number;
  coursesCompleted: number;
}

const LeaderboardPage: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const currentStudentId = localStorage.getItem('studentId');

  useEffect(() => {
    api.get('/Leaderboard')
      .then(res => setEntries(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getMedal = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  const getRowBg = (index: number, isCurrentStudent: boolean) => {
    if (isCurrentStudent) return '#e8f0fe';
    if (index === 0) return '#fffbea';
    if (index === 1) return '#f5f5f5';
    if (index === 2) return '#fff5f0';
    return 'white';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#155724';
    if (score >= 50) return '#856404';
    return '#721c24';
  };

  if (loading) return <p style={{ padding: '2rem' }}>Loading leaderboard...</p>;

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ fontSize: '2.5rem' }}>🏆</div>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>Leaderboard</h1>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Top quiz performers across all courses</p>
        </div>
      </div>

      {entries.length === 0 ? (
        <p style={{ color: '#666' }}>No quiz results yet. Be the first to take a quiz!</p>
      ) : (
        <>
          {entries.length >= 3 && (
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'flex-end' }}>
              <div style={{ flex: 1, textAlign: 'center', background: '#f5f5f5', borderRadius: '8px', padding: '1.5rem 1rem', border: '1px solid #ddd' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🥈</div>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#888', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold', margin: '0 auto 0.5rem' }}>
                  {entries[1].fullName[0].toUpperCase()}
                </div>
                <p style={{ fontWeight: 'bold', fontSize: '0.95rem', marginBottom: '0.25rem' }}>{entries[1].fullName}</p>
                <p style={{ fontSize: '1.3rem', fontWeight: 'bold', color: getScoreColor(entries[1].averageScore) }}>{entries[1].averageScore}%</p>
                <p style={{ fontSize: '0.75rem', color: '#666' }}>avg score</p>
              </div>
              <div style={{ flex: 1, textAlign: 'center', background: '#fffbea', borderRadius: '8px', padding: '2rem 1rem', border: '2px solid #ffc107' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🥇</div>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#ffc107', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 'bold', margin: '0 auto 0.5rem' }}>
                  {entries[0].fullName[0].toUpperCase()}
                </div>
                <p style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.25rem' }}>{entries[0].fullName}</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getScoreColor(entries[0].averageScore) }}>{entries[0].averageScore}%</p>
                <p style={{ fontSize: '0.75rem', color: '#666' }}>avg score</p>
              </div>
              <div style={{ flex: 1, textAlign: 'center', background: '#fff5f0', borderRadius: '8px', padding: '1.25rem 1rem', border: '1px solid #ffccbc' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🥉</div>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#ff7043', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 'bold', margin: '0 auto 0.5rem' }}>
                  {entries[2].fullName[0].toUpperCase()}
                </div>
                <p style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{entries[2].fullName}</p>
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: getScoreColor(entries[2].averageScore) }}>{entries[2].averageScore}%</p>
                <p style={{ fontSize: '0.75rem', color: '#666' }}>avg score</p>
              </div>
            </div>
          )}

          <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.85rem', color: '#666' }}>Rank</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.85rem', color: '#666' }}>Student</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.85rem', color: '#666' }}>Avg Score</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.85rem', color: '#666' }}>Best Score</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.85rem', color: '#666' }}>Attempts</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.85rem', color: '#666' }}>Courses Done</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, index) => {
                  const isCurrentStudent = entry.studentId.toString() === currentStudentId;
                  return (
                    <tr key={entry.studentId} style={{ background: getRowBg(index, isCurrentStudent), borderTop: '1px solid #eee' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 'bold', fontSize: '1.1rem' }}>{getMedal(index)}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: isCurrentStudent ? '#0066cc' : '#888', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 'bold', flexShrink: 0 }}>
                            {entry.fullName[0].toUpperCase()}
                          </div>
                          <div>
                            <p style={{ fontWeight: isCurrentStudent ? 'bold' : 'normal', fontSize: '0.95rem' }}>{entry.fullName}</p>
                            {isCurrentStudent && <p style={{ fontSize: '0.75rem', color: '#0066cc' }}>You</p>}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 'bold', color: getScoreColor(entry.averageScore) }}>{entry.averageScore}%</td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'center', color: getScoreColor(entry.bestScore) }}>{entry.bestScore}%</td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'center', color: '#666' }}>{entry.totalAttempts}</td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                        <span style={{ background: '#e0f0ff', color: '#0066cc', padding: '2px 10px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                          {entry.coursesCompleted}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default LeaderboardPage;
