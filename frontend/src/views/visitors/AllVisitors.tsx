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
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Tabs,
  Tab,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  IconSearch,
  IconFilter,
  IconEye,
  IconEdit,
  IconTrash,
  IconUserPlus,
  IconDownload,
  IconQrcode,
  IconClock,
  IconMapPin,
  IconCheck,
  IconX,
} from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import { useAuth } from '../../context/AuthContext';
import { visitorAPI } from '../../services/api';
import { toast } from 'react-toastify';

interface Visitor {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  idType: string;
  idNumber: string;
  photo?: string;
  purposeOfVisit?: string;
  personToMeet: string;
  status: 'pending' | 'approved' | 'checked-in' | 'checked-out' | 'rejected' | 'cancelled';
  checkInTime?: Date;
  checkOutTime?: Date;
  expectedDuration?: number;
  visitorCategory: string;
  department: string;
  vehicleNumber?: string;
  specialRequirements?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  qrCode?: string;
  badgeNumber?: string;
  isBlacklisted?: boolean;
  approvedBy?: any;
  approvalDate?: Date;
  rejectionReason?: string;
  school?: any;
  createdAt: Date;
  updatedAt: Date;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AllVisitors: React.FC = () => {
  const { user } = useAuth();
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch visitors from API
  const fetchVisitors = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        page,
        limit: 10,
      };

      if (searchTerm) params.search = searchTerm;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (departmentFilter !== 'all') params.department = departmentFilter;

      const response = await visitorAPI.getAllVisitors(params);

      if (response.success) {
        setVisitors(response.data);
        setTotalPages(response.pagination?.pages || 1);
      } else {
        setError(response.message || 'Failed to fetch visitors');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching visitors');
      toast.error('Failed to load visitors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, [page, searchTerm, statusFilter, categoryFilter, departmentFilter]);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (page === 1) {
        fetchVisitors();
      } else {
        setPage(1); // Reset to first page when search changes
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Handle visitor actions
  const handleCheckIn = async (visitorId: string) => {
    try {
      const response = await visitorAPI.checkIn(visitorId);
      if (response.success) {
        toast.success('Visitor checked in successfully');
        fetchVisitors();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to check in visitor');
    }
  };

  const handleCheckOut = async (visitorId: string) => {
    try {
      const response = await visitorAPI.checkOut(visitorId);
      if (response.success) {
        toast.success('Visitor checked out successfully');
        fetchVisitors();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to check out visitor');
    }
  };

  const handleApprove = async (visitorId: string) => {
    try {
      const response = await visitorAPI.approveVisitor(visitorId);
      if (response.success) {
        toast.success('Visitor approved successfully');
        fetchVisitors();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve visitor');
    }
  };

  const handleReject = async (visitorId: string, reason: string) => {
    try {
      const response = await visitorAPI.rejectVisitor(visitorId, reason);
      if (response.success) {
        toast.success('Visitor rejected successfully');
        fetchVisitors();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject visitor');
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'checked-in':
        return 'success';
      case 'checked-out':
        return 'default';
      case 'pending':
        return 'warning';
      case 'approved':
        return 'info';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatTime = (date?: Date | string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString();
  };

  const handleViewVisitor = (visitor: Visitor) => {
    setSelectedVisitor(visitor);
    setViewDialogOpen(true);
  };

  const getVisitorsByStatus = (status: string) => {
    return visitors.filter((visitor) => visitor.status === status);
  };

  const stats = {
    total: visitors.length,
    checkedIn: getVisitorsByStatus('checked-in').length,
    pending: getVisitorsByStatus('pending').length,
    checkedOut: getVisitorsByStatus('checked-out').length,
  };

  if (loading) {
    return (
      <PageContainer title="All Visitors" description="Manage and view all visitors">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="All Visitors" description="Manage and view all visitors">
      <Box>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            All Visitors
          </Typography>
          <Box display="flex" gap={2}>
            <Button variant="outlined" startIcon={<IconDownload />} color="primary">
              Export
            </Button>
            <Button variant="contained" startIcon={<IconUserPlus />} color="primary">
              New Visitor
            </Button>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Visitors
                </Typography>
                <Typography variant="h4">{stats.total}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Currently In
                </Typography>
                <Typography variant="h4" color="success.main">
                  {stats.checkedIn}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Pending Approval
                </Typography>
                <Typography variant="h4" color="warning.main">
                  {stats.pending}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Checked Out
                </Typography>
                <Typography variant="h4" color="text.secondary">
                  {stats.checkedOut}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters and Search */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search visitors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconSearch />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="checked-in">Checked In</MenuItem>
                    <MenuItem value="checked-out">Checked Out</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={categoryFilter}
                    label="Category"
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    <MenuItem value="parent">Parent</MenuItem>
                    <MenuItem value="contractor">Contractor</MenuItem>
                    <MenuItem value="vendor">Vendor</MenuItem>
                    <MenuItem value="guest">Guest</MenuItem>
                    <MenuItem value="alumni">Alumni</MenuItem>
                    <MenuItem value="official">Official</MenuItem>
                    <MenuItem value="media">Media</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={departmentFilter}
                    label="Department"
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Departments</MenuItem>
                    <MenuItem value="administration">Administration</MenuItem>
                    <MenuItem value="academics">Academics</MenuItem>
                    <MenuItem value="student-affairs">Student Affairs</MenuItem>
                    <MenuItem value="facilities">Facilities</MenuItem>
                    <MenuItem value="it">IT</MenuItem>
                    <MenuItem value="library">Library</MenuItem>
                    <MenuItem value="security">Security</MenuItem>
                    <MenuItem value="cafeteria">Cafeteria</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={1}>
                <Button fullWidth variant="outlined" startIcon={<IconFilter />}>
                  More Filters
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Visitors Table */}
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Visitor</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Purpose & Department</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Check In</TableCell>
                  <TableCell>Check Out</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visitors.map((visitor) => (
                  <TableRow key={visitor._id}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ width: 40, height: 40 }}>
                          {visitor.firstName[0]}
                          {visitor.lastName[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">
                            {visitor.firstName} {visitor.lastName}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {visitor.visitorCategory}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">{visitor.phone}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {visitor.email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {visitor.purposeOfVisit || 'General Visit'}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Meeting: {visitor.personToMeet} •{' '}
                          {visitor.department.replace('-', ' ').toUpperCase()}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={visitor.status.replace('-', ' ').toUpperCase()}
                        color={getStatusColor(visitor.status) as any}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{formatTime(visitor.checkInTime)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{formatTime(visitor.checkOutTime)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <IconButton
                          size="small"
                          onClick={() => handleViewVisitor(visitor)}
                          title="View Details"
                        >
                          <IconEye size={18} />
                        </IconButton>

                        {/* Status-based action buttons */}
                        {visitor.status === 'pending' &&
                          (user?.role === 'admin' || user?.role === 'frontdesk') && (
                            <>
                              <IconButton
                                size="small"
                                onClick={() => handleApprove(visitor._id)}
                                title="Approve"
                                color="success"
                              >
                                <IconCheck size={18} />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleReject(visitor._id, 'Rejected by staff')}
                                title="Reject"
                                color="error"
                              >
                                <IconX size={18} />
                              </IconButton>
                            </>
                          )}

                        {visitor.status === 'approved' &&
                          (user?.role === 'admin' || user?.role === 'security') && (
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => handleCheckIn(visitor._id)}
                              sx={{ minWidth: 'auto', px: 1 }}
                            >
                              Check In
                            </Button>
                          )}

                        {visitor.status === 'checked-in' &&
                          (user?.role === 'admin' || user?.role === 'security') && (
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleCheckOut(visitor._id)}
                              sx={{ minWidth: 'auto', px: 1 }}
                            >
                              Check Out
                            </Button>
                          )}

                        <IconButton size="small" title="Show QR Code">
                          <IconQrcode size={18} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* View Visitor Dialog */}
        <Dialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Visitor Details</DialogTitle>
          <DialogContent>
            {selectedVisitor && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box mb={2}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Name
                    </Typography>
                    <Typography variant="body1">
                      {selectedVisitor.firstName} {selectedVisitor.lastName}
                    </Typography>
                  </Box>
                  <Box mb={2}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Phone
                    </Typography>
                    <Typography variant="body1">{selectedVisitor.phone}</Typography>
                  </Box>
                  <Box mb={2}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Email
                    </Typography>
                    <Typography variant="body1">{selectedVisitor.email || 'N/A'}</Typography>
                  </Box>
                  <Box mb={2}>
                    <Typography variant="subtitle2" color="textSecondary">
                      ID Type
                    </Typography>
                    <Typography variant="body1">{selectedVisitor.idType}</Typography>
                  </Box>
                  <Box mb={2}>
                    <Typography variant="subtitle2" color="textSecondary">
                      ID Number
                    </Typography>
                    <Typography variant="body1">{selectedVisitor.idNumber}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box mb={2}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Purpose of Visit
                    </Typography>
                    <Typography variant="body1">{selectedVisitor.purposeOfVisit}</Typography>
                  </Box>
                  <Box mb={2}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Person to Meet
                    </Typography>
                    <Typography variant="body1">{selectedVisitor.personToMeet}</Typography>
                  </Box>
                  <Box mb={2}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Category
                    </Typography>
                    <Typography variant="body1">{selectedVisitor.visitorCategory}</Typography>
                  </Box>
                  <Box mb={2}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Status
                    </Typography>
                    <Chip
                      label={selectedVisitor.status.replace('-', ' ').toUpperCase()}
                      color={getStatusColor(selectedVisitor.status) as any}
                    />
                  </Box>
                  <Box mb={2}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Check In Time
                    </Typography>
                    <Typography variant="body1">
                      {formatTime(selectedVisitor.checkInTime)}
                    </Typography>
                  </Box>
                  <Box mb={2}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Check Out Time
                    </Typography>
                    <Typography variant="body1">
                      {formatTime(selectedVisitor.checkOutTime)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
            <Button variant="contained" startIcon={<IconQrcode />}>
              Generate Badge
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PageContainer>
  );
};

export default AllVisitors;
