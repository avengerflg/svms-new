import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Menu,
  MenuItem as MenuItemComponent,
  Badge,
  Tooltip,
} from '@mui/material'; 
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconSearch,
  IconFilter,
  IconDownload,
  IconUpload,
  IconUser,
  IconEye,
  IconEyeCheck,
  IconShield,
  IconBell,
  IconMoreVertical,
  IconCopy,
  IconMail,
  IconPhone,
  IconCalendar,
  IconMapPin,
  IconFlag,
  IconAlertCircle,
} from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import { useAuth } from '../../context/AuthContext';

interface WatchlistEntry {
  id: string;
  name: string;
  idNumber?: string;
  phoneNumber?: string;
  email?: string;
  photo?: string;
  reason: string;
  category:
    | 'vip'
    | 'frequent-visitor'
    | 'suspicious-activity'
    | 'pending-investigation'
    | 'monitoring'
    | 'other';
  addedBy: string;
  addedDate: Date;
  isActive: boolean;
  notes?: string;
  expiryDate?: Date;
  lastSeen?: Date;
  alertLevel: 'info' | 'low' | 'medium' | 'high';
  aliases?: string[];
  relatedIncidents: string[];
  monitoringFlags: {
    frequentVisits: boolean;
    afterHours: boolean;
    restrictedAreas: boolean;
    multipleEntries: boolean;
    behaviourChanges: boolean;
  };
  visitCount: number;
  lastLocation?: string;
  associatedPersons?: string[];
}

const Watchlist: React.FC = () => {
  const { user } = useAuth();
  const [watchlistEntries, setWatchlistEntries] = useState<WatchlistEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<WatchlistEntry[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<WatchlistEntry | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit' | 'view'>('add');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning',
  });
  const [filters, setFilters] = useState({
    category: 'all',
    alertLevel: 'all',
    status: 'all',
  });
  const [formData, setFormData] = useState<Partial<WatchlistEntry>>({
    name: '',
    idNumber: '',
    phoneNumber: '',
    email: '',
    reason: '',
    category: 'monitoring',
    alertLevel: 'info',
    notes: '',
    expiryDate: undefined,
    aliases: [],
    monitoringFlags: {
      frequentVisits: false,
      afterHours: false,
      restrictedAreas: false,
      multipleEntries: false,
      behaviourChanges: false,
    },
  });

  // Mock data
  const mockWatchlistEntries: WatchlistEntry[] = [
    {
      id: '1',
      name: 'Dr. Sarah Mitchell',
      idNumber: 'ID789456123',
      phoneNumber: '+1-555-0789',
      email: 'sarah.mitchell@email.com',
      reason: 'VIP parent - school board member',
      category: 'vip',
      addedBy: 'Principal',
      addedDate: new Date('2024-01-10'),
      isActive: true,
      notes: 'Board member, requires special attention and priority handling.',
      alertLevel: 'info',
      aliases: ['S. Mitchell', 'Dr. Mitchell'],
      relatedIncidents: [],
      monitoringFlags: {
        frequentVisits: true,
        afterHours: false,
        restrictedAreas: false,
        multipleEntries: false,
        behaviourChanges: false,
      },
      visitCount: 45,
      lastSeen: new Date('2024-02-28'),
      lastLocation: 'Main Office',
      associatedPersons: ['Emma Mitchell (Student)'],
    },
    {
      id: '2',
      name: 'Mark Rodriguez',
      idNumber: 'ID321654987',
      phoneNumber: '+1-555-0321',
      reason: 'Frequent visitor - exhibits unusual behavior patterns',
      category: 'suspicious-activity',
      addedBy: 'Security Guard',
      addedDate: new Date('2024-02-15'),
      isActive: true,
      alertLevel: 'medium',
      notes: 'Multiple visits with different stated purposes. Monitor entry patterns.',
      relatedIncidents: ['OBS-001', 'OBS-003'],
      monitoringFlags: {
        frequentVisits: true,
        afterHours: true,
        restrictedAreas: true,
        multipleEntries: false,
        behaviourChanges: true,
      },
      visitCount: 12,
      lastSeen: new Date('2024-02-27'),
      lastLocation: 'Parking Lot',
    },
    {
      id: '3',
      name: 'Jennifer Chang',
      idNumber: 'ID654987321',
      email: 'j.chang@contractor.com',
      reason: 'Regular contractor - maintenance services',
      category: 'frequent-visitor',
      addedBy: 'Facilities Manager',
      addedDate: new Date('2024-01-05'),
      isActive: true,
      alertLevel: 'low',
      notes: 'Authorized contractor for HVAC maintenance. Weekly visits scheduled.',
      relatedIncidents: [],
      monitoringFlags: {
        frequentVisits: true,
        afterHours: true,
        restrictedAreas: true,
        multipleEntries: false,
        behaviourChanges: false,
      },
      visitCount: 28,
      lastSeen: new Date('2024-02-26'),
      lastLocation: 'Mechanical Room',
    },
    {
      id: '4',
      name: 'Alex Thompson',
      idNumber: 'ID987321654',
      phoneNumber: '+1-555-0987',
      reason: 'Under investigation for unauthorized photography',
      category: 'pending-investigation',
      addedBy: 'Security Manager',
      addedDate: new Date('2024-02-20'),
      isActive: true,
      alertLevel: 'high',
      notes: 'Reported taking photos of school layout. Investigation ongoing.',
      relatedIncidents: ['INV-002'],
      monitoringFlags: {
        frequentVisits: false,
        afterHours: false,
        restrictedAreas: true,
        multipleEntries: false,
        behaviourChanges: true,
      },
      visitCount: 3,
      lastSeen: new Date('2024-02-22'),
      lastLocation: 'Main Hallway',
    },
  ];

  useEffect(() => {
    setWatchlistEntries(mockWatchlistEntries);
    setFilteredEntries(mockWatchlistEntries);
  }, []);

  useEffect(() => {
    let filtered = watchlistEntries.filter((entry) => {
      const matchesSearch =
        entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.idNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.reason.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = filters.category === 'all' || entry.category === filters.category;
      const matchesAlertLevel =
        filters.alertLevel === 'all' || entry.alertLevel === filters.alertLevel;
      const matchesStatus =
        filters.status === 'all' ||
        (filters.status === 'active' && entry.isActive) ||
        (filters.status === 'inactive' && !entry.isActive);

      return matchesSearch && matchesCategory && matchesAlertLevel && matchesStatus;
    });

    setFilteredEntries(filtered);
    setPage(0);
  }, [watchlistEntries, searchTerm, filters]);

  const handleAddEntry = () => {
    setDialogMode('add');
    setFormData({
      name: '',
      idNumber: '',
      phoneNumber: '',
      email: '',
      reason: '',
      category: 'monitoring',
      alertLevel: 'info',
      notes: '',
      expiryDate: undefined,
      aliases: [],
      monitoringFlags: {
        frequentVisits: false,
        afterHours: false,
        restrictedAreas: false,
        multipleEntries: false,
        behaviourChanges: false,
      },
    });
    setShowDialog(true);
  };

  const handleEditEntry = (entry: WatchlistEntry) => {
    setDialogMode('edit');
    setSelectedEntry(entry);
    setFormData({
      name: entry.name,
      idNumber: entry.idNumber,
      phoneNumber: entry.phoneNumber,
      email: entry.email,
      reason: entry.reason,
      category: entry.category,
      alertLevel: entry.alertLevel,
      notes: entry.notes,
      expiryDate: entry.expiryDate,
      aliases: entry.aliases || [],
      monitoringFlags: entry.monitoringFlags,
    });
    setShowDialog(true);
  };

  const handleViewEntry = (entry: WatchlistEntry) => {
    setDialogMode('view');
    setSelectedEntry(entry);
    setShowDialog(true);
  };

  const handleSaveEntry = () => {
    if (!formData.name || !formData.reason) {
      setSnackbar({ open: true, message: 'Name and reason are required', severity: 'error' });
      return;
    }

    const entryData: WatchlistEntry = {
      id: selectedEntry?.id || `wl_${Date.now()}`,
      name: formData.name!,
      idNumber: formData.idNumber,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      reason: formData.reason!,
      category: formData.category as any,
      addedBy: user?.name || 'Unknown',
      addedDate: selectedEntry?.addedDate || new Date(),
      isActive: true,
      notes: formData.notes,
      expiryDate: formData.expiryDate,
      alertLevel: formData.alertLevel as any,
      aliases: formData.aliases || [],
      relatedIncidents: selectedEntry?.relatedIncidents || [],
      monitoringFlags: formData.monitoringFlags!,
      visitCount: selectedEntry?.visitCount || 0,
    };

    if (dialogMode === 'add') {
      setWatchlistEntries((prev) => [entryData, ...prev]);
      setSnackbar({ open: true, message: 'Entry added to watchlist', severity: 'success' });
    } else {
      setWatchlistEntries((prev) =>
        prev.map((entry) => (entry.id === entryData.id ? entryData : entry)),
      );
      setSnackbar({ open: true, message: 'Entry updated successfully', severity: 'success' });
    }

    setShowDialog(false);
  };

  const handleDeleteEntry = (id: string) => {
    setWatchlistEntries((prev) => prev.filter((entry) => entry.id !== id));
    setSnackbar({ open: true, message: 'Entry removed from watchlist', severity: 'success' });
    setAnchorEl(null);
  };

  const handleToggleStatus = (id: string) => {
    setWatchlistEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, isActive: !entry.isActive } : entry)),
    );
    setSnackbar({ open: true, message: 'Entry status updated', severity: 'success' });
    setAnchorEl(null);
  };

  const getAlertLevelColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      case 'info':
        return 'success';
      default:
        return 'default';
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      vip: 'VIP',
      'frequent-visitor': 'Frequent Visitor',
      'suspicious-activity': 'Suspicious Activity',
      'pending-investigation': 'Under Investigation',
      monitoring: 'Monitoring',
      other: 'Other',
    };
    return labels[category as keyof typeof labels] || category;
  };

  const getMonitoringFlagsCount = (flags: WatchlistEntry['monitoringFlags']) => {
    return Object.values(flags).filter((flag) => flag).length;
  };

  return (
    <PageContainer title="Watchlist Management" description="Monitor and track persons of interest">
      <Box>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Watchlist Management
          </Typography>
          <Box display="flex" gap={2}>
            <Button variant="outlined" startIcon={<IconUpload />}>
              Import
            </Button>
            <Button variant="outlined" startIcon={<IconDownload />}>
              Export
            </Button>
            <Button variant="contained" startIcon={<IconPlus />} onClick={handleAddEntry}>
              Add to Watchlist
            </Button>
          </Box>
        </Box>

        {/* Quick Stats */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary">
                  {watchlistEntries.filter((e) => e.isActive).length}
                </Typography>
                <Typography variant="body2">Active Entries</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="error">
                  {watchlistEntries.filter((e) => e.alertLevel === 'high').length}
                </Typography>
                <Typography variant="body2">High Alert</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="warning.main">
                  {watchlistEntries.filter((e) => e.category === 'pending-investigation').length}
                </Typography>
                <Typography variant="body2">Under Investigation</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="success.main">
                  {watchlistEntries.filter((e) => e.category === 'vip').length}
                </Typography>
                <Typography variant="body2">VIP Entries</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search and Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search by name, ID, or reason..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <IconSearch style={{ marginRight: 8, color: '#666' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    <MenuItem value="vip">VIP</MenuItem>
                    <MenuItem value="frequent-visitor">Frequent Visitor</MenuItem>
                    <MenuItem value="suspicious-activity">Suspicious Activity</MenuItem>
                    <MenuItem value="pending-investigation">Under Investigation</MenuItem>
                    <MenuItem value="monitoring">Monitoring</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Alert Level</InputLabel>
                  <Select
                    value={filters.alertLevel}
                    onChange={(e) => setFilters({ ...filters, alertLevel: e.target.value })}
                  >
                    <MenuItem value="all">All Levels</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="info">Info</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Typography variant="body2" color="textSecondary">
                  {filteredEntries.length} entries found
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Watchlist Table */}
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Alert Level</TableCell>
                  <TableCell>Monitoring Flags</TableCell>
                  <TableCell>Last Seen</TableCell>
                  <TableCell>Visit Count</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEntries
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((entry) => (
                    <TableRow key={entry.id} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar>
                            {entry.photo ? (
                              <img src={entry.photo} alt={entry.name} />
                            ) : (
                              <IconUser />
                            )}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {entry.name}
                            </Typography>
                            {entry.idNumber && (
                              <Typography variant="caption" color="textSecondary">
                                ID: {entry.idNumber}
                              </Typography>
                            )}
                            {entry.lastLocation && (
                              <Typography variant="caption" display="block" color="textSecondary">
                                <IconMapPin xs={12} style={{ marginRight: 4 }} />
                                {entry.lastLocation}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getCategoryLabel(entry.category)}
                          variant="outlined"
                         
                          color={
                            entry.category === 'vip'
                              ? 'primary'
                              : entry.category === 'suspicious-activity'
                              ? 'warning'
                              : entry.category === 'pending-investigation'
                              ? 'error'
                              : 'default'
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={entry.alertLevel.toUpperCase()}
                          color={getAlertLevelColor(entry.alertLevel) as any}
                         
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip
                          title={
                            Object.entries(entry.monitoringFlags)
                              .filter(([_, value]) => value)
                              .map(([key, _]) =>
                                key
                                  .replace(/([A-Z])/g, ' $1')
                                  .replace(/^./, (str) => str.toUpperCase()),
                              )
                              .join(', ') || 'No active flags'
                          }
                        >
                          <Badge
                            badgeContent={getMonitoringFlagsCount(entry.monitoringFlags)}
                            color="warning"
                          >
                            <IconFlag />
                          </Badge>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        {entry.lastSeen ? (
                          <Box>
                            <Typography variant="body2">
                              {entry.lastSeen.toLocaleDateString()}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {entry.lastSeen.toLocaleTimeString()}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="caption" color="textSecondary">
                            Never
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {entry.visitCount}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          visits
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={entry.isActive ? 'Active' : 'Inactive'}
                          color={entry.isActive ? 'success' : 'default'}
                         
                        />
                        {entry.expiryDate && (
                          <Typography variant="caption" display="block" color="textSecondary">
                            Expires: {entry.expiryDate.toLocaleDateString()}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={(e) => {
                            setAnchorEl(e.currentTarget);
                            setSelectedEntryId(entry.id);
                          }}
                        >
                          <IconMoreVertical />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredEntries.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </Card>

        {/* Context Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItemComponent
            onClick={() => {
              const entry = watchlistEntries.find((e) => e.id === selectedEntryId);
              if (entry) handleViewEntry(entry);
              setAnchorEl(null);
            }}
          >
            <IconEye style={{ marginRight: 8 }} />
            View Details
          </MenuItemComponent>
          <MenuItemComponent
            onClick={() => {
              const entry = watchlistEntries.find((e) => e.id === selectedEntryId);
              if (entry) handleEditEntry(entry);
              setAnchorEl(null);
            }}
          >
            <IconEdit style={{ marginRight: 8 }} />
            Edit Entry
          </MenuItemComponent>
          <MenuItemComponent
            onClick={() => {
              if (selectedEntryId) handleToggleStatus(selectedEntryId);
            }}
          >
            <IconEyeCheck style={{ marginRight: 8 }} />
            Toggle Status
          </MenuItemComponent>
          <Divider />
          <MenuItemComponent
            onClick={() => {
              if (selectedEntryId) handleDeleteEntry(selectedEntryId);
            }}
            sx={{ color: 'error.main' }}
          >
            <IconTrash style={{ marginRight: 8 }} />
            Remove from Watchlist
          </MenuItemComponent>
        </Menu>

        {/* Add/Edit Dialog */}
        <Dialog open={showDialog} onClose={() => setShowDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            {dialogMode === 'add'
              ? 'Add Watchlist Entry'
              : dialogMode === 'edit'
              ? 'Edit Watchlist Entry'
              : 'Watchlist Entry Details'}
          </DialogTitle>
          <DialogContent>
            {dialogMode === 'view' && selectedEntry ? (
              <Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <List>
                      <ListItem>
                        <ListItemText primary="Name" secondary={selectedEntry.name} />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="ID Number"
                          secondary={selectedEntry.idNumber || 'N/A'}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Phone"
                          secondary={selectedEntry.phoneNumber || 'N/A'}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Email" secondary={selectedEntry.email || 'N/A'} />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Category"
                          secondary={getCategoryLabel(selectedEntry.category)}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Alert Level"
                          secondary={selectedEntry.alertLevel.toUpperCase()}
                        />
                      </ListItem>
                    </List>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <List>
                      <ListItem>
                        <ListItemText primary="Added By" secondary={selectedEntry.addedBy} />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Added Date"
                          secondary={selectedEntry.addedDate.toLocaleDateString()}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Visit Count" secondary={selectedEntry.visitCount} />
                      </ListItem>
                      {selectedEntry.lastSeen && (
                        <ListItem>
                          <ListItemText
                            primary="Last Seen"
                            secondary={selectedEntry.lastSeen.toLocaleString()}
                          />
                        </ListItem>
                      )}
                      {selectedEntry.lastLocation && (
                        <ListItem>
                          <ListItemText
                            primary="Last Location"
                            secondary={selectedEntry.lastLocation}
                          />
                        </ListItem>
                      )}
                    </List>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Monitoring Flags
                    </Typography>
                    <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                      {Object.entries(selectedEntry.monitoringFlags).map(([flag, isActive]) => (
                        <Chip
                          key={flag}
                          label={flag
                            .replace(/([A-Z])/g, ' $1')
                            .replace(/^./, (str) => str.toUpperCase())}
                          color={isActive ? 'warning' : 'default'}
                          variant={isActive ? 'filled' : 'outlined'}
                         
                        />
                      ))}
                    </Box>

                    <Typography variant="h6" gutterBottom>
                      Reason
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {selectedEntry.reason}
                    </Typography>

                    {selectedEntry.notes && (
                      <>
                        <Typography variant="h6" gutterBottom>
                          Notes
                        </Typography>
                        <Typography variant="body2" paragraph>
                          {selectedEntry.notes}
                        </Typography>
                      </>
                    )}

                    {selectedEntry.aliases && selectedEntry.aliases.length > 0 && (
                      <>
                        <Typography variant="h6" gutterBottom>
                          Known Aliases
                        </Typography>
                        <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                          {selectedEntry.aliases.map((alias, index) => (
                            <Chip key={index} label={alias} variant="outlined" />
                          ))}
                        </Box>
                      </>
                    )}

                    {selectedEntry.relatedIncidents.length > 0 && (
                      <>
                        <Typography variant="h6" gutterBottom>
                          Related Incidents
                        </Typography>
                        <Box display="flex" gap={1} flexWrap="wrap">
                          {selectedEntry.relatedIncidents.map((incident, index) => (
                            <Chip key={index} label={incident} color="info" />
                          ))}
                        </Box>
                      </>
                    )}

                    {selectedEntry.associatedPersons &&
                      selectedEntry.associatedPersons.length > 0 && (
                        <>
                          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                            Associated Persons
                          </Typography>
                          <Box display="flex" gap={1} flexWrap="wrap">
                            {selectedEntry.associatedPersons.map((person, index) => (
                              <Chip key={index} label={person} color="primary" />
                            ))}
                          </Box>
                        </>
                      )}
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Full Name *"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    margin="normal"
                    disabled={dialogMode === 'view'}
                  />
                  <TextField
                    fullWidth
                    label="ID Number"
                    value={formData.idNumber}
                    onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                    margin="normal"
                    disabled={dialogMode === 'view'}
                  />
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    margin="normal"
                    disabled={dialogMode === 'view'}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    margin="normal"
                    disabled={dialogMode === 'view'}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Category *</InputLabel>
                    <Select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value as any })
                      }
                      disabled={dialogMode === 'view'}
                    >
                      <MenuItem value="vip">VIP</MenuItem>
                      <MenuItem value="frequent-visitor">Frequent Visitor</MenuItem>
                      <MenuItem value="suspicious-activity">Suspicious Activity</MenuItem>
                      <MenuItem value="pending-investigation">Under Investigation</MenuItem>
                      <MenuItem value="monitoring">Monitoring</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Alert Level *</InputLabel>
                    <Select
                      value={formData.alertLevel}
                      onChange={(e) =>
                        setFormData({ ...formData, alertLevel: e.target.value as any })
                      }
                      disabled={dialogMode === 'view'}
                    >
                      <MenuItem value="info">Info</MenuItem>
                      <MenuItem value="low">Low</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label="Expiry Date"
                    type="date"
                    value={
                      formData.expiryDate ? formData.expiryDate.toISOString().split('T')[0] : ''
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        expiryDate: e.target.value ? new Date(e.target.value) : undefined,
                      })
                    }
                    InputLabelProps={{ shrink: true }}
                    margin="normal"
                    disabled={dialogMode === 'view'}
                  />
                </Grid>

                {/* Monitoring Flags */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Monitoring Flags
                  </Typography>
                  <Grid container spacing={2}>
                    {Object.entries(formData.monitoringFlags || {}).map(([flag, isActive]) => (
                      <Grid item xs={12} md={4} key={flag}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={isActive}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  monitoringFlags: {
                                    ...formData.monitoringFlags!,
                                    [flag]: e.target.checked,
                                  },
                                })
                              }
                              disabled={dialogMode === 'view'}
                            />
                          }
                          label={flag
                            .replace(/([A-Z])/g, ' $1')
                            .replace(/^./, (str) => str.toUpperCase())}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Reason *"
                    multiline
                    rows={3}
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    margin="normal"
                    disabled={dialogMode === 'view'}
                  />
                  <TextField
                    fullWidth
                    label="Additional Notes"
                    multiline
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    margin="normal"
                    disabled={dialogMode === 'view'}
                  />
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDialog(false)}>
              {dialogMode === 'view' ? 'Close' : 'Cancel'}
            </Button>
            {dialogMode !== 'view' && (
              <Button variant="contained" onClick={handleSaveEntry}>
                {dialogMode === 'add' ? 'Add to Watchlist' : 'Update Entry'}
              </Button>
            )}
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </PageContainer>
  );
};

export default Watchlist;
