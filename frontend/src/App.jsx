import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageEvents from './pages/admin/ManageEvents';
import ManageAnnouncements from './pages/admin/ManageAnnouncements';

// Alumni Pages
import AlumniDashboard from './pages/alumni/AlumniDashboard';
import AlumniProfile from './pages/alumni/AlumniProfile';
import EditProfile from './pages/alumni/EditProfile';
import PostJob from './pages/alumni/PostJob';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';

// Shared Pages
import AlumniDirectory from './pages/shared/AlumniDirectory';
import EventsList from './pages/shared/EventsList';
import EventDetail from './pages/shared/EventDetail';
import JobsList from './pages/shared/JobsList';
import JobDetail from './pages/shared/JobDetail';
import Announcements from './pages/shared/Announcements';

/**
 * ProtectedRoute - Redirects unauthenticated users to login.
 * Also redirects to the correct dashboard based on role.
 *
 * Interview explanation:
 *   "I created a ProtectedRoute component that wraps sensitive pages.
 *    If no user is logged in, it redirects to /login using React Router's
 *    Navigate component. This prevents unauthorized access to dashboards."
 */
function ProtectedRoute({ children, allowedRoles }) {
  const { user, isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their appropriate dashboard
    if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'ALUMNI') return <Navigate to="/alumni/dashboard" replace />;
    if (user.role === 'STUDENT') return <Navigate to="/student/dashboard" replace />;
  }

  return children;
}

/**
 * App - Root component with React Router setup.
 *
 * Interview explanation:
 *   "I used React Router v6 to implement client-side routing.
 *    This means page navigation happens without full page reloads.
 *    React Router renders the matching component for each URL path."
 */
function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/events" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <ManageEvents />
        </ProtectedRoute>
      } />
      <Route path="/admin/announcements" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <ManageAnnouncements />
        </ProtectedRoute>
      } />

      {/* Alumni Routes */}
      <Route path="/alumni/dashboard" element={
        <ProtectedRoute allowedRoles={['ALUMNI']}>
          <AlumniDashboard />
        </ProtectedRoute>
      } />
      <Route path="/alumni/profile" element={
        <ProtectedRoute allowedRoles={['ALUMNI']}>
          <AlumniProfile />
        </ProtectedRoute>
      } />
      <Route path="/alumni/edit-profile" element={
        <ProtectedRoute allowedRoles={['ALUMNI']}>
          <EditProfile />
        </ProtectedRoute>
      } />
      <Route path="/alumni/post-job" element={
        <ProtectedRoute allowedRoles={['ALUMNI']}>
          <PostJob />
        </ProtectedRoute>
      } />

      {/* Student Routes */}
      <Route path="/student/dashboard" element={
        <ProtectedRoute allowedRoles={['STUDENT']}>
          <StudentDashboard />
        </ProtectedRoute>
      } />

      {/* Shared Routes (accessible when logged in) */}
      <Route path="/directory" element={
        <ProtectedRoute allowedRoles={['ADMIN', 'ALUMNI', 'STUDENT']}>
          <AlumniDirectory />
        </ProtectedRoute>
      } />
      <Route path="/events" element={
        <ProtectedRoute allowedRoles={['ADMIN', 'ALUMNI', 'STUDENT']}>
          <EventsList />
        </ProtectedRoute>
      } />
      <Route path="/events/:id" element={
        <ProtectedRoute allowedRoles={['ADMIN', 'ALUMNI', 'STUDENT']}>
          <EventDetail />
        </ProtectedRoute>
      } />
      <Route path="/jobs" element={
        <ProtectedRoute allowedRoles={['ADMIN', 'ALUMNI', 'STUDENT']}>
          <JobsList />
        </ProtectedRoute>
      } />
      <Route path="/jobs/:id" element={
        <ProtectedRoute allowedRoles={['ADMIN', 'ALUMNI', 'STUDENT']}>
          <JobDetail />
        </ProtectedRoute>
      } />
      <Route path="/announcements" element={
        <ProtectedRoute allowedRoles={['ADMIN', 'ALUMNI', 'STUDENT']}>
          <Announcements />
        </ProtectedRoute>
      } />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
