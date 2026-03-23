using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LeaderboardController : ControllerBase
{
    private readonly AppDbContext _context;

    public LeaderboardController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetLeaderboard()
    {
        var students = await _context.Students.ToListAsync();
        var quizResults = await _context.QuizResults
            .Include(r => r.Quiz)
            .ToListAsync();

        var leaderboard = students
            .Select(s => {
                var studentResults = quizResults.Where(r => r.StudentId == s.Id).ToList();
                if (studentResults.Count == 0) return null;
                return new {
                    studentId = s.Id,
                    fullName = s.FullName,
                    totalAttempts = studentResults.Count,
                    averageScore = (int)Math.Round(studentResults.Average(r =>
                        r.Quiz.TotalMarks > 0 ? (double)r.Score / r.Quiz.TotalMarks * 100 : 0)),
                    bestScore = (int)Math.Round(studentResults.Max(r =>
                        r.Quiz.TotalMarks > 0 ? (double)r.Score / r.Quiz.TotalMarks * 100 : 0)),
                    coursesCompleted = _context.Enrollments
                        .Count(e => e.StudentId == s.Id && e.IsCompleted)
                };
            })
            .Where(x => x != null)
            .OrderByDescending(x => x!.averageScore)
            .ThenByDescending(x => x!.totalAttempts)
            .Take(10)
            .ToList();

        return Ok(leaderboard);
    }
}
