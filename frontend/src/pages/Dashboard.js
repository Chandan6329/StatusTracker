import React, { useState, useEffect } from 'react';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({
    achievements: 0,
    tasks: { total: 0, completed: 0, inProgress: 0, todo: 0 },
    urgentTasks: []
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const getUrgentTasks = (tasks) => {
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    return tasks.filter((task) => {
      if (!task.due_date) return false;
      const dueDate = new Date(task.due_date);
      return dueDate <= threeDaysFromNow && task.status !== 'completed';
    });
  };

  const fetchStats = async () => {
    try {
      const [achievementsRes, tasksRes] = await Promise.all([
        fetch('/api/achievements'),
        fetch('/api/tasks')
      ]);

      const achievements = await achievementsRes.json();
      const tasks = await tasksRes.json();

      const taskStats = tasks.reduce((acc, task) => {
        acc.total++;
        switch (task.status) {
          case 'completed':
            acc.completed++;
            break;
          case 'in_progress':
            acc.inProgress++;
            break;
          default:
            acc.todo++;
        }
        return acc;
      }, { total: 0, completed: 0, inProgress: 0, todo: 0 });

      setStats({
        achievements: achievements.length,
        tasks: taskStats,
        urgentTasks: getUrgentTasks(tasks)
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Achievements</h3>
          <div className="stat-number">{stats.achievements}</div>
          <p>Total logged achievements</p>
        </div>

        <div className="stat-card">
          <h3>Total Tasks</h3>
          <div className="stat-number">{stats.tasks.total}</div>
          <p>All tasks in system</p>
        </div>

        <div className="stat-card">
          <h3>Completed Tasks</h3>
          <div className="stat-number completed">{stats.tasks.completed}</div>
          <p>Tasks marked as done</p>
        </div>

        <div className="stat-card">
          <h3>In Progress</h3>
          <div className="stat-number in-progress">{stats.tasks.inProgress}</div>
          <p>Currently active tasks</p>
        </div>

        <div className="stat-card">
          <h3>To Do</h3>
          <div className="stat-number todo">{stats.tasks.todo}</div>
          <p>Pending tasks</p>
        </div>
      </div>

      {stats.urgentTasks.length > 0 && (
        <div className="urgent-dashboard-card">
          <div className="urgent-dashboard-header">
            <h3>Urgent Tasks</h3>
            <span>{stats.urgentTasks.length} task{stats.urgentTasks.length > 1 ? 's' : ''} overdue or due soon</span>
          </div>
          <div className="urgent-task-list">
            {stats.urgentTasks.slice(0, 3).map((task) => (
              <div key={task.id} className="urgent-task-item">
                <div>
                  <p className="urgent-task-desc">{task.description}</p>
                  <p className="urgent-task-meta">
                    Due: {new Date(task.due_date).toLocaleDateString()} · Status: {task.status.replace('_', ' ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button
            className="action-btn primary"
            onClick={() => window.location.href = '/achievements'}
          >
            Log Achievement
          </button>
          <button
            className="action-btn secondary"
            onClick={() => window.location.href = '/tasks'}
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;