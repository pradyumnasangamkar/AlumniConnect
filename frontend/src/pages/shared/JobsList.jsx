import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { jobAPI } from '../../api/api';

function JobsList() {
  const { user, isAdmin, isAlumni } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tab, setTab] = useState('all');
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => { fetchJobs(); }, [tab]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      let data;
      if (tab === 'mine' && isAlumni) data = await jobAPI.getByAlumni(user.userId);
      else if (tab === 'applied') data = await jobAPI.getUserApplications(user.userId);
      else data = await jobAPI.getAll(user.userId);
      setJobs(data);
    } catch { } finally { setLoading(false); }
  };

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.trim().length > 1) {
      try { const data = await jobAPI.search(term, user.userId); setJobs(data); } catch { }
    } else if (term.trim() === '') { fetchJobs(); }
  };

  const handleApply = async (jobId) => {
    try {
      await jobAPI.apply(jobId, user.userId);
      setActionMsg('Application submitted successfully! 🎉');
      fetchJobs();
    } catch (err) { setActionMsg('Error: ' + (err.message || 'Failed to apply')); }
    setTimeout(() => setActionMsg(''), 4000);
  };

  const handleDelete = async (jobId, title) => {
    if (!window.confirm(`Delete job posting "${title}"?`)) return;
    try {
      await jobAPI.delete(jobId, user.userId);
      setActionMsg('Job deleted successfully');
      fetchJobs();
    } catch (err) { setActionMsg('Error: ' + err.message); }
  };

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
  const typeColors = { 'Full-Time': 'green', 'Part-Time': 'blue', 'Internship': 'purple', 'Contract': 'orange' };
  const getLogoLetters = (company) => company?.substring(0, 2).toUpperCase() || 'JB';

  return (
    <DashboardLayout pageTitle="Job Board" activeRoute="/jobs">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Job Opportunities</h1>
          <p>Explore jobs posted by alumni at top companies</p>
        </div>
        {isAlumni && <button className="btn btn-primary" onClick={() => navigate('/alumni/post-job')}>+ Post a Job</button>}
      </div>

      {actionMsg && <div className={`alert ${actionMsg.startsWith('Error') ? 'alert-error' : 'alert-success'}`}>{actionMsg}</div>}

      {/* Search */}
      <div className="search-bar">
        <div className="search-input-wrapper" style={{ flex: 1 }}>
          <span className="search-icon">🔍</span>
          <input className="form-input" placeholder="Search jobs by title, company, skills, or location..." value={searchTerm} onChange={handleSearch} style={{ paddingLeft: '2.5rem' }} />
        </div>
        {searchTerm && <button className="btn btn-ghost" onClick={() => { setSearchTerm(''); fetchJobs(); }}>✕ Clear</button>}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--border)' }}>
        {[['all', 'All Jobs'], ...(isAlumni ? [['mine', 'My Postings']] : []), ['applied', 'My Applications']].map(([key, label]) => (
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
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💼</div>
          <h3 className="empty-state-title">{tab === 'mine' ? 'No Postings Yet' : tab === 'applied' ? 'No Applications Yet' : 'No Jobs Found'}</h3>
          <p className="empty-state-text">
            {tab === 'mine' ? 'Post your first job to help students!' : tab === 'applied' ? 'Browse jobs and start applying!' : 'No job postings match your search.'}
          </p>
          {isAlumni && tab === 'mine' && <button className="btn btn-primary mt-4" onClick={() => navigate('/alumni/post-job')}>Post a Job</button>}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {jobs.map(job => (
            <div key={job.id} className="job-card">
              <div className="job-card-header">
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                    <div className="job-company-logo">{getLogoLetters(job.companyName)}</div>
                    <div>
                      <div className="job-title">{job.jobTitle}</div>
                      <div className="job-company">{job.companyName}</div>
                    </div>
                  </div>
                </div>
                {job.hasApplied && <span className="badge badge-green">Applied ✓</span>}
              </div>

              <div className="job-tags">
                {job.location && <span className="badge badge-gray">📍 {job.location}</span>}
                <span className={`badge badge-${typeColors[job.jobType] || 'blue'}`}>{job.jobType || 'Full-Time'}</span>
                {job.experienceRequired && <span className="badge badge-gray">🎯 {job.experienceRequired}</span>}
              </div>

              {job.skills && (
                <div className="job-tags">
                  {job.skills.split(',').slice(0, 3).map(s => (
                    <span key={s.trim()} className="badge badge-blue" style={{ fontSize: '0.7rem' }}>{s.trim()}</span>
                  ))}
                </div>
              )}

              {job.description && <p className="job-desc">{job.description}</p>}

              <div className="job-footer">
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Posted {fmtDate(job.postedDate)}</div>
                  {job.applicationDeadline && <div style={{ fontSize: '0.75rem', color: 'var(--warning)' }}>⏰ Deadline: {fmtDate(job.applicationDeadline)}</div>}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/jobs/${job.id}`)}>View</button>
                  {!isAdmin && !job.hasApplied && job.postedBy !== user.userId && (
                    <button className="btn btn-primary btn-sm" onClick={() => handleApply(job.id)}>Apply</button>
                  )}
                  {(isAdmin || (isAlumni && job.postedBy === user.userId)) && (
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(job.id, job.jobTitle)}>🗑️</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default JobsList;
