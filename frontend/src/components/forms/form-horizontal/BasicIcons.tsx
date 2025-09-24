'use client'
import { Grid, InputAdornment, Button } from '@mui/material';

import CustomFormLabel from '../theme-elements/CustomFormLabel';
import CustomOutlinedInput from '../theme-elements/CustomOutlinedInput';
import { IconBuildingArch, IconMail, IconMessage2, IconPhone, IconUser } from '@tabler/icons-react';

const BasicIcons = () => {
  return (
    (<div>
      {/* ------------------------------------------------------------------------------------------------ */}
      {/* Basic Layout */}
      {/* ------------------------------------------------------------------------------------------------ */}
      <Grid container spacing={3}>
        {/* 1 */}
        <Grid
          display="flex"
          alignItems="center"
          xs={{
            xs: 12,
            sm: 3
          }}>
          <CustomFormLabel htmlFor="bi-name" sx={{ mt: 0, mb: { xs: '-10px', sm: 0 } }}>
            Name
          </CustomFormLabel>
        </Grid>
        <Grid
          xs={{
            xs: 12,
            sm: 9
          }}>
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
        <Grid
          display="flex"
          alignItems="center"
          xs={{
            xs: 12,
            sm: 3
          }}>
          <CustomFormLabel htmlFor="bi-company" sx={{ mt: 0, mb: { xs: '-10px', sm: 0 } }}>
            Company
          </CustomFormLabel>
        </Grid>
        <Grid
          xs={{
            xs: 12,
            sm: 9
          }}>
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
        <Grid
          display="flex"
          alignItems="center"
          xs={{
            xs: 12,
            sm: 3
          }}>
          <CustomFormLabel htmlFor="bi-email" sx={{ mt: 0, mb: { xs: '-10px', sm: 0 } }}>
            Email
          </CustomFormLabel>
        </Grid>
        <Grid
          xs={{
            xs: 12,
            sm: 9
          }}>
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
        <Grid
          display="flex"
          alignItems="center"
          xs={{
            xs: 12,
            sm: 3
          }}>
          <CustomFormLabel htmlFor="bi-phone" sx={{ mt: 0, mb: { xs: '-10px', sm: 0 } }}>
            Phone No
          </CustomFormLabel>
        </Grid>
        <Grid
          xs={{
            xs: 12,
            sm: 9
          }}>
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
        <Grid
          display="flex"
          alignItems="center"
          xs={{
            xs: 12,
            sm: 3
          }}>
          <CustomFormLabel htmlFor="bi-message" sx={{ mt: 0, mb: { xs: '-10px', sm: 0 } }}>
            Message
          </CustomFormLabel>
        </Grid>
        <Grid
          xs={{
            xs: 12,
            sm: 9
          }}>
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
        <Grid
          xs={{
            xs: 12,
            sm: 3
          }}></Grid>
        <Grid
          xs={{
            xs: 12,
            sm: 9
          }}>
          <Button variant="contained" color="primary">
            Send
          </Button>
        </Grid>
      </Grid>
    </div>)
  );
};

export default BasicIcons;
