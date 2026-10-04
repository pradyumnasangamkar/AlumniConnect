import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { alumniAPI } from '../../api/api';

function AlumniProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    alumniAPI.getByUserId(user.userId)
      .then(setProfile)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user.userId]);

  if (loading) return (
    <DashboardLayout pageTitle="My Profile" activeRoute="/alumni/profile">
      <div className="spinner-wrapper"><div className="spinner"></div></div>
    </DashboardLayout>
  );

  const initials = (user.firstName?.[0] || '') + (user.lastName?.[0] || '');
  const skills = profile?.skills ? profile.skills.split(',').map(s => s.trim()).filter(Boolean) : [];

  return (
    <DashboardLayout pageTitle="My Profile" activeRoute="/alumni/profile">
      {/* Profile Hero */}
      <div className="card mb-6" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', height: '120px' }} />
        <div style={{ padding: '0 2rem 2rem', marginTop: '-50px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div className="alumni-avatar" style={{ width: '90px', height: '90px', fontSize: '2rem', border: '4px solid white' }}>
              {initials}
            </div>
            <button className="btn btn-secondary" onClick={() => navigate('/alumni/edit-profile')}>✏️ Edit Profile</button>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{user.firstName} {user.lastName}</h2>
            {profile?.jobRole && <p style={{ color: 'var(--primary)', fontWeight: 600, marginBottom: '0.25rem' }}>{profile.jobRole}</p>}
            {profile?.companyName && <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>🏢 {profile.companyName}</p>}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {profile?.location && <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>📍 {profile.location}</span>}
              {profile?.graduationYear && <span className="badge badge-blue">Class of {profile.graduationYear}</span>}
              {profile?.department && <span className="badge badge-purple">{profile.department}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* About */}
          <div className="card">
            <div className="card-header"><span className="card-title">📝 About</span></div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.875rem' }}>
              {profile?.bio || 'No bio added yet. Click Edit Profile to add one.'}
            </p>
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="card">
              <div className="card-header"><span className="card-title">🛠️ Skills</span></div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {skills.map(s => <span key={s} className="badge badge-blue" style={{ padding: '0.4rem 0.75rem' }}>{s}</span>)}
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Contact Info */}
          <div className="card">
            <div className="card-header"><span className="card-title">📬 Contact</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { icon: '📧', label: 'Email', value: user.email },
                { icon: '📱', label: 'Phone', value: profile?.phone },
                { icon: '🔗', label: 'LinkedIn', value: profile?.linkedinUrl, link: true },
              ].map(({ icon, label, value, link }) => value && (
                <div key={label} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', fontSize: '0.875rem' }}>
                  <span>{icon}</span>
                  <div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{label}</div>
                    {link ? (
                      <a href={value} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>{value}</a>
                    ) : (
                      <div style={{ fontWeight: 500 }}>{value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="card">
            <div className="card-header"><span className="card-title">🎓 Education</span></div>
            <div style={{ fontSize: '0.875rem' }}>
              <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{profile?.department || user.department || 'Department not set'}</div>
              <div style={{ color: 'var(--text-secondary)' }}>Graduation Year: {profile?.graduationYear || user.graduationYear || 'Not set'}</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AlumniProfile;
