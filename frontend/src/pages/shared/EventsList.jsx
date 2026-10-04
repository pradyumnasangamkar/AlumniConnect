import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { eventAPI } from '../../api/api';

function EventsList() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [tab, setTab] = useState('upcoming');
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => { fetchEvents(); }, [tab]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      let data;
      if (tab === 'all') data = await eventAPI.getAll(user.userId);
      else if (tab === 'upcoming') data = await eventAPI.getUpcoming(user.userId);
      else data = await eventAPI.getUserRegistered(user.userId);
      setEvents(data);
    } catch { } finally { setLoading(false); }
  };

  const handleRegister = async (eventId, isRegistered) => {
    try {
      if (isRegistered) {
        await eventAPI.cancelRegistration(eventId, user.userId);
        setActionMsg('Registration cancelled.');
      } else {
        await eventAPI.register(eventId, user.userId);
        setActionMsg('Successfully registered!');
      }
      fetchEvents();
    } catch (err) { setActionMsg('Error: ' + (err.message || 'Something went wrong')); }
    setTimeout(() => setActionMsg(''), 3000);
  };

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : '';
  const categoryColors = { ALUMNI_MEET: 'blue', TECH_TALK: 'purple', CAREER: 'green', HACKATHON: 'orange', CULTURAL: 'gray', GENERAL: 'gray' };

  return (
    <DashboardLayout pageTitle="Events" activeRoute="/events">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Events</h1>
          <p>Discover and register for upcoming events</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => navigate('/admin/events')}>+ Manage Events</button>
        )}
      </div>

      {actionMsg && <div className={`alert ${actionMsg.startsWith('Error') ? 'alert-error' : 'alert-success'}`}>{actionMsg}</div>}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--border)', paddingBottom: '0' }}>
        {[['upcoming', 'Upcoming'], ['all', 'All Events'], ['registered', 'My Registrations']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            padding: '0.75rem 1.25rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
            background: 'none', border: 'none', borderBottom: tab === key ? '2px solid var(--primary)' : '2px solid transparent',
            color: tab === key ? 'var(--primary)' : 'var(--text-secondary)', marginBottom: '-2px',
          }}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="spinner-wrapper"><div className="spinner"></div></div>
      ) : events.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <h3 className="empty-state-title">{tab === 'registered' ? 'No Registrations Yet' : 'No Events Found'}</h3>
          <p className="empty-state-text">{tab === 'registered' ? 'Browse events and register for some!' : 'Check back soon for upcoming events.'}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {events.map(event => (
            <div key={event.id} className="event-card">
              <div className="event-card-banner" />
              <div className="event-card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span className="event-date-badge">📅 {fmtDate(event.eventDate)}</span>
                  <span className={`badge badge-${categoryColors[event.category] || 'gray'}`}>{event.category || 'Event'}</span>
                </div>
                <div className="event-title">{event.eventName}</div>
                <div className="event-meta">
                  <div className="event-meta-item">🕐 {event.eventTime || '10:00'}</div>
                  <div className="event-meta-item">📍 {event.location}</div>
                  {event.maxParticipants && <div className="event-meta-item">👥 Max {event.maxParticipants} participants</div>}
                </div>
                {event.description && (
                  <p className="event-desc">{event.description}</p>
                )}
                <div className="event-footer">
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    👥 {event.registrationCount || 0} registered
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/events/${event.id}`)}>View</button>
                    {!isAdmin && (
                      <button
                        className={`btn btn-sm ${event.isRegistered ? 'btn-danger' : 'btn-primary'}`}
                        onClick={() => handleRegister(event.id, event.isRegistered)}>
                        {event.isRegistered ? '✕ Cancel' : '✓ Register'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default EventsList;
