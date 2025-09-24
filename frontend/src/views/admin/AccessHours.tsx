import React from 'react';
import { Box, Typography } from '@mui/material'; 
import PageContainer from 'src/components/container/PageContainer';

const AccessHours: React.FC = () => {
  return (
    <PageContainer
      title="Access Hours"
      description="Configure school access hours and restrictions"
    >
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Access Hours
        </Typography>
        <Typography variant="body1" color="textSecondary">
          This component is under development. It will provide access hours configuration.
        </Typography>
      </Box>
    </PageContainer>
  );
};

export default AccessHours;
