import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Course } from '../types';
import Toast from '../components/Toast';
import useToast from '../components/useToast';

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrolling, setEnrolling] = useState<number | null>(null);
  const [unenrolling, setUnenrolling] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterEnrolled, setFilterEnrolled] = useState<'all' | 'enrolled' | 'not-enrolled'>('all');
  const { toast, showToast, hideToast } = useToast();
  const navigate = useNavigate();

  const studentId = localStorage.getItem('studentId');

  useEffect(() => {
    Promise.all([
      api.get('/Courses'),
      studentId ? api.get(`/Enrollments/${studentId}`) : Promise.resolve({ data: [] })
    ])
      .then(([coursesRes, enrollmentsRes]) => {
        setCourses(coursesRes.data);
        setEnrolledIds(enrollmentsRes.data.map((e: any) => e.courseId));
      })
      .catch(() => setError('Failed to load courses.'))
      .finally(() => setLoading(false));
  }, [studentId]);

  const handleEnroll = async (courseId: number) => {
    if (!studentId) { showToast('Please log in to enroll.', 'error'); return; }
    setEnrolling(courseId);
    try {
      await api.post('/Enrollments', { studentId: parseInt(studentId), courseId, lessonsCompleted: 0 });
      setEnrolledIds(prev => [...prev, courseId]);
      showToast('Successfully enrolled in course!', 'success');
    } catch (err: any) {
      if (err.response?.status === 409) {
        showToast('You are already enrolled in this course.', 'info');
      } else {
        showToast('Enrollment failed. Please try again.', 'error');
      }
    } finally {
      setEnrolling(null);
    }
  };

  const handleUnenroll = async (courseId: number) => {
    if (!studentId) return;
    setUnenrolling(courseId);
    setConfirmId(null);
    try {
      await api.delete(`/Enrollments/${studentId}/${courseId}`);
      setEnrolledIds(prev => prev.filter(id => id !== courseId));
      showToast('Successfully unenrolled from course.', 'info');
    } catch {
      showToast('Failed to unenroll. Please try again.', 'error');
    } finally {
      setUnenrolling(null);
    }
  };

  const categories = ['All', ...Array.from(new Set(courses.map(c => c.category)))];

  const filtered = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesEnrolled = filterEnrolled === 'all' ||
      (filterEnrolled === 'enrolled' && enrolledIds.includes(course.id)) ||
      (filterEnrolled === 'not-enrolled' && !enrolledIds.includes(course.id));
    return matchesSearch && matchesCategory && matchesEnrolled;
  });

  if (loading) return <p style={{ padding: '2rem' }}>Loading courses...</p>;
  if (error) return <p style={{ padding: '2rem', color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Available Courses</h1>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 2, minWidth: '200px', padding: '0.6rem 1rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem' }}
        />
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          style={{ flex: 1, minWidth: '140px', padding: '0.6rem 1rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem' }}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={filterEnrolled}
          onChange={e => setFilterEnrolled(e.target.value as any)}
          style={{ flex: 1, minWidth: '140px', padding: '0.6rem 1rem', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem' }}
        >
          <option value="all">All Courses</option>
          <option value="enrolled">Enrolled</option>
          <option value="not-enrolled">Not Enrolled</option>
        </select>
      </div>
      <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>
        Showing {filtered.length} of {courses.length} courses
        {search && ` for "${search}"`}
        {selectedCategory !== 'All' && ` in ${selectedCategory}`}
      </p>
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          <p style={{ fontSize: '1.1rem' }}>No courses found.</p>
          <button
            onClick={() => { setSearch(''); setSelectedCategory('All'); setFilterEnrolled('all'); }}
            style={{ marginTop: '1rem', padding: '0.5rem 1.5rem', background: '#0066cc', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            Clear filters
          </button>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {filtered.map(course => {
          const isEnrolled = enrolledIds.includes(course.id);
          const isConfirming = confirmId === course.id;
          return (
            <div key={course.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{course.title}</h2>
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{course.description}</p>
                <span style={{ background: '#e0f0ff', color: '#0066cc', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                  {course.category}
                </span>
                <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#444' }}>{course.totalLessons} lessons</p>
              </div>
              <div style={{ marginTop: '1rem' }}>
                {isEnrolled ? (
                  isConfirming ? (
                    <div style={{ background: '#fff3cd', border: '1px solid #ffc107', borderRadius: '6px', padding: '0.75rem' }}>
                      <p style={{ fontSize: '0.85rem', color: '#856404', marginBottom: '0.6rem' }}>
                        Are you sure you want to unenroll? Your progress will be lost.
                      </p>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleUnenroll(course.id)} disabled={unenrolling === course.id}
                          style={{ flex: 1, padding: '0.5rem', background: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                          {unenrolling === course.id ? 'Removing...' : 'Yes, unenroll'}
                        </button>
                        <button onClick={() => setConfirmId(null)}
                          style={{ flex: 1, padding: '0.5rem', background: '#e0e0e0', color: '#444', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => navigate(`/courses/${course.id}`)}
                        style={{ flex: 2, padding: '0.6rem', background: '#0066cc', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.95rem' }}>
                        Start Course →
                      </button>
                      <button onClick={() => setConfirmId(course.id)}
                        style={{ flex: 1, padding: '0.6rem', background: '#fff0f0', color: '#dc3545', border: '1px solid #dc3545', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                        Unenroll
                      </button>
                    </div>
                  )
                ) : (
                  <button onClick={() => handleEnroll(course.id)} disabled={enrolling === course.id}
                    style={{ width: '100%', padding: '0.6rem', background: '#0066cc', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.95rem' }}>
                    {enrolling === course.id ? 'Enrolling...' : 'Enroll'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {toast.visible && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  );
};

export default CoursesPage;
