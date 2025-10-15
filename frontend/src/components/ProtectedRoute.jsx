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
    // Store the intended destination for after login
    sessionStorage.setItem('intendedDestination', location.pathname);
    console.log('🔐 ProtectedRoute - Storing intended destination:', location.pathname);
    
    // Redirect to login if not authenticated
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Profile setup is now optional - users can access dashboard directly
  // The profile setup component will auto-redirect to dashboard
  // No need to check profileCompleted anymore

  if (requiredRole && !hasRole(requiredRole)) {
    // Redirect to appropriate dashboard if user doesn't have required role
    const userRole = user?.role?.toLowerCase();
    
    if (userRole === 'recruiter') {
      return <Navigate to="/recruiter-dashboard" replace />;
    } else if (userRole === 'jobseeker' || userRole === 'job_seeker') {
      return <Navigate to="/jobseeker-dashboard" replace />;
    } else if (userRole === 'intern') {
      return <Navigate to="/intern-dashboard" replace />;
    } else if (userRole === 'admin' || userRole === 'administrator') {
      return <Navigate to="/admin" replace />;
    }
    // Fallback to home page
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
