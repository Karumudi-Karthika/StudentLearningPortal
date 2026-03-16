using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EnrollmentsController : ControllerBase
{
    private readonly AppDbContext _context;

    public EnrollmentsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{studentId}")]
    public async Task<IActionResult> GetByStudent(int studentId)
    {
        var enrollments = await _context.Enrollments
            .Include(e => e.Course)
            .Where(e => e.StudentId == studentId)
            .ToListAsync();
        return Ok(enrollments);
    }

    [HttpPost]
    public async Task<IActionResult> Enroll(Enrollment enrollment)
    {
        var exists = await _context.Enrollments
            .AnyAsync(e => e.StudentId == enrollment.StudentId && e.CourseId == enrollment.CourseId);
        if (exists) return Conflict("Already enrolled in this course.");

        _context.Enrollments.Add(enrollment);
        await _context.SaveChangesAsync();
        return Ok(enrollment);
    }

    [HttpPut("{id}/progress")]
    public async Task<IActionResult> UpdateProgress(int id, [FromBody] int lessonsCompleted)
    {
        var enrollment = await _context.Enrollments.FindAsync(id);
        if (enrollment == null) return NotFound();

        var course = await _context.Courses.FindAsync(enrollment.CourseId);
        if (course == null) return NotFound();

        enrollment.LessonsCompleted = lessonsCompleted;
        enrollment.IsCompleted = lessonsCompleted >= course.TotalLessons;

        await _context.SaveChangesAsync();
        return Ok(enrollment);
    }
}
