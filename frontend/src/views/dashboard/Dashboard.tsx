import { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Stack,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from '@mui/material';
import {
  IconUsers,
  IconUserCheck,
  IconUserX,
  IconClock,
  IconShield,
  IconAlertTriangle,
  IconTrendingUp,
  IconTrendingDown,
  IconEye,
  IconPlus,
  IconRefresh,
  IconDownload,
  IconBell,
  IconSettings,
  IconActivity,
  IconCalendar,
} from '@tabler/icons-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import PageContainer from 'src/components/container/PageContainer';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Mock dashboard data - replace with real API calls
  const mockDashboardData = {
    stats: {
      todayVisitors: 47,
      currentlyIn: 23,
      pendingApprovals: 8,
      totalThisWeek: 234,
      averageStayTime: 45,
      securityAlerts: 2,
    },
    trends: {
      visitorsChange: 12.5,
      approvalsChange: -3.2,
      stayTimeChange: 8.1,
    },
    visitorsByHour: [
      { hour: '8AM', visitors: 5 },
      { hour: '9AM', visitors: 12 },
      { hour: '10AM', visitors: 8 },
      { hour: '11AM', visitors: 15 },
      { hour: '12PM', visitors: 18 },
      { hour: '1PM', visitors: 22 },
      { hour: '2PM', visitors: 14 },
      { hour: '3PM', visitors: 10 },
      { hour: '4PM', visitors: 7 },
    ],
    visitorsByCategory: [
      { name: 'Parents', value: 45, color: '#5D87FF' },
      { name: 'Vendors', value: 25, color: '#49BEFF' },
      { name: 'Contractors', value: 15, color: '#13DEB9' },
      { name: 'Alumni', value: 10, color: '#FFAE1F' },
      { name: 'Others', value: 5, color: '#FA896B' },
    ],
    weeklyTrend: [
      { day: 'Mon', visitors: 45, approved: 42 },
      { day: 'Tue', visitors: 52, approved: 48 },
      { day: 'Wed', visitors: 38, approved: 35 },
      { day: 'Thu', visitors: 61, approved: 58 },
      { day: 'Fri', visitors: 47, approved: 44 },
      { day: 'Sat', visitors: 23, approved: 22 },
      { day: 'Sun', visitors: 12, approved: 12 },
    ],
    recentVisitors: [
      {
        id: 1,
        name: 'John Smith',
        purpose: 'Parent Meeting',
        checkIn: '2024-03-15T10:30:00Z',
        status: 'checked-in',
        category: 'Parent',
      },
      {
        id: 2,
        name: 'Sarah Johnson',
        purpose: 'Vendor Visit',
        checkIn: '2024-03-15T09:15:00Z',
        status: 'checked-out',
        category: 'Vendor',
      },
      {
        id: 3,
        name: 'Mike Wilson',
        purpose: 'Maintenance',
        checkIn: '2024-03-15T08:45:00Z',
        status: 'checked-in',
        category: 'Contractor',
      },
      {
        id: 4,
        name: 'Lisa Brown',
        purpose: 'Alumni Visit',
        checkIn: '2024-03-15T11:20:00Z',
        status: 'pending',
        category: 'Alumni',
      },
    ],
    alerts: [
      {
        id: 1,
        type: 'security',
        message: 'Visitor overstay detected - Mike Wilson (3+ hours)',
        time: '10 minutes ago',
        severity: 'high',
      },
      {
        id: 2,
        type: 'approval',
        message: '3 pending visitor approvals require attention',
        time: '25 minutes ago',
        severity: 'medium',
      },
      {
        id: 3,
        type: 'system',
        message: 'Badge printer running low on supplies',
        time: '1 hour ago',
        severity: 'low',
      },
    ],
    quickActions: [
      { title: 'Check In Visitor', icon: IconUserCheck, path: '/visitors/checkin' },
      { title: 'Pre-Register', icon: IconPlus, path: '/visitors/pre-register' },
      { title: 'View All Visitors', icon: IconUsers, path: '/visitors/all' },
      { title: 'Security Alerts', icon: IconShield, path: '/security/alerts' },
    ],
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setDashboardData(mockDashboardData);
      } catch (err: any) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Simulate refresh
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setDashboardData({ ...mockDashboardData });
    } catch (err) {
      setError('Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'checked-in':
        return 'success';
      case 'checked-out':
        return 'default';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getRoleDashboardData = () => {
    const baseData = mockDashboardData;

    switch (user?.role) {
      case 'admin':
        return {
          ...baseData,
          roleSpecificActions: [
            { title: 'Manage Users', icon: IconUsers, path: '/admin/users' },
            { title: 'System Settings', icon: IconSettings, path: '/admin/settings' },
            { title: 'Generate Reports', icon: IconDownload, path: '/reports' },
            { title: 'Security Overview', icon: IconShield, path: '/security/overview' },
          ],
        };
      case 'security':
        return {
          ...baseData,
          stats: {
            ...baseData.stats,
            currentlyIn: 23,
            securityAlerts: 5,
            flaggedVisitors: 3,
            overstayVisitors: 2,
          },
          roleSpecificActions: [
            { title: 'ID Verification', icon: IconShield, path: '/security/id-verification' },
            { title: 'QR Scanner', icon: IconActivity, path: '/security/qr-scanner' },
            { title: 'Blacklist Check', icon: IconUserX, path: '/security/blacklist' },
            { title: 'Audit Logs', icon: IconCalendar, path: '/security/audit-logs' },
          ],
        };
      case 'frontdesk':
        return {
          ...baseData,
          roleSpecificActions: [
            { title: 'Quick Check-In', icon: IconUserCheck, path: '/visitors/checkin' },
            { title: 'Print Badges', icon: IconActivity, path: '/visitors/badges' },
            { title: 'Visitor Lookup', icon: IconUsers, path: '/visitors/all' },
            { title: 'Appointments', icon: IconCalendar, path: '/staff/appointments' },
          ],
        };
      case 'teacher':
        return {
          ...baseData,
          stats: {
            ...baseData.stats,
            myMeetings: 5,
            todayAppointments: 3,
            pendingMeetings: 2,
          },
          roleSpecificActions: [
            { title: 'My Appointments', icon: IconCalendar, path: '/staff/appointments' },
            { title: 'Schedule Meeting', icon: IconPlus, path: '/staff/scheduler' },
            { title: 'Visitor Requests', icon: IconUsers, path: '/staff/approvals' },
            { title: 'Meeting History', icon: IconActivity, path: '/staff/history' },
          ],
        };
      default:
        return baseData;
    }
  };

  const roleDashboardData = getRoleDashboardData();

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <PageContainer title="Dashboard" description="Loading dashboard...">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Dashboard" description="School Visiting System Dashboard">
      <Box>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h4" fontWeight={600}>
              Welcome back, {user?.firstName}!
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} • {user?.school?.name}
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" startIcon={<IconDownload />}>
              Export
            </Button>
            <Button
              variant="outlined"
              startIcon={refreshing ? <CircularProgress xs={16} /> : <IconRefresh />}
              onClick={handleRefresh}
              disabled={refreshing}
            >
              Refresh
            </Button>
          </Stack>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Main Dashboard Content */}
        {roleDashboardData && (
          <Grid container spacing={3}>
            {/* Key Metrics Cards */}
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ p: 1, bgcolor: 'primary.light', borderRadius: 2 }}>
                      <IconUsers xs={24} color="white" />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="textSecondary">
                        Today's Visitors
                      </Typography>
                      <Typography variant="h4" fontWeight={600}>
                        {roleDashboardData.stats.todayVisitors}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {roleDashboardData.trends.visitorsChange > 0 ? (
                          <IconTrendingUp xs={16} color="green" />
                        ) : (
                          <IconTrendingDown xs={16} color="red" />
                        )}
                        <Typography
                          variant="caption"
                          color={
                            roleDashboardData.trends.visitorsChange > 0
                              ? 'success.main'
                              : 'error.main'
                          }
                        >
                          {Math.abs(roleDashboardData.trends.visitorsChange)}%
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ p: 1, bgcolor: 'success.light', borderRadius: 2 }}>
                      <IconUserCheck xs={24} color="white" />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="textSecondary">
                        Currently In
                      </Typography>
                      <Typography variant="h4" fontWeight={600} color="success.main">
                        {roleDashboardData.stats.currentlyIn}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Active visitors
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ p: 1, bgcolor: 'warning.light', borderRadius: 2 }}>
                      <IconClock xs={24} color="white" />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="textSecondary">
                        {user?.role === 'teacher' ? 'My Meetings' : 'Pending Approvals'}
                      </Typography>
                      <Typography variant="h4" fontWeight={600} color="warning.main">
                        {user?.role === 'teacher'
                          ? roleDashboardData.stats.myMeetings ||
                            roleDashboardData.stats.pendingApprovals
                          : roleDashboardData.stats.pendingApprovals}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <IconTrendingDown xs={16} color="orange" />
                        <Typography variant="caption" color="warning.main">
                          {Math.abs(roleDashboardData.trends.approvalsChange)}%
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ p: 1, bgcolor: 'error.light', borderRadius: 2 }}>
                      <IconShield xs={24} color="white" />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="textSecondary">
                        {user?.role === 'security'
                          ? 'Security Alerts'
                          : user?.role === 'teacher'
                          ? 'Today Appointments'
                          : 'Security Alerts'}
                      </Typography>
                      <Typography variant="h4" fontWeight={600} color="error.main">
                        {user?.role === 'teacher'
                          ? roleDashboardData.stats.todayAppointments || 0
                          : roleDashboardData.stats.securityAlerts}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {user?.role === 'security'
                          ? 'Requires attention'
                          : user?.role === 'teacher'
                          ? 'Scheduled today'
                          : 'Requires attention'}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Charts Section */}
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h6" fontWeight={600}>
                      Visitor Activity Today
                    </Typography>
                    <Button startIcon={<IconEye />}>View Details</Button>
                  </Stack>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={roleDashboardData.visitorsByHour}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="visitors"
                          stroke="#5D87FF"
                          strokeWidth={3}
                          dot={{ fill: '#5D87FF', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} mb={3}>
                    Visitor Categories
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={roleDashboardData.visitorsByCategory}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }: any) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {roleDashboardData.visitorsByCategory.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Weekly Trend */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} mb={3}>
                    Weekly Visitor Trend
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={roleDashboardData.weeklyTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="visitors" fill="#5D87FF" name="Total Visitors" />
                        <Bar dataKey="approved" fill="#13DEB9" name="Approved" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Activity & Alerts */}
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h6" fontWeight={600}>
                      Recent Visitors
                    </Typography>
                    <Button startIcon={<IconUsers />}>View All</Button>
                  </Stack>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Visitor</TableCell>
                          <TableCell>Purpose</TableCell>
                          <TableCell>Check In</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {roleDashboardData.recentVisitors.map((visitor: any) => (
                          <TableRow key={visitor.id}>
                            <TableCell>
                              <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar sx={{ width: 32, height: 32 }}>
                                  {visitor.name
                                    .split(' ')
                                    .map((n: string) => n[0])
                                    .join('')}
                                </Avatar>
                                <Box>
                                  <Typography variant="subtitle2">{visitor.name}</Typography>
                                  <Typography variant="caption" color="textSecondary">
                                    {visitor.category}
                                  </Typography>
                                </Box>
                              </Stack>
                            </TableCell>
                            <TableCell>{visitor.purpose}</TableCell>
                            <TableCell>{formatTime(visitor.checkIn)}</TableCell>
                            <TableCell>
                              <Chip
                                label={visitor.status.replace('-', ' ')}
                                color={getStatusColor(visitor.status) as any}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Alerts & Quick Actions */}
            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                {/* Alerts */}
                <Card>
                  <CardContent>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                    >
                      <Typography variant="h6" fontWeight={600}>
                        Alerts
                      </Typography>
                      <IconButton>
                        <IconBell xs={20} />
                      </IconButton>
                    </Stack>
                    <List dense>
                      {roleDashboardData.alerts.map((alert: any) => (
                        <ListItem key={alert.id} sx={{ px: 0 }}>
                          <ListItemIcon>
                            <IconAlertTriangle
                              xs={20}
                              color={
                                alert.severity === 'high'
                                  ? 'red'
                                  : alert.severity === 'medium'
                                  ? 'orange'
                                  : 'blue'
                              }
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={alert.message}
                            secondary={alert.time}
                            primaryTypographyProps={{ variant: 'body2' }}
                            secondaryTypographyProps={{ variant: 'caption' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} mb={2}>
                      Quick Actions
                    </Typography>
                    <Stack spacing={1}>
                      {(
                        roleDashboardData.roleSpecificActions || roleDashboardData.quickActions
                      ).map((action: any, index: number) => (
                        <Button
                          key={index}
                          variant="outlined"
                          fullWidth
                          startIcon={<action.icon xs={20} />}
                          sx={{ justifyContent: 'flex-start' }}
                        >
                          {action.title}
                        </Button>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        )}
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
