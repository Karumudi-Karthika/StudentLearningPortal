using System.Text.Json.Serialization;

namespace server.Models;

public class QuizResult
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public int QuizId { get; set; }
    public int Score { get; set; }
    public DateTime TakenAt { get; set; } = DateTime.UtcNow;

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Student? Student { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Quiz? Quiz { get; set; }
}
