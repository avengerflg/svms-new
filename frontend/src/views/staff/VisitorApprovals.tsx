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
  Snackbar,
  Badge,
  Tooltip,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/material'; 
import {
  IconSearch,
  IconFilter,
  IconDownload,
  IconUser,
  IconClock,
  IconMapPin,
  IconCheck,
  IconX,
  IconAlertTriangle,
  IconEye,
  IconMail,
  IconPhone,
  IconCalendar,
  IconRefresh,
  IconUserCheck,
  IconUserX,
  IconClockHour3,
  IconBell,
  IconMessage,
} from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import { useAuth } from '../../context/AuthContext';

interface VisitorApproval {
  id: string;
  visitorName: string;
  visitorEmail?: string;
  visitorPhone?: string;
  purpose: string;
  visitDate: Date;
  visitTime: string;
  duration: string;
  hostName: string;
  hostDepartment: string;
  hostEmail: string;
  requestedBy: string;
  requestDate: Date;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  location: string;
  specialRequirements?: string;
  attachments?: string[];
  approvalHistory: {
    action: 'submitted' | 'approved' | 'rejected' | 'modified';
    by: string;
    date: Date;
    comments?: string;
  }[];
  visitType: 'meeting' | 'interview' | 'delivery' | 'maintenance' | 'parent-conference' | 'other';
  numberOfVisitors: number;
  securityLevel: 'standard' | 'enhanced' | 'restricted';
}

const VisitorApprovals: React.FC = () => {
  const { user } = useAuth();
  const [approvals, setApprovals] = useState<VisitorApproval[]>([]);
  const [filteredApprovals, setFilteredApprovals] = useState<VisitorApproval[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApproval, setSelectedApproval] = useState<VisitorApproval | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning',
  });
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    visitType: 'all',
    dateRange: 'all',
  });

  // Mock approval data
  const mockApprovals: VisitorApproval[] = [
    {
      id: 'approval_001',
      visitorName: 'John Smith',
      visitorEmail: 'john.smith@company.com',
      visitorPhone: '+1-555-0123',
      purpose: 'Parent-teacher conference regarding student progress',
      visitDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      visitTime: '14:00',
      duration: '1 hour',
      hostName: 'Dr. Sarah Wilson',
      hostDepartment: 'Mathematics Department',
      hostEmail: 'sarah.wilson@school.edu',
      requestedBy: 'Front Desk',
      requestDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'pending',
      priority: 'medium',
      location: 'Classroom 201',
      numberOfVisitors: 2,
      visitType: 'parent-conference',
      securityLevel: 'standard',
      approvalHistory: [
        {
          action: 'submitted',
          by: 'Front Desk Staff',
          date: new Date(Date.now() - 2 * 60 * 60 * 1000),
          comments: 'Parent conference request submitted',
        },
      ],
    },
    {
      id: 'approval_002',
      visitorName: 'Tech Solutions Inc',
      visitorEmail: 'service@techsolutions.com',
      visitorPhone: '+1-555-0456',
      purpose: 'Network infrastructure maintenance and upgrades',
      visitDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      visitTime: '09:00',
      duration: '4 hours',
      hostName: 'IT Department',
      hostDepartment: 'Technology Services',
      hostEmail: 'it@school.edu',
      requestedBy: 'IT Manager',
      requestDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'approved',
      priority: 'high',
      location: 'Server Room',
      specialRequirements: 'Requires security clearance and IT supervision',
      numberOfVisitors: 3,
      visitType: 'maintenance',
      securityLevel: 'enhanced',
      approvalHistory: [
        {
          action: 'submitted',
          by: 'IT Manager',
          date: new Date(Date.now() - 24 * 60 * 60 * 1000),
          comments: 'Critical network maintenance required',
        },
        {
          action: 'approved',
          by: 'Principal',
          date: new Date(Date.now() - 8 * 60 * 60 * 1000),
          comments: 'Approved with enhanced security measures',
        },
      ],
    },
    {
      id: 'approval_003',
      visitorName: 'Lisa Johnson',
      visitorEmail: 'lisa.johnson@email.com',
      purpose: 'Job interview for teaching position',
      visitDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      visitTime: '10:30',
      duration: '2 hours',
      hostName: 'Dr. Michael Brown',
      hostDepartment: 'Human Resources',
      hostEmail: 'hr@school.edu',
      requestedBy: 'HR Manager',
      requestDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: 'pending',
      priority: 'urgent',
      location: 'Conference Room A',
      numberOfVisitors: 1,
      visitType: 'interview',
      securityLevel: 'standard',
      approvalHistory: [
        {
          action: 'submitted',
          by: 'HR Manager',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          comments: 'Interview scheduled for mathematics teaching position',
        },
      ],
    },
    {
      id: 'approval_004',
      visitorName: 'Food Service Delivery',
      purpose: 'Weekly cafeteria supplies delivery',
      visitDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
      visitTime: '08:00',
      duration: '30 minutes',
      hostName: 'Cafeteria Manager',
      hostDepartment: 'Food Services',
      hostEmail: 'cafeteria@school.edu',
      requestedBy: 'Cafeteria Staff',
      requestDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      status: 'expired',
      priority: 'low',
      location: 'Cafeteria Loading Dock',
      numberOfVisitors: 2,
      visitType: 'delivery',
      securityLevel: 'standard',
      approvalHistory: [
        {
          action: 'submitted',
          by: 'Cafeteria Manager',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
        {
          action: 'approved',
          by: 'Operations Manager',
          date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        },
      ],
    },
  ];

  useEffect(() => {
    setApprovals(mockApprovals);
    setFilteredApprovals(mockApprovals);
  }, []);

  useEffect(() => {
    let filtered = approvals.filter((approval) => {
      const matchesSearch =
        approval.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        approval.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
        approval.hostName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        approval.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filters.status === 'all' || approval.status === filters.status;
      const matchesPriority = filters.priority === 'all' || approval.priority === filters.priority;
      const matchesVisitType =
        filters.visitType === 'all' || approval.visitType === filters.visitType;

      // Date range filtering
      let matchesDate = true;
      const now = new Date();
      const visitDate = approval.visitDate;

      switch (filters.dateRange) {
        case 'today':
          matchesDate = visitDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          matchesDate = visitDate >= now && visitDate <= weekFromNow;
          break;
        case 'month':
          const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          matchesDate = visitDate >= now && visitDate <= monthFromNow;
          break;
      }

      return matchesSearch && matchesStatus && matchesPriority && matchesVisitType && matchesDate;
    });

    setFilteredApprovals(filtered);
    setPage(0);
  }, [approvals, searchTerm, filters]);

  const handleApprove = (id: string, comments?: string) => {
    setApprovals((prev) =>
      prev.map((approval) =>
        approval.id === id
          ? {
              ...approval,
              status: 'approved',
              approvalHistory: [
                ...approval.approvalHistory,
                {
                  action: 'approved',
                  by: user?.name || 'Unknown',
                  date: new Date(),
                  comments,
                },
              ],
            }
          : approval,
      ),
    );
    setSnackbar({ open: true, message: 'Visitor request approved', severity: 'success' });
  };

  const handleReject = (id: string, comments?: string) => {
    setApprovals((prev) =>
      prev.map((approval) =>
        approval.id === id
          ? {
              ...approval,
              status: 'rejected',
              approvalHistory: [
                ...approval.approvalHistory,
                {
                  action: 'rejected',
                  by: user?.name || 'Unknown',
                  date: new Date(),
                  comments,
                },
              ],
            }
          : approval,
      ),
    );
    setSnackbar({ open: true, message: 'Visitor request rejected', severity: 'warning' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'warning';
      case 'expired':
        return 'default';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const renderPendingApprovals = () => (
    <Box>
      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Search approvals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <IconSearch style={{ marginRight: 8, color: '#666' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                  <MenuItem value="expired">Expired</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={filters.priority}
                  onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                >
                  <MenuItem value="all">All Priorities</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Visit Type</InputLabel>
                <Select
                  value={filters.visitType}
                  onChange={(e) => setFilters({ ...filters, visitType: e.target.value })}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="meeting">Meeting</MenuItem>
                  <MenuItem value="interview">Interview</MenuItem>
                  <MenuItem value="delivery">Delivery</MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                  <MenuItem value="parent-conference">Parent Conference</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Date Range</InputLabel>
                <Select
                  value={filters.dateRange}
                  onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                >
                  <MenuItem value="all">All Dates</MenuItem>
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="week">This Week</MenuItem>
                  <MenuItem value="month">This Month</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={1}>
              <Typography variant="body2" color="textSecondary">
                {filteredApprovals.length} requests
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Approvals Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Visitor</TableCell>
                <TableCell>Purpose</TableCell>
                <TableCell>Host</TableCell>
                <TableCell>Visit Details</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredApprovals
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((approval) => (
                  <TableRow key={approval.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar>
                          <IconUser />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {approval.visitorName}
                          </Typography>
                          {approval.visitorEmail && (
                            <Typography variant="caption" color="textSecondary">
                              {approval.visitorEmail}
                            </Typography>
                          )}
                          <Typography variant="caption" display="block" color="textSecondary">
                            {approval.numberOfVisitors} visitor
                            {approval.numberOfVisitors > 1 ? 's' : ''}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" style={{ maxWidth: 200 }}>
                        {approval.purpose}
                      </Typography>
                      <Chip
                        label={approval.visitType
                          .replace('-', ' ')
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                       
                        variant="outlined"
                        sx={{ mt: 0.5 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {approval.hostName}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {approval.hostDepartment}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          <IconCalendar xs={16} style={{ marginRight: 4 }} />
                          {approval.visitDate.toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2">
                          <IconClock xs={16} style={{ marginRight: 4 }} />
                          {approval.visitTime} ({approval.duration})
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          <IconMapPin xs={14} style={{ marginRight: 4 }} />
                          {approval.location}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={approval.priority.toUpperCase()}
                        color={getPriorityColor(approval.priority) as any}
                       
                      />
                      {approval.securityLevel !== 'standard' && (
                        <Chip
                          label={approval.securityLevel.toUpperCase()}
                          color="warning"
                         
                          sx={{ ml: 0.5 }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={approval.status.toUpperCase()}
                        color={getStatusColor(approval.status) as any}
                       
                      />
                      {approval.status === 'pending' && (
                        <Typography variant="caption" display="block" color="textSecondary">
                          {Math.ceil(
                            (approval.visitDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000),
                          )}{' '}
                          days left
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" gap={1}>
                        <Tooltip title="View Details">
                          <IconButton
                           
                            onClick={() => {
                              setSelectedApproval(approval);
                              setShowDialog(true);
                            }}
                          >
                            <IconEye />
                          </IconButton>
                        </Tooltip>
                        {approval.status === 'pending' && (
                          <>
                            <Tooltip title="Approve">
                              <IconButton
                               
                                color="success"
                                onClick={() => handleApprove(approval.id)}
                              >
                                <IconCheck />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Reject">
                              <IconButton
                               
                                color="error"
                                onClick={() => handleReject(approval.id)}
                              >
                                <IconX />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredApprovals.length}
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
    </Box>
  );

  const renderOverviewTab = () => (
    <Grid container spacing={3}>
      {/* Stats Cards */}
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h4" color="warning.main">
              {approvals.filter((a) => a.status === 'pending').length}
            </Typography>
            <Typography variant="body2">Pending Approvals</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h4" color="success.main">
              {approvals.filter((a) => a.status === 'approved').length}
            </Typography>
            <Typography variant="body2">Approved Today</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h4" color="error.main">
              {approvals.filter((a) => a.priority === 'urgent').length}
            </Typography>
            <Typography variant="body2">Urgent Requests</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h4" color="info.main">
              {approvals.filter((a) => a.securityLevel === 'enhanced').length}
            </Typography>
            <Typography variant="body2">Enhanced Security</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Activity */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Approval Activity
            </Typography>
            <Timeline>
              {approvals
                .flatMap((approval) =>
                  approval.approvalHistory.map((history) => ({
                    ...history,
                    visitorName: approval.visitorName,
                    approvalId: approval.id,
                  })),
                )
                .sort((a, b) => b.date.getTime() - a.date.getTime())
                .slice(0, 6)
                .map((activity, index) => (
                  <TimelineItem key={index}>
                    <TimelineOppositeContent color="textSecondary">
                      {activity.date.toLocaleTimeString()}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot
                        color={
                          activity.action === 'approved'
                            ? 'success'
                            : activity.action === 'rejected'
                            ? 'error'
                            : 'primary'
                        }
                      >
                        {activity.action === 'approved' ? (
                          <IconCheck />
                        ) : activity.action === 'rejected' ? (
                          <IconX />
                        ) : (
                          <IconBell />
                        )}
                      </TimelineDot>
                      {index < 5 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="h6" component="span">
                        {activity.action.charAt(0).toUpperCase() + activity.action.slice(1)}
                      </Typography>
                      <Typography color="textSecondary">
                        {activity.visitorName} by {activity.by}
                      </Typography>
                      {activity.comments && (
                        <Typography variant="caption" display="block">
                          {activity.comments}
                        </Typography>
                      )}
                    </TimelineContent>
                  </TimelineItem>
                ))}
            </Timeline>
          </CardContent>
        </Card>
      </Grid>

      {/* Urgent Requests */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Urgent Requests
            </Typography>
            <List>
              {approvals
                .filter(
                  (approval) => approval.priority === 'urgent' && approval.status === 'pending',
                )
                .slice(0, 5)
                .map((approval) => (
                  <ListItem key={approval.id}>
                    <ListItemAvatar>
                      <Avatar>
                        <IconAlertTriangle />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={approval.visitorName}
                      secondary={approval.purpose.substring(0, 50) + '...'}
                    />
                    <Badge badgeContent="!" color="error" />
                  </ListItem>
                ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <PageContainer title="Visitor Approvals" description="Manage visitor approval requests">
      <Box>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Visitor Approvals
          </Typography>
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              startIcon={<IconRefresh />}
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
            <Button variant="outlined" startIcon={<IconDownload />}>
              Export
            </Button>
            <Badge
              badgeContent={approvals.filter((a) => a.status === 'pending').length}
              color="warning"
            >
              <Button variant="contained" startIcon={<IconUserCheck />}>
                Pending Approvals
              </Button>
            </Badge>
          </Box>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
            <Tab label="Overview" />
            <Tab
              label={
                <Badge
                  badgeContent={approvals.filter((a) => a.status === 'pending').length}
                  color="warning"
                >
                  Approval Requests
                </Badge>
              }
            />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {activeTab === 0 && renderOverviewTab()}
        {activeTab === 1 && renderPendingApprovals()}

        {/* Approval Details Dialog */}
        <Dialog open={showDialog} onClose={() => setShowDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Visitor Approval Details</DialogTitle>
          <DialogContent>
            {selectedApproval && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Visitor Name"
                        secondary={selectedApproval.visitorName}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Email"
                        secondary={selectedApproval.visitorEmail || 'Not provided'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Phone"
                        secondary={selectedApproval.visitorPhone || 'Not provided'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Number of Visitors"
                        secondary={selectedApproval.numberOfVisitors}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Visit Type"
                        secondary={selectedApproval.visitType
                          .replace('-', ' ')
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Host"
                        secondary={`${selectedApproval.hostName} (${selectedApproval.hostDepartment})`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Visit Date"
                        secondary={selectedApproval.visitDate.toLocaleDateString()}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Visit Time"
                        secondary={`${selectedApproval.visitTime} (${selectedApproval.duration})`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Location" secondary={selectedApproval.location} />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Security Level"
                        secondary={
                          selectedApproval.securityLevel.charAt(0).toUpperCase() +
                          selectedApproval.securityLevel.slice(1)
                        }
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Purpose
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {selectedApproval.purpose}
                  </Typography>

                  {selectedApproval.specialRequirements && (
                    <>
                      <Typography variant="h6" gutterBottom>
                        Special Requirements
                      </Typography>
                      <Typography variant="body2" paragraph>
                        {selectedApproval.specialRequirements}
                      </Typography>
                    </>
                  )}

                  <Typography variant="h6" gutterBottom>
                    Approval History
                  </Typography>
                  <Timeline>
                    {selectedApproval.approvalHistory.map((history, index) => (
                      <TimelineItem key={index}>
                        <TimelineOppositeContent color="textSecondary">
                          {history.date.toLocaleString()}
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                          <TimelineDot
                            color={
                              history.action === 'approved'
                                ? 'success'
                                : history.action === 'rejected'
                                ? 'error'
                                : 'primary'
                            }
                          >
                            {history.action === 'approved' ? (
                              <IconCheck />
                            ) : history.action === 'rejected' ? (
                              <IconX />
                            ) : (
                              <IconBell />
                            )}
                          </TimelineDot>
                          {index < selectedApproval.approvalHistory.length - 1 && (
                            <TimelineConnector />
                          )}
                        </TimelineSeparator>
                        <TimelineContent>
                          <Typography variant="h6" component="span">
                            {history.action.charAt(0).toUpperCase() + history.action.slice(1)}
                          </Typography>
                          <Typography color="textSecondary">by {history.by}</Typography>
                          {history.comments && (
                            <Typography variant="body2">{history.comments}</Typography>
                          )}
                        </TimelineContent>
                      </TimelineItem>
                    ))}
                  </Timeline>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDialog(false)}>Close</Button>
            {selectedApproval?.status === 'pending' && (
              <>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    handleReject(selectedApproval.id);
                    setShowDialog(false);
                  }}
                  startIcon={<IconX />}
                >
                  Reject
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => {
                    handleApprove(selectedApproval.id);
                    setShowDialog(false);
                  }}
                  startIcon={<IconCheck />}
                >
                  Approve
                </Button>
              </>
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

export default VisitorApprovals;
