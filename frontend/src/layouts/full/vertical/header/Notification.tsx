// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useState } from 'react';
import {
  IconButton,
  Box,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Button,
  Stack,
  Divider,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import Scrollbar from 'src/components/custom-scroll/Scrollbar';
import {
  IconBellRinging,
  IconUserCheck,
  IconShield,
  IconAlertTriangle,
  IconClock,
  IconSettings,
  IconEye,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const navigate = useNavigate();

  const handleClick2 = (event: any) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleViewAllNotifications = () => {
    navigate('/notifications');
    handleClose2();
  };

  // Sample school visiting system notifications
  const schoolNotifications = [
    {
      id: 1,
      icon: <IconUserCheck xs={24} color="green" />,
      title: 'New Visitor Check-in',
      subtitle: 'John Smith checked in to Building A',
      time: '2 minutes ago',
      type: 'visitor',
    },
    {
      id: 2,
      icon: <IconShield xs={24} color="orange" />,
      title: 'Security Alert',
      subtitle: 'Unauthorized access attempt detected',
      time: '5 minutes ago',
      type: 'security',
    },
    {
      id: 3,
      icon: <IconClock xs={24} color="blue" />,
      title: 'Visitor Overstay',
      subtitle: 'Sarah Johnson exceeded visit duration',
      time: '10 minutes ago',
      type: 'warning',
    },
    {
      id: 4,
      icon: <IconAlertTriangle xs={24} color="red" />,
      title: 'Emergency Alert',
      subtitle: 'Evacuation drill scheduled for 3 PM',
      time: '1 hour ago',
      type: 'emergency',
    },
  ];

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'visitor':
        return 'success.light';
      case 'security':
        return 'warning.light';
      case 'warning':
        return 'info.light';
      case 'emergency':
        return 'error.light';
      default:
        return 'grey.100';
    }
  };

  return (
    <Box>
      <IconButton
       
        aria-label="notifications"
        color="inherit"
        aria-controls="notifications-menu"
        aria-haspopup="true"
        sx={{
          color: anchorEl2 ? 'primary.main' : 'text.secondary',
        }}
        onClick={handleClick2}
      >
        <Badge badgeContent={schoolNotifications.length} color="error">
          <IconBellRinging stroke="1.5" />
        </Badge>
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Notifications Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="notifications-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '380px',
            maxHeight: '500px',
          },
        }}
      >
        <Stack direction="row" py={2} px={3} justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Notifications</Typography>
          <Badge badgeContent={schoolNotifications.length} color="primary" />
        </Stack>

        <Divider />

        <Scrollbar sx={{ height: '320px' }}>
          {schoolNotifications.length > 0 ? (
            schoolNotifications.map((notification) => (
              <MenuItem
                key={notification.id}
                sx={{ py: 2, px: 3, borderBottom: '1px solid', borderColor: 'divider' }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start" width="100%">
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: getNotificationColor(notification.type),
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {notification.icon}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="subtitle2"
                      color="textPrimary"
                      fontWeight={600}
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {notification.title}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      variant="body2"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        mb: 0.5,
                      }}
                    >
                      {notification.subtitle}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      variant="caption"
                      sx={{ fontSize: '0.75rem' }}
                    >
                      {notification.time}
                    </Typography>
                  </Box>
                </Stack>
              </MenuItem>
            ))
          ) : (
            <Box sx={{ py: 4, px: 3, textAlign: 'center' }}>
              <IconBellRinging xs={48} color="gray" style={{ marginBottom: 16 }} />
              <Typography variant="body2" color="textSecondary">
                No new notifications
              </Typography>
            </Box>
          )}
        </Scrollbar>

        <Divider />

        <Box sx={{ p: 2 }}>
          <Button
            onClick={handleViewAllNotifications}
            variant="outlined"
            color="primary"
            fullWidth
            startIcon={<IconEye xs={16} />}
          >
            View All Notifications
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Notifications;
