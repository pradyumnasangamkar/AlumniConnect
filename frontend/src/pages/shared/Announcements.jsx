import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { announcementAPI } from '../../api/api';

function Announcements() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [msg, setMsg] = useState('');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const data = await announcementAPI.getAll();
      setAnnouncements(data);
      setFiltered(data);
    } catch { } finally { setLoading(false); }
  };

  const handleFilter = (cat) => {
    setActiveCategory(cat);
    if (cat === 'ALL') setFiltered(announcements);
    else setFiltered(announcements.filter(a => a.category === cat));
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await announcementAPI.delete(id);
      setMsg('Announcement deleted.');
      fetchAll();
    } catch { setMsg('Failed to delete.'); }
    setTimeout(() => setMsg(''), 3000);
  };

  const categories = ['ALL', 'GENERAL', 'EVENT', 'JOB', 'IMPORTANT', 'SCHOLARSHIP'];
  const catColors = { GENERAL: 'blue', EVENT: 'green', JOB: 'purple', IMPORTANT: 'orange', SCHOLARSHIP: 'gray' };
  const borderColors = { IMPORTANT: 'var(--error)', EVENT: 'var(--success)', JOB: 'var(--secondary)', SCHOLARSHIP: 'var(--text-muted)', GENERAL: 'var(--primary)' };

  return (
    <DashboardLayout pageTitle="Announcements" activeRoute="/announcements">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Announcements</h1>
          <p>Stay updated with the latest news and notifications</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => navigate('/admin/announcements')}>+ Create Announcement</button>
        )}
      </div>

      {msg && <div className="alert alert-info">{msg}</div>}

      {/* Category Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => handleFilter(cat)} style={{
            padding: '0.5rem 1rem', borderRadius: '999px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
            background: activeCategory === cat ? 'var(--primary)' : 'white',
            color: activeCategory === cat ? 'white' : 'var(--text-secondary)',
            border: `1.5px solid ${activeCategory === cat ? 'var(--primary)' : 'var(--border)'}`,
            transition: 'all 0.2s',
          }}>
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="spinner-wrapper"><div className="spinner"></div></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📢</div>
          <h3 className="empty-state-title">No Announcements</h3>
          <p className="empty-state-text">
            {activeCategory === 'ALL' ? 'No announcements yet.' : `No ${activeCategory} announcements.`}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map(ann => (
            <div key={ann.id} className="announcement-card" style={{ borderLeftColor: borderColors[ann.category] || 'var(--primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <span className={`badge badge-${catColors[ann.category] || 'blue'}`}>{ann.category || 'GENERAL'}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {ann.createdAt ? new Date(ann.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <div className="announcement-title">{ann.title}</div>
                  <div className="announcement-content" style={{ marginTop: '0.5rem' }}>{ann.content}</div>
                  {ann.createdByName && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                      📢 Posted by {ann.createdByName}
                    </div>
                  )}
                </div>
                {isAdmin && (
                  <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/announcements')}>✏️</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(ann.id, ann.title)}>🗑️</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default Announcements;
