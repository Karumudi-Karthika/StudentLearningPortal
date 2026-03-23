using System.Text.Json.Serialization;

namespace server.Models;

public class Question
{
    public int Id { get; set; }
    public int QuizId { get; set; }
    public string Text { get; set; } = string.Empty;
    public string OptionA { get; set; } = string.Empty;
    public string OptionB { get; set; } = string.Empty;
    public string OptionC { get; set; } = string.Empty;
    public string OptionD { get; set; } = string.Empty;
    public string CorrectAnswer { get; set; } = string.Empty;
    public int Order { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Quiz? Quiz { get; set; }
}
