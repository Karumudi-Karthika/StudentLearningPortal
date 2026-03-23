using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuestionsController : ControllerBase
{
    private readonly AppDbContext _context;

    public QuestionsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("quiz/{quizId}")]
    public async Task<IActionResult> GetByQuiz(int quizId)
    {
        var questions = await _context.Questions
            .Where(q => q.QuizId == quizId)
            .OrderBy(q => q.Order)
            .Select(q => new {
                q.Id,
                q.QuizId,
                q.Text,
                q.OptionA,
                q.OptionB,
                q.OptionC,
                q.OptionD,
                q.Order
            })
            .ToListAsync();
        return Ok(questions);
    }

    [HttpPost("bulk")]
    public async Task<IActionResult> CreateBulk(List<Question> questions)
    {
        _context.Questions.AddRange(questions);
        await _context.SaveChangesAsync();
        return Ok(questions);
    }

    [HttpPost("submit")]
    public async Task<IActionResult> SubmitQuiz([FromBody] QuizSubmission submission)
    {
        var questions = await _context.Questions
            .Where(q => q.QuizId == submission.QuizId)
            .ToListAsync();

        var quiz = await _context.Quizzes.FindAsync(submission.QuizId);
        if (quiz == null) return NotFound();

        int correct = 0;
        foreach (var answer in submission.Answers)
        {
            var question = questions.FirstOrDefault(q => q.Id == answer.QuestionId);
            if (question != null && question.CorrectAnswer == answer.SelectedAnswer)
                correct++;
        }

        int score = (int)Math.Round((double)correct / questions.Count * quiz.TotalMarks);

        var result = new QuizResult
        {
            StudentId = submission.StudentId,
            QuizId = submission.QuizId,
            Score = score,
            TakenAt = DateTime.UtcNow
        };

        _context.QuizResults.Add(result);
        await _context.SaveChangesAsync();

        return Ok(new {
            score,
            totalMarks = quiz.TotalMarks,
            correct,
            total = questions.Count,
            percentage = (int)Math.Round((double)score / quiz.TotalMarks * 100)
        });
    }
}

public class QuizSubmission
{
    public int StudentId { get; set; }
    public int QuizId { get; set; }
    public List<QuizAnswer> Answers { get; set; } = new();
}

public class QuizAnswer
{
    public int QuestionId { get; set; }
    public string SelectedAnswer { get; set; } = string.Empty;
}
