import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { eventAPI, announcementAPI, adminAPI, alumniAPI } from '../../api/api';

/**
 * ManageEvents - Admin page to create, edit, and delete events.
 */
function ManageEvents() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    eventName: '',
    eventDate: '',
    eventTime: '10:00',
    location: '',
    description: '',
    category: 'GENERAL',
    maxParticipants: '',
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await eventAPI.getAll(user.userId);
      setEvents(data);
    } catch (err) {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!form.eventName || !form.eventDate || !form.location) {
      setError('Please fill all required fields (Name, Date, Location)');
      return;
    }

    try {
      const payload = {
        ...form,
        maxParticipants: form.maxParticipants ? parseInt(form.maxParticipants) : null,
      };

      if (editingEvent) {
        await eventAPI.update(editingEvent.id, payload);
        setMessage('Event updated successfully!');
      } else {
        await eventAPI.create(payload, user.userId);
        setMessage('Event created successfully!');
      }

      setForm({ eventName: '', eventDate: '', eventTime: '10:00', location: '', description: '', category: 'GENERAL', maxParticipants: '' });
      setShowForm(false);
      setEditingEvent(null);
      fetchEvents();
    } catch (err) {
      setError(err.message || 'Failed to save event');
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setForm({
      eventName: event.eventName || '',
      eventDate: event.eventDate || '',
      eventTime: event.eventTime || '10:00',
      location: event.location || '',
      description: event.description || '',
      category: event.category || 'GENERAL',
      maxParticipants: event.maxParticipants || '',
    });
    setShowForm(true);
    setError('');
    setMessage('');
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete event "${name}"? This will also remove all registrations.`)) return;
    try {
      await eventAPI.delete(id);
      setMessage('Event deleted successfully!');
      fetchEvents();
    } catch (err) {
      setError('Failed to delete event');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <DashboardLayout pageTitle="Manage Events" activeRoute="/admin/events">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Manage Events</h1>
          <p>Create and manage events for alumni and students</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditingEvent(null); setForm({ eventName: '', eventDate: '', eventTime: '10:00', location: '', description: '', category: 'GENERAL', maxParticipants: '' }); setError(''); setMessage(''); }}>
          {showForm ? '✕ Cancel' : '+ Create Event'}
        </button>
      </div>

      {message && <div className="alert alert-success">✅ {message}</div>}
      {error && <div className="alert alert-error">❌ {error}</div>}

      {/* Event Form */}
      {showForm && (
        <div className="card mb-6">
          <div className="card-header">
            <span className="card-title">{editingEvent ? 'Edit Event' : 'Create New Event'}</span>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Event Name *</label>
                <input className="form-input" name="eventName" value={form.eventName} onChange={handleChange} placeholder="e.g. Annual Alumni Meet 2025" required />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" name="category" value={form.category} onChange={handleChange}>
                  <option value="GENERAL">General</option>
                  <option value="ALUMNI_MEET">Alumni Meet</option>
                  <option value="TECH_TALK">Tech Talk</option>
                  <option value="CAREER">Career Guidance</option>
                  <option value="HACKATHON">Hackathon</option>
                  <option value="CULTURAL">Cultural</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Event Date *</label>
                <input className="form-input" type="date" name="eventDate" value={form.eventDate} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Event Time</label>
                <input className="form-input" type="time" name="eventTime" value={form.eventTime} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Location *</label>
                <input className="form-input" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Main Auditorium, Pune" required />
              </div>
              <div className="form-group">
                <label className="form-label">Max Participants (optional)</label>
                <input className="form-input" type="number" name="maxParticipants" value={form.maxParticipants} onChange={handleChange} placeholder="Leave empty for unlimited" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" name="description" value={form.description} onChange={handleChange} placeholder="Describe the event..." rows={4} />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">{editingEvent ? 'Update Event' : 'Create Event'}</button>
            </div>
          </form>
        </div>
      )}

      {/* Events Table */}
      {loading ? (
        <div className="spinner-wrapper"><div className="spinner"></div></div>
      ) : events.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">🎉</div>
            <h3 className="empty-state-title">No Events Yet</h3>
            <p className="empty-state-text">Create your first event to get started.</p>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-header">
            <span className="card-title">All Events ({events.length})</span>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Category</th>
                  <th>Registrations</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map(event => (
                  <tr key={event.id}>
                    <td><strong>{event.eventName}</strong></td>
                    <td>{formatDate(event.eventDate)}</td>
                    <td>{event.location}</td>
                    <td>
                      <span className="badge badge-blue">{event.category}</span>
                    </td>
                    <td>
                      <span className="badge badge-gray">👥 {event.registrationCount || 0}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(event)}>✏️ Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(event.id, event.eventName)}>🗑️ Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default ManageEvents;
