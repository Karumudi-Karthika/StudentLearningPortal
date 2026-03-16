using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StudentsController : ControllerBase
{
    private readonly AppDbContext _context;

    public StudentsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var students = await _context.Students.ToListAsync();
        return Ok(students);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var student = await _context.Students.FindAsync(id);
        if (student == null) return NotFound();
        return Ok(student);
    }

    [HttpGet("{id}/progress")]
    public async Task<IActionResult> GetProgress(int id)
    {
        var enrollments = await _context.Enrollments
            .Include(e => e.Course)
            .Where(e => e.StudentId == id)
            .ToListAsync();

        var progress = enrollments.Select(e => new {
            courseId = e.CourseId,
            courseTitle = e.Course.Title,
            totalLessons = e.Course.TotalLessons,
            lessonsCompleted = e.LessonsCompleted,
            isCompleted = e.IsCompleted,
            percentage = e.Course.TotalLessons == 0 ? 0 :
                (int)((double)e.LessonsCompleted / e.Course.TotalLessons * 100)
        });

        return Ok(progress);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Student student)
    {
        var exists = await _context.Students.AnyAsync(s => s.Email == student.Email);
        if (exists) return Conflict("Email already in use.");

        _context.Students.Add(student);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = student.Id }, student);
    }
}
