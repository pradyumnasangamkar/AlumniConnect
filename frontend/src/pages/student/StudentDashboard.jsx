import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { eventAPI, jobAPI, announcementAPI, alumniAPI } from '../../api/api';

/**
 * StudentDashboard - Main page for STUDENT role users.
 *
 * Shows:
 * - Welcome message
 * - Upcoming Events (clickable)
 * - Available Jobs with quick apply
 * - Latest Announcements
 * - Quick link to Alumni Directory
 */
function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [alumniCount, setAlumniCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsData, jobsData, announcementsData, alumniData] = await Promise.all([
          eventAPI.getUpcoming(user.userId),
          jobAPI.getAll(user.userId),
          announcementAPI.getAll(),
          alumniAPI.getAll(),
        ]);
        setUpcomingEvents(eventsData.slice(0, 3));
        setJobs(jobsData.slice(0, 4));
        setAnnouncements(announcementsData.slice(0, 3));
        setAlumniCount(alumniData.length);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.userId]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  if (loading) {
    return (
      <DashboardLayout pageTitle="Student Dashboard" activeRoute="/student/dashboard">
        <div className="spinner-wrapper">
          <div className="spinner"></div>
          <p className="text-muted">Loading your dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Student Dashboard" activeRoute="/student/dashboard">
      {/* Welcome Banner */}
      <div className="card mb-6" style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: 'white', border: 'none' }}>
        <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
          Welcome back, {user.firstName}! 👋
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '1.5rem' }}>
          Explore opportunities, connect with alumni, and grow your career.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn" style={{ background: 'white', color: '#2563eb' }}
            onClick={() => navigate('/directory')}>
            👥 Browse Alumni
          </button>
          <button className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}
            onClick={() => navigate('/jobs')}>
            💼 Find Jobs
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: '2rem' }}>
        <div className="stat-card blue">
          <span className="stat-icon">👥</span>
          <span className="stat-number">{alumniCount}</span>
          <div className="stat-label">Alumni in Network</div>
        </div>
        <div className="stat-card green">
          <span className="stat-icon">🎉</span>
          <span className="stat-number">{upcomingEvents.length}</span>
          <div className="stat-label">Upcoming Events</div>
        </div>
        <div className="stat-card purple">
          <span className="stat-icon">💼</span>
          <span className="stat-number">{jobs.length}</span>
          <div className="stat-label">Available Jobs</div>
        </div>
      </div>

      <div className="grid-2">
        {/* Upcoming Events */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">🎉 Upcoming Events</span>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/events')}>
              View All
            </button>
          </div>
          {upcomingEvents.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem' }}>
              <div className="empty-state-icon">📅</div>
              <p className="empty-state-text">No upcoming events right now.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {upcomingEvents.map(event => (
                <div key={event.id} className="announcement-card"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/events/${event.id}`)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div className="announcement-title" style={{ fontSize: '0.9rem' }}>{event.eventName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        📅 {formatDate(event.eventDate)} · 📍 {event.location}
                      </div>
                    </div>
                    {event.isRegistered ? (
                      <span className="badge badge-green">Registered</span>
                    ) : (
                      <span className="badge badge-blue">Open</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Latest Announcements */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">📢 Announcements</span>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/announcements')}>
              View All
            </button>
          </div>
          {announcements.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem' }}>
              <div className="empty-state-icon">📢</div>
              <p className="empty-state-text">No announcements yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {announcements.map(ann => (
                <div key={ann.id} className={`announcement-card ${ann.category || ''}`}>
                  <div className="announcement-title" style={{ fontSize: '0.9rem' }}>{ann.title}</div>
                  <div className="announcement-content" style={{
                    fontSize: '0.8rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {ann.content}
                  </div>
                  <div className="announcement-meta">
                    <span className={`badge badge-${ann.category === 'IMPORTANT' ? 'orange' : ann.category === 'JOB' ? 'purple' : 'blue'}`}>
                      {ann.category}
                    </span>
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

      {/* Job Board Preview */}
      <div className="card mt-4">
        <div className="card-header">
          <span className="card-title">💼 Recent Job Opportunities</span>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/jobs')}>
            View All Jobs
          </button>
        </div>
        {jobs.length === 0 ? (
          <div className="empty-state" style={{ padding: '2rem' }}>
            <div className="empty-state-icon">💼</div>
            <p className="empty-state-text">No job postings available yet.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job.id}>
                    <td><strong>{job.jobTitle}</strong></td>
                    <td style={{ color: 'var(--primary)' }}>{job.companyName}</td>
                    <td>{job.location || '-'}</td>
                    <td>
                      <span className="badge badge-blue">{job.jobType || 'Full-Time'}</span>
                    </td>
                    <td>
                      {job.hasApplied
                        ? <span className="badge badge-green">Applied ✓</span>
                        : <span className="badge badge-gray">Not Applied</span>}
                    </td>
                    <td>
                      <button className="btn btn-secondary btn-sm"
                        onClick={() => navigate(`/jobs/${job.id}`)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default StudentDashboard;
