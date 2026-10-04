import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { alumniAPI } from '../../api/api';

function AlumniDirectory() {
  const { user } = useAuth();
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterDept, setFilterDept] = useState('');

  const departments = ['Computer Science', 'Information Technology', 'Electronics and Communication', 'Mechanical Engineering', 'Civil Engineering'];
  const years = Array.from({ length: 12 }, (_, i) => 2013 + i);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try { const data = await alumniAPI.getAll(); setAlumni(data); }
    catch { } finally { setLoading(false); }
  };

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.trim().length > 1) {
      try { const data = await alumniAPI.search(term); setAlumni(data); } catch { }
    } else if (term.trim() === '') {
      loadAll();
    }
  };

  const handleFilter = async (year, dept) => {
    try {
      const data = await alumniAPI.filter(year || undefined, dept || undefined);
      setAlumni(data);
    } catch { }
  };

  const getInitials = (firstName, lastName) =>
    (firstName?.[0] || '') + (lastName?.[0] || '');

  const avatarColors = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626'];
  const getColor = (name) => avatarColors[name?.charCodeAt(0) % avatarColors.length] || '#2563eb';

  return (
    <DashboardLayout pageTitle="Alumni Directory" activeRoute="/directory">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Alumni Directory</h1>
          <p>Connect with {alumni.length} alumni from your institution</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="search-bar">
        <div className="search-input-wrapper" style={{ flex: 2 }}>
          <span className="search-icon">🔍</span>
          <input className="form-input" placeholder="Search by name, company, or job role..." value={searchTerm} onChange={handleSearch} style={{ paddingLeft: '2.5rem' }} />
        </div>
        <select className="form-select" style={{ maxWidth: '180px' }} value={filterYear}
          onChange={(e) => { setFilterYear(e.target.value); handleFilter(e.target.value, filterDept); }}>
          <option value="">All Years</option>
          {years.map(y => <option key={y} value={y}>Class of {y}</option>)}
        </select>
        <select className="form-select" style={{ maxWidth: '220px' }} value={filterDept}
          onChange={(e) => { setFilterDept(e.target.value); handleFilter(filterYear, e.target.value); }}>
          <option value="">All Departments</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        {(filterYear || filterDept || searchTerm) && (
          <button className="btn btn-ghost" onClick={() => { setSearchTerm(''); setFilterYear(''); setFilterDept(''); loadAll(); }}>
            ✕ Clear
          </button>
        )}
      </div>

      {loading ? (
        <div className="spinner-wrapper"><div className="spinner"></div><p className="text-muted">Loading alumni...</p></div>
      ) : alumni.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <h3 className="empty-state-title">No Alumni Found</h3>
          <p className="empty-state-text">Try a different search or clear the filters.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {alumni.map(a => (
            <div key={a.id} className="alumni-card">
              <div className="alumni-avatar" style={{ background: `linear-gradient(135deg, ${getColor(a.firstName)}, #7c3aed)` }}>
                {getInitials(a.firstName, a.lastName)}
              </div>
              <div className="alumni-name">{a.firstName} {a.lastName}</div>
              {a.jobRole && <div className="alumni-role">{a.jobRole}</div>}
              {a.companyName && <div className="alumni-company">🏢 {a.companyName}</div>}
              {a.location && <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>📍 {a.location}</div>}
              <div className="alumni-meta">
                {a.graduationYear && <span className="badge badge-blue">Class of {a.graduationYear}</span>}
                {a.department && <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                  {a.department.split(' ')[0]}
                </span>}
              </div>
              {a.skills && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', justifyContent: 'center' }}>
                  {a.skills.split(',').slice(0, 3).map(s => (
                    <span key={s.trim()} className="badge badge-gray" style={{ fontSize: '0.65rem' }}>{s.trim()}</span>
                  ))}
                </div>
              )}
              {a.linkedinUrl && (
                <a href={a.linkedinUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm w-full" style={{ justifyContent: 'center', marginTop: '0.25rem' }}>
                  🔗 LinkedIn
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default AlumniDirectory;
