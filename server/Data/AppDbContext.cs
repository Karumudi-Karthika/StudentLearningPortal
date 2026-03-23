using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Student> Students => Set<Student>();
    public DbSet<Course> Courses => Set<Course>();
    public DbSet<Enrollment> Enrollments => Set<Enrollment>();
    public DbSet<Quiz> Quizzes => Set<Quiz>();
    public DbSet<QuizResult> QuizResults => Set<QuizResult>();
    public DbSet<Lesson> Lessons => Set<Lesson>();
    public DbSet<Question> Questions => Set<Question>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Student>()
            .HasIndex(s => s.Email)
            .IsUnique();

        modelBuilder.Entity<Enrollment>()
            .HasIndex(e => new { e.StudentId, e.CourseId })
            .IsUnique();

        modelBuilder.Entity<Enrollment>()
            .HasOne(e => e.Course)
            .WithMany(c => c.Enrollments)
            .HasForeignKey(e => e.CourseId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<QuizResult>()
            .HasOne(qr => qr.Quiz)
            .WithMany(q => q.Results)
            .HasForeignKey(qr => qr.QuizId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Lesson>()
            .HasOne(l => l.Course)
            .WithMany()
            .HasForeignKey(l => l.CourseId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Question>()
            .HasOne(q => q.Quiz)
            .WithMany()
            .HasForeignKey(q => q.QuizId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
