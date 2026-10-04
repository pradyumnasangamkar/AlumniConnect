import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * DashboardLayout - Reusable sidebar layout wrapping all dashboard pages.
 *
 * Props:
 *   - children: The page content to display
 *   - pageTitle: Title shown in the top bar
 *   - activeRoute: Current route (highlights the correct nav item)
 */
function DashboardLayout({ children, pageTitle, activeRoute }) {
  const { user, logout, isAdmin, isAlumni, isStudent } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Get the user's initials for the avatar
  const initials = user
    ? (user.firstName?.[0] || '') + (user.lastName?.[0] || '')
    : 'U';

  // Define navigation items based on role
  const adminNav = [
    { icon: '🏠', label: 'Dashboard', path: '/admin/dashboard' },
    { icon: '📢', label: 'Announcements', path: '/admin/announcements' },
    { icon: '🎉', label: 'Manage Events', path: '/admin/events' },
    { icon: '👥', label: 'Alumni Directory', path: '/directory' },
    { icon: '💼', label: 'Jobs Board', path: '/jobs' },
  ];

  const alumniNav = [
    { icon: '🏠', label: 'Dashboard', path: '/alumni/dashboard' },
    { icon: '👤', label: 'My Profile', path: '/alumni/profile' },
    { icon: '✏️', label: 'Edit Profile', path: '/alumni/edit-profile' },
    { icon: '💼', label: 'Post a Job', path: '/alumni/post-job' },
    { icon: '👥', label: 'Alumni Directory', path: '/directory' },
    { icon: '🎉', label: 'Events', path: '/events' },
    { icon: '📋', label: 'All Jobs', path: '/jobs' },
    { icon: '📢', label: 'Announcements', path: '/announcements' },
  ];

  const studentNav = [
    { icon: '🏠', label: 'Dashboard', path: '/student/dashboard' },
    { icon: '👥', label: 'Alumni Directory', path: '/directory' },
    { icon: '🎉', label: 'Events', path: '/events' },
    { icon: '💼', label: 'Job Board', path: '/jobs' },
    { icon: '📢', label: 'Announcements', path: '/announcements' },
  ];

  const navItems = isAdmin ? adminNav : isAlumni ? alumniNav : studentNav;

  const roleBadgeColor = isAdmin ? '#f59e0b' : isAlumni ? '#2563eb' : '#059669';

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <h2>🎓 AlumniConnect</h2>
          <span>Management Platform</span>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="nav-section-label">NAVIGATION</div>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${activeRoute === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User Info + Logout */}
        <div className="sidebar-footer">
          <div className="sidebar-user-info">
            <div className="sidebar-user-avatar">{initials}</div>
            <div>
              <div className="sidebar-user-name">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="sidebar-user-role" style={{ color: roleBadgeColor }}>
                {user?.role}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="nav-item"
            style={{ color: '#f87171', width: '100%', textAlign: 'left' }}
          >
            <span className="nav-icon">🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <div className="topbar">
          <h1 className="topbar-title">{pageTitle}</h1>
          <div className="topbar-actions">
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Welcome, {user?.firstName}!
            </span>
            <div className="user-avatar">{initials}</div>
          </div>
        </div>

        {/* Page Content */}
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
