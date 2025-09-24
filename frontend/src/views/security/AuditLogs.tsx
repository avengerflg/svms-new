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
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
  Snackbar,
  Menu,
  MenuItem as MenuItemComponent,
  Badge,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'; 
import {
  IconFilter,
  IconDownload,
  IconSearch,
  IconUser,
  IconClock,
  IconMapPin,
  IconShield,
  IconLock,
  IconCamera,
  IconScan,
  IconAlertTriangle,
  IconCheck,
  IconX,
  IconEye,
  IconMoreVertical,
  IconRefresh,
  IconChevronDown,
  IconCalendar,
  IconBell,
  IconSettings,
  IconDatabase,
  IconFileText,
  IconDownloader,
} from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import { useAuth } from '../../context/AuthContext';

interface AuditLogEntry {
  id: string;
  timestamp: Date;
  action: string;
  category:
    | 'authentication'
    | 'access-control'
    | 'visitor-management'
    | 'security'
    | 'system'
    | 'data-management';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId: string;
  userName: string;
  userRole: string;
  targetResource?: string;
  targetId?: string;
  ipAddress: string;
  location: string;
  deviceInfo?: string;
  details: {
    description: string;
    oldValue?: any;
    newValue?: any;
    additionalData?: any;
  };
  status: 'success' | 'failed' | 'warning';
  riskScore: number;
  sessionId?: string;
}

interface AuditStats {
  totalEvents: number;
  criticalEvents: number;
  failedActions: number;
  suspiciousActivity: number;
  topActions: { action: string; count: number }[];
  topUsers: { user: string; count: number }[];
}

const AuditLogs: React.FC = () => {
  const { user } = useAuth();
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [auditStats, setAuditStats] = useState<AuditStats | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning',
  });
  const [filters, setFilters] = useState({
    category: 'all',
    severity: 'all',
    status: 'all',
    dateRange: 'today',
    user: 'all',
  });

  // Mock audit log data
  const mockAuditLogs: AuditLogEntry[] = [
    {
      id: 'audit_001',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      action: 'Visitor Check-In',
      category: 'visitor-management',
      severity: 'low',
      userId: 'user_001',
      userName: 'Sarah Johnson',
      userRole: 'Front Desk',
      targetResource: 'Visitor',
      targetId: 'V123456',
      ipAddress: '192.168.1.15',
      location: 'Main Reception',
      deviceInfo: 'iPad - Reception Terminal',
      details: {
        description: 'Visitor checked in successfully',
        additionalData: {
          visitorName: 'John Doe',
          purpose: 'Parent Meeting',
          hostName: 'Dr. Smith',
        },
      },
      status: 'success',
      riskScore: 1,
      sessionId: 'sess_001',
    },
    {
      id: 'audit_002',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      action: 'Failed Login Attempt',
      category: 'authentication',
      severity: 'high',
      userId: 'unknown',
      userName: 'Unknown User',
      userRole: 'N/A',
      ipAddress: '192.168.1.45',
      location: 'Security Office',
      deviceInfo: 'Windows PC - SEC-01',
      details: {
        description: 'Multiple failed login attempts detected',
        additionalData: {
          attemptCount: 5,
          accountTargeted: 'admin@school.edu',
          reason: 'Invalid password',
        },
      },
      status: 'failed',
      riskScore: 8,
    },
    {
      id: 'audit_003',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      action: 'Access Denied - Restricted Area',
      category: 'access-control',
      severity: 'medium',
      userId: 'user_002',
      userName: 'Mike Wilson',
      userRole: 'Visitor',
      targetResource: 'Access Point',
      targetId: 'AP_ADMIN_01',
      ipAddress: '192.168.1.22',
      location: 'Administrative Wing',
      details: {
        description: 'Visitor attempted to access restricted administrative area',
        additionalData: {
          badgeId: 'BADGE_V789',
          accessLevel: 'Visitor',
          requiredLevel: 'Staff',
        },
      },
      status: 'warning',
      riskScore: 6,
    },
    {
      id: 'audit_004',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      action: 'Blacklist Entry Added',
      category: 'security',
      severity: 'medium',
      userId: 'user_003',
      userName: 'Security Manager',
      userRole: 'Security',
      targetResource: 'Blacklist',
      targetId: 'BL_001',
      ipAddress: '192.168.1.33',
      location: 'Security Office',
      details: {
        description: 'New entry added to visitor blacklist',
        newValue: {
          personName: 'John Smith',
          reason: 'Disruptive behavior',
          category: 'Security Threat',
        },
      },
      status: 'success',
      riskScore: 4,
    },
    {
      id: 'audit_005',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      action: 'ID Verification Completed',
      category: 'security',
      severity: 'low',
      userId: 'user_004',
      userName: 'Amy Chen',
      userRole: 'Security Guard',
      targetResource: 'ID Verification',
      targetId: 'IDV_789',
      ipAddress: '192.168.1.28',
      location: 'Main Entrance',
      deviceInfo: 'Tablet - Security Checkpoint',
      details: {
        description: 'Visitor ID document verified successfully',
        additionalData: {
          idType: 'Driver License',
          verificationMethod: 'Automated Scan',
          confidence: 95,
        },
      },
      status: 'success',
      riskScore: 2,
    },
    {
      id: 'audit_006',
      timestamp: new Date(Date.now() - 75 * 60 * 1000),
      action: 'Data Export Request',
      category: 'data-management',
      severity: 'medium',
      userId: 'user_005',
      userName: 'Admin User',
      userRole: 'Administrator',
      targetResource: 'Visitor Data',
      ipAddress: '192.168.1.10',
      location: 'Administrative Office',
      details: {
        description: 'Visitor data exported for monthly report',
        additionalData: {
          exportType: 'Monthly Report',
          recordCount: 1250,
          format: 'CSV',
        },
      },
      status: 'success',
      riskScore: 3,
    },
    {
      id: 'audit_007',
      timestamp: new Date(Date.now() - 90 * 60 * 1000),
      action: 'Suspicious QR Scan Detected',
      category: 'security',
      severity: 'critical',
      userId: 'user_006',
      userName: 'Tom Garcia',
      userRole: 'Visitor',
      targetResource: 'QR Scanner',
      targetId: 'QR_SCAN_001',
      ipAddress: '192.168.1.55',
      location: 'Back Entrance',
      details: {
        description: 'Potentially fraudulent QR code detected during scan',
        additionalData: {
          qrCodeType: 'Visitor Badge',
          anomalyType: 'Invalid signature',
          scannerLocation: 'Back Entrance',
        },
      },
      status: 'warning',
      riskScore: 9,
    },
  ];

  const mockAuditStats: AuditStats = {
    totalEvents: 1247,
    criticalEvents: 12,
    failedActions: 43,
    suspiciousActivity: 8,
    topActions: [
      { action: 'Visitor Check-In', count: 345 },
      { action: 'Badge Generated', count: 298 },
      { action: 'Access Granted', count: 187 },
      { action: 'ID Verification', count: 156 },
      { action: 'QR Code Scan', count: 134 },
    ],
    topUsers: [
      { user: 'Front Desk Staff', count: 425 },
      { user: 'Security Guard', count: 298 },
      { user: 'Admin User', count: 187 },
      { user: 'Reception Team', count: 134 },
      { user: 'Security Manager', count: 89 },
    ],
  };

  useEffect(() => {
    setAuditLogs(mockAuditLogs);
    setFilteredLogs(mockAuditLogs);
    setAuditStats(mockAuditStats);
  }, []);

  useEffect(() => {
    let filtered = auditLogs.filter((log) => {
      const matchesSearch =
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ipAddress.includes(searchTerm);

      const matchesCategory = filters.category === 'all' || log.category === filters.category;
      const matchesSeverity = filters.severity === 'all' || log.severity === filters.severity;
      const matchesStatus = filters.status === 'all' || log.status === filters.status;
      const matchesUser = filters.user === 'all' || log.userName === filters.user;

      // Date range filtering
      let matchesDate = true;
      const now = new Date();
      const logDate = log.timestamp;

      switch (filters.dateRange) {
        case 'today':
          matchesDate = logDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = logDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = logDate >= monthAgo;
          break;
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSeverity &&
        matchesStatus &&
        matchesUser &&
        matchesDate
      );
    });

    setFilteredLogs(filtered);
    setPage(0);
  }, [auditLogs, searchTerm, filters]);

  const handleViewDetails = (log: AuditLogEntry) => {
    setSelectedLog(log);
    setShowDialog(true);
  };

  const handleExportLogs = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Timestamp,Action,Category,Severity,User,Status,IP Address,Location,Description'].join(',') +
      '\n' +
      filteredLogs
        .map((log) =>
          [
            log.timestamp.toISOString(),
            log.action,
            log.category,
            log.severity,
            log.userName,
            log.status,
            log.ipAddress,
            log.location,
            log.details.description,
          ]
            .map((field) => `"${field}"`)
            .join(','),
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSnackbar({ open: true, message: 'Audit logs exported successfully', severity: 'success' });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'failed':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'authentication':
        return <IconLock />;
      case 'access-control':
        return <IconShield />;
      case 'visitor-management':
        return <IconUser />;
      case 'security':
        return <IconAlertTriangle />;
      case 'system':
        return <IconSettings />;
      case 'data-management':
        return <IconDatabase />;
      default:
        return <IconFileText />;
    }
  };

  const renderOverviewTab = () => (
    <Grid container spacing={3}>
      {/* Stats Cards */}
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h4" color="primary">
              {auditStats?.totalEvents.toLocaleString()}
            </Typography>
            <Typography variant="body2">Total Events Today</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h4" color="error">
              {auditStats?.criticalEvents}
            </Typography>
            <Typography variant="body2">Critical Events</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h4" color="warning.main">
              {auditStats?.failedActions}
            </Typography>
            <Typography variant="body2">Failed Actions</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h4" color="info.main">
              {auditStats?.suspiciousActivity}
            </Typography>
            <Typography variant="body2">Suspicious Activity</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Top Actions */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Top Actions Today
            </Typography>
            <List>
              {auditStats?.topActions.map((action, index) => (
                <ListItem key={index}>
                  <ListItemText primary={action.action} secondary={`${action.count} occurrences`} />
                  <Chip label={action.count} color="primary" />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Top Users */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Most Active Users
            </Typography>
            <List>
              {auditStats?.topUsers.map((user, index) => (
                <ListItem key={index}>
                  <ListItemText primary={user.user} secondary={`${user.count} actions`} />
                  <Chip label={user.count} color="secondary" />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Critical Events */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Critical Events
            </Typography>
            <Timeline>
              {filteredLogs
                .filter((log) => log.severity === 'critical' || log.severity === 'high')
                .slice(0, 5)
                .map((log) => (
                  <TimelineItem key={log.id}>
                    <TimelineOppositeContent color="textSecondary">
                      {log.timestamp.toLocaleTimeString()}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot color={getSeverityColor(log.severity) as any}>
                        {getCategoryIcon(log.category)}
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="h6" component="span">
                        {log.action}
                      </Typography>
                      <Typography color="textSecondary">{log.details.description}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        by {log.userName} from {log.location}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                ))}
            </Timeline>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderLogsTab = () => (
    <Box>
      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Search logs..."
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
                  <MenuItem value="authentication">Authentication</MenuItem>
                  <MenuItem value="access-control">Access Control</MenuItem>
                  <MenuItem value="visitor-management">Visitor Management</MenuItem>
                  <MenuItem value="security">Security</MenuItem>
                  <MenuItem value="system">System</MenuItem>
                  <MenuItem value="data-management">Data Management</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Severity</InputLabel>
                <Select
                  value={filters.severity}
                  onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                >
                  <MenuItem value="all">All Severities</MenuItem>
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
                  <MenuItem value="success">Success</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                  <MenuItem value="warning">Warning</MenuItem>
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
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="week">This Week</MenuItem>
                  <MenuItem value="month">This Month</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={1}>
              <Button
                variant="outlined"
                startIcon={<IconDownload />}
                onClick={handleExportLogs}
                fullWidth
              >
                Export
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Risk Score</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {log.timestamp.toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {log.timestamp.toLocaleTimeString()}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        {getCategoryIcon(log.category)}
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {log.action}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {log.details.description.substring(0, 50)}...
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.category
                          .replace('-', ' ')
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                        variant="outlined"
                       
                      />
                      <Chip
                        label={log.severity.toUpperCase()}
                        color={getSeverityColor(log.severity) as any}
                       
                        sx={{ ml: 0.5 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {log.userName}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {log.userRole}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">{log.location}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {log.ipAddress}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.status.toUpperCase()}
                        color={getStatusColor(log.status) as any}
                       
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.riskScore}
                        color={
                          log.riskScore >= 8 ? 'error' : log.riskScore >= 5 ? 'warning' : 'success'
                        }
                       
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => handleViewDetails(log)}>
                        <IconEye />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredLogs.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 25, 50, 100]}
        />
      </Card>
    </Box>
  );

  return (
    <PageContainer title="Audit Logs" description="Monitor system activities and security events">
      <Box>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Audit Logs & Security Monitoring
          </Typography>
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              startIcon={<IconRefresh />}
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
            <Button variant="outlined" startIcon={<IconDownloader />}>
              Print Report
            </Button>
            <Button variant="contained" startIcon={<IconDownload />} onClick={handleExportLogs}>
              Export Logs
            </Button>
          </Box>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
            <Tab label="Overview" />
            <Tab label="Audit Logs" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {activeTab === 0 && renderOverviewTab()}
        {activeTab === 1 && renderLogsTab()}

        {/* Log Details Dialog */}
        <Dialog open={showDialog} onClose={() => setShowDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Audit Log Details</DialogTitle>
          <DialogContent>
            {selectedLog && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Timestamp"
                        secondary={selectedLog.timestamp.toLocaleString()}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Action" secondary={selectedLog.action} />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Category"
                        secondary={selectedLog.category
                          .replace('-', ' ')
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Severity"
                        secondary={
                          <Chip
                            label={selectedLog.severity.toUpperCase()}
                            color={getSeverityColor(selectedLog.severity) as any}
                           
                          />
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Status"
                        secondary={
                          <Chip
                            label={selectedLog.status.toUpperCase()}
                            color={getStatusColor(selectedLog.status) as any}
                           
                          />
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Risk Score"
                        secondary={
                          <Chip
                            label={selectedLog.riskScore}
                            color={
                              selectedLog.riskScore >= 8
                                ? 'error'
                                : selectedLog.riskScore >= 5
                                ? 'warning'
                                : 'success'
                            }
                           
                          />
                        }
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="User"
                        secondary={`${selectedLog.userName} (${selectedLog.userRole})`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Location" secondary={selectedLog.location} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="IP Address" secondary={selectedLog.ipAddress} />
                    </ListItem>
                    {selectedLog.deviceInfo && (
                      <ListItem>
                        <ListItemText primary="Device" secondary={selectedLog.deviceInfo} />
                      </ListItem>
                    )}
                    {selectedLog.targetResource && (
                      <ListItem>
                        <ListItemText
                          primary="Target Resource"
                          secondary={`${selectedLog.targetResource} (${selectedLog.targetId})`}
                        />
                      </ListItem>
                    )}
                    {selectedLog.sessionId && (
                      <ListItem>
                        <ListItemText primary="Session ID" secondary={selectedLog.sessionId} />
                      </ListItem>
                    )}
                  </List>
                </Grid>
                <Grid item xs={12}>
                  <Accordion>
                    <AccordionSummary expandIcon={<IconChevronDown />}>
                      <Typography variant="h6">Event Details</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" paragraph>
                        {selectedLog.details.description}
                      </Typography>

                      {selectedLog.details.additionalData && (
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>
                            Additional Information:
                          </Typography>
                          <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                            <pre style={{ margin: 0, fontSize: '0.8rem' }}>
                              {JSON.stringify(selectedLog.details.additionalData, null, 2)}
                            </pre>
                          </Paper>
                        </Box>
                      )}

                      {selectedLog.details.oldValue && (
                        <Box mt={2}>
                          <Typography variant="subtitle2" gutterBottom>
                            Previous Value:
                          </Typography>
                          <Paper sx={{ p: 2, backgroundColor: '#fff3e0' }}>
                            <pre style={{ margin: 0, fontSize: '0.8rem' }}>
                              {JSON.stringify(selectedLog.details.oldValue, null, 2)}
                            </pre>
                          </Paper>
                        </Box>
                      )}

                      {selectedLog.details.newValue && (
                        <Box mt={2}>
                          <Typography variant="subtitle2" gutterBottom>
                            New Value:
                          </Typography>
                          <Paper sx={{ p: 2, backgroundColor: '#e8f5e8' }}>
                            <pre style={{ margin: 0, fontSize: '0.8rem' }}>
                              {JSON.stringify(selectedLog.details.newValue, null, 2)}
                            </pre>
                          </Paper>
                        </Box>
                      )}
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDialog(false)}>Close</Button>
            <Button
              variant="outlined"
              startIcon={<IconDownload />}
              onClick={() => {
                if (selectedLog) {
                  const logData = JSON.stringify(selectedLog, null, 2);
                  const blob = new Blob([logData], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `audit_log_${selectedLog.id}.json`;
                  link.click();
                  URL.revokeObjectURL(url);
                }
              }}
            >
              Export Log
            </Button>
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

export default AuditLogs;
