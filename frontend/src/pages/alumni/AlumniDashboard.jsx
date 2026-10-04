import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { alumniAPI, eventAPI, jobAPI } from '../../api/api';

function AlumniDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [profileData, eventsData, jobsData, appsData] = await Promise.all([
          alumniAPI.getByUserId(user.userId),
          eventAPI.getUpcoming(user.userId),
          jobAPI.getByAlumni(user.userId),
          jobAPI.getUserApplications(user.userId),
        ]);
        setProfile(profileData);
        setUpcomingEvents(eventsData.slice(0, 3));
        setMyJobs(jobsData.slice(0, 3));
        setMyApplications(appsData);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, [user.userId]);

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

  if (loading) return (
    <DashboardLayout pageTitle="Alumni Dashboard" activeRoute="/alumni/dashboard">
      <div className="spinner-wrapper"><div className="spinner"></div></div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout pageTitle="Alumni Dashboard" activeRoute="/alumni/dashboard">
      {/* Welcome Banner */}
      <div className="card mb-6" style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', border: 'none' }}>
        <h2 style={{ color: 'white', marginBottom: '0.5rem' }}>Hello, {user.firstName}! 🎓</h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '1.25rem' }}>
          {profile?.companyName ? `Working at ${profile.companyName} as ${profile.jobRole}` : 'Complete your profile to help students connect with you.'}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn" style={{ background: 'white', color: '#2563eb' }} onClick={() => navigate('/alumni/edit-profile')}>✏️ Edit Profile</button>
          <button className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', borderColor: 'rgba(255,255,255,0.4)' }} onClick={() => navigate('/alumni/post-job')}>💼 Post a Job</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: '1.5rem' }}>
        <div className="stat-card blue"><span className="stat-icon">🎉</span><span className="stat-number">{upcomingEvents.length}</span><div className="stat-label">Upcoming Events</div></div>
        <div className="stat-card purple"><span className="stat-icon">💼</span><span className="stat-number">{myJobs.length}</span><div className="stat-label">My Job Postings</div></div>
        <div className="stat-card green"><span className="stat-icon">📋</span><span className="stat-number">{myApplications.length}</span><div className="stat-label">My Applications</div></div>
      </div>

      <div className="grid-2">
        {/* My Profile Card */}
        <div className="card">
          <div className="card-header"><span className="card-title">👤 My Profile</span>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/alumni/profile')}>View Full</button>
          </div>
          {profile ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className="alumni-avatar" style={{ width: '56px', height: '56px', fontSize: '1.25rem' }}>
                  {(user.firstName?.[0] || '') + (user.lastName?.[0] || '')}
                </div>
                <div>
                  <div style={{ fontWeight: 700 }}>{user.firstName} {user.lastName}</div>
                  <div style={{ color: 'var(--primary)', fontSize: '0.875rem' }}>{profile.jobRole || 'Add your job role'}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{profile.companyName || 'Add your company'}</div>
                </div>
              </div>
              {[
                { label: '📍 Location', value: profile.location },
                { label: '🎓 Graduation', value: profile.graduationYear },
                { label: '🏛️ Department', value: profile.department },
              ].map(({ label, value }) => value && (
                <div key={label} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{label}:</span>
                  <span style={{ fontWeight: 500 }}>{value}</span>
                </div>
              ))}
              {profile.skills && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                  {profile.skills.split(',').slice(0, 4).map(s => (
                    <span key={s.trim()} className="badge badge-blue">{s.trim()}</span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '1.5rem' }}>
              <p>Profile not found. <button className="btn btn-primary btn-sm" onClick={() => navigate('/alumni/edit-profile')}>Set Up Profile</button></p>
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        <div className="card">
          <div className="card-header"><span className="card-title">🎉 Upcoming Events</span>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/events')}>View All</button>
          </div>
          {upcomingEvents.length === 0 ? (
            <div className="empty-state" style={{ padding: '1.5rem' }}><div className="empty-state-icon">📅</div><p className="empty-state-text">No upcoming events.</p></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {upcomingEvents.map(ev => (
                <div key={ev.id} className="announcement-card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/events/${ev.id}`)}>
                  <div className="announcement-title" style={{ fontSize: '0.875rem' }}>{ev.eventName}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    📅 {fmtDate(ev.eventDate)} · 📍 {ev.location}
                  </div>
                  <div className="announcement-meta">
                    {ev.isRegistered ? <span className="badge badge-green">✓ Registered</span> : <span className="badge badge-blue">Register</span>}
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>👥 {ev.registrationCount || 0} joined</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* My Job Postings */}
      <div className="card mt-4">
        <div className="card-header"><span className="card-title">💼 My Job Postings</span>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/alumni/post-job')}>+ Post Job</button>
        </div>
        {myJobs.length === 0 ? (
          <div className="empty-state" style={{ padding: '1.5rem' }}>
            <div className="empty-state-icon">💼</div>
            <p className="empty-state-text">You haven't posted any jobs yet.</p>
            <button className="btn btn-primary btn-sm mt-4" onClick={() => navigate('/alumni/post-job')}>Post Your First Job</button>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead><tr><th>Job Title</th><th>Company</th><th>Location</th><th>Applications</th><th>Posted</th></tr></thead>
              <tbody>
                {myJobs.map(j => (
                  <tr key={j.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/jobs/${j.id}`)}>
                    <td><strong>{j.jobTitle}</strong></td>
                    <td style={{ color: 'var(--primary)' }}>{j.companyName}</td>
                    <td>{j.location || '-'}</td>
                    <td><span className="badge badge-green">📋 {j.applicationCount || 0}</span></td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{fmtDate(j.postedDate)}</td>
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

export default AlumniDashboard;
