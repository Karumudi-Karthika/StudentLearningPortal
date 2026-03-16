import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Course, Student } from '../types';

interface Stats {
  totalStudents: number;
  totalCourses: number;
  totalEnrollments: number;
}

const AdminDashboard: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<Stats>({ totalStudents: 0, totalCourses: 0, totalEnrollments: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'courses'>('overview');

  useEffect(() => {
    Promise.all([
      api.get('/Students'),
      api.get('/Courses')
    ]).then(([studentsRes, coursesRes]) => {
      setStudents(studentsRes.data);
      setCourses(coursesRes.data);
      setStats({
        totalStudents: studentsRes.data.length,
        totalCourses: coursesRes.data.length,
        totalEnrollments: studentsRes.data.reduce((acc: number, s: any) => acc + (s.enrollments?.length || 0), 0)
      });
    }).finally(() => setLoading(false));
  }, []);

  const tabStyle = (tab: string) => ({
    padding: '0.5rem 1.5rem',
    border: 'none',
    borderBottom: activeTab === tab ? '2px solid #0066cc' : '2px solid transparent',
    background: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    color: activeTab === tab ? '#0066cc' : '#666',
    fontWeight: activeTab === tab ? 'bold' : 'normal' as any
  });

  if (loading) return <p style={{ padding: '2rem' }}>Loading...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Admin Dashboard</h1>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ flex: 1, background: '#f0f4ff', borderRadius: '8px', padding: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Total Students</p>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#0066cc' }}>{stats.totalStudents}</p>
        </div>
        <div style={{ flex: 1, background: '#f0fff4', borderRadius: '8px', padding: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Total Courses</p>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#28a745' }}>{stats.totalCourses}</p>
        </div>
        <div style={{ flex: 1, background: '#fffaf0', borderRadius: '8px', padding: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Total Enrollments</p>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ff9900' }}>{stats.totalEnrollments}</p>
        </div>
      </div>

      <div style={{ borderBottom: '1px solid #ddd', marginBottom: '1.5rem' }}>
        <button style={tabStyle('overview')} onClick={() => setActiveTab('overview')}>Overview</button>
        <button style={tabStyle('students')} onClick={() => setActiveTab('students')}>Students</button>
        <button style={tabStyle('courses')} onClick={() => setActiveTab('courses')}>Courses</button>
      </div>

      {activeTab === 'overview' && (
        <div>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Recent Students</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>ID</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Name</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Email</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Role</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.75rem' }}>{s.id}</td>
                  <td style={{ padding: '0.75rem' }}>{s.fullName}</td>
                  <td style={{ padding: '0.75rem', color: '#666' }}>{s.email}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{
                      background: s.isAdmin ? '#d4edda' : '#e8f0fe',
                      color: s.isAdmin ? '#155724' : '#0066cc',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '0.8rem'
                    }}>
                      {s.isAdmin ? 'Admin' : 'Student'}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', color: '#666', fontSize: '0.9rem' }}>
                    {new Date(s.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'students' && (
        <div>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>All Students ({students.length})</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {students.map(s => (
              <div key={s.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1rem' }}>{s.fullName}</h3>
                  <span style={{
                    background: s.isAdmin ? '#d4edda' : '#e8f0fe',
                    color: s.isAdmin ? '#155724' : '#0066cc',
                    padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem'
                  }}>
                    {s.isAdmin ? 'Admin' : 'Student'}
                  </span>
                </div>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>{s.email}</p>
                <p style={{ color: '#999', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                  Joined {new Date(s.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'courses' && (
        <div>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>All Courses ({courses.length})</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {courses.map(c => (
              <div key={c.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1.25rem' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{c.title}</h3>
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{c.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                  <span style={{ background: '#e0f0ff', color: '#0066cc', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                    {c.category}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#444' }}>{c.totalLessons} lessons</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
