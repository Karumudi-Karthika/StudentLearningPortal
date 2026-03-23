using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuizzesController : ControllerBase
{
    private readonly AppDbContext _context;

    public QuizzesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var quizzes = await _context.Quizzes
            .Select(q => new {
                q.Id,
                q.CourseId,
                q.Title,
                q.TotalMarks
            })
            .ToListAsync();
        return Ok(quizzes);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Quiz quiz)
    {
        _context.Quizzes.Add(quiz);
        await _context.SaveChangesAsync();
        return Ok(new { quiz.Id, quiz.CourseId, quiz.Title, quiz.TotalMarks });
    }

    [HttpPost("results")]
    public async Task<IActionResult> SubmitResult(QuizResult result)
    {
        _context.QuizResults.Add(result);
        await _context.SaveChangesAsync();
        return Ok(new { result.Id, result.StudentId, result.QuizId, result.Score, result.TakenAt });
    }

    [HttpGet("results/{studentId}")]
    public async Task<IActionResult> GetResultsByStudent(int studentId)
    {
        var results = await _context.QuizResults
            .Include(r => r.Quiz)
            .ThenInclude(q => q.Course)
            .Where(r => r.StudentId == studentId)
            .ToListAsync();

        var dashboard = results.Select(r => new {
            quizId = r.QuizId,
            quizTitle = r.Quiz.Title,
            courseTitle = r.Quiz.Course.Title,
            score = r.Score,
            totalMarks = r.Quiz.TotalMarks,
            percentage = r.Quiz.TotalMarks == 0 ? 0 :
                (int)((double)r.Score / r.Quiz.TotalMarks * 100),
            takenAt = r.TakenAt
        });

        return Ok(dashboard);
    }
}
