import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/api';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const data = await authAPI.login(form);
      login(data); // Store user in context + localStorage
      // Redirect based on role
      if (data.role === 'ADMIN') navigate('/admin/dashboard');
      else if (data.role === 'ALUMNI') navigate('/alumni/dashboard');
      else navigate('/student/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    setLoading(true);
    setError('');
    let demoCredentials = { email: 'admin@college.edu', password: 'password123' };
    if (role === 'ALUMNI') demoCredentials = { email: 'rahul@example.com', password: 'password123' };
    if (role === 'STUDENT') demoCredentials = { email: 'arjun@student.edu', password: 'password123' };

    try {
      const data = await authAPI.login(demoCredentials);
      login(data);
      if (data.role === 'ADMIN') navigate('/admin/dashboard');
      else if (data.role === 'ALUMNI') navigate('/alumni/dashboard');
      else navigate('/student/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left Branding Panel */}
      <div className="auth-left">
        <h1>Welcome to AlumniConnect</h1>
        <p>Your gateway to a powerful alumni network. Connect, discover opportunities, and grow together.</p>
        <div className="auth-features">
          {[
            { icon: '👥', text: 'Browse 500+ alumni profiles and connect with industry professionals' },
            { icon: '🎉', text: 'Register for exclusive events, workshops, and alumni meets' },
            { icon: '💼', text: 'Access alumni-posted job opportunities and internships' },
          ].map((f, i) => (
            <div className="auth-feature" key={i}>
              <div className="auth-feature-icon">{f.icon}</div>
              <span>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔑</div>
            <h2>Sign In</h2>
            <p>Enter your credentials or use 1-click demo login</p>
          </div>

          <div className="auth-form">
            {error && <div className="alert alert-error">❌ {error}</div>}

            {/* Quick 1-Click Demo Login for recruiters / visitors */}
            <div style={{ marginBottom: '1.25rem', padding: '0.875rem', background: 'var(--bg-main)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem', textAlign: 'center', letterSpacing: '0.5px' }}>
                ⚡ 1-CLICK DEMO ACCESS
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="button" onClick={() => handleDemoLogin('ADMIN')} className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center', fontSize: '0.75rem' }} disabled={loading}>
                  👑 Admin
                </button>
                <button type="button" onClick={() => handleDemoLogin('ALUMNI')} className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center', fontSize: '0.75rem' }} disabled={loading}>
                  🎓 Alumni
                </button>
                <button type="button" onClick={() => handleDemoLogin('STUDENT')} className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center', fontSize: '0.75rem' }} disabled={loading}>
                  📚 Student
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  className={`form-input ${error ? 'error' : ''}`}
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  className={`form-input ${error ? 'error' : ''}`}
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                style={{ justifyContent: 'center', marginTop: '0.5rem' }}
                disabled={loading}
              >
                {loading ? '⏳ Signing in...' : '🔑 Sign In'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Don't have an account?{' '}
                <Link to="/register" style={{ fontWeight: 700 }}>Create one →</Link>
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link to="/" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
