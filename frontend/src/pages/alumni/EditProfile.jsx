import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { alumniAPI } from '../../api/api';

function EditProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    companyName: '', jobRole: '', location: '', phone: '',
    bio: '', skills: '', linkedinUrl: '', profilePhotoUrl: '',
    graduationYear: '', department: '',
  });

  const departments = ['Computer Science', 'Information Technology', 'Electronics and Communication', 'Mechanical Engineering', 'Civil Engineering'];

  useEffect(() => {
    alumniAPI.getByUserId(user.userId)
      .then(p => {
        setForm({
          companyName: p.companyName || '',
          jobRole: p.jobRole || '',
          location: p.location || '',
          phone: p.phone || '',
          bio: p.bio || '',
          skills: p.skills || '',
          linkedinUrl: p.linkedinUrl || '',
          profilePhotoUrl: p.profilePhotoUrl || '',
          graduationYear: p.graduationYear || user.graduationYear || '',
          department: p.department || user.department || '',
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user.userId]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');
    setSaving(true);
    try {
      const payload = { ...form, graduationYear: form.graduationYear ? parseInt(form.graduationYear) : null };
      await alumniAPI.updateProfile(user.userId, payload);
      setMessage('Profile updated successfully! 🎉');
      setTimeout(() => navigate('/alumni/profile'), 1500);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <DashboardLayout pageTitle="Edit Profile" activeRoute="/alumni/edit-profile">
      <div className="spinner-wrapper"><div className="spinner"></div></div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout pageTitle="Edit Profile" activeRoute="/alumni/edit-profile">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Edit Profile</h1>
          <p>Update your professional information visible to other users</p>
        </div>
      </div>

      {message && <div className="alert alert-success">✅ {message}</div>}
      {error && <div className="alert alert-error">❌ {error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="card mb-4">
          <div className="card-header"><span className="card-title">🏢 Professional Info</span></div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input className="form-input" name="companyName" value={form.companyName} onChange={handleChange} placeholder="e.g. Infosys, TCS, Google" />
            </div>
            <div className="form-group">
              <label className="form-label">Job Role / Title</label>
              <input className="form-input" name="jobRole" value={form.jobRole} onChange={handleChange} placeholder="e.g. Software Engineer" />
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input className="form-input" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Bangalore, India" />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input className="form-input" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 9876543210" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Bio / About</label>
            <textarea className="form-textarea" name="bio" value={form.bio} onChange={handleChange} placeholder="Tell other users about yourself, your journey, and your interests..." rows={4} />
          </div>
          <div className="form-group">
            <label className="form-label">Skills (comma-separated)</label>
            <input className="form-input" name="skills" value={form.skills} onChange={handleChange} placeholder="Java, Spring Boot, React, MySQL, Git" />
          </div>
          <div className="form-group">
            <label className="form-label">LinkedIn Profile URL</label>
            <input className="form-input" name="linkedinUrl" value={form.linkedinUrl} onChange={handleChange} placeholder="https://linkedin.com/in/yourname" />
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header"><span className="card-title">🎓 Education</span></div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Graduation Year</label>
              <input className="form-input" type="number" name="graduationYear" value={form.graduationYear} onChange={handleChange} placeholder="2022" min="1990" max="2030" />
            </div>
            <div className="form-group">
              <label className="form-label">Department</label>
              <select className="form-select" name="department" value={form.department} onChange={handleChange}>
                <option value="">Select department</option>
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/alumni/profile')}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? '⏳ Saving...' : '💾 Save Profile'}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}

export default EditProfile;
