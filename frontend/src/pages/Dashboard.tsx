import { useEffect, useState } from 'react';
import api from '../services/api';

// Interfejs naszego zadania
interface Task {
  id: number;
  title: string;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Zapytanie GET do API
    api.get('/tasks')
      .then(response => {
        setTasks(response.data);
      })
      .catch(err => {
        console.error("Błąd API:", err);
        setError("Brak połączenia z API.");
      });
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Cloud Task Manager</h1>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {tasks.length > 0 ? (
          tasks.map(task => (
            <li key={task.id}>{task.title}</li>
          ))
        ) : (
          !error && <li>Ładowanie zadań...</li>
        )}
      </ul>
    </div>
  );
}