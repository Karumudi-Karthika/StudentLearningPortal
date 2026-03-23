# Student Learning Portal

A full-stack web application for online learning — students can enroll in courses, complete lessons, track progress, and take quizzes. Admins can manage students and add new courses.

## Live Demo

> Run locally following the setup instructions below.

## Screenshots

| Home | Course Detail | Quiz |
|------|--------------|------|
| Dashboard with enrolled courses and progress | Lesson viewer with sidebar navigation | Multiple choice quiz with instant scoring |

## Tech Stack

**Frontend**
- React 18 + TypeScript
- React Router v6
- Axios

**Backend**
- ASP.NET Core 10 Web API
- Entity Framework Core 10
- JWT Authentication
- SQL Server (Docker)

## Features

### Student
- Register and login with JWT
- Browse available courses
- Enroll and unenroll from courses
- Complete lessons in order — each lesson unlocks the next
- Track progress with a live progress bar
- Take quizzes after completing a course
- View quiz results dashboard with scores and badges

### Admin
- View all students and their roles
- Add new courses
- View all courses

## Project Structure
```
StudentLearningPortal/
├── client/                        # React + TypeScript frontend
│   └── src/
│       ├── pages/
│       │   ├── HomePage.tsx       # Dashboard with learning overview
│       │   ├── CoursesPage.tsx    # Browse and enroll in courses
│       │   ├── CourseDetailPage.tsx # Lesson viewer with progress
│       │   ├── QuizPage.tsx       # Take a quiz
│       │   ├── QuizDashboard.tsx  # View quiz results
│       │   ├── ProgressPage.tsx   # View course progress
│       │   ├── AdminDashboard.tsx # Manage students and courses
│       │   ├── LoginPage.tsx      # Login
│       │   └── RegisterPage.tsx   # Register
│       ├── components/
│       │   ├── ProtectedRoute.tsx # Auth guard
│       │   ├── Toast.tsx          # Banner notifications
│       │   ├── Badge.tsx          # Status badges
│       │   └── useToast.ts        # Toast hook
│       ├── services/
│       │   └── api.ts             # Axios instance
│       └── types/
│           └── index.ts           # TypeScript interfaces
└── server/                        # ASP.NET Core backend
    ├── Controllers/
    │   ├── AuthController.cs      # Register + Login (JWT)
    │   ├── CoursesController.cs   # CRUD for courses
    │   ├── EnrollmentsController.cs # Enroll, unenroll, progress
    │   ├── StudentsController.cs  # Student management
    │   ├── LessonsController.cs   # Lessons per course
    │   ├── QuizzesController.cs   # Quizzes + results
    │   └── QuestionsController.cs # Questions + quiz submission
    ├── Models/
    │   ├── Student.cs
    │   ├── Course.cs
    │   ├── Enrollment.cs
    │   ├── Lesson.cs
    │   ├── Quiz.cs
    │   ├── Question.cs
    │   └── QuizResult.cs
    ├── Data/
    │   └── AppDbContext.cs        # EF Core DbContext
    └── Migrations/                # EF Core migrations
```

## Getting Started

### Prerequisites
- [Node.js v18+](https://nodejs.org)
- [.NET 10 SDK](https://dot.net/download)
- [Docker Desktop](https://docker.com/products/docker-desktop)

### 1 — Clone the repo
```bash
git clone https://github.com/Karumudi-Karthika/StudentLearningPortal.git
cd StudentLearningPortal
```

### 2 — Start SQL Server in Docker
```bash
docker run -e "ACCEPT_EULA=Y" \
  -e "SA_PASSWORD=YourStrong@Passw0rd" \
  -p 1433:1433 \
  --name sqlserver \
  --platform linux/amd64 \
  -d mcr.microsoft.com/mssql/server:2022-latest
```

### 3 — Start the backend
```bash
cd server
dotnet ef database update
dotnet run
```
API runs at `http://localhost:5229`
Swagger UI at `http://localhost:5229/swagger`

### 4 — Start the frontend
```bash
cd client
npm install
npm start
```
App runs at `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/Auth/register | Register a new student |
| POST | /api/Auth/login | Login and receive JWT |
| GET | /api/Courses | Get all courses |
| POST | /api/Courses | Create a course |
| GET | /api/Enrollments/{studentId} | Get student enrollments |
| POST | /api/Enrollments | Enroll in a course |
| DELETE | /api/Enrollments/{studentId}/{courseId} | Unenroll |
| PUT | /api/Enrollments/{id}/progress | Update lesson progress |
| GET | /api/Lessons/course/{courseId} | Get lessons for a course |
| GET | /api/Students/{id}/progress | Get progress for a student |
| GET | /api/Questions/quiz/{quizId} | Get questions for a quiz |
| POST | /api/Questions/submit | Submit quiz answers |
| GET | /api/Quizzes/results/{studentId} | Get quiz results |

## Default Admin Setup

1. Register a new account via `/register`
2. Run this SQL to grant admin access:
```sql
USE StudentPortalDb;
UPDATE Students SET IsAdmin = 1 WHERE Email = 'your@email.com';
```

## License

MIT
