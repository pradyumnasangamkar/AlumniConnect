import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { adminAPI, announcementAPI, eventAPI } from '../../api/api';

function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ totalAlumni: 0, totalStudents: 0, totalEvents: 0, totalJobs: 0, totalAnnouncements: 0 });
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, announcementsData, eventsData] = await Promise.all([
          adminAPI.getStats(),
          announcementAPI.getAll(),
          eventAPI.getAll(user.userId),
        ]);
        setStats(statsData);
        setRecentAnnouncements(announcementsData.slice(0, 4));
        setRecentEvents(eventsData.slice(0, 4));
      } catch (err) {
        console.error('Failed to load admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <DashboardLayout pageTitle="Admin Dashboard" activeRoute="/admin/dashboard">
        <div className="spinner-wrapper"><div className="spinner"></div><p className="text-muted">Loading dashboard...</p></div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Admin Dashboard" activeRoute="/admin/dashboard">
      {/* Welcome */}
      <div className="card mb-6" style={{ background: 'linear-gradient(135deg, #1e293b, #2563eb)', border: 'none' }}>
        <h2 style={{ color: 'white', marginBottom: '0.5rem' }}>Welcome back, {user.firstName}! 👋</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)' }}>Here's your platform overview for today.</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid mb-8">
        <div className="stat-card blue">
          <span className="stat-icon">🎓</span>
          <span className="stat-number">{stats.totalAlumni}</span>
          <div className="stat-label">Total Alumni</div>
        </div>
        <div className="stat-card green">
          <span className="stat-icon">📚</span>
          <span className="stat-number">{stats.totalStudents}</span>
          <div className="stat-label">Total Students</div>
        </div>
        <div className="stat-card purple">
          <span className="stat-icon">🎉</span>
          <span className="stat-number">{stats.totalEvents}</span>
          <div className="stat-label">Total Events</div>
        </div>
        <div className="stat-card orange">
          <span className="stat-icon">💼</span>
          <span className="stat-number">{stats.totalJobs}</span>
          <div className="stat-label">Jobs Posted</div>
        </div>
        <div className="stat-card" style={{ borderTop: '4px solid var(--text-secondary)' }}>
          <span className="stat-icon">📢</span>
          <span className="stat-number">{stats.totalAnnouncements}</span>
          <div className="stat-label">Announcements</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card mb-6">
        <div className="card-header"><span className="card-title">⚡ Quick Actions</span></div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => navigate('/admin/events')}>🎉 Create Event</button>
          <button className="btn btn-secondary" onClick={() => navigate('/admin/announcements')}>📢 New Announcement</button>
          <button className="btn btn-ghost" onClick={() => navigate('/directory')}>👥 View Alumni</button>
          <button className="btn btn-ghost" onClick={() => navigate('/jobs')}>💼 View Jobs</button>
        </div>
      </div>

      <div className="grid-2">
        {/* Recent Events */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">🎉 Recent Events</span>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/admin/events')}>Manage</button>
          </div>
          {recentEvents.length === 0 ? (
            <div className="empty-state" style={{ padding: '1.5rem' }}>
              <div className="empty-state-icon">🎉</div>
              <p className="empty-state-text">No events yet. Create one!</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead><tr><th>Event</th><th>Date</th><th>Registered</th></tr></thead>
                <tbody>
                  {recentEvents.map(e => (
                    <tr key={e.id}>
                      <td><strong>{e.eventName}</strong></td>
                      <td style={{ fontSize: '0.8rem' }}>{formatDate(e.eventDate)}</td>
                      <td><span className="badge badge-blue">👥 {e.registrationCount || 0}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Announcements */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">📢 Recent Announcements</span>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/admin/announcements')}>Manage</button>
          </div>
          {recentAnnouncements.length === 0 ? (
            <div className="empty-state" style={{ padding: '1.5rem' }}>
              <div className="empty-state-icon">📢</div>
              <p className="empty-state-text">No announcements yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentAnnouncements.map(ann => (
                <div key={ann.id} className={`announcement-card ${ann.category || ''}`}>
                  <div className="announcement-title" style={{ fontSize: '0.875rem' }}>{ann.title}</div>
                  <div className="announcement-meta">
                    <span className={`badge badge-${ann.category === 'IMPORTANT' ? 'orange' : 'blue'}`}>{ann.category}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {ann.createdAt ? new Date(ann.createdAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;
