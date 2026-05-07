import React, { useState, useEffect } from 'react';
import './Tasks.css';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    priority: 'medium',
    status: 'todo',
    due_date: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const getUrgentTasks = () => {
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    
    return tasks.filter(task => {
      if (!task.due_date) return false;
      const dueDate = new Date(task.due_date);
      return dueDate <= threeDaysFromNow && task.status !== 'completed';
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null
        }),
      });

      if (response.ok) {
        setFormData({
          description: '',
          priority: 'medium',
          status: 'todo',
          due_date: ''
        });
        setShowForm(false);
        fetchTasks();
      }
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await fetch(`/api/tasks/${taskId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchTasks();
        }
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch('/api/export/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tasks_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error exporting tasks:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'completed';
      case 'in_progress': return 'in-progress';
      case 'todo': return 'todo';
      default: return 'todo';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'high';
      case 'medium': return 'medium';
      case 'low': return 'low';
      default: return 'medium';
    }
  };

  return (
    <div className="tasks">
      <div className="page-header">
        <h2>Tasks</h2>
        <div className="page-actions">
          <button
            className="btn secondary"
            onClick={handleExport}
          >
            Export to Excel
          </button>
          <button
            className="btn primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Add Task'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="task-form">
          <h3>Add New Task</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
                placeholder="Describe the task..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="priority">Priority</label>
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="due_date">Due Date</label>
                <input
                  type="date"
                  id="due_date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button type="submit" className="btn primary" disabled={loading}>
                {loading ? 'Adding...' : 'Add Task'}
              </button>
            </div>
          </form>
        </div>
      )}

      {getUrgentTasks().length > 0 && (
        <div className="urgent-tasks">
          <h3>⚠️ Urgent Tasks (Overdue or Due Soon)</h3>
          <div className="tasks-grid">
            {getUrgentTasks().map((task) => (
              <div key={task.id} className="task-card urgent">
                <div className="task-header">
                  <span className={`priority-badge priority-${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className={`status-badge status-${getStatusColor(task.status)}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>

                <p className="task-description">{task.description}</p>

                <div className="task-footer">
                  {task.due_date && (
                    <span className={`due-date ${new Date(task.due_date) < new Date() ? 'overdue' : 'due-soon'}`}>
                      Due: {new Date(task.due_date).toLocaleDateString()}
                    </span>
                  )}
                  <div className="task-actions">
                    {task.status !== 'completed' && (
                      <button
                        className="status-btn"
                        onClick={() => updateTaskStatus(task.id, 'completed')}
                      >
                        Complete
                      </button>
                    )}
                    {task.status === 'todo' && (
                      <button
                        className="status-btn"
                        onClick={() => updateTaskStatus(task.id, 'in_progress')}
                      >
                        Start
                      </button>
                    )}
                    <button
                      className="delete-btn"
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="tasks-list">
        <h3>Your Tasks</h3>
        {tasks.length === 0 ? (
          <p className="empty-state">No tasks yet. Add your first task above!</p>
        ) : (
          <div className="tasks-grid">
            {tasks.map((task) => (
              <div key={task.id} className="task-card">
                <div className="task-header">
                  <span className={`priority-badge priority-${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className={`status-badge status-${getStatusColor(task.status)}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>

                <p className="task-description">{task.description}</p>

                <div className="task-footer">
                  {task.due_date && (
                    <span className="due-date">
                      Due: {new Date(task.due_date).toLocaleDateString()}
                    </span>
                  )}
                  <div className="task-actions">
                    {task.status !== 'completed' && (
                      <button
                        className="status-btn"
                        onClick={() => updateTaskStatus(task.id, 'completed')}
                      >
                        Complete
                      </button>
                    )}
                    {task.status === 'todo' && (
                      <button
                        className="status-btn"
                        onClick={() => updateTaskStatus(task.id, 'in_progress')}
                      >
                        Start
                      </button>
                    )}
                    <button
                      className="delete-btn"
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Tasks;