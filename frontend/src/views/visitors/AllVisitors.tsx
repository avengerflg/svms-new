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
} from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import { useAuth } from '../../context/AuthContext';

interface Visitor {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  idType: string;
  idNumber: string;
  photo?: string;
  purposeOfVisit: string;
  personToMeet: string;
  status: 'checked-in' | 'checked-out' | 'pending' | 'approved' | 'rejected';
  checkInTime?: Date;
  checkOutTime?: Date;
  expectedDuration?: number;
  visitorCategory: string;
  school: string;
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
  const [filteredVisitors, setFilteredVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  // Mock data - replace with actual API call
  const mockVisitors: Visitor[] = [
    {
      _id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      idType: 'Driver License',
      idNumber: 'DL123456789',
      purposeOfVisit: 'Parent Meeting',
      personToMeet: 'Mrs. Smith',
      status: 'checked-in',
      checkInTime: new Date('2024-03-15T09:30:00'),
      expectedDuration: 60,
      visitorCategory: 'Parent',
      school: 'Main Campus',
      createdAt: new Date('2024-03-15T09:00:00'),
      updatedAt: new Date('2024-03-15T09:30:00'),
    },
    {
      _id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@contractor.com',
      phone: '+1987654321',
      idType: 'National ID',
      idNumber: 'ID987654321',
      purposeOfVisit: 'Maintenance Work',
      personToMeet: 'Facilities Manager',
      status: 'pending',
      expectedDuration: 120,
      visitorCategory: 'Contractor',
      school: 'Main Campus',
      createdAt: new Date('2024-03-15T08:45:00'),
      updatedAt: new Date('2024-03-15T08:45:00'),
    },
    {
      _id: '3',
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike.johnson@vendor.com',
      phone: '+1555666777',
      idType: 'Passport',
      idNumber: 'PP123456789',
      purposeOfVisit: 'Equipment Delivery',
      personToMeet: 'IT Department',
      status: 'checked-out',
      checkInTime: new Date('2024-03-15T08:00:00'),
      checkOutTime: new Date('2024-03-15T10:30:00'),
      expectedDuration: 90,
      visitorCategory: 'Vendor',
      school: 'Main Campus',
      createdAt: new Date('2024-03-15T07:30:00'),
      updatedAt: new Date('2024-03-15T10:30:00'),
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setVisitors(mockVisitors);
      setFilteredVisitors(mockVisitors);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = visitors;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (visitor) =>
          visitor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visitor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visitor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visitor.phone.includes(searchTerm) ||
          visitor.purposeOfVisit.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((visitor) => visitor.status === statusFilter);
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((visitor) => visitor.visitorCategory === categoryFilter);
    }

    setFilteredVisitors(filtered);
  }, [visitors, searchTerm, statusFilter, categoryFilter]);

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

  const formatTime = (date: Date | undefined) => {
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

  return (
    <PageContainer title="All Visitors" description="Manage and view all visitors">
      <Box>
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
              <Grid item xs={12} md={3}>
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
                    <MenuItem value="Guest">Guest</MenuItem>
                    <MenuItem value="Alumni">Alumni</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
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
                  <TableCell>Purpose</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Check In</TableCell>
                  <TableCell>Check Out</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredVisitors.map((visitor) => (
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
                        <Typography variant="body2">{visitor.purposeOfVisit}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          Meeting: {visitor.personToMeet}
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
                        <IconButton onClick={() => handleViewVisitor(visitor)}>
                          <IconEye />
                        </IconButton>
                        <IconButton>
                          <IconQrcode />
                        </IconButton>
                        {(user?.role === 'admin' || user?.role === 'security') && (
                          <IconButton>
                            <IconEdit />
                          </IconButton>
                        )}
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
