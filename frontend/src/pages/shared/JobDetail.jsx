import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { jobAPI } from '../../api/api';

function JobDetail() {
  const { id } = useParams();
  const { user, isAdmin, isAlumni } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    jobAPI.getById(id, user.userId)
      .then(setJob)
      .catch(() => setError('Job not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    try {
      const res = await jobAPI.apply(id, user.userId, coverNote);
      setMsg(res.message || 'Application submitted!');
      setJob({ ...job, hasApplied: true, applicationCount: (job.applicationCount || 0) + 1 });
      setShowApplyForm(false);
    } catch (err) { setError(err.message || 'Failed to apply'); }
    finally { setApplying(false); }
  };

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
  const typeColors = { 'Full-Time': 'green', 'Part-Time': 'blue', 'Internship': 'purple', 'Contract': 'orange' };

  if (loading) return (
    <DashboardLayout pageTitle="Job Details" activeRoute="/jobs">
      <div className="spinner-wrapper"><div className="spinner"></div></div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout pageTitle={job?.jobTitle || 'Job'} activeRoute="/jobs">
      <div style={{ marginBottom: '1rem' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/jobs')}>← Back to Jobs</button>
      </div>

      {msg && <div className="alert alert-success">✅ {msg}</div>}
      {error && <div className="alert alert-error">❌ {error}</div>}

      {job && (
        <div className="grid-2" style={{ alignItems: 'flex-start' }}>
          {/* Main Job Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card">
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div className="job-company-logo" style={{ width: '56px', height: '56px', fontSize: '1.25rem' }}>
                  {job.companyName?.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.375rem', marginBottom: '0.25rem' }}>{job.jobTitle}</h2>
                  <div style={{ color: 'var(--primary)', fontWeight: 600, marginBottom: '0.5rem' }}>{job.companyName}</div>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {job.location && <span className="badge badge-gray">📍 {job.location}</span>}
                    <span className={`badge badge-${typeColors[job.jobType] || 'blue'}`}>{job.jobType}</span>
                    {job.experienceRequired && <span className="badge badge-gray">🎯 {job.experienceRequired}</span>}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', padding: '1rem', background: 'var(--bg-main)', borderRadius: 'var(--radius)', marginBottom: '1.5rem' }}>
                <div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Posted</div><div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{fmtDate(job.postedDate)}</div></div>
                {job.applicationDeadline && <div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Deadline</div><div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--warning)' }}>{fmtDate(job.applicationDeadline)}</div></div>}
                <div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Applications</div><div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{job.applicationCount || 0}</div></div>
                {job.postedByName && <div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Posted by</div><div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{job.postedByName}</div></div>}
              </div>

              <h3 style={{ marginBottom: '0.75rem' }}>Job Description</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>
                {job.description || 'No detailed description provided.'}
              </p>
            </div>

            {job.skills && (
              <div className="card">
                <div className="card-header"><span className="card-title">🛠️ Required Skills</span></div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {job.skills.split(',').map(s => (
                    <span key={s.trim()} className="badge badge-blue" style={{ padding: '0.4rem 0.75rem' }}>{s.trim()}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Apply Card */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Apply for this Job</h3>
            {job.hasApplied ? (
              <div className="alert alert-success">✅ You have already applied for this job!</div>
            ) : isAdmin || job.postedBy === user.userId ? (
              <div className="alert alert-info">ℹ️ {isAdmin ? 'Admins' : 'You'} cannot apply to this posting.</div>
            ) : showApplyForm ? (
              <form onSubmit={handleApply}>
                <div className="form-group">
                  <label className="form-label">Cover Note (optional)</label>
                  <textarea className="form-textarea" value={coverNote} onChange={e => setCoverNote(e.target.value)} placeholder="Tell the hiring manager why you're a great fit..." rows={5} />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column' }}>
                  <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center' }} disabled={applying}>
                    {applying ? '⏳ Submitting...' : '📤 Submit Application'}
                  </button>
                  <button type="button" className="btn btn-ghost w-full" style={{ justifyContent: 'center' }} onClick={() => setShowApplyForm(false)}>Cancel</button>
                </div>
              </form>
            ) : (
              <div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                  Click the button below to apply. You can include a short cover note explaining why you're the right fit.
                </p>
                <button className="btn btn-primary w-full" style={{ justifyContent: 'center' }} onClick={() => setShowApplyForm(true)}>
                  🚀 Apply Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default JobDetail;
