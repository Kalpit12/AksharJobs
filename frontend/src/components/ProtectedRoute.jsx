import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null, redirectTo = '/login' }) => {
  const { isAuthenticated, loading, hasRole, user } = useAuth();
  const location = useLocation();

  if (loading) {
    // Show loading spinner while checking authentication
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check if user has completed profile setup
  const profileCompleted = localStorage.getItem('profileCompleted') === 'true';
  const isDashboardRoute = location.pathname.includes('dashboard');
  
  if (isDashboardRoute && !profileCompleted) {
    // Redirect to profile setup if trying to access dashboard without completed profile
    return <Navigate to="/user-profile-setup" replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    // Redirect to appropriate dashboard if user doesn't have required role
    const userRole = user?.role?.toLowerCase();
    
    if (userRole === 'recruiter' || userRole === 'recruiter') {
      return <Navigate to="/recruiter-dashboard" replace />;
    } else if (userRole === 'jobseeker' || userRole === 'job_seeker' || userRole === 'jobseeker') {
      return <Navigate to="/jobseeker-dashboard" replace />;
    } else if (userRole === 'admin' || userRole === 'administrator') {
      return <Navigate to="/admin" replace />;
    }
    // Fallback to home page
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
