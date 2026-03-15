using CloudBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace CloudBackend.Repositories;

public interface ITaskRepository
{
    Task<IEnumerable<TaskItem>> GetAllAsync();
    Task<TaskItem?> GetByIdAsync(int id);
    Task AddAsync(TaskItem task);
    Task DeleteAsync(TaskItem task);
    Task SaveChangesAsync();
}

public class TaskRepository : ITaskRepository
{
    private readonly AppDbContext _context;
    public TaskRepository(AppDbContext context) => _context = context;

    public async Task<IEnumerable<TaskItem>> GetAllAsync() => await _context.Tasks.ToListAsync();
    
    public async Task<TaskItem?> GetByIdAsync(int id) => await _context.Tasks.FindAsync(id);
    
    public async Task AddAsync(TaskItem task) => await _context.Tasks.AddAsync(task);
    
    public Task DeleteAsync(TaskItem task) 
    { 
        _context.Tasks.Remove(task); 
        return Task.CompletedTask; 
    }
    
    public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
}