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
  IconAlertTriangle,
  IconShield,
  IconBan,
  IconEye,
  IconMoreVertical,
  IconCopy,
  IconMail,
  IconPhone,
} from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import { useAuth } from '../../context/AuthContext';

interface BlacklistEntry {
  id: string;
  name: string;
  idNumber?: string;
  phoneNumber?: string;
  email?: string;
  photo?: string;
  reason: string;
  category: 'security-threat' | 'disruptive-behavior' | 'unauthorized-access' | 'fraud' | 'other';
  addedBy: string;
  addedDate: Date;
  isActive: boolean;
  notes?: string;
  expiryDate?: Date;
  lastIncident?: Date;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  aliases?: string[];
  relatedIncidents: string[];
}

const Blacklist: React.FC = () => {
  const { user } = useAuth();
  const [blacklistEntries, setBlacklistEntries] = useState<BlacklistEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<BlacklistEntry[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<BlacklistEntry | null>(null);
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
    riskLevel: 'all',
    status: 'all',
  });
  const [formData, setFormData] = useState<Partial<BlacklistEntry>>({
    name: '',
    idNumber: '',
    phoneNumber: '',
    email: '',
    reason: '',
    category: 'other',
    riskLevel: 'medium',
    notes: '',
    expiryDate: undefined,
    aliases: [],
  });

  // Mock data
  const mockBlacklistEntries: BlacklistEntry[] = [
    {
      id: '1',
      name: 'John Smith',
      idNumber: 'ID123456789',
      phoneNumber: '+1-555-0123',
      email: 'john.smith@email.com',
      reason: 'Threatening behavior towards staff',
      category: 'security-threat',
      addedBy: 'Security Manager',
      addedDate: new Date('2024-01-15'),
      isActive: true,
      notes: 'Exhibited aggressive behavior during previous visit. Threatened staff member.',
      lastIncident: new Date('2024-01-14'),
      riskLevel: 'high',
      aliases: ['J. Smith', 'Johnny Smith'],
      relatedIncidents: ['INC-001', 'INC-003'],
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      idNumber: 'ID987654321',
      phoneNumber: '+1-555-0456',
      reason: 'Attempted unauthorized access to restricted areas',
      category: 'unauthorized-access',
      addedBy: 'Security Guard',
      addedDate: new Date('2024-02-01'),
      isActive: true,
      riskLevel: 'medium',
      relatedIncidents: ['INC-005'],
    },
    {
      id: '3',
      name: 'Mike Johnson',
      idNumber: 'ID456789123',
      reason: 'Disruptive behavior during school event',
      category: 'disruptive-behavior',
      addedBy: 'Principal',
      addedDate: new Date('2024-01-20'),
      isActive: false,
      expiryDate: new Date('2024-12-31'),
      riskLevel: 'low',
      relatedIncidents: ['INC-002'],
    },
  ];

  useEffect(() => {
    setBlacklistEntries(mockBlacklistEntries);
    setFilteredEntries(mockBlacklistEntries);
  }, []);

  useEffect(() => {
    let filtered = blacklistEntries.filter((entry) => {
      const matchesSearch =
        entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.idNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.reason.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = filters.category === 'all' || entry.category === filters.category;
      const matchesRiskLevel = filters.riskLevel === 'all' || entry.riskLevel === filters.riskLevel;
      const matchesStatus =
        filters.status === 'all' ||
        (filters.status === 'active' && entry.isActive) ||
        (filters.status === 'inactive' && !entry.isActive);

      return matchesSearch && matchesCategory && matchesRiskLevel && matchesStatus;
    });

    setFilteredEntries(filtered);
    setPage(0);
  }, [blacklistEntries, searchTerm, filters]);

  const handleAddEntry = () => {
    setDialogMode('add');
    setFormData({
      name: '',
      idNumber: '',
      phoneNumber: '',
      email: '',
      reason: '',
      category: 'other',
      riskLevel: 'medium',
      notes: '',
      expiryDate: undefined,
      aliases: [],
    });
    setShowDialog(true);
  };

  const handleEditEntry = (entry: BlacklistEntry) => {
    setDialogMode('edit');
    setSelectedEntry(entry);
    setFormData({
      name: entry.name,
      idNumber: entry.idNumber,
      phoneNumber: entry.phoneNumber,
      email: entry.email,
      reason: entry.reason,
      category: entry.category,
      riskLevel: entry.riskLevel,
      notes: entry.notes,
      expiryDate: entry.expiryDate,
      aliases: entry.aliases || [],
    });
    setShowDialog(true);
  };

  const handleViewEntry = (entry: BlacklistEntry) => {
    setDialogMode('view');
    setSelectedEntry(entry);
    setShowDialog(true);
  };

  const handleSaveEntry = () => {
    if (!formData.name || !formData.reason) {
      setSnackbar({ open: true, message: 'Name and reason are required', severity: 'error' });
      return;
    }

    const entryData: BlacklistEntry = {
      id: selectedEntry?.id || `bl_${Date.now()}`,
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
      riskLevel: formData.riskLevel as any,
      aliases: formData.aliases || [],
      relatedIncidents: selectedEntry?.relatedIncidents || [],
    };

    if (dialogMode === 'add') {
      setBlacklistEntries((prev) => [entryData, ...prev]);
      setSnackbar({ open: true, message: 'Entry added to blacklist', severity: 'success' });
    } else {
      setBlacklistEntries((prev) =>
        prev.map((entry) => (entry.id === entryData.id ? entryData : entry)),
      );
      setSnackbar({ open: true, message: 'Entry updated successfully', severity: 'success' });
    }

    setShowDialog(false);
  };

  const handleDeleteEntry = (id: string) => {
    setBlacklistEntries((prev) => prev.filter((entry) => entry.id !== id));
    setSnackbar({ open: true, message: 'Entry removed from blacklist', severity: 'success' });
    setAnchorEl(null);
  };

  const handleToggleStatus = (id: string) => {
    setBlacklistEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, isActive: !entry.isActive } : entry)),
    );
    setSnackbar({ open: true, message: 'Entry status updated', severity: 'success' });
    setAnchorEl(null);
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'primary';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      'security-threat': 'Security Threat',
      'disruptive-behavior': 'Disruptive Behavior',
      'unauthorized-access': 'Unauthorized Access',
      fraud: 'Fraud',
      other: 'Other',
    };
    return labels[category as keyof typeof labels] || category;
  };

  return (
    <PageContainer
      title="Blacklist Management"
      description="Manage visitor blacklist and security restrictions"
    >
      <Box>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Blacklist Management
          </Typography>
          <Box display="flex" gap={2}>
            <Button variant="outlined" startIcon={<IconUpload />}>
              Import
            </Button>
            <Button variant="outlined" startIcon={<IconDownload />}>
              Export
            </Button>
            <Button variant="contained" startIcon={<IconPlus />} onClick={handleAddEntry}>
              Add Entry
            </Button>
          </Box>
        </Box>

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
                    <MenuItem value="security-threat">Security Threat</MenuItem>
                    <MenuItem value="disruptive-behavior">Disruptive Behavior</MenuItem>
                    <MenuItem value="unauthorized-access">Unauthorized Access</MenuItem>
                    <MenuItem value="fraud">Fraud</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Risk Level</InputLabel>
                  <Select
                    value={filters.riskLevel}
                    onChange={(e) => setFilters({ ...filters, riskLevel: e.target.value })}
                  >
                    <MenuItem value="all">All Levels</MenuItem>
                    <MenuItem value="critical">Critical</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
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

        {/* Blacklist Table */}
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Risk Level</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Added Date</TableCell>
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
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getCategoryLabel(entry.category)}
                          variant="outlined"
                         
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={entry.riskLevel.toUpperCase()}
                          color={getRiskLevelColor(entry.riskLevel) as any}
                         
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" noWrap style={{ maxWidth: 200 }}>
                          {entry.reason}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {entry.addedDate.toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          by {entry.addedBy}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={entry.isActive ? 'Active' : 'Inactive'}
                          color={entry.isActive ? 'error' : 'default'}
                         
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
              const entry = blacklistEntries.find((e) => e.id === selectedEntryId);
              if (entry) handleViewEntry(entry);
              setAnchorEl(null);
            }}
          >
            <IconEye style={{ marginRight: 8 }} />
            View Details
          </MenuItemComponent>
          <MenuItemComponent
            onClick={() => {
              const entry = blacklistEntries.find((e) => e.id === selectedEntryId);
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
            <IconBan style={{ marginRight: 8 }} />
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
            Delete Entry
          </MenuItemComponent>
        </Menu>

        {/* Add/Edit Dialog */}
        <Dialog open={showDialog} onClose={() => setShowDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            {dialogMode === 'add'
              ? 'Add Blacklist Entry'
              : dialogMode === 'edit'
              ? 'Edit Blacklist Entry'
              : 'Blacklist Entry Details'}
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
                          primary="Risk Level"
                          secondary={selectedEntry.riskLevel.toUpperCase()}
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
                        <ListItemText
                          primary="Status"
                          secondary={selectedEntry.isActive ? 'Active' : 'Inactive'}
                        />
                      </ListItem>
                      {selectedEntry.expiryDate && (
                        <ListItem>
                          <ListItemText
                            primary="Expiry Date"
                            secondary={selectedEntry.expiryDate.toLocaleDateString()}
                          />
                        </ListItem>
                      )}
                      {selectedEntry.lastIncident && (
                        <ListItem>
                          <ListItemText
                            primary="Last Incident"
                            secondary={selectedEntry.lastIncident.toLocaleDateString()}
                          />
                        </ListItem>
                      )}
                    </List>
                  </Grid>
                  <Grid item xs={12}>
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
                        <Box display="flex" gap={1} flexWrap="wrap">
                          {selectedEntry.aliases.map((alias, index) => (
                            <Chip key={index} label={alias} variant="outlined" />
                          ))}
                        </Box>
                      </>
                    )}

                    {selectedEntry.relatedIncidents.length > 0 && (
                      <>
                        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                          Related Incidents
                        </Typography>
                        <Box display="flex" gap={1} flexWrap="wrap">
                          {selectedEntry.relatedIncidents.map((incident, index) => (
                            <Chip key={index} label={incident} color="warning" />
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
                      <MenuItem value="security-threat">Security Threat</MenuItem>
                      <MenuItem value="disruptive-behavior">Disruptive Behavior</MenuItem>
                      <MenuItem value="unauthorized-access">Unauthorized Access</MenuItem>
                      <MenuItem value="fraud">Fraud</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Risk Level *</InputLabel>
                    <Select
                      value={formData.riskLevel}
                      onChange={(e) =>
                        setFormData({ ...formData, riskLevel: e.target.value as any })
                      }
                      disabled={dialogMode === 'view'}
                    >
                      <MenuItem value="low">Low</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                      <MenuItem value="critical">Critical</MenuItem>
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
                {dialogMode === 'add' ? 'Add Entry' : 'Update Entry'}
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

export default Blacklist;
