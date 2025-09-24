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
  Tabs,
  Tab,
  Switch,
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
  IconMail,
  IconPhone,
  IconMapPin,
  IconShield,
  IconKey,
  IconCalendar,
  IconClock,
  IconUserCheck,
  IconUserX,
  IconMoreVertical,
  IconEye,
  IconBuilding,
  IconId,
  IconBriefcase,
} from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import { useAuth } from '../../context/AuthContext';

interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  employeeId: string;
  department: string;
  position: string;
  role: 'admin' | 'teacher' | 'staff' | 'security' | 'frontdesk';
  status: 'active' | 'inactive' | 'suspended';
  hireDate: Date;
  lastLogin?: Date;
  avatar?: string;
  permissions: {
    manageVisitors: boolean;
    approveVisitors: boolean;
    viewReports: boolean;
    manageSettings: boolean;
    accessSecurity: boolean;
  };
  accessAreas: string[];
  workingHours: {
    monday: { start: string; end: string };
    tuesday: { start: string; end: string };
    wednesday: { start: string; end: string };
    thursday: { start: string; end: string };
    friday: { start: string; end: string };
    saturday?: { start: string; end: string };
    sunday?: { start: string; end: string };
  };
  contactInfo?: {
    emergencyContact: string;
    emergencyPhone: string;
    address: string;
  };
}

const StaffManagement: React.FC = () => {
  const { user } = useAuth();
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<StaffMember[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit' | 'view'>('add');
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning',
  });
  const [filters, setFilters] = useState({
    department: 'all',
    role: 'all',
    status: 'all',
  });

  // Mock staff data
  const mockStaffMembers: StaffMember[] = [
    {
      id: 'staff_001',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@school.edu',
      phoneNumber: '+1-555-0123',
      employeeId: 'EMP001',
      department: 'Administration',
      position: 'Principal',
      role: 'admin',
      status: 'active',
      hireDate: new Date('2020-08-15'),
      lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
      permissions: {
        manageVisitors: true,
        approveVisitors: true,
        viewReports: true,
        manageSettings: true,
        accessSecurity: true,
      },
      accessAreas: ['All Areas'],
      workingHours: {
        monday: { start: '08:00', end: '17:00' },
        tuesday: { start: '08:00', end: '17:00' },
        wednesday: { start: '08:00', end: '17:00' },
        thursday: { start: '08:00', end: '17:00' },
        friday: { start: '08:00', end: '16:00' },
      },
    },
    {
      id: 'staff_002',
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael.chen@school.edu',
      phoneNumber: '+1-555-0456',
      employeeId: 'EMP002',
      department: 'Security',
      position: 'Security Manager',
      role: 'security',
      status: 'active',
      hireDate: new Date('2021-03-10'),
      lastLogin: new Date(Date.now() - 30 * 60 * 1000),
      permissions: {
        manageVisitors: true,
        approveVisitors: false,
        viewReports: true,
        manageSettings: false,
        accessSecurity: true,
      },
      accessAreas: ['Security Office', 'Main Entrance', 'Parking Lot'],
      workingHours: {
        monday: { start: '07:00', end: '15:00' },
        tuesday: { start: '07:00', end: '15:00' },
        wednesday: { start: '07:00', end: '15:00' },
        thursday: { start: '07:00', end: '15:00' },
        friday: { start: '07:00', end: '15:00' },
      },
    },
    {
      id: 'staff_003',
      firstName: 'Emily',
      lastName: 'Rodriguez',
      email: 'emily.rodriguez@school.edu',
      phoneNumber: '+1-555-0789',
      employeeId: 'EMP003',
      department: 'Front Office',
      position: 'Front Desk Coordinator',
      role: 'frontdesk',
      status: 'active',
      hireDate: new Date('2022-01-20'),
      lastLogin: new Date(Date.now() - 10 * 60 * 1000),
      permissions: {
        manageVisitors: true,
        approveVisitors: false,
        viewReports: false,
        manageSettings: false,
        accessSecurity: false,
      },
      accessAreas: ['Reception', 'Main Office'],
      workingHours: {
        monday: { start: '08:00', end: '16:00' },
        tuesday: { start: '08:00', end: '16:00' },
        wednesday: { start: '08:00', end: '16:00' },
        thursday: { start: '08:00', end: '16:00' },
        friday: { start: '08:00', end: '16:00' },
      },
    },
    {
      id: 'staff_004',
      firstName: 'Dr. David',
      lastName: 'Williams',
      email: 'david.williams@school.edu',
      phoneNumber: '+1-555-0321',
      employeeId: 'EMP004',
      department: 'Academic',
      position: 'Mathematics Teacher',
      role: 'teacher',
      status: 'active',
      hireDate: new Date('2019-09-01'),
      lastLogin: new Date(Date.now() - 4 * 60 * 60 * 1000),
      permissions: {
        manageVisitors: false,
        approveVisitors: true,
        viewReports: false,
        manageSettings: false,
        accessSecurity: false,
      },
      accessAreas: ['Classroom 201', 'Math Department', 'Teachers Lounge'],
      workingHours: {
        monday: { start: '08:00', end: '15:30' },
        tuesday: { start: '08:00', end: '15:30' },
        wednesday: { start: '08:00', end: '15:30' },
        thursday: { start: '08:00', end: '15:30' },
        friday: { start: '08:00', end: '15:30' },
      },
    },
  ];

  useEffect(() => {
    setStaffMembers(mockStaffMembers);
    setFilteredStaff(mockStaffMembers);
  }, []);

  useEffect(() => {
    let filtered = staffMembers.filter((staff) => {
      const matchesSearch =
        staff.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.department.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment =
        filters.department === 'all' || staff.department === filters.department;
      const matchesRole = filters.role === 'all' || staff.role === filters.role;
      const matchesStatus = filters.status === 'all' || staff.status === filters.status;

      return matchesSearch && matchesDepartment && matchesRole && matchesStatus;
    });

    setFilteredStaff(filtered);
    setPage(0);
  }, [staffMembers, searchTerm, filters]);

  const handleAddStaff = () => {
    setDialogMode('add');
    setSelectedStaff(null);
    setShowDialog(true);
  };

  const handleEditStaff = (staff: StaffMember) => {
    setDialogMode('edit');
    setSelectedStaff(staff);
    setShowDialog(true);
  };

  const handleViewStaff = (staff: StaffMember) => {
    setDialogMode('view');
    setSelectedStaff(staff);
    setShowDialog(true);
  };

  const handleToggleStatus = (id: string) => {
    setStaffMembers((prev) =>
      prev.map((staff) =>
        staff.id === id
          ? { ...staff, status: staff.status === 'active' ? 'inactive' : 'active' }
          : staff,
      ),
    );
    setSnackbar({ open: true, message: 'Staff status updated', severity: 'success' });
    setAnchorEl(null);
  };

  const handleDeleteStaff = (id: string) => {
    setStaffMembers((prev) => prev.filter((staff) => staff.id !== id));
    setSnackbar({ open: true, message: 'Staff member removed', severity: 'success' });
    setAnchorEl(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      case 'suspended':
        return 'error';
      default:
        return 'default';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'security':
        return 'warning';
      case 'teacher':
        return 'primary';
      case 'frontdesk':
        return 'info';
      case 'staff':
        return 'success';
      default:
        return 'default';
    }
  };

  const renderStaffTable = () => (
    <Card>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Staff Member</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Login</TableCell>
              <TableCell>Permissions</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStaff
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((staff) => (
                <TableRow key={staff.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar>
                        {staff.avatar ? (
                          <img src={staff.avatar} alt={`${staff.firstName} ${staff.lastName}`} />
                        ) : (
                          `${staff.firstName[0]}${staff.lastName[0]}`
                        )}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {staff.firstName} {staff.lastName}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {staff.employeeId} • {staff.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{staff.department}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {staff.position}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={staff.role.toUpperCase()}
                      color={getRoleColor(staff.role) as any}
                     
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={staff.status.toUpperCase()}
                      color={getStatusColor(staff.status) as any}
                     
                    />
                  </TableCell>
                  <TableCell>
                    {staff.lastLogin ? (
                      <Box>
                        <Typography variant="body2">
                          {staff.lastLogin.toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {staff.lastLogin.toLocaleTimeString()}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="caption" color="textSecondary">
                        Never
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={0.5} flexWrap="wrap">
                      {Object.entries(staff.permissions)
                        .filter(([_, value]) => value)
                        .slice(0, 2)
                        .map(([key, _]) => (
                          <Chip
                            key={key}
                            label={key
                              .replace(/([A-Z])/g, ' $1')
                              .replace(/^./, (str) => str.toUpperCase())}
                           
                            variant="outlined"
                          />
                        ))}
                      {Object.values(staff.permissions).filter(Boolean).length > 2 && (
                        <Chip
                          label={`+${Object.values(staff.permissions).filter(Boolean).length - 2}`}
                         
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={(e) => {
                        setAnchorEl(e.currentTarget);
                        setSelectedStaffId(staff.id);
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
        count={filteredStaff.length}
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
  );

  const renderOverviewTab = () => (
    <Grid container spacing={3}>
      {/* Stats Cards */}
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h4" color="primary">
              {staffMembers.filter((s) => s.status === 'active').length}
            </Typography>
            <Typography variant="body2">Active Staff</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h4" color="success.main">
              {staffMembers.filter((s) => s.role === 'teacher').length}
            </Typography>
            <Typography variant="body2">Teachers</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h4" color="warning.main">
              {staffMembers.filter((s) => s.role === 'security').length}
            </Typography>
            <Typography variant="body2">Security Staff</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h4" color="info.main">
              {staffMembers.filter((s) => s.role === 'admin').length}
            </Typography>
            <Typography variant="body2">Administrators</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Department Overview */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Staff by Department
            </Typography>
            <List>
              {Array.from(new Set(staffMembers.map((s) => s.department))).map((dept) => {
                const count = staffMembers.filter((s) => s.department === dept).length;
                return (
                  <ListItem key={dept}>
                    <ListItemText primary={dept} secondary={`${count} staff members`} />
                    <Chip label={count} color="primary" />
                  </ListItem>
                );
              })}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Activities */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Staff Activities
            </Typography>
            <List>
              {staffMembers
                .filter((s) => s.lastLogin)
                .sort((a, b) => (b.lastLogin?.getTime() || 0) - (a.lastLogin?.getTime() || 0))
                .slice(0, 5)
                .map((staff) => (
                  <ListItem key={staff.id}>
                    <ListItemAvatar>
                      <Avatar>{`${staff.firstName[0]}${staff.lastName[0]}`}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${staff.firstName} ${staff.lastName}`}
                      secondary={`Last login: ${staff.lastLogin?.toLocaleString()}`}
                    />
                  </ListItem>
                ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <PageContainer
      title="Staff Management"
      description="Manage school staff members and their permissions"
    >
      <Box>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Staff Management
          </Typography>
          <Box display="flex" gap={2}>
            <Button variant="outlined" startIcon={<IconUpload />}>
              Import
            </Button>
            <Button variant="outlined" startIcon={<IconDownload />}>
              Export
            </Button>
            <Button variant="contained" startIcon={<IconPlus />} onClick={handleAddStaff}>
              Add Staff Member
            </Button>
          </Box>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
            <Tab label="Overview" />
            <Tab label="Staff Directory" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {activeTab === 0 && renderOverviewTab()}

        {activeTab === 1 && (
          <Box>
            {/* Search and Filters */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      placeholder="Search staff members..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      InputProps={{
                        startAdornment: <IconSearch style={{ marginRight: 8, color: '#666' }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <FormControl fullWidth>
                      <InputLabel>Department</InputLabel>
                      <Select
                        value={filters.department}
                        onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                      >
                        <MenuItem value="all">All Departments</MenuItem>
                        <MenuItem value="Administration">Administration</MenuItem>
                        <MenuItem value="Academic">Academic</MenuItem>
                        <MenuItem value="Security">Security</MenuItem>
                        <MenuItem value="Front Office">Front Office</MenuItem>
                        <MenuItem value="Maintenance">Maintenance</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <FormControl fullWidth>
                      <InputLabel>Role</InputLabel>
                      <Select
                        value={filters.role}
                        onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                      >
                        <MenuItem value="all">All Roles</MenuItem>
                        <MenuItem value="admin">Administrator</MenuItem>
                        <MenuItem value="teacher">Teacher</MenuItem>
                        <MenuItem value="security">Security</MenuItem>
                        <MenuItem value="frontdesk">Front Desk</MenuItem>
                        <MenuItem value="staff">Staff</MenuItem>
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
                        <MenuItem value="suspended">Suspended</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Typography variant="body2" color="textSecondary">
                      {filteredStaff.length} staff members
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {renderStaffTable()}
          </Box>
        )}

        {/* Context Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItemComponent
            onClick={() => {
              const staff = staffMembers.find((s) => s.id === selectedStaffId);
              if (staff) handleViewStaff(staff);
              setAnchorEl(null);
            }}
          >
            <IconEye style={{ marginRight: 8 }} />
            View Details
          </MenuItemComponent>
          <MenuItemComponent
            onClick={() => {
              const staff = staffMembers.find((s) => s.id === selectedStaffId);
              if (staff) handleEditStaff(staff);
              setAnchorEl(null);
            }}
          >
            <IconEdit style={{ marginRight: 8 }} />
            Edit Staff
          </MenuItemComponent>
          <MenuItemComponent
            onClick={() => {
              if (selectedStaffId) handleToggleStatus(selectedStaffId);
            }}
          >
            <IconUserCheck style={{ marginRight: 8 }} />
            Toggle Status
          </MenuItemComponent>
          <Divider />
          <MenuItemComponent
            onClick={() => {
              if (selectedStaffId) handleDeleteStaff(selectedStaffId);
            }}
            sx={{ color: 'error.main' }}
          >
            <IconTrash style={{ marginRight: 8 }} />
            Remove Staff
          </MenuItemComponent>
        </Menu>

        {/* Staff Details Dialog */}
        <Dialog open={showDialog} onClose={() => setShowDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            {dialogMode === 'add'
              ? 'Add Staff Member'
              : dialogMode === 'edit'
              ? 'Edit Staff Member'
              : 'Staff Member Details'}
          </DialogTitle>
          <DialogContent>
            {selectedStaff && dialogMode === 'view' ? (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Name"
                        secondary={`${selectedStaff.firstName} ${selectedStaff.lastName}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Employee ID" secondary={selectedStaff.employeeId} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Email" secondary={selectedStaff.email} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Phone" secondary={selectedStaff.phoneNumber} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Department" secondary={selectedStaff.department} />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <List>
                    <ListItem>
                      <ListItemText primary="Position" secondary={selectedStaff.position} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Role" secondary={selectedStaff.role} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Status" secondary={selectedStaff.status} />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Hire Date"
                        secondary={selectedStaff.hireDate.toLocaleDateString()}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Last Login"
                        secondary={selectedStaff.lastLogin?.toLocaleString() || 'Never'}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Permissions
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                    {Object.entries(selectedStaff.permissions).map(
                      ([permission, hasPermission]) => (
                        <Chip
                          key={permission}
                          label={permission
                            .replace(/([A-Z])/g, ' $1')
                            .replace(/^./, (str) => str.toUpperCase())}
                          color={hasPermission ? 'success' : 'default'}
                          variant={hasPermission ? 'filled' : 'outlined'}
                         
                        />
                      ),
                    )}
                  </Box>

                  <Typography variant="h6" gutterBottom>
                    Access Areas
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {selectedStaff.accessAreas.map((area, index) => (
                      <Chip
                        key={index}
                        label={area}
                        color="primary"
                        variant="outlined"
                       
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            ) : (
              <Typography variant="body2" color="textSecondary">
                Staff member form would be implemented here for add/edit functionality.
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDialog(false)}>
              {dialogMode === 'view' ? 'Close' : 'Cancel'}
            </Button>
            {dialogMode !== 'view' && (
              <Button variant="contained">
                {dialogMode === 'add' ? 'Add Staff Member' : 'Update Staff Member'}
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

export default StaffManagement;
