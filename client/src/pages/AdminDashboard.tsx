import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Course, Student } from '../types';
import Badge from '../components/Badge';

const AdminDashboard: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'courses' | 'add'>('overview');
  const [newCourse, setNewCourse] = useState({ title: '', description: '', category: '', totalLessons: '' });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    Promise.all([api.get('/Students'), api.get('/Courses')])
      .then(([s, c]) => { setStudents(s.data); setCourses(c.data); })
      .finally(() => setLoading(false));
  }, []);

  const handleAddCourse = async () => {
    if (!newCourse.title || !newCourse.description || !newCourse.category || !newCourse.totalLessons) {
      setSaveMsg('Please fill in all fields.');
      return;
    }
    setSaving(true);
    setSaveMsg('');
    try {
      const res = await api.post('/Courses', {
        title: newCourse.title,
        description: newCourse.description,
        category: newCourse.category,
        totalLessons: parseInt(newCourse.totalLessons)
      });
      setCourses(prev => [...prev, res.data]);
      setNewCourse({ title: '', description: '', category: '', totalLessons: '' });
      setSaveMsg('Course added successfully!');
      setActiveTab('courses');
    } catch {
      setSaveMsg('Failed to add course.');
    } finally {
      setSaving(false);
    }
  };

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

  const inputStyle = {
    width: '100%',
    padding: '0.6rem 0.8rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    boxSizing: 'border-box' as any,
    marginBottom: '1rem'
  };

  if (loading) return <p style={{ padding: '2rem' }}>Loading...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Admin Dashboard</h1>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ flex: 1, background: '#f0f4ff', borderRadius: '8px', padding: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Total Students</p>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#0066cc' }}>{students.length}</p>
        </div>
        <div style={{ flex: 1, background: '#f0fff4', borderRadius: '8px', padding: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Total Courses</p>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#28a745' }}>{courses.length}</p>
        </div>
      </div>

      <div style={{ borderBottom: '1px solid #ddd', marginBottom: '1.5rem' }}>
        <button style={tabStyle('overview')} onClick={() => setActiveTab('overview')}>Overview</button>
        <button style={tabStyle('students')} onClick={() => setActiveTab('students')}>Students</button>
        <button style={tabStyle('courses')} onClick={() => setActiveTab('courses')}>Courses</button>
        <button style={tabStyle('add')} onClick={() => setActiveTab('add')}>+ Add Course</button>
      </div>

      {activeTab === 'overview' && (
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
                  <Badge label={s.isAdmin ? 'Admin' : 'Student'} type={s.isAdmin ? 'admin' : 'student'} />
                </td>
                <td style={{ padding: '0.75rem', color: '#666', fontSize: '0.9rem' }}>{new Date(s.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeTab === 'students' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {students.map(s => (
            <div key={s.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1rem' }}>{s.fullName}</h3>
                <Badge label={s.isAdmin ? 'Admin' : 'Student'} type={s.isAdmin ? 'admin' : 'student'} />
              </div>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>{s.email}</p>
              <p style={{ color: '#999', fontSize: '0.8rem', marginTop: '0.5rem' }}>Joined {new Date(s.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'courses' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {courses.map(c => (
            <div key={c.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{c.title}</h3>
              <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{c.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                <span style={{ background: '#e0f0ff', color: '#0066cc', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{c.category}</span>
                <span style={{ fontSize: '0.85rem', color: '#444' }}>{c.totalLessons} lessons</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'add' && (
        <div style={{ maxWidth: '500px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Add New Course</h2>
          {saveMsg && (
            <p style={{ marginBottom: '1rem', color: saveMsg.includes('successfully') ? '#28a745' : 'red', fontSize: '0.9rem' }}>
              {saveMsg}
            </p>
          )}
          <label style={{ fontSize: '0.85rem', color: '#444' }}>Course Title</label>
          <input style={inputStyle} value={newCourse.title} onChange={e => setNewCourse(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Introduction to React" />
          <label style={{ fontSize: '0.85rem', color: '#444' }}>Description</label>
          <input style={inputStyle} value={newCourse.description} onChange={e => setNewCourse(p => ({ ...p, description: e.target.value }))} placeholder="Short description" />
          <label style={{ fontSize: '0.85rem', color: '#444' }}>Category</label>
          <input style={inputStyle} value={newCourse.category} onChange={e => setNewCourse(p => ({ ...p, category: e.target.value }))} placeholder="e.g. Programming" />
          <label style={{ fontSize: '0.85rem', color: '#444' }}>Total Lessons</label>
          <input style={inputStyle} type="number" value={newCourse.totalLessons} onChange={e => setNewCourse(p => ({ ...p, totalLessons: e.target.value }))} placeholder="e.g. 12" />
          <button
            onClick={handleAddCourse}
            disabled={saving}
            style={{ padding: '0.75rem 2rem', background: '#0066cc', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem' }}
          >
            {saving ? 'Adding...' : 'Add Course'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
