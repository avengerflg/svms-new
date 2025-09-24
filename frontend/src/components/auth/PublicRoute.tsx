import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSkeleton from '../shared/LoadingSkeleton';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  console.log('PublicRoute state:', { isAuthenticated, isLoading, path: location.pathname });

  // Show minimal loading for faster perceived performance
  if (isLoading) {
    console.log('PublicRoute: Showing loading state');
    return <LoadingSkeleton variant="minimal" />;
  }

  // If user is already authenticated, redirect to dashboard
  if (isAuthenticated) {
    console.log('PublicRoute: User authenticated, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('PublicRoute: Rendering public content');
  // Render the public component (login, register, etc.)
  return <>{children}</>;
};

export default PublicRoute;
