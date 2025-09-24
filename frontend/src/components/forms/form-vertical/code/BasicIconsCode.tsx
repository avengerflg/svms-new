import CodeDialog from 'src/components/shared/CodeDialog';
const BasicIconsCode = () => {
  return (
    <>
      <CodeDialog>
        {`
"use client";

import {Grid, InputAdornment, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import { OutlinedInput } from '@mui/material';
import { IconBuildingArch, IconMail, IconMessage2, IconPhone, IconUser } from '@tabler/icons-react';

const CustomFormLabel = styled((props: any) => (
  <Typography
    variant="subtitle1"
    fontWeight={600}
    {...props}
    component="label"
    htmlFor={props.htmlFor}
  />
))(() => ({
  marginBottom: '5px',
  marginTop: '25px',
  display: 'block',
}));

const CustomOutlinedInput = styled((props: any) => <OutlinedInput {...props} />)(({ theme }) => ({
  '& .MuiOutlinedInput-input::-webkit-input-placeholder': {
    color: theme.palette.text.secondary,
    opacity: '0.8',
  },

  '& .MuiTypography-root': {
    color: theme.palette.text.secondary,
  },

  '& .MuiOutlinedInput-input.Mui-disabled::-webkit-input-placeholder': {
    color: theme.palette.text.secondary,
    opacity: '1',
  },
}));

<div>
  <Grid >
    {/* 1 */}
    <Grid item xs={12}>
      <CustomFormLabel htmlFor="bi-name" sx={{ mt: 0 }}>
        Name
      </CustomFormLabel>
    </Grid>
    <Grid item xs={12}>
      <CustomOutlinedInput
        startAdornment={
          <InputAdornment position="start">
            <IconUser />
          </InputAdornment>
        }
        id="bi-name"
        placeholder="John Deo"
        fullWidth
      />
    </Grid>
    {/* 2 */}
    <Grid item xs={12}>
      <CustomFormLabel htmlFor="bi-company">
        Company
      </CustomFormLabel>
    </Grid>
    <Grid item xs={12}>
      <CustomOutlinedInput
        startAdornment={
          <InputAdornment position="start">
            <IconBuildingArch />
          </InputAdornment>
        }
        id="bi-company"
        placeholder="ACME Inc."
        fullWidth
      />
    </Grid>
    {/* 3 */}
    <Grid item xs={12}>
      <CustomFormLabel htmlFor="bi-email">
        Email
      </CustomFormLabel>
    </Grid>
    <Grid item xs={12}>
      <CustomOutlinedInput
        startAdornment={
          <InputAdornment position="start">
            <IconMail />
          </InputAdornment>
        }
        id="bi-email"
        placeholder="john.deo"
        fullWidth
      />
    </Grid>
    {/* 4 */}
    <Grid item xs={12}>
      <CustomFormLabel htmlFor="bi-phone">
        Phone No
      </CustomFormLabel>
    </Grid>
    <Grid item xs={12}>
      <CustomOutlinedInput
        startAdornment={
          <InputAdornment position="start">
            <IconPhone />
          </InputAdornment>
        }
        id="bi-phone"
        placeholder="412 2150 451"
        fullWidth
      />
    </Grid>
    {/* 5 */}
    <Grid item xs={12}>
      <CustomFormLabel htmlFor="bi-message">
        Message
      </CustomFormLabel>
    </Grid>
    <Grid item xs={12}>
      <CustomOutlinedInput
        id="bi-message"
        startAdornment={
          <InputAdornment position="start">
            <IconMessage2 />
          </InputAdornment>
        }
        placeholder="Hi, Do you  have a moment to talk Jeo ?"
        multiline
        fullWidth
      />
    </Grid>
    <Grid mt={3} xs={12}>
      <Button variant="contained" color="primary">
        Send
      </Button>
    </Grid>
  </Grid>
</div>
`}
      </CodeDialog>
    </>
  );
};

export default BasicIconsCode;
