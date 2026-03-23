import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Course {
  id: number;
  title: string;
  category: string;
  totalLessons: number;
}

interface QuizResult {
  quizId: number;
  quizTitle: string;
  score: number;
  totalMarks: number;
  percentage: number;
  takenAt: string;
}

const CertificatePage: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const fullName = localStorage.getItem('fullName') || '';
  const studentId = localStorage.getItem('studentId') || '';
  const [course, setCourse] = useState<Course | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId || !studentId) return;
    Promise.all([
      api.get(`/Courses/${courseId}`),
      api.get(`/Quizzes/results/${studentId}`)
    ]).then(([courseRes, resultsRes]) => {
      setCourse(courseRes.data);
      const results = resultsRes.data.filter((r: QuizResult & { courseTitle: string }) =>
        r.courseTitle === courseRes.data.title
      );
      if (results.length > 0) {
        const best = results.reduce((a: QuizResult, b: QuizResult) => a.percentage > b.percentage ? a : b);
        setQuizResult(best);
      }
    }).finally(() => setLoading(false));
  }, [courseId, studentId]);

  const handlePrint = () => window.print();

  if (loading) return <p style={{ padding: '2rem' }}>Loading certificate...</p>;
  if (!course) return <p style={{ padding: '2rem' }}>Course not found.</p>;

  const today = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div>
      {/* Print/download buttons - hidden when printing */}
      <div className="no-print" style={{ padding: '1rem 2rem', display: 'flex', gap: '1rem', background: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
        <button
          onClick={handlePrint}
          style={{ padding: '0.6rem 1.5rem', background: '#0066cc', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.95rem' }}
        >
          🖨️ Print / Save as PDF
        </button>
        <button
          onClick={() => navigate('/courses')}
          style={{ padding: '0.6rem 1.5rem', background: 'white', color: '#0066cc', border: '1px solid #0066cc', borderRadius: '6px', cursor: 'pointer', fontSize: '0.95rem' }}
        >
          ← Back to Courses
        </button>
      </div>

      {/* Certificate */}
      <div style={{
        maxWidth: '800px', margin: '2rem auto', padding: '3rem',
        border: '8px solid #0066cc', borderRadius: '4px',
        position: 'relative', background: 'white',
        boxShadow: '0 4px 24px rgba(0,0,0,0.1)'
      }}>
        {/* Inner border */}
        <div style={{
          position: 'absolute', top: '12px', left: '12px', right: '12px', bottom: '12px',
          border: '2px solid #0066cc', borderRadius: '2px', pointerEvents: 'none'
        }} />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎓</div>
          <h1 style={{ fontSize: '1rem', letterSpacing: '4px', color: '#0066cc', fontWeight: 'normal', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Student Learning Portal
          </h1>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1a1a1a', margin: '0.5rem 0' }}>
            Certificate of Completion
          </h2>
          <div style={{ width: '80px', height: '3px', background: '#0066cc', margin: '0 auto' }} />
        </div>

        {/* Body */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p style={{ fontSize: '1rem', color: '#666', marginBottom: '0.5rem' }}>This is to certify that</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0066cc', fontStyle: 'italic', marginBottom: '0.5rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem', display: 'inline-block', minWidth: '300px' }}>
            {fullName}
          </p>
          <p style={{ fontSize: '1rem', color: '#666', margin: '1rem 0 0.5rem' }}>has successfully completed the course</p>
          <p style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '0.5rem' }}>
            {course.title}
          </p>
          <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1.5rem' }}>
            {course.totalLessons} lessons · {course.category}
          </p>

          {quizResult && (
            <div style={{ display: 'inline-block', background: '#f0f4ff', border: '1px solid #c8d8f8', borderRadius: '8px', padding: '0.75rem 2rem', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.25rem' }}>Final Quiz Score</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0066cc' }}>{quizResult.percentage}%</p>
              <p style={{ fontSize: '0.8rem', color: '#888' }}>{quizResult.score} / {quizResult.totalMarks} marks</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #eee' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '150px', borderBottom: '1px solid #333', marginBottom: '0.4rem' }} />
            <p style={{ fontSize: '0.8rem', color: '#666' }}>Date of Completion</p>
            <p style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{today}</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem' }}>⭐</div>
            <p style={{ fontSize: '0.75rem', color: '#888' }}>Student ID: {studentId}</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '150px', borderBottom: '1px solid #333', marginBottom: '0.4rem' }} />
            <p style={{ fontSize: '0.8rem', color: '#666' }}>Authorized By</p>
            <p style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Student Learning Portal</p>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; }
        }
      `}</style>
    </div>
  );
};

export default CertificatePage;
