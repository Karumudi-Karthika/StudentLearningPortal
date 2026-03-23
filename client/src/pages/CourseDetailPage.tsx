import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Toast from '../components/Toast';
import useToast from '../components/useToast';

interface Lesson {
  id: number;
  courseId: number;
  title: string;
  content: string;
  order: number;
}

interface Enrollment {
  id: number;
  studentId: number;
  courseId: number;
  lessonsCompleted: number;
  isCompleted: boolean;
}

interface Quiz {
  id: number;
  courseId: number;
  title: string;
  totalMarks: number;
}

const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCompletion, setShowCompletion] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const studentId = localStorage.getItem('studentId');

  useEffect(() => {
    if (!courseId || !studentId) return;
    Promise.all([
      api.get(`/Lessons/course/${courseId}`),
      api.get(`/Enrollments/${studentId}`),
      api.get(`/Quizzes`)
    ]).then(([lessonsRes, enrollmentsRes, quizzesRes]) => {
      setLessons(lessonsRes.data);
      const found = enrollmentsRes.data.find((e: Enrollment) => e.courseId === parseInt(courseId));
      setEnrollment(found || null);
      if (found?.isCompleted) setShowCompletion(true);
      if (lessonsRes.data.length > 0) setActiveLesson(lessonsRes.data[0]);
      const courseQuizzes = quizzesRes.data.filter((q: Quiz) => q.courseId === parseInt(courseId));
      setQuizzes(courseQuizzes);
    }).finally(() => setLoading(false));
  }, [courseId, studentId]);

  const handleCompleteLesson = async () => {
    if (!enrollment || !activeLesson) return;
    const newCount = Math.max(enrollment.lessonsCompleted, activeLesson.order);
    try {
      const res = await api.put(
        `/Enrollments/${enrollment.id}/progress`,
        newCount,
        { headers: { 'Content-Type': 'application/json' } }
      );
      setEnrollment(res.data);
      if (res.data.isCompleted) {
        setShowCompletion(true);
      } else {
        showToast('Lesson marked as complete!', 'success');
        const nextLesson = lessons.find(l => l.order === activeLesson.order + 1);
        if (nextLesson) setActiveLesson(nextLesson);
      }
    } catch {
      showToast('Failed to update progress.', 'error');
    }
  };

  const isLessonCompleted = (lesson: Lesson) => enrollment ? lesson.order <= enrollment.lessonsCompleted : false;
  const isLessonLocked = (lesson: Lesson) => enrollment ? lesson.order > enrollment.lessonsCompleted + 1 : true;

  if (loading) return <p style={{ padding: '2rem' }}>Loading course...</p>;
  if (!enrollment) return (
    <div style={{ padding: '2rem' }}>
      <p>You are not enrolled in this course.</p>
      <button onClick={() => navigate('/courses')} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#0066cc', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
        Browse Courses
      </button>
    </div>
  );

  // Course completion screen
  if (showCompletion) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#155724' }}>Course Completed!</h1>
          <p style={{ color: '#666', fontSize: '1rem', marginBottom: '2rem' }}>
            Congratulations! You have completed all {lessons.length} lessons.
          </p>
          {quizzes.length > 0 && (
            <div style={{ background: '#f0fff4', border: '1px solid #c3e6cb', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <p style={{ color: '#155724', fontWeight: 'bold', marginBottom: '1rem' }}>Ready to test your knowledge?</p>
              {quizzes.map(quiz => (
                <button
                  key={quiz.id}
                  onClick={() => navigate(`/quiz/${quiz.id}`)}
                  style={{ width: '100%', padding: '0.75rem', background: '#0066cc', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem', marginBottom: '0.5rem' }}
                >
                  Take {quiz.title} →
                </button>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={() => setShowCompletion(false)}
              style={{ padding: '0.75rem 1.5rem', background: 'white', color: '#0066cc', border: '1px solid #0066cc', borderRadius: '6px', cursor: 'pointer' }}
            >
              Review Lessons
            </button>
            <button
              onClick={() => navigate('/courses')}
              style={{ padding: '0.75rem 1.5rem', background: '#0066cc', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            >
              Browse More Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>
      <div style={{ width: '300px', borderRight: '1px solid #ddd', overflowY: 'auto', padding: '1rem' }}>
        <button onClick={() => navigate('/courses')} style={{ background: 'none', border: 'none', color: '#0066cc', cursor: 'pointer', fontSize: '0.9rem', marginBottom: '1rem', padding: 0 }}>
          ← Back to Courses
        </button>
        <h2 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Lessons</h2>
        <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1rem' }}>
          {enrollment.lessonsCompleted} of {lessons.length} completed
        </p>
        <div style={{ background: '#eee', borderRadius: '999px', height: '6px', marginBottom: '1rem' }}>
          <div style={{
            width: `${lessons.length ? (enrollment.lessonsCompleted / lessons.length) * 100 : 0}%`,
            background: enrollment.isCompleted ? '#155724' : '#0066cc',
            height: '6px', borderRadius: '999px', transition: 'width 0.4s ease'
          }} />
        </div>
        {lessons.map(lesson => (
          <div
            key={lesson.id}
            onClick={() => !isLessonLocked(lesson) && setActiveLesson(lesson)}
            style={{
              padding: '0.75rem', borderRadius: '6px', marginBottom: '0.4rem',
              cursor: isLessonLocked(lesson) ? 'not-allowed' : 'pointer',
              background: activeLesson?.id === lesson.id ? '#e8f0fe' : 'transparent',
              border: activeLesson?.id === lesson.id ? '1px solid #0066cc' : '1px solid transparent',
              opacity: isLessonLocked(lesson) ? 0.4 : 1,
              display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}
          >
            <span style={{
              width: '20px', height: '20px', borderRadius: '50%',
              background: isLessonCompleted(lesson) ? '#155724' : activeLesson?.id === lesson.id ? '#0066cc' : '#ddd',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', flexShrink: 0
            }}>
              {isLessonCompleted(lesson) ? '✓' : lesson.order}
            </span>
            <span style={{ fontSize: '0.85rem', color: activeLesson?.id === lesson.id ? '#0066cc' : '#333' }}>
              {lesson.title}
            </span>
          </div>
        ))}

        {quizzes.length > 0 && (
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid #ddd', paddingTop: '1rem' }}>
            <h2 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Quizzes</h2>
            {quizzes.map(quiz => (
              <button
                key={quiz.id}
                onClick={() => enrollment.isCompleted && navigate(`/quiz/${quiz.id}`)}
                style={{
                  width: '100%', padding: '0.75rem', marginBottom: '0.5rem',
                  background: enrollment.isCompleted ? '#0066cc' : '#f0f0f0',
                  color: enrollment.isCompleted ? 'white' : '#888',
                  border: 'none', borderRadius: '6px',
                  cursor: enrollment.isCompleted ? 'pointer' : 'not-allowed',
                  fontSize: '0.85rem', textAlign: 'left'
                }}
              >
                {enrollment.isCompleted ? '📝' : '🔒'} {quiz.title}
              </button>
            ))}
            {!enrollment.isCompleted && (
              <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.5rem' }}>
                Complete all lessons to unlock quizzes.
              </p>
            )}
          </div>
        )}

        {enrollment.isCompleted && (
          <button
            onClick={() => setShowCompletion(true)}
            style={{ marginTop: '1rem', width: '100%', padding: '0.6rem', background: '#155724', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            🎉 View Completion
          </button>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
        {activeLesson && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.25rem' }}>Lesson {activeLesson.order} of {lessons.length}</p>
                <h1 style={{ fontSize: '1.6rem' }}>{activeLesson.title}</h1>
              </div>
              {isLessonCompleted(activeLesson) && (
                <span style={{ background: '#155724', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                  Completed ✓
                </span>
              )}
            </div>
            <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '2rem', marginBottom: '2rem', lineHeight: '1.8', fontSize: '1rem', color: '#333' }}>
              {activeLesson.content}
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {!isLessonCompleted(activeLesson) && (
                <button
                  onClick={handleCompleteLesson}
                  style={{ padding: '0.75rem 2rem', background: '#0066cc', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem' }}
                >
                  Mark as Complete →
                </button>
              )}
              {activeLesson.order < lessons.length && isLessonCompleted(activeLesson) && (
                <button
                  onClick={() => setActiveLesson(lessons.find(l => l.order === activeLesson.order + 1) || activeLesson)}
                  style={{ padding: '0.75rem 2rem', background: '#0066cc', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem' }}
                >
                  Next Lesson →
                </button>
              )}
              {activeLesson.order > 1 && (
                <button
                  onClick={() => setActiveLesson(lessons.find(l => l.order === activeLesson.order - 1) || activeLesson)}
                  style={{ padding: '0.75rem 2rem', background: 'white', color: '#0066cc', border: '1px solid #0066cc', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem' }}
                >
                  ← Previous
                </button>
              )}
            </div>
          </>
        )}
      </div>
      {toast.visible && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  );
};

export default CourseDetailPage;
