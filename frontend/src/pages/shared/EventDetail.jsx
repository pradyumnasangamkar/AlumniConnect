import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { eventAPI } from '../../api/api';

function EventDetail() {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    eventAPI.getById(id, user.userId)
      .then(setEvent)
      .catch(() => setError('Event not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRegister = async () => {
    try {
      const res = await eventAPI.register(id, user.userId);
      setMsg(res.message || 'Registered successfully!');
      setEvent({ ...event, isRegistered: true, registrationCount: (event.registrationCount || 0) + 1 });
    } catch (err) { setError(err.message || 'Failed to register'); }
  };

  const handleCancel = async () => {
    try {
      const res = await eventAPI.cancelRegistration(id, user.userId);
      setMsg(res.message || 'Registration cancelled');
      setEvent({ ...event, isRegistered: false, registrationCount: Math.max((event.registrationCount || 1) - 1, 0) });
    } catch (err) { setError(err.message || 'Failed to cancel'); }
  };

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '';

  if (loading) return (
    <DashboardLayout pageTitle="Event Details" activeRoute="/events">
      <div className="spinner-wrapper"><div className="spinner"></div></div>
    </DashboardLayout>
  );

  if (error && !event) return (
    <DashboardLayout pageTitle="Event Details" activeRoute="/events">
      <div className="empty-state"><div className="empty-state-icon">❌</div><h3>{error}</h3>
        <button className="btn btn-primary mt-4" onClick={() => navigate('/events')}>Back to Events</button>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout pageTitle={event?.eventName || 'Event'} activeRoute="/events">
      <div style={{ marginBottom: '1rem' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/events')}>← Back to Events</button>
      </div>

      {msg && <div className="alert alert-success">✅ {msg}</div>}
      {error && <div className="alert alert-error">❌ {error}</div>}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', padding: '2.5rem 2rem', color: 'white' }}>
          <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', marginBottom: '1rem', display: 'inline-block' }}>
            {event.category || 'Event'}
          </span>
          <h1 style={{ color: 'white', fontSize: '1.75rem', marginBottom: '0.75rem' }}>{event.eventName}</h1>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', color: 'rgba(255,255,255,0.9)' }}>
            <span>📅 {fmtDate(event.eventDate)}</span>
            <span>🕐 {event.eventTime || '10:00 AM'}</span>
            <span>📍 {event.location}</span>
            <span>👥 {event.registrationCount || 0} registered</span>
          </div>
        </div>

        <div style={{ padding: '2rem' }}>
          <div className="grid-2" style={{ alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ marginBottom: '1rem' }}>About This Event</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                {event.description || 'No description provided for this event.'}
              </p>

              {event.maxParticipants && (
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-main)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                  <strong>Capacity</strong>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    {event.registrationCount || 0} / {event.maxParticipants} spots filled
                  </p>
                  <div style={{ height: '6px', background: 'var(--border)', borderRadius: '999px', marginTop: '0.5rem', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: 'var(--primary)', borderRadius: '999px', width: `${Math.min(100, ((event.registrationCount || 0) / event.maxParticipants) * 100)}%` }} />
                  </div>
                </div>
              )}
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Registration</h3>
              {event.isRegistered ? (
                <div>
                  <div className="alert alert-success" style={{ marginBottom: '1rem' }}>✅ You are registered for this event!</div>
                  {!isAdmin && (
                    <button className="btn btn-danger w-full" style={{ justifyContent: 'center' }} onClick={handleCancel}>
                      Cancel Registration
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Join {event.registrationCount || 0} other participants for this event.
                  </p>
                  {!isAdmin && (
                    <button className="btn btn-primary w-full" style={{ justifyContent: 'center' }} onClick={handleRegister}>
                      🎟️ Register Now
                    </button>
                  )}
                </div>
              )}
              {event.createdByName && (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1rem', textAlign: 'center' }}>
                  Organized by {event.createdByName}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default EventDetail;
