import React, { useState, useEffect } from 'react';
import './Achievements.css';

function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    category: '',
    tags: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await fetch('/api/achievements');
      const data = await response.json();
      setAchievements(data);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      const response = await fetch('/api/achievements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: formData.description,
          category: formData.category,
          tags: tagsArray
        }),
      });

      if (response.ok) {
        setFormData({ description: '', category: '', tags: '' });
        setShowForm(false);
        fetchAchievements();
      }
    } catch (error) {
      console.error('Error creating achievement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch('/api/export/achievements', {
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
        a.download = `achievements_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error exporting achievements:', error);
    }
  };

  return (
    <div className="achievements">
      <div className="page-header">
        <h2>Achievements</h2>
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
            {showForm ? 'Cancel' : 'Log Achievement'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="achievement-form">
          <h3>Log New Achievement</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
                placeholder="Describe what you accomplished..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
              >
                <option value="">Select a category</option>
                <option value="development">Development</option>
                <option value="meeting">Meeting</option>
                <option value="research">Research</option>
                <option value="planning">Planning</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags (comma-separated)</label>
              <input
                type="text"
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                placeholder="urgent, frontend, bug-fix"
              />
            </div>

            <div className="form-actions">
              <button type="button" className="btn secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button type="submit" className="btn primary" disabled={loading}>
                {loading ? 'Logging...' : 'Log Achievement'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="achievements-list">
        <h3>Recent Achievements</h3>
        {achievements.length === 0 ? (
          <p className="empty-state">No achievements logged yet. Log your first achievement above!</p>
        ) : (
          <div className="achievements-grid">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="achievement-card">
                <div className="achievement-header">
                  <span className={`category-badge category-${achievement.category}`}>
                    {achievement.category}
                  </span>
                  <span className="timestamp">
                    {new Date(achievement.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="achievement-description">{achievement.description}</p>
                {achievement.tags && (
                  <div className="achievement-tags">
                    {achievement.tags.split(',').map((tag, index) => (
                      <span key={index} className="tag">{tag.trim()}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Achievements;