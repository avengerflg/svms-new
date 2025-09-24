import React from 'react';
import { Box, Skeleton, Paper } from '@mui/material'; 

interface LoadingSkeletonProps {
  variant?: 'dashboard' | 'page' | 'minimal';
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ variant = 'minimal' }) => {
  if (variant === 'minimal') {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100px"
        sx={{
          opacity: 0.7,
          transition: 'opacity 0.2s ease-in-out',
        }}
      >
        <Skeleton
          variant="circular"
          width={32}
          height={32}
          sx={{
            animationDuration: '1s',
            bgcolor: 'primary.light',
          }}
        />
      </Box>
    );
  }
  if (variant === 'dashboard') {
    return (
      <Box sx={{ padding: 3, minHeight: '100vh' }}>
        {/* Header skeleton */}
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
        </Box>

        {/* Content skeleton */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Paper sx={{ p: 2, flex: 1 }}>
            <Skeleton variant="text" height={30} width="60%" sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" height={120} />
          </Paper>
          <Paper sx={{ p: 2, flex: 1 }}>
            <Skeleton variant="text" height={30} width="60%" sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" height={120} />
          </Paper>
        </Box>

        {/* Table skeleton */}
        <Paper sx={{ p: 2 }}>
          <Skeleton variant="text" height={40} width="40%" sx={{ mb: 2 }} />
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} variant="text" height={50} sx={{ mb: 1 }} />
          ))}
        </Paper>
      </Box>
    );
  }

  // Page variant
  return (
    <Box sx={{ padding: 3, minHeight: '100vh' }}>
      <Skeleton variant="text" height={50} width="50%" sx={{ mb: 3 }} />
      <Skeleton variant="rectangular" height={300} sx={{ mb: 2 }} />
      <Skeleton variant="text" height={30} />
      <Skeleton variant="text" height={30} width="80%" />
    </Box>
  );
};

export default LoadingSkeleton;
