// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import { Grid } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import ProfileBanner from 'src/components/apps/userprofile/profile/ProfileBanner';
import IntroCard from 'src/components/apps/userprofile/profile/IntroCard';
import { UserDataProvider } from 'src/context/UserDataContext/index';

const UserProfile = () => {
  const BCrumb = [
    {
      to: '/dashboard',
      title: 'Dashboard',
    },
    {
      title: 'My Profile',
    },
  ];
  return (
    <UserDataProvider>
      <PageContainer
        title="My Profile"
        description="User profile management for school visiting system"
      >
        <Breadcrumb title="My Profile" items={BCrumb} />
        <Grid container spacing={3}>
          <Grid
            xs={{
              sm: 12,
            }}
          >
            <ProfileBanner />
          </Grid>

          {/* intro Card */}
          <Grid
            xs={{
              sm: 12,
              lg: 6,
              xs: 12,
            }}
          >
            <IntroCard />
          </Grid>

          {/* Additional profile sections can be added here */}
          <Grid
            xs={{
              sm: 12,
              lg: 6,
              xs: 12,
            }}
          >
            {/* Future: Add security settings, activity logs, etc. */}
          </Grid>
        </Grid>
      </PageContainer>
    </UserDataProvider>
  );
};

export default UserProfile;
