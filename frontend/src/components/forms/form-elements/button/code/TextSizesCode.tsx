import CodeDialog from 'src/components/shared/CodeDialog';
const TextSizesCode = () => {
  return (
    <>
      <CodeDialog>
        {`
"use client";

import { Button, Stack } from '@mui/material';

<Stack spacing={1} direction="row" alignItems="center" justifyContent="center">
    <Button>Small</Button>
    <Button>Medium</Button>
    <Button>Large</Button>
</Stack>`}
      </CodeDialog>
    </>
  );
};

export default TextSizesCode;
