import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LandingPage() {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (isLoggedIn && user) {
      if (user.role === 'ADMIN') navigate('/admin/dashboard');
      else if (user.role === 'ALUMNI') navigate('/alumni/dashboard');
      else if (user.role === 'STUDENT') navigate('/student/dashboard');
    }
  }, [isLoggedIn]);

  const features = [
    { icon: '👥', title: 'Alumni Directory', desc: 'Browse and connect with thousands of alumni. Filter by graduation year, department, company, or location.' },
    { icon: '🎉', title: 'Events', desc: 'Discover and register for alumni meets, tech talks, career workshops, hackathons, and more.' },
    { icon: '💼', title: 'Job Board', desc: 'Alumni post exclusive job opportunities. Students and fellow alumni can apply directly through the platform.' },
    { icon: '📢', title: 'Announcements', desc: 'Stay updated with the latest news, scholarship opportunities, and important notifications from administration.' },
    { icon: '🔐', title: 'Role-Based Access', desc: 'Three distinct roles – Admin, Alumni, and Student – each with tailored features and permissions.' },
    { icon: '📊', title: 'Smart Dashboards', desc: 'Personalized dashboards for each role showing relevant statistics, recent activity, and quick actions.' },
  ];

  return (
    <>
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-logo">
            🎓 Alumni<span>Connect</span>
          </div>
          <div className="landing-nav-links">
            <a href="#features">Features</a>
            <a href="#stats">About</a>
            <Link to="/login">Directory</Link>
            <Link to="/login">Events</Link>
          </div>
          <div className="landing-nav-actions">
            <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-badge">🎓 Alumni Management Platform</div>
            <h1 className="hero-title">
              Connect Alumni,<br />
              <span className="accent">Build Futures</span>
            </h1>
            <p className="hero-subtitle">
              AlumniConnect bridges the gap between graduates, students, and administration.
              Discover opportunities, attend events, share jobs, and stay connected — all in one place.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary btn-lg">
                🚀 Get Started Free
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg">
                🔑 Login
              </Link>
            </div>
          </div>

          <div className="hero-image-area">
            <div className="hero-visual">
              <div className="hero-visual-header">
                <h3>🎓 AlumniConnect</h3>
                <p>Platform Overview</p>
              </div>
              <div className="hero-visual-body">
                <div className="mini-stat">
                  <div className="mini-stat-icon">👥</div>
                  <div className="mini-stat-info">
                    <h4>500+</h4>
                    <p>Alumni Connected</p>
                  </div>
                </div>
                <div className="mini-stat">
                  <div className="mini-stat-icon">🎉</div>
                  <div className="mini-stat-info">
                    <h4>50+</h4>
                    <p>Events Organized</p>
                  </div>
                </div>
                <div className="mini-stat">
                  <div className="mini-stat-icon">💼</div>
                  <div className="mini-stat-info">
                    <h4>200+</h4>
                    <p>Jobs Posted</p>
                  </div>
                </div>
                <div className="mini-stat">
                  <div className="mini-stat-icon">🏢</div>
                  <div className="mini-stat-info">
                    <h4>100+</h4>
                    <p>Companies Represented</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="section-header">
          <span className="section-tag">✨ Features</span>
          <h2 className="section-title">Everything You Need to Stay Connected</h2>
          <p className="section-subtitle">
            A complete platform designed for alumni associations, with powerful tools
            for networking, events, and career development.
          </p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section" id="stats">
        <div className="stats-inner">
          <div className="stat-item">
            <h3>500+</h3>
            <p>Alumni Registered</p>
          </div>
          <div className="stat-item">
            <h3>50+</h3>
            <p>Events Hosted</p>
          </div>
          <div className="stat-item">
            <h3>200+</h3>
            <p>Jobs Posted</p>
          </div>
          <div className="stat-item">
            <h3>3</h3>
            <p>User Roles</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '5rem 2rem', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="section-header">
            <span className="section-tag">🚀 Getting Started</span>
            <h2 className="section-title">Get Started in 3 Simple Steps</h2>
          </div>
          <div className="grid-3">
            {[
              { step: '01', icon: '📝', title: 'Register', desc: 'Sign up as an Alumni or Student. Admins are created by the system administrator.' },
              { step: '02', icon: '👤', title: 'Build Your Profile', desc: 'Alumni: Add your company, role, skills and bio. Students: Explore the directory.' },
              { step: '03', icon: '🌐', title: 'Connect & Grow', desc: 'Register for events, apply to jobs, read announcements, and network with peers.' },
            ].map((s, i) => (
              <div key={i} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '2px', marginBottom: '1rem' }}>STEP {s.step}</div>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{s.icon}</div>
                <h3 style={{ marginBottom: '0.75rem' }}>{s.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/register" className="btn btn-primary btn-lg">Join AlumniConnect Today →</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <h3>🎓 AlumniConnect</h3>
              <p>A professional alumni management and networking platform built with Java Spring Boot, React, and MySQL.</p>
            </div>
            <div className="footer-links">
              <h4>Platform</h4>
              <ul>
                <li><Link to="/register">Get Started</Link></li>
                <li><Link to="/login">Login</Link></li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>Features</h4>
              <ul>
                <li><a href="#features">Alumni Directory</a></li>
                <li><a href="#features">Events</a></li>
                <li><a href="#features">Job Board</a></li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>Tech Stack</h4>
              <ul>
                <li><a href="#">React + CSS</a></li>
                <li><a href="#">Spring Boot</a></li>
                <li><a href="#">MySQL + JPA</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 AlumniConnect – Alumni Management & Networking Platform. Built with ❤️ using Java Full Stack.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default LandingPage;
