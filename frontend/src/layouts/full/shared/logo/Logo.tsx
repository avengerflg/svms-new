import { FC, useContext } from 'react';
import { Link } from 'react-router';
import { styled, Typography, Box } from '@mui/material';
import { IconSchool } from '@tabler/icons-react';
import config from 'src/context/config';
import { CustomizerContext } from 'src/context/CustomizerContext';

const Logo: FC = () => {
  const { isCollapse, isSidebarHover, activeMode } = useContext(CustomizerContext);
  const TopbarHeight = config.topbarHeight;

  const LinkStyled = styled(Link)(() => ({
    height: TopbarHeight,
    width: isCollapse == 'mini-sidebar' && !isSidebarHover ? '40px' : '180px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    padding: '8px',
    textDecoration: 'none',
    gap: '8px',
  }));

  return (
    <LinkStyled to="/">
      <IconSchool xs={32} color={activeMode === 'dark' ? '#ffffff' : '#5D87FF'} />
      {(isCollapse !== 'mini-sidebar' || isSidebarHover) && (
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: '16px',
              lineHeight: '20px',
              color: activeMode === 'dark' ? '#ffffff' : '#2A3547',
            }}
          >
            School Visiting
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontSize: '12px',
              color: activeMode === 'dark' ? '#ffffff99' : '#2A354799',
            }}
          >
            Management System
          </Typography>
        </Box>
      )}
    </LinkStyled>
  );
};

export default Logo;
