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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Pagination,
  Tooltip,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from '@mui/material'; 
import {
  IconSearch,
  IconFilter,
  IconEye,
  IconDownload,
  IconCalendar,
  IconClock,
  IconUser,
  IconMapPin,
  IconFileExport,
  IconRefresh,
  IconHistory,
  IconChartBar,
} from '@tabler/icons-react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import PageContainer from 'src/components/container/PageContainer';
import { useAuth } from '../../context/AuthContext';

interface VisitorHistory {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  photo?: string;
  purposeOfVisit: string;
  personToMeet: string;
  department: string;
  checkInTime: Date;
  checkOutTime?: Date;
  expectedDuration: number;
  actualDuration?: number;
  visitorCategory: string;
  status: 'completed' | 'overstayed' | 'incomplete';
  badgeNumber: string;
  notes?: string;
  rating?: number;
  feedback?: string;
}

const VisitorHistory: React.FC = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<VisitorHistory[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<VisitorHistory[]>([]);
  const [selectedVisit, setSelectedVisit] = useState<VisitorHistory | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Mock history data
  const mockHistory: VisitorHistory[] = [
    {
      _id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      purposeOfVisit: 'Parent-Teacher Meeting',
      personToMeet: 'Mrs. Smith',
      department: 'Administration',
      checkInTime: new Date('2024-03-15T09:30:00'),
      checkOutTime: new Date('2024-03-15T10:30:00'),
      expectedDuration: 60,
      actualDuration: 60,
      visitorCategory: 'Parent',
      status: 'completed',
      badgeNumber: 'V001',
      notes: 'Discussed student progress',
      rating: 5,
      feedback: 'Very helpful meeting',
    },
    {
      _id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@contractor.com',
      phone: '+1987654321',
      purposeOfVisit: 'Maintenance Work - HVAC Repair',
      personToMeet: 'Facilities Manager',
      department: 'Facilities',
      checkInTime: new Date('2024-03-14T08:00:00'),
      checkOutTime: new Date('2024-03-14T12:30:00'),
      expectedDuration: 120,
      actualDuration: 270,
      visitorCategory: 'Contractor',
      status: 'overstayed',
      badgeNumber: 'V002',
      notes: 'Work took longer due to additional issues found',
    },
    {
      _id: '3',
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike.johnson@vendor.com',
      phone: '+1555666777',
      purposeOfVisit: 'Equipment Delivery',
      personToMeet: 'IT Manager',
      department: 'IT',
      checkInTime: new Date('2024-03-13T14:00:00'),
      checkOutTime: new Date('2024-03-13T15:30:00'),
      expectedDuration: 90,
      actualDuration: 90,
      visitorCategory: 'Vendor',
      status: 'completed',
      badgeNumber: 'V003',
      rating: 4,
      feedback: 'Smooth delivery process',
    },
    {
      _id: '4',
      firstName: 'Sarah',
      lastName: 'Wilson',
      email: 'sarah.wilson@alumni.edu',
      phone: '+1444555666',
      purposeOfVisit: 'Alumni Visit',
      personToMeet: 'Principal',
      department: 'Administration',
      checkInTime: new Date('2024-03-12T11:00:00'),
      expectedDuration: 45,
      visitorCategory: 'Alumni',
      status: 'incomplete',
      badgeNumber: 'V004',
      notes: 'Left without checking out',
    },
    {
      _id: '5',
      firstName: 'David',
      lastName: 'Brown',
      email: 'david.brown@media.com',
      phone: '+1777888999',
      purposeOfVisit: 'School Event Coverage',
      personToMeet: 'Communications Director',
      department: 'Administration',
      checkInTime: new Date('2024-03-11T09:00:00'),
      checkOutTime: new Date('2024-03-11T16:00:00'),
      expectedDuration: 360,
      actualDuration: 420,
      visitorCategory: 'Media',
      status: 'overstayed',
      badgeNumber: 'V005',
      notes: 'Extended coverage for annual function',
      rating: 5,
    },
  ];

  useEffect(() => {
    setHistory(mockHistory);
    setFilteredHistory(mockHistory);
    setTotalPages(Math.ceil(mockHistory.length / itemsPerPage));
  }, []);

  useEffect(() => {
    let filtered = history;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (visit) =>
          visit.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visit.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visit.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visit.purposeOfVisit.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visit.badgeNumber.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((visit) => visit.status === statusFilter);
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((visit) => visit.visitorCategory === categoryFilter);
    }

    // Apply date filters
    if (dateFrom) {
      filtered = filtered.filter((visit) => new Date(visit.checkInTime) >= dateFrom);
    }
    if (dateTo) {
      filtered = filtered.filter((visit) => new Date(visit.checkInTime) <= dateTo);
    }

    setFilteredHistory(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
  }, [history, searchTerm, statusFilter, categoryFilter, dateFrom, dateTo]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'overstayed':
        return 'warning';
      case 'incomplete':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDuration = (minutes: number | undefined) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDateTime = (date: Date | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString();
  };

  const handleViewDetails = (visit: VisitorHistory) => {
    setSelectedVisit(visit);
    setDetailDialogOpen(true);
  };

  const handleExport = () => {
    // Implementation for exporting data
    console.log('Exporting filtered history data...');
  };

  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const stats = {
    total: history.length,
    completed: history.filter((h) => h.status === 'completed').length,
    overstayed: history.filter((h) => h.status === 'overstayed').length,
    incomplete: history.filter((h) => h.status === 'incomplete').length,
    avgDuration: Math.round(
      history.filter((h) => h.actualDuration).reduce((sum, h) => sum + (h.actualDuration || 0), 0) /
        history.filter((h) => h.actualDuration).length || 0,
    ),
  };

  return (
    <PageContainer title="Visitor History" description="View and analyze visitor history records">
      <Box>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Visitor History
          </Typography>
          <Box display="flex" gap={2}>
            <Button variant="outlined" startIcon={<IconRefresh />}>
              Refresh
            </Button>
            <Button variant="outlined" startIcon={<IconFileExport />} onClick={handleExport}>
              Export
            </Button>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={2.4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Visits
                </Typography>
                <Typography variant="h4">{stats.total}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={2.4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Completed
                </Typography>
                <Typography variant="h4" color="success.main">
                  {stats.completed}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={2.4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Overstayed
                </Typography>
                <Typography variant="h4" color="warning.main">
                  {stats.overstayed}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={2.4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Incomplete
                </Typography>
                <Typography variant="h4" color="error.main">
                  {stats.incomplete}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={2.4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Avg Duration
                </Typography>
                <Typography variant="h4" color="primary.main">
                  {formatDuration(stats.avgDuration)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={3}>
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
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="overstayed">Overstayed</MenuItem>
                    <MenuItem value="incomplete">Incomplete</MenuItem>
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
                    <MenuItem value="Parent">Parent</MenuItem>
                    <MenuItem value="Contractor">Contractor</MenuItem>
                    <MenuItem value="Vendor">Vendor</MenuItem>
                    <MenuItem value="Alumni">Alumni</MenuItem>
                    <MenuItem value="Media">Media</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2.5}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="From Date"
                    value={dateFrom}
                    onChange={(newValue) => setDateFrom(newValue)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={2.5}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="To Date"
                    value={dateTo}
                    onChange={(newValue) => setDateTo(newValue)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* History Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Visit Records ({filteredHistory.length})
            </Typography>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Visitor</TableCell>
                    <TableCell>Purpose</TableCell>
                    <TableCell>Check In</TableCell>
                    <TableCell>Check Out</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedHistory.map((visit) => (
                    <TableRow key={visit._id}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar sx={{ width: 40, height: 40 }}>
                            {visit.firstName[0]}
                            {visit.lastName[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2">
                              {visit.firstName} {visit.lastName}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {visit.visitorCategory} • Badge: {visit.badgeNumber}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">{visit.purposeOfVisit}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            Meeting: {visit.personToMeet}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{formatDateTime(visit.checkInTime)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDateTime(visit.checkOutTime)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            {formatDuration(visit.actualDuration)}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Expected: {formatDuration(visit.expectedDuration)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={visit.status.toUpperCase()}
                          color={getStatusColor(visit.status) as any}
                         
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View Details">
                          <IconButton onClick={() => handleViewDetails(visit)}>
                            <IconEye />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
                color="primary"
              />
            </Box>
          </CardContent>
        </Card>

        {/* Detail Dialog */}
        <Dialog
          open={detailDialogOpen}
          onClose={() => setDetailDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={2}>
              <IconHistory />
              Visit Details
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedVisit && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Visitor Information
                  </Typography>
                  <Typography variant="body2">
                    <strong>Name:</strong> {selectedVisit.firstName} {selectedVisit.lastName}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Email:</strong> {selectedVisit.email || 'N/A'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Phone:</strong> {selectedVisit.phone}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Category:</strong> {selectedVisit.visitorCategory}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Badge #:</strong> {selectedVisit.badgeNumber}
                  </Typography>

                  <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3 }}>
                    Visit Details
                  </Typography>
                  <Typography variant="body2">
                    <strong>Purpose:</strong> {selectedVisit.purposeOfVisit}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Meeting With:</strong> {selectedVisit.personToMeet}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Department:</strong> {selectedVisit.department}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Status:</strong>
                    <Chip
                      label={selectedVisit.status.toUpperCase()}
                      color={getStatusColor(selectedVisit.status) as any}
                     
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Time Information
                  </Typography>
                  <Typography variant="body2">
                    <strong>Check In:</strong> {formatDateTime(selectedVisit.checkInTime)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Check Out:</strong> {formatDateTime(selectedVisit.checkOutTime)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Expected Duration:</strong>{' '}
                    {formatDuration(selectedVisit.expectedDuration)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Actual Duration:</strong> {formatDuration(selectedVisit.actualDuration)}
                  </Typography>

                  {selectedVisit.notes && (
                    <>
                      <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3 }}>
                        Notes
                      </Typography>
                      <Typography variant="body2">{selectedVisit.notes}</Typography>
                    </>
                  )}

                  {selectedVisit.feedback && (
                    <>
                      <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 3 }}>
                        Feedback
                      </Typography>
                      <Typography variant="body2">{selectedVisit.feedback}</Typography>
                      {selectedVisit.rating && (
                        <Typography variant="body2">
                          <strong>Rating:</strong> {selectedVisit.rating}/5 stars
                        </Typography>
                      )}
                    </>
                  )}
                </Grid>

                {(selectedVisit.status === 'overstayed' ||
                  selectedVisit.status === 'incomplete') && (
                  <Grid item xs={12}>
                    <Alert severity={selectedVisit.status === 'overstayed' ? 'warning' : 'error'}>
                      {selectedVisit.status === 'overstayed'
                        ? 'This visitor stayed longer than expected. Review security protocols if necessary.'
                        : 'This visitor did not check out properly. Follow up may be required.'}
                    </Alert>
                  </Grid>
                )}
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
            <Button variant="outlined" startIcon={<IconDownload />}>
              Export Details
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PageContainer>
  );
};

export default VisitorHistory;
