import { Button, Stack } from '@mui/material';

const SizeButton = () => (
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
  </Stack>
);

export default SizeButton;
