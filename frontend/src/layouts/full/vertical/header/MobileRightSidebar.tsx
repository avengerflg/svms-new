// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useState } from 'react';
import {
  IconApps,
  IconCalendarEvent,
  IconChevronDown,
  IconChevronUp,
  IconGridDots,
  IconMail,
  IconMessages,
} from '@tabler/icons-react';
import {
  Box,
  Typography,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@mui/material';

import { Link } from 'react-router';
import AppLinks from './AppLinks';
import QuickLinks from './QuickLinks';

const MobileRightSidebar = () => {
  const [showDrawer, setShowDrawer] = useState(false);

  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  const cartContent = (
    <Box>
      {/* ------------------------------------------- */}
      {/* Apps Content */}
      {/* ------------------------------------------- */}
      <Box px={1}>
        <List
          sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          <ListItemButton component={Link} to="/apps/chats">
            <ListItemIcon sx={{ minWidth: 35 }}>
              <IconMessages stroke="1.5" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="subtitle2" fontWeight={600}>
                Chats
              </Typography>
            </ListItemText>
          </ListItemButton>
          <ListItemButton component={Link} to="/apps/calendar">
            <ListItemIcon sx={{ minWidth: 35 }}>
              <IconCalendarEvent stroke="1.5" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="subtitle2" fontWeight={600}>
                Calendar
              </Typography>
            </ListItemText>
          </ListItemButton>
          <ListItemButton component={Link} to="/apps/email">
            <ListItemIcon sx={{ minWidth: 35 }}>
              <IconMail stroke="1.5" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="subtitle2" fontWeight={600}>
                Email
              </Typography>
            </ListItemText>
          </ListItemButton>
          <ListItemButton onClick={handleClick}>
            <ListItemIcon sx={{ minWidth: 35 }}>
              <IconApps stroke="1.5" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="subtitle2" fontWeight={600}>
                Apps
              </Typography>
            </ListItemText>
            {open ? (
              <IconChevronDown stroke="1.5" />
            ) : (
              <IconChevronUp stroke="1.5" />
            )}
          </ListItemButton>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box px={4} pt={3} overflow="hidden">
              <AppLinks />
            </Box>
          </Collapse>
        </List>
      </Box>

      <Box px={3} mt={3}>
        <QuickLinks />
      </Box>
    </Box>
  );

  return (
    (<Box>
      <IconButton
       
        color="inherit"
        onClick={() => setShowDrawer(true)}
        sx={{
          ...(showDrawer && {
            color: 'primary.main',
          }),
        }}
      >
        <IconGridDots stroke="1.5" />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Cart Sidebar */}
      {/* ------------------------------------------- */}
      <Drawer
        anchor="right"
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        slotProps={{
          paper: { sx: { width: '300px' } }
        }}
      >
        <Box p={3} pb={0}>
          <Typography variant="h5" fontWeight={600}>
            Navigation
          </Typography>
        </Box>

        {/* component */}
        {cartContent}
      </Drawer>
    </Box>)
  );
};

export default MobileRightSidebar;
