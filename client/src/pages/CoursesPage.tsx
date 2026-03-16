import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Course } from '../types';

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrolling, setEnrolling] = useState<number | null>(null);
  const [messages, setMessages] = useState<{ [key: number]: string }>({});

  const studentId = localStorage.getItem('studentId');

  useEffect(() => {
    api.get('/Courses')
      .then(res => setCourses(res.data))
      .catch(() => setError('Failed to load courses.'))
      .finally(() => setLoading(false));
  }, []);

  const handleEnroll = async (courseId: number) => {
    if (!studentId) {
      setMessages(prev => ({ ...prev, [courseId]: 'Please log in to enroll.' }));
      return;
    }
    setEnrolling(courseId);
    try {
      await api.post('/Enrollments', {
        studentId: parseInt(studentId),
        courseId,
        lessonsCompleted: 0
      });
      setMessages(prev => ({ ...prev, [courseId]: 'Enrolled successfully!' }));
    } catch (err: any) {
      if (err.response?.status === 409) {
        setMessages(prev => ({ ...prev, [courseId]: 'Already enrolled.' }));
      } else {
        setMessages(prev => ({ ...prev, [courseId]: 'Enrollment failed.' }));
      }
    } finally {
      setEnrolling(null);
    }
  };

  if (loading) return <p style={{ padding: '2rem' }}>Loading courses...</p>;
  if (error) return <p style={{ padding: '2rem', color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Available Courses</h1>
      {courses.length === 0 && <p>No courses found.</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
        {courses.map(course => (
          <div key={course.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{course.title}</h2>
              <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{course.description}</p>
              <span style={{ background: '#e0f0ff', color: '#0066cc', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                {course.category}
              </span>
              <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#444' }}>
                {course.totalLessons} lessons
              </p>
            </div>
            <div style={{ marginTop: '1rem' }}>
              {messages[course.id] && (
                <p style={{
                  fontSize: '0.85rem',
                  marginBottom: '0.5rem',
                  color: messages[course.id] === 'Enrolled successfully!' ? '#28a745' : '#cc0000'
                }}>
                  {messages[course.id]}
                </p>
              )}
              <button
                onClick={() => handleEnroll(course.id)}
                disabled={enrolling === course.id || messages[course.id] === 'Enrolled successfully!' || messages[course.id] === 'Already enrolled.'}
                style={{
                  width: '100%',
                  padding: '0.6rem',
                  background: messages[course.id] === 'Enrolled successfully!' || messages[course.id] === 'Already enrolled.' ? '#e0e0e0' : '#0066cc',
                  color: messages[course.id] === 'Enrolled successfully!' || messages[course.id] === 'Already enrolled.' ? '#888' : 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: enrolling === course.id ? 'wait' : 'pointer',
                  fontSize: '0.95rem'
                }}
              >
                {enrolling === course.id ? 'Enrolling...' :
                  messages[course.id] === 'Enrolled successfully!' ? 'Enrolled ✓' :
                  messages[course.id] === 'Already enrolled.' ? 'Already enrolled' :
                  'Enroll'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;
