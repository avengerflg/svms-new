// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import { Grid } from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
// Dashboard components removed
import MostVisited from '../../../components/widgets/charts/MostVisited';
import PageImpressions from '../../../components/widgets/charts/PageImpressions';
import Followers from '../../../components/widgets/charts/Followers';
import Views from '../../../components/widgets/charts/Views';
import Earned from '../../../components/widgets/charts/Earned';
import CurrentValue from '../../../components/widgets/charts/CurrentValue';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Charts',
  },
];

const WidgetCharts = () => {
  return (
    <PageContainer title="Charts" description="this is Charts page">
      {/* breadcrumb */}
      <Breadcrumb title="Charts" items={BCrumb} />
      {/* end breadcrumb */}
      <Grid container spacing={3}>
        <Grid
          xs={{
            xs: 12,
            sm: 3,
          }}
        >
          <Followers />
        </Grid>
        <Grid
          xs={{
            xs: 12,
            sm: 3,
          }}
        >
          <Views />
        </Grid>
        <Grid
          xs={{
            xs: 12,
            sm: 3,
          }}
        >
          <Earned />
        </Grid>
        <Grid
          xs={{
            xs: 12,
            sm: 3,
          }}
        >
          <CurrentValue />
        </Grid>
        <Grid item xs={12}>
          <MostVisited />
        </Grid>
        <Grid item xs={12}>
          <PageImpressions />
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default WidgetCharts;
