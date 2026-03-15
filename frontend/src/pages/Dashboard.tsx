import { useEffect, useState } from 'react';
import api from '../services/api';

interface Task {
  id: number;
  title: string;
  isCompleted: boolean;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. READ
  const fetchTasks = () => {
    setIsLoading(true);
    setError(null);
    api.get('/api/tasks')
      .then(response => setTasks(response.data))
      .catch(err => {
        console.error("Błąd API:", err);
        setError("Nie udało się pobrać zadań. Sprawdź, czy backend działa.");
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 2. CREATE 
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      setError("Nazwa zadania nie może być pusta!");
      return;
    }
    setError(null);
    api.post('/api/tasks', { title: newTaskTitle })
      .then(response => {
        setTasks([...tasks, response.data]);
        setNewTaskTitle(''); 
      })
      .catch(err => {
        if (err.response && err.response.status === 400) {
          setError("Błąd walidacji API: Nieprawidłowe dane zadania.");
        } else {
          setError("Wystąpił błąd podczas dodawania zadania.");
        }
      });
  };

  // 3. UPDATE 
  const handleToggleComplete = (task: Task) => {
    api.put(`/api/tasks/${task.id}`, {
      title: task.title,
      isCompleted: !task.isCompleted
    })
    .then(() => {
      setTasks(tasks.map(t => 
        t.id === task.id ? { ...t, isCompleted: !t.isCompleted } : t
      ));
    })
    .catch(() => setError("Nie udało się zaktualizować zadania."));
  };

  // 4. DELETE 
  const handleDeleteTask = (id: number) => {
    api.delete(`/api/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter(t => t.id !== id));
      })
      .catch(() => setError("Nie udało się usunąć zadania (Błąd 404/500)."));
  };

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', padding: '40px 20px', fontFamily: 'system-ui, sans-serif', color: '#333' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', backgroundColor: '#ffffff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        
        <h1 style={{ textAlign: 'center', color: '#1a1a1a', marginBottom: '30px', borderBottom: '2px solid #eaeaea', paddingBottom: '15px' }}>
          Cloud Task Manager
        </h1>
        
        {error && (
          <div style={{ backgroundColor: '#fee2e2', borderLeft: '4px solid #ef4444', color: '#b91c1c', padding: '12px 16px', borderRadius: '4px', marginBottom: '20px' }}>
            <strong>Błąd:</strong> {error}
          </div>
        )}

        <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '12px', marginBottom: '30px' }}>
          <input 
            type="text" 
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Wpisz nowe zadanie..."
            style={{ flex: 1, padding: '12px 16px', fontSize: '16px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a', outline: 'none' }}
          />
          <button type="submit" style={{ padding: '12px 24px', fontSize: '16px', fontWeight: 'bold', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            Dodaj
          </button>
        </form>

        {isLoading ? (
          <p style={{ textAlign: 'center', color: '#64748b', fontSize: '16px' }}>Ładowanie danych z API...</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {tasks.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '16px', fontStyle: 'italic' }}>Brak zadań. Dodaj pierwsze!</p>
            ) : (
              tasks.map(task => (
                <li key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '16px 20px', marginBottom: '12px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  
                  <div 
                    onClick={() => handleToggleComplete(task)}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flex: 1 }}
                  >
                    <input 
                      type="checkbox" 
                      checked={task.isCompleted} 
                      readOnly
                      style={{ transform: 'scale(1.2)', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '16px', color: task.isCompleted ? '#94a3b8' : '#1e293b', textDecoration: task.isCompleted ? 'line-through' : 'none', fontWeight: '500' }}>
                      {task.title}
                    </span>
                  </div>

                  <button 
                    onClick={() => handleDeleteTask(task.id)}
                    style={{ backgroundColor: '#ef4444', color: 'white', fontWeight: 'bold', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', marginLeft: '10px' }}>
                    Usuń
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}