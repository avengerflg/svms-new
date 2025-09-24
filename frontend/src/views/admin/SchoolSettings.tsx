import React from 'react';
import { Box, Typography } from '@mui/material'; 
import PageContainer from 'src/components/container/PageContainer';

const SchoolSettings: React.FC = () => {
  return (
    <PageContainer title="School Settings" description="Configure school-wide settings">
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          School Settings
        </Typography>
        <Typography variant="body1" color="textSecondary">
          This component is under development. It will provide school-wide configuration options.
        </Typography>
      </Box>
    </PageContainer>
  );
};

export default SchoolSettings;
