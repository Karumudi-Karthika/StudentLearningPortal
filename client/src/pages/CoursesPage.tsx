import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Course } from '../types';

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/Courses')
      .then(res => setCourses(res.data))
      .catch(() => setError('Failed to load courses.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: '2rem' }}>Loading courses...</p>;
  if (error) return <p style={{ padding: '2rem', color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Available Courses</h1>
      {courses.length === 0 && <p>No courses found.</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
        {courses.map(course => (
          <div key={course.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{course.title}</h2>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{course.description}</p>
            <span style={{ background: '#e0f0ff', color: '#0066cc', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
              {course.category}
            </span>
            <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#444' }}>
              {course.totalLessons} lessons
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;
