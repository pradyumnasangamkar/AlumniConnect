import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../api/api';

function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
    role: 'ALUMNI', gender: '', graduationYear: '', department: '',
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setApiError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!form.email.includes('@')) newErrors.email = 'Enter a valid email';
    if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!form.role) newErrors.role = 'Please select a role';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = form;
      if (payload.graduationYear) payload.graduationYear = parseInt(payload.graduationYear);
      await authAPI.register(payload);
      setSuccess('Registration successful! You can now login with your credentials.');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setApiError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const departments = ['Computer Science', 'Information Technology', 'Electronics and Communication', 'Mechanical Engineering', 'Civil Engineering'];

  return (
    <div className="auth-page">
      <div className="auth-left">
        <h1>Join AlumniConnect</h1>
        <p>Create your account and become part of a thriving alumni community with thousands of opportunities.</p>
        <div className="auth-features">
          {[
            { icon: '🎓', text: 'Alumni: Build your professional profile and post job opportunities' },
            { icon: '📚', text: 'Students: Connect with alumni mentors and explore career paths' },
            { icon: '🌐', text: 'Network with professionals from top companies across India' },
          ].map((f, i) => (
            <div className="auth-feature" key={i}>
              <div className="auth-feature-icon">{f.icon}</div>
              <span>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-container" style={{ maxWidth: '480px' }}>
          <div className="auth-form-header">
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📝</div>
            <h2>Create Account</h2>
            <p>Fill in your details to get started</p>
          </div>

          <div className="auth-form">
            {success && <div className="alert alert-success">✅ {success}</div>}
            {apiError && <div className="alert alert-error">❌ {apiError}</div>}

            <form onSubmit={handleSubmit}>
              <div className="grid-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">First Name *</label>
                  <input className={`form-input ${errors.firstName ? 'error' : ''}`} name="firstName" placeholder="Rahul" value={form.firstName} onChange={handleChange} />
                  {errors.firstName && <span className="form-error">{errors.firstName}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name *</label>
                  <input className={`form-input ${errors.lastName ? 'error' : ''}`} name="lastName" placeholder="Sharma" value={form.lastName} onChange={handleChange} />
                  {errors.lastName && <span className="form-error">{errors.lastName}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input className={`form-input ${errors.email ? 'error' : ''}`} type="email" name="email" placeholder="rahul@example.com" value={form.email} onChange={handleChange} />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>

              <div className="grid-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Password *</label>
                  <input className={`form-input ${errors.password ? 'error' : ''}`} type="password" name="password" placeholder="Min 6 characters" value={form.password} onChange={handleChange} />
                  {errors.password && <span className="form-error">{errors.password}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password *</label>
                  <input className={`form-input ${errors.confirmPassword ? 'error' : ''}`} type="password" name="confirmPassword" placeholder="Re-enter password" value={form.confirmPassword} onChange={handleChange} />
                  {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
                </div>
              </div>

              <div className="grid-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Role *</label>
                  <select className={`form-select ${errors.role ? 'error' : ''}`} name="role" value={form.role} onChange={handleChange}>
                    <option value="ALUMNI">Alumni</option>
                    <option value="STUDENT">Student</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select className="form-select" name="gender" value={form.gender} onChange={handleChange}>
                    <option value="">Prefer not to say</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Graduation Year</label>
                  <input className="form-input" type="number" name="graduationYear" placeholder="e.g. 2022" min="1990" max="2030" value={form.graduationYear} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select className="form-select" name="department" value={form.department} onChange={handleChange}>
                    <option value="">Select department</option>
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center', marginTop: '0.5rem' }} disabled={loading}>
                {loading ? '⏳ Creating account...' : '🚀 Create Account'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Already have an account? <Link to="/login" style={{ fontWeight: 700 }}>Sign in →</Link>
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Link to="/" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
