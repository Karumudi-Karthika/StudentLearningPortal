
export interface Course {

  id: number;

  title: string;

  description: string;

  category: string;

  totalLessons: number;

  createdAt: string;

}

export interface Enrollment {

  id: number;

  studentId: number;

  courseId: number;

  lessonsCompleted: number;

  isCompleted: boolean;

  enrolledAt: string;

  course?: Course;

}

export interface Student {

  id: number;

  fullName: string;

  email: string;

  isAdmin: boolean;

  createdAt: string;

}

export interface QuizResult {

  id: number;

  studentId: number;

  quizId: number;

  score: number;

  takenAt: string;

}

