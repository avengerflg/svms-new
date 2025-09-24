// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Menu,
  Avatar,
  Typography,
  Divider,
  Button,
  IconButton,
  Stack,
  ListItemIcon,
  ListItemText,
  MenuItem,
} from '@mui/material';
import {
  IconUser,
  IconSettings,
  IconLogout,
  IconShield,
  IconKey,
  IconHelp,
} from '@tabler/icons-react';
import { useAuth } from 'src/context/AuthContext';

import ProfileImg from 'src/assets/images/profile/user-1.jpg';

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleClick2 = (event: any) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
    handleClose2();
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    handleClose2();
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
    <Box>
      <IconButton
       
        aria-label="user profile"
        color="inherit"
        aria-controls="profile-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === 'object' && {
            color: 'primary.main',
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={ProfileImg}
          alt="Profile"
          sx={{
            width: 35,
            height: 35,
            bgcolor: 'primary.main',
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          {user ? getUserInitials(user.firstName, user.lastName) : 'U'}
        </Avatar>
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Profile Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="profile-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '300px',
            p: 2,
          },
        }}
      >
        <Typography variant="h6" sx={{ px: 2, py: 1 }}>
          User Profile
        </Typography>

        {/* User Info Section */}
        <Stack direction="row" py={2} px={2} spacing={2} alignItems="center">
          <Avatar
            src={ProfileImg}
            alt="Profile"
            sx={{
              width: 60,
              height: 60,
              bgcolor: 'primary.main',
              fontSize: '18px',
              fontWeight: 600,
            }}
          >
            {user ? getUserInitials(user.firstName, user.lastName) : 'U'}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" color="textPrimary" fontWeight={600}>
              {user ? `${user.firstName} ${user.lastName}` : 'Guest User'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {user ? getRoleDisplayName(user.role) : 'Guest'}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.8rem' }}>
              {user?.email || 'No email'}
            </Typography>
            {user?.school && (
              <Typography
                variant="body2"
                color="primary.main"
                sx={{ fontSize: '0.75rem', mt: 0.5 }}
              >
                {user.school.name}
              </Typography>
            )}
          </Box>
        </Stack>

        <Divider />

        {/* Menu Items */}
        <MenuItem onClick={() => handleMenuItemClick('/profile')} sx={{ py: 1.5, px: 2 }}>
          <ListItemIcon>
            <IconUser xs={20} />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2">My Profile</Typography>
          </ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleMenuItemClick('/profile/settings')} sx={{ py: 1.5, px: 2 }}>
          <ListItemIcon>
            <IconSettings xs={20} />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2">Account Settings</Typography>
          </ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleMenuItemClick('/profile/security')} sx={{ py: 1.5, px: 2 }}>
          <ListItemIcon>
            <IconShield xs={20} />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2">Security</Typography>
          </ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => handleMenuItemClick('/profile/change-password')}
          sx={{ py: 1.5, px: 2 }}
        >
          <ListItemIcon>
            <IconKey xs={20} />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2">Change Password</Typography>
          </ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleMenuItemClick('/help')} sx={{ py: 1.5, px: 2 }}>
          <ListItemIcon>
            <IconHelp xs={20} />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2">Help & Support</Typography>
          </ListItemText>
        </MenuItem>

        <Divider sx={{ my: 1 }} />

        <Box sx={{ p: 1 }}>
          <Button
            onClick={handleLogout}
            variant="outlined"
            color="error"
            fullWidth
            startIcon={<IconLogout xs={16} />}
            sx={{ py: 1 }}
          >
            Logout
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
