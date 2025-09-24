import React from 'react';
import { Box, Typography } from '@mui/material'; 
import PageContainer from 'src/components/container/PageContainer';

const FormBuilder: React.FC = () => {
  return (
    <PageContainer title="Form Builder" description="Create and customize visitor forms">
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Form Builder
        </Typography>
        <Typography variant="body1" color="textSecondary">
          This component is under development. It will provide form building and customization
          tools.
        </Typography>
      </Box>
    </PageContainer>
  );
};

export default FormBuilder;
