import { format } from 'date-fns';
import { Link } from 'react-router';

import {
  CardContent,
  Stack,
  Avatar,
  Typography,
  CardMedia,
  Chip,
  Grid,
  Tooltip,
  Box,
} from '@mui/material';
import { IconEye, IconMessage2, IconPoint } from '@tabler/icons-react';

import BlankCard from '../../shared/BlankCard';
import { BlogPostType } from 'src/types/apps/blog';
interface Btype {
  post: BlogPostType;
  index?: number;
}

const BlogCard = ({ post }: Btype) => {
  const { coverImg, title, view, comments, category, author, createdAt }: any = post;

  const linkTo = title
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');

  return (
    <Grid display="flex" alignItems="stretch" xs={12} sm={6} md={4} lg={4}>
      <BlankCard className="hoverCard">
        <>
          <Typography component={Link} to={`/frontend-pages/blog/detail/${linkTo}`}>
            <CardMedia component="img" height="240" image={coverImg} alt="green iguana" />
          </Typography>
          <CardContent>
            <Stack direction="row" sx={{ marginTop: '-45px' }}>
              <Tooltip title={author?.name} placement="top">
                <Avatar aria-label="recipe" src={author?.avatar}></Avatar>
              </Tooltip>
              <Chip
                sx={{
                  marginLeft: 'auto',
                  marginTop: '-21px',
                  backgroundColor: (theme: any) =>
                    theme.palette.mode === 'dark' ? '#262e3f' : 'white',
                }}
                label="2 min Read"
              ></Chip>
            </Stack>
            <Chip label={category} sx={{ marginTop: 2 }}></Chip>
            <Box my={3}>
              <Typography
                gutterBottom
                variant="h5"
                color="inherit"
                sx={{ textDecoration: 'none' }}
                component={Link}
                to={`/frontend-pages/blog/detail/${linkTo}`}
              >
                {title}
              </Typography>
            </Box>
            <Stack direction="row" gap={3} alignItems="center">
              <Stack direction="row" gap={1} alignItems="center">
                <IconEye /> {view}
              </Stack>
              <Stack direction="row" gap={1} alignItems="center">
                <IconMessage2 /> {comments?.length}
              </Stack>

              <Stack direction="row" ml="auto" alignItems="center">
                <IconPoint />
                <small>{format(new Date(createdAt), 'E, MMM d')}</small>
              </Stack>
            </Stack>
          </CardContent>
        </>
      </BlankCard>
    </Grid>
  );
};

export default BlogCard;
