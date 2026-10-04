import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { announcementAPI } from '../../api/api';

function ManageAnnouncements() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAnn, setEditingAnn] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', content: '', category: 'GENERAL' });

  useEffect(() => { fetchAnnouncements(); }, []);

  const fetchAnnouncements = async () => {
    try {
      const data = await announcementAPI.getAll();
      setAnnouncements(data);
    } catch { setError('Failed to load announcements'); }
    finally { setLoading(false); }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');
    if (!form.title.trim() || !form.content.trim()) { setError('Title and content are required.'); return; }
    try {
      if (editingAnn) {
        await announcementAPI.update(editingAnn.id, form);
        setMessage('Announcement updated!');
      } else {
        await announcementAPI.create(form, user.userId);
        setMessage('Announcement created!');
      }
      setForm({ title: '', content: '', category: 'GENERAL' });
      setShowForm(false); setEditingAnn(null);
      fetchAnnouncements();
    } catch (err) { setError(err.message || 'Failed to save announcement'); }
  };

  const handleEdit = (ann) => {
    setEditingAnn(ann);
    setForm({ title: ann.title, content: ann.content, category: ann.category || 'GENERAL' });
    setShowForm(true); setError(''); setMessage('');
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete announcement "${title}"?`)) return;
    try {
      await announcementAPI.delete(id);
      setMessage('Announcement deleted!');
      fetchAnnouncements();
    } catch { setError('Failed to delete announcement'); }
  };

  const categoryColors = { GENERAL: 'blue', EVENT: 'green', JOB: 'purple', IMPORTANT: 'orange', SCHOLARSHIP: 'gray' };

  return (
    <DashboardLayout pageTitle="Manage Announcements" activeRoute="/admin/announcements">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Announcements</h1>
          <p>Create and manage platform-wide announcements</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditingAnn(null); setForm({ title: '', content: '', category: 'GENERAL' }); setError(''); setMessage(''); }}>
          {showForm ? '✕ Cancel' : '+ New Announcement'}
        </button>
      </div>

      {message && <div className="alert alert-success">✅ {message}</div>}
      {error && <div className="alert alert-error">❌ {error}</div>}

      {showForm && (
        <div className="card mb-6">
          <div className="card-header"><span className="card-title">{editingAnn ? 'Edit Announcement' : 'Create Announcement'}</span></div>
          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input className="form-input" name="title" value={form.title} onChange={handleChange} placeholder="Announcement title" required />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" name="category" value={form.category} onChange={handleChange}>
                  <option value="GENERAL">General</option>
                  <option value="EVENT">Event</option>
                  <option value="JOB">Job / Career</option>
                  <option value="IMPORTANT">Important</option>
                  <option value="SCHOLARSHIP">Scholarship</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Content *</label>
              <textarea className="form-textarea" name="content" value={form.content} onChange={handleChange} placeholder="Write the full announcement content here..." rows={5} required />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">{editingAnn ? 'Update' : 'Publish'} Announcement</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="spinner-wrapper"><div className="spinner"></div></div>
      ) : announcements.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">📢</div>
            <h3 className="empty-state-title">No Announcements</h3>
            <p className="empty-state-text">Create your first announcement.</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {announcements.map(ann => (
            <div key={ann.id} className={`announcement-card ${ann.category || ''}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span className={`badge badge-${categoryColors[ann.category] || 'blue'}`}>{ann.category}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {ann.createdAt ? new Date(ann.createdAt).toLocaleString() : ''}
                    </span>
                  </div>
                  <div className="announcement-title">{ann.title}</div>
                  <div className="announcement-content">{ann.content}</div>
                  {ann.createdByName && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                      Posted by: {ann.createdByName}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(ann)}>✏️ Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(ann.id, ann.title)}>🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default ManageAnnouncements;
