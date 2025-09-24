import React from 'react';
import { Box, Typography } from '@mui/material'; 
import PageContainer from 'src/components/container/PageContainer';

const VisitorCategories: React.FC = () => {
  return (
    <PageContainer title="Visitor Categories" description="Manage visitor categories and types">
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Visitor Categories
        </Typography>
        <Typography variant="body1" color="textSecondary">
          This component is under development. It will provide visitor category management.
        </Typography>
      </Box>
    </PageContainer>
  );
};

export default VisitorCategories;
