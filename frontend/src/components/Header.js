import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">Smart Status Report Tracker</h1>
        <nav className="header-nav">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link
            to="/achievements"
            className={`nav-link ${location.pathname === '/achievements' ? 'active' : ''}`}
          >
            Achievements
          </Link>
          <Link
            to="/tasks"
            className={`nav-link ${location.pathname === '/tasks' ? 'active' : ''}`}
          >
            Tasks
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;