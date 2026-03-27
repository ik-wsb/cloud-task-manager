using CloudBackend.DTOs;
using CloudBackend.Models;
using CloudBackend.Repositories;

namespace CloudBackend.Services;

public interface ITaskService
{
    Task<IEnumerable<TaskReadDto>> GetAllAsync();
    Task<TaskReadDto?> GetByIdAsync(int id);
    Task<TaskReadDto> CreateAsync(CreateTaskDto dto);
    Task<bool> UpdateAsync(int id, UpdateTaskDto dto);
    Task<bool> DeleteAsync(int id);
}

public class TaskService : ITaskService
{
    private readonly ITaskRepository _repo;
    public TaskService(ITaskRepository repo) => _repo = repo;

    public async Task<IEnumerable<TaskReadDto>> GetAllAsync()
    {
        var tasks = await _repo.GetAllAsync();
        return tasks.Select(t => new TaskReadDto(t.Id, t.Title, t.IsCompleted));
    }

    public async Task<TaskReadDto?> GetByIdAsync(int id)
    {
        var task = await _repo.GetByIdAsync(id);
        return task == null ? null : new TaskReadDto(task.Id, task.Title, task.IsCompleted);
    }

    public async Task<TaskReadDto> CreateAsync(CreateTaskDto dto)
    {
        var task = new TaskItem { Title = dto.Title, IsCompleted = false };
        await _repo.AddAsync(task);
        await _repo.SaveChangesAsync();
        return new TaskReadDto(task.Id, task.Title, task.IsCompleted);
    }

    public async Task<bool> UpdateAsync(int id, UpdateTaskDto dto)
    {
        var task = await _repo.GetByIdAsync(id);
        if (task == null) return false;

        task.Title = dto.Title;
        task.IsCompleted = dto.IsCompleted;
        await _repo.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var task = await _repo.GetByIdAsync(id);
        if (task == null) return false;

        await _repo.DeleteAsync(task);
        await _repo.SaveChangesAsync();
        return true;
    }
}