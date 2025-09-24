import { useState } from 'react';
import {
  IconButton,
  Dialog,
  DialogContent,
  Stack,
  Divider,
  Box,
  List,
  ListItemText,
  Typography,
  TextField,
  ListItemButton,
} from '@mui/material';
import { IconSearch, IconX } from '@tabler/icons-react';
import Menuitems from '../sidebar/MenuItems';
import { Link } from 'react-router';

interface menuType {
  title: string;
  id: string;
  subheader: string;
  children: menuType[];
  href: string;
}

const Search = () => {
  // drawer top
  const [showDrawer2, setShowDrawer2] = useState(false);
  const [search, setSerach] = useState('');

  const handleDrawerClose2 = () => {
    setShowDrawer2(false);
  };

  const filterRoutes = (rotr: any, cSearch: string) => {
    if (rotr.length > 1) {
      return rotr.filter((t: any) => {
        // Skip navigation labels (section headers)
        if (t.navlabel) return false;

        // Filter by title and href
        if (t.title && t.href) {
          return (
            t.href.toLowerCase().includes(cSearch.toLowerCase()) ||
            t.title.toLowerCase().includes(cSearch.toLowerCase())
          );
        }

        // Also check children if they exist
        if (t.children && t.children.length > 0) {
          return t.children.some(
            (child: any) =>
              child.title &&
              child.href &&
              (child.href.toLowerCase().includes(cSearch.toLowerCase()) ||
                child.title.toLowerCase().includes(cSearch.toLowerCase())),
          );
        }

        return false;
      });
    }

    return rotr;
  };
  const searchData = filterRoutes(Menuitems, search);

  return (
    <>
      <IconButton
        aria-label="show 4 new mails"
        color="inherit"
        aria-controls="search-menu"
        aria-haspopup="true"
        onClick={() => setShowDrawer2(true)}
       
      >
        <IconSearch />
      </IconButton>
      <Dialog
        open={showDrawer2}
        onClose={() => setShowDrawer2(false)}
        fullWidth
        maxWidth={'sm'}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        slotProps={{
          paper: {
            sx: { position: 'fixed', top: 30, m: 0 },
          },
        }}
      >
        <DialogContent className="testdialog">
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              id="tb-search"
              placeholder="Search here"
              fullWidth
              onChange={(e) => setSerach(e.target.value)}
              slotProps={{
                htmlInput: { 'aria-label': 'Search here' },
              }}
            />
            <IconButton onClick={handleDrawerClose2}>
              <IconX />
            </IconButton>
          </Stack>
        </DialogContent>
        <Divider />
        <Box p={2} sx={{ maxHeight: '60vh', overflow: 'auto' }}>
          <Typography variant="h5" p={1}>
            Quick Page Links
          </Typography>
          <Box>
            <List component="nav">
              {searchData.map((menu: menuType) => {
                return (
                  <Box key={menu.title ? menu.id : menu.subheader}>
                    {menu.title && !menu.children ? (
                      <ListItemButton sx={{ py: 0.5, px: 1 }} to={menu?.href} component={Link}>
                        <ListItemText
                          primary={menu.title}
                          secondary={menu?.href}
                          sx={{ my: 0, py: 0.5 }}
                        />
                      </ListItemButton>
                    ) : (
                      ''
                    )}
                    {menu.children ? (
                      <>
                        {menu.children.map((child: menuType) => {
                          return (
                            <ListItemButton
                              sx={{ py: 0.5, px: 1 }}
                              to={child.href}
                              component={Link}
                              key={child.title ? child.id : menu.subheader}
                            >
                              <ListItemText
                                primary={child.title}
                                secondary={child.href}
                                sx={{ my: 0, py: 0.5 }}
                              />
                            </ListItemButton>
                          );
                        })}
                      </>
                    ) : (
                      ''
                    )}
                  </Box>
                );
              })}
            </List>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default Search;
