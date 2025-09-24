import React from 'react';
import { Box, Typography } from '@mui/material'; 
import PageContainer from 'src/components/container/PageContainer';

const Alerts: React.FC = () => {
  return (
    <PageContainer title="Alerts" description="Manage system alerts and warnings">
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Alerts
        </Typography>
        <Typography variant="body1" color="textSecondary">
          This component is under development. It will provide alert management and configuration.
        </Typography>
      </Box>
    </PageContainer>
  );
};

export default Alerts;
