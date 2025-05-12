import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUserProfile } from './api';

import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import Home2 from './pages/Home2';
import FeedSection from './components/FeedSection';
import Notificationss from './components/Notificationss';
import Profile from './pages/Profile';
import Categories from './pages/Categories';
import FeedPage from './pages/FeedPage';
import Notifications from './pages/Notifications';
import AuthCallback from './components/AuthCallback';

import TechHome from './techWriter/TechHome';
import TechWriterPosts from './techWriter/TechWriterPosts';
import Content from './techWriter/Content';
import TechWriterFlaggedContent from './techWriter/TechWriterFlaggedContent';
import TechWriterProfile from './techWriter/TechWriterProfile';

// import AdminHome from './dashboards/admin/AdminHome';
// import UserManagement from './dashboards/admin/UserManagement';

// Placeholder components for dashboards (replace with actual components if needed)
const UsersDashboard = () => <div>Users Dashboard</div>;
const TechWriterDashboard = () => <div>Tech Writer Dashboard</div>;
// const AdminsDashboard = () => <div>Admins Dashboard</div>;

function ProtectedRoute({ children }) {
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await getUserProfile();
        const userRoles = response.data.roles || [];
        const role = userRoles.length > 0 ? userRoles[0].name : 'User';
        setUserRole(role);
      } catch (err) {
        console.error('Error fetching user role:', err);
        setUserRole('User'); // Default to User if fetch fails
      }
    };
    fetchUserRole();
  }, []);

  if (userRole === null) {
    return <div>Loading...</div>; // Show loading state while fetching role
  }

  const path = location.pathname;
  if (path === '/Home2' && userRole !== 'User') {
    return <Navigate to={userRole === 'Admin' ? '/TechHome' : '/TechHome'} replace />;
  }
  if (path === '/techwriterdashboard' && userRole !== 'TechWriter') {
    return <Navigate to={userRole === 'Admin' ? '/adminsdashboard' : '/usersdashboard'} replace />;
  }
  // if (path === '/adminsdashboard' && userRole !== 'Admin') {
  //   return <Navigate to={userRole === 'TechWriter' ? '/techwriterdashboard' : '/usersdashboard'} replace />;
  // }

  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ResetPasswordPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/feed" element={<FeedSection />} />
        <Route path="/notifications" element={<Notificationss />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/category" element={<Categories />} />
        <Route path="/feedpage" element={<FeedPage />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/home" element={<Home2/>}/>

        <Route
          path="/Home2"
          element={
            <ProtectedRoute>
              <Home2 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/TechHome"
          element={
            <ProtectedRoute>
              <TechHome />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/adminsdashboard"
          element={
            <ProtectedRoute>
              <AdminsDashboard />
            </ProtectedRoute>
          }
        /> */}

        <Route path="techhome" element={<TechHome />} />
        <Route path="my-posts" element={<TechWriterPosts />} />
        <Route path="content" element={<Content />} />
        <Route path="tech-writer-flagged" element={<TechWriterFlaggedContent />} />
        <Route path="tech-writer-profile" element={<TechWriterProfile />} />

        {/* <Route path="admin-home" element={<AdminHome />} />
        <Route path="user-management" element={<UserManagement />} /> */}
      </Routes>
    </Router>
  );
}

export default App;