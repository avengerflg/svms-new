import React from 'react';
import { Box, Typography } from '@mui/material'; 
import PageContainer from 'src/components/container/PageContainer';

const StaffReports: React.FC = () => {
  return (
    <PageContainer title="Staff Reports" description="Staff activity and performance reports">
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Staff Reports
        </Typography>
        <Typography variant="body1" color="textSecondary">
          This component is under development. It will provide reports on staff activities and
          performance metrics.
        </Typography>
      </Box>
    </PageContainer>
  );
};

export default StaffReports;
