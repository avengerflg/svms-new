import React from 'react';
import { Box, Typography } from '@mui/material'; 
import PageContainer from 'src/components/container/PageContainer';

const DataSettings: React.FC = () => {
  return (
    <PageContainer
      title="Data Settings"
      description="Configure data retention and privacy settings"
    >
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Data Settings
        </Typography>
        <Typography variant="body1" color="textSecondary">
          This component is under development. It will provide data management and privacy
          configuration.
        </Typography>
      </Box>
    </PageContainer>
  );
};

export default DataSettings;
