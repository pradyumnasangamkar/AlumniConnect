import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { jobAPI } from '../../api/api';

function PostJob() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    jobTitle: '', companyName: '', location: '', jobType: 'Full-Time',
    experienceRequired: '', description: '', skills: '', applicationDeadline: '',
  });

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.jobTitle || !form.companyName) { setError('Job title and company name are required.'); return; }
    setSaving(true);
    try {
      await jobAPI.create(form, user.userId);
      setMessage('Job posted successfully! 🎉');
      setForm({ jobTitle: '', companyName: '', location: '', jobType: 'Full-Time', experienceRequired: '', description: '', skills: '', applicationDeadline: '' });
    } catch (err) {
      setError(err.message || 'Failed to post job');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout pageTitle="Post a Job" activeRoute="/alumni/post-job">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Post a Job</h1>
          <p>Share job opportunities at your company with students and fellow alumni</p>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate('/jobs')}>View All Jobs</button>
      </div>

      {message && (
        <div className="alert alert-success">
          ✅ {message}
          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-primary btn-sm" onClick={() => setMessage('')}>Post Another</button>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/jobs')}>View Jobs</button>
          </div>
        </div>
      )}
      {error && <div className="alert alert-error">❌ {error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="card mb-4">
          <div className="card-header"><span className="card-title">📋 Job Details</span></div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Job Title *</label>
              <input className="form-input" name="jobTitle" value={form.jobTitle} onChange={handleChange} placeholder="e.g. Software Engineer, Java Developer" required />
            </div>
            <div className="form-group">
              <label className="form-label">Company Name *</label>
              <input className="form-input" name="companyName" value={form.companyName} onChange={handleChange} placeholder="e.g. Infosys, TCS, Wipro" required />
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input className="form-input" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Bangalore, Remote" />
            </div>
            <div className="form-group">
              <label className="form-label">Job Type</label>
              <select className="form-select" name="jobType" value={form.jobType} onChange={handleChange}>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Experience Required</label>
              <input className="form-input" name="experienceRequired" value={form.experienceRequired} onChange={handleChange} placeholder="e.g. Freshers welcome, 0-2 years" />
            </div>
            <div className="form-group">
              <label className="form-label">Application Deadline</label>
              <input className="form-input" type="date" name="applicationDeadline" value={form.applicationDeadline} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Required Skills</label>
            <input className="form-input" name="skills" value={form.skills} onChange={handleChange} placeholder="e.g. Java, Spring Boot, MySQL, React (comma-separated)" />
          </div>
          <div className="form-group">
            <label className="form-label">Job Description</label>
            <textarea className="form-textarea" name="description" value={form.description} onChange={handleChange} placeholder="Describe the role, responsibilities, and what you are looking for in a candidate..." rows={6} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/alumni/dashboard')}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? '⏳ Posting...' : '📤 Post Job'}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}

export default PostJob;
