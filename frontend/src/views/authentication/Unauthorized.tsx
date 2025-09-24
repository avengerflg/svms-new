import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material'; 
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Unauthorized: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        textAlign="center"
      >
        <Typography variant="h1" color="error" gutterBottom>
          403
        </Typography>
        <Typography variant="h4" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          You don't have permission to access this page.
          {user && ` Your current role is: ${user.role}`}
        </Typography>

        <Box mt={3} display="flex" gap={2}>
          <Button variant="contained" color="primary" component={Link} to="/dashboard">
            Go to Dashboard
          </Button>
          <Button variant="outlined" color="secondary" onClick={logout}>
            Logout
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Unauthorized;
