import { Box, Avatar, Typography, IconButton, Tooltip, useMediaQuery } from '@mui/material';
import { IconPower } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { CustomizerContext } from 'src/context/CustomizerContext';
import { useAuth } from 'src/context/AuthContext';
import { useContext } from 'react';

import img1 from 'src/assets/images/profile/user-1.jpg';

export const Profile = () => {
  const { isSidebarHover, isCollapse } = useContext(CustomizerContext);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up('lg'));
  const hideMenu = lgUp ? isCollapse == 'mini-sidebar' && !isSidebarHover : '';

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'security':
        return 'Security Officer';
      case 'frontdesk':
        return 'Front Desk';
      case 'teacher':
        return 'Teacher';
      default:
        return role;
    }
  };

  const getUserInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <Box
      display={'flex'}
      alignItems="center"
      gap={2}
      sx={{ m: 3, p: 2, bgcolor: `${'secondary.light'}` }}
    >
      {!hideMenu ? (
        <>
          <Avatar
            alt="Profile"
            src={img1}
            sx={{
              bgcolor: 'primary.main',
              fontSize: '16px',
              fontWeight: 600,
            }}
          >
            {user ? getUserInitials(user.firstName, user.lastName) : 'U'}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{
                fontSize: '14px',
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {user ? `${user.firstName} ${user.lastName}` : 'Guest User'}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontSize: '12px',
                color: 'text.secondary',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {user ? getRoleDisplayName(user.role) : 'Guest'}
            </Typography>
          </Box>

          <Box sx={{ ml: 'auto' }}>
            <Tooltip title="Logout" placement="top">
              <IconButton color="primary" onClick={handleLogout} aria-label="logout">
                <IconPower />
              </IconButton>
            </Tooltip>
          </Box>
        </>
      ) : (
        <Tooltip title="Logout" placement="right">
          <IconButton
            color="primary"
            onClick={handleLogout}
            aria-label="logout"
           
            sx={{ mx: 'auto' }}
          >
            <IconPower />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};
