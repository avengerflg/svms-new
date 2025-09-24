import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSkeleton from '../shared/LoadingSkeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute state:', {
    isAuthenticated,
    isLoading,
    user: user?.email,
    path: location.pathname,
  });

  // Show minimal loading for faster perceived performance
  if (isLoading) {
    console.log('ProtectedRoute: Showing loading state');
    return <LoadingSkeleton variant="minimal" />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('ProtectedRoute: Not authenticated, redirecting to login');
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check role-based access if allowedRoles is specified
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    console.log('ProtectedRoute: Insufficient permissions, redirecting to unauthorized');
    return <Navigate to="/unauthorized" replace />;
  }

  console.log('ProtectedRoute: Rendering protected content');
  // Render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
