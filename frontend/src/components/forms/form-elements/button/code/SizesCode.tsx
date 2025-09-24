import CodeDialog from 'src/components/shared/CodeDialog';
const SizesCode = () => {
  return (
    <>
      <CodeDialog>
        {`
"use client";

import { Button, Stack } from '@mui/material';

<Stack spacing={1} direction={{ xs: 'column', sm: 'row' }} alignItems="center" justifyContent="center">
    <Button variant="contained">
      Small
    </Button>
    <Button variant="contained">
      Medium
    </Button>
    <Button variant="contained">
      Large
    </Button>
</Stack>`}
      </CodeDialog>
    </>
  );
};

export default SizesCode;
