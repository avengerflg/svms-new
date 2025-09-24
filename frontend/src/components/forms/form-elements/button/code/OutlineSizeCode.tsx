import CodeDialog from 'src/components/shared/CodeDialog';
const OutlineSizeCode = () => {
  return (
    <>
      <CodeDialog>
        {`
"use client";

import { Button, Stack } from '@mui/material';

<Stack spacing={1} direction={{ xs: 'column', sm: 'row' }} alignItems="center" justifyContent="center">
    <Button variant="outlined">
      Small
    </Button>
    <Button variant="outlined">
      Medium
    </Button>
    <Button variant="outlined">
      Large
    </Button>
</Stack>`}
      </CodeDialog>
    </>
  );
};

export default OutlineSizeCode;
