import React from 'react';
import { Box, Typography } from '@mui/material'; 
import PageContainer from 'src/components/container/PageContainer';

const ExportData: React.FC = () => {
  return (
    <PageContainer title="Export Data" description="Export system data in various formats">
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Export Data
        </Typography>
        <Typography variant="body1" color="textSecondary">
          This component is under development. It will provide data export functionality in multiple
          formats.
        </Typography>
      </Box>
    </PageContainer>
  );
};

export default ExportData;
