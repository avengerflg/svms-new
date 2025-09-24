import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSkeleton from '../shared/LoadingSkeleton';

const RootRedirect: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  console.log('RootRedirect state:', { isAuthenticated, isLoading });

  if (isLoading) {
    console.log('RootRedirect: Loading, showing skeleton');
    return <LoadingSkeleton variant="minimal" />;
  }

  if (isAuthenticated) {
    console.log('RootRedirect: User authenticated, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('RootRedirect: User not authenticated, redirecting to login');
  return <Navigate to="/auth/login" replace />;
};

export default RootRedirect;
