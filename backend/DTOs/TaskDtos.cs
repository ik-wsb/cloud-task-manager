namespace CloudBackend.DTOs;

public record TaskReadDto(int Id, string Title, bool IsCompleted);
public record CreateTaskDto(string Title);
public record UpdateTaskDto(string Title, bool IsCompleted);