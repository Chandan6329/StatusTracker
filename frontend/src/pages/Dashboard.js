import React, { useState, useEffect } from 'react';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({
    achievements: 0,
    tasks: { total: 0, completed: 0, inProgress: 0, todo: 0 }
  });

  useEffect(() => {
    // Fetch stats from API
    fetchStats();
  }, []);

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
        tasks: taskStats
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