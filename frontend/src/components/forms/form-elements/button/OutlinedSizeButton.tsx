import { Button, Stack } from '@mui/material';

const OutlinedSizeButton = () => (
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
  </Stack>
);

export default OutlinedSizeButton;
