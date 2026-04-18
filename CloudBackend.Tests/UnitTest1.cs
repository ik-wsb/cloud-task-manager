using Xunit;

namespace CloudBackend.Tests;

public class UnitTest1
{
    [Fact]
    public void NewTask_ShouldNotBeCompleted()
    {
        var task = new CloudBackend.Models.TaskItem();
        task.Title = "Przetestowac bezpiecznik";
        Assert.False(task.IsCompleted);
    }
}