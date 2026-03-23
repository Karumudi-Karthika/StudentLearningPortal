using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LessonsController : ControllerBase
{
    private readonly AppDbContext _context;

    public LessonsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("course/{courseId}")]
    public async Task<IActionResult> GetByCourse(int courseId)
    {
        var lessons = await _context.Lessons
            .Where(l => l.CourseId == courseId)
            .OrderBy(l => l.Order)
            .ToListAsync();
        return Ok(lessons);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Lesson lesson)
    {
        _context.Lessons.Add(lesson);
        await _context.SaveChangesAsync();
        return Ok(lesson);
    }

    [HttpPost("bulk")]
    public async Task<IActionResult> CreateBulk(List<Lesson> lessons)
    {
        _context.Lessons.AddRange(lessons);
        await _context.SaveChangesAsync();
        return Ok(lessons);
    }
}
