import React from 'react';
import { Box, Typography } from '@mui/material'; 
import PageContainer from 'src/components/container/PageContainer';

const Notifications: React.FC = () => {
  return (
    <PageContainer title="Notifications" description="Manage system notifications">
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Notifications
        </Typography>
        <Typography variant="body1" color="textSecondary">
          This component is under development. It will provide notification management capabilities.
        </Typography>
      </Box>
    </PageContainer>
  );
};

export default Notifications;
