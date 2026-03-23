import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Question {
  id: number;
  quizId: number;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  order: number;
}

interface QuizInfo {
  id: number;
  title: string;
  totalMarks: number;
}

interface Result {
  score: number;
  totalMarks: number;
  correct: number;
  total: number;
  percentage: number;
}

const QuizPage: React.FC = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<QuizInfo | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const studentId = localStorage.getItem('studentId');

  useEffect(() => {
    if (!quizId) return;
    Promise.all([
      api.get(`/Quizzes`),
      api.get(`/Questions/quiz/${quizId}`)
    ]).then(([quizzesRes, questionsRes]) => {
      const found = quizzesRes.data.find((q: QuizInfo) => q.id === parseInt(quizId));
      setQuiz(found || null);
      setQuestions(questionsRes.data);
    }).finally(() => setLoading(false));
  }, [quizId]);

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    if (!studentId || !quizId) return;
    setSubmitting(true);
    try {
      const submission = {
        studentId: parseInt(studentId),
        quizId: parseInt(quizId),
        answers: Object.entries(answers).map(([questionId, selectedAnswer]) => ({
          questionId: parseInt(questionId),
          selectedAnswer
        }))
      };
      const res = await api.post('/Questions/submit', submission);
      setResult(res.data);
    } catch {
      alert('Failed to submit quiz.');
    } finally {
      setSubmitting(false);
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return '#155724';
    if (percentage >= 50) return '#856404';
    return '#721c24';
  };

  const getScoreBg = (percentage: number) => {
    if (percentage >= 80) return '#d4edda';
    if (percentage >= 50) return '#fff3cd';
    return '#f8d7da';
  };

  if (loading) return <p style={{ padding: '2rem' }}>Loading quiz...</p>;
  if (!quiz) return <p style={{ padding: '2rem' }}>Quiz not found.</p>;
  if (questions.length === 0) return <p style={{ padding: '2rem' }}>No questions available.</p>;

  const currentQuestion = questions[current];
  const answered = Object.keys(answers).length;
  const options = ['A', 'B', 'C', 'D'];
  const optionTexts: { [key: string]: string } = {
    A: currentQuestion.optionA,
    B: currentQuestion.optionB,
    C: currentQuestion.optionC,
    D: currentQuestion.optionD
  };

  if (result) {
    return (
      <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ background: getScoreBg(result.percentage), border: `1px solid`, borderRadius: '12px', padding: '2rem', textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', color: getScoreColor(result.percentage), marginBottom: '0.5rem' }}>
            {result.percentage >= 80 ? '🎉 Excellent!' : result.percentage >= 50 ? '👍 Good effort!' : '📚 Keep studying!'}
          </h1>
          <p style={{ fontSize: '3rem', fontWeight: 'bold', color: getScoreColor(result.percentage), margin: '1rem 0' }}>
            {result.percentage}%
          </p>
          <p style={{ color: getScoreColor(result.percentage), fontSize: '1.1rem' }}>
            {result.score} / {result.totalMarks} marks — {result.correct} of {result.total} correct
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => navigate('/quizzes')}
            style={{ flex: 1, padding: '0.75rem', background: '#0066cc', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem' }}
          >
            View All Results
          </button>
          <button
            onClick={() => navigate('/courses')}
            style={{ flex: 1, padding: '0.75rem', background: 'white', color: '#0066cc', border: '1px solid #0066cc', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem' }}
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', marginBottom: '0.25rem' }}>{quiz.title}</h1>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>{answered} of {questions.length} answered</p>
        </div>
        <span style={{ background: '#e8f0fe', color: '#0066cc', padding: '4px 12px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold' }}>
          {current + 1} / {questions.length}
        </span>
      </div>

      <div style={{ background: '#eee', borderRadius: '999px', height: '6px', marginBottom: '2rem' }}>
        <div style={{
          width: `${((current + 1) / questions.length) * 100}%`,
          background: '#0066cc', height: '6px', borderRadius: '999px', transition: 'width 0.3s ease'
        }} />
      </div>

      <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '2rem', marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1.5rem', lineHeight: '1.5' }}>
          {current + 1}. {currentQuestion.text}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {options.map(opt => (
            <div
              key={opt}
              onClick={() => handleAnswer(currentQuestion.id, opt)}
              style={{
                padding: '0.85rem 1rem',
                borderRadius: '6px',
                border: answers[currentQuestion.id] === opt ? '2px solid #0066cc' : '1px solid #ddd',
                background: answers[currentQuestion.id] === opt ? '#e8f0fe' : 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{
                width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                background: answers[currentQuestion.id] === opt ? '#0066cc' : '#f0f0f0',
                color: answers[currentQuestion.id] === opt ? 'white' : '#666',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.85rem', fontWeight: 'bold'
              }}>
                {opt}
              </span>
              <span style={{ fontSize: '0.95rem', color: '#333' }}>{optionTexts[opt]}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
        <button
          onClick={() => setCurrent(prev => prev - 1)}
          disabled={current === 0}
          style={{ padding: '0.75rem 1.5rem', background: 'white', color: '#0066cc', border: '1px solid #0066cc', borderRadius: '6px', cursor: current === 0 ? 'not-allowed' : 'pointer', opacity: current === 0 ? 0.4 : 1 }}
        >
          ← Previous
        </button>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {questions.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer',
                background: answers[questions[i].id] ? '#0066cc' : i === current ? '#e8f0fe' : '#f0f0f0',
                color: answers[questions[i].id] ? 'white' : i === current ? '#0066cc' : '#666',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8rem', fontWeight: 'bold',
                border: i === current ? '2px solid #0066cc' : '1px solid transparent'
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {current < questions.length - 1 ? (
          <button
            onClick={() => setCurrent(prev => prev + 1)}
            style={{ padding: '0.75rem 1.5rem', background: '#0066cc', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting || answered < questions.length}
            style={{
              padding: '0.75rem 1.5rem',
              background: answered < questions.length ? '#ccc' : '#28a745',
              color: 'white', border: 'none', borderRadius: '6px',
              cursor: answered < questions.length ? 'not-allowed' : 'pointer',
              fontSize: '1rem'
            }}
          >
            {submitting ? 'Submitting...' : `Submit (${answered}/${questions.length})`}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
