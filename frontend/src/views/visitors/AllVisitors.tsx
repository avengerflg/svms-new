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
  Stack,
  Divider,
  CardHeader,
  Tooltip,
  useTheme,
  alpha,
  Fade,
  Slide,
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
  IconUser,
  IconMail,
  IconBuilding,
  IconCircle,
  IconSettings,
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
  const theme = useTheme();
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Form state for new visitor
  const [newVisitor, setNewVisitor] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    idType: 'national-id',
    idNumber: '',
    purposeOfVisit: '',
    personToMeet: '',
    department: 'administration',
    expectedDuration: 60,
    visitorCategory: 'guest',
  });

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

  const handleAddVisitor = () => {
    setAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
    setNewVisitor({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      idType: 'national-id',
      idNumber: '',
      purposeOfVisit: '',
      personToMeet: '',
      department: 'administration',
      expectedDuration: 60,
      visitorCategory: 'guest',
    });
  };

  const handleSubmitNewVisitor = async () => {
    if (!validateNewVisitor()) {
      return;
    }

    try {
      setLoading(true);

      // Add school from current user context
      const visitorData = {
        ...newVisitor,
        school: user?.school?._id,
      };

      console.log('Submitting visitor data:', visitorData);

      const response = await visitorAPI.createVisitor(visitorData);
      if (response.success) {
        toast.success('Visitor added successfully!');
        handleCloseAddDialog();
        fetchVisitors(); // Refresh the list
      }
    } catch (error: any) {
      console.error('Error creating visitor:', error);
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to add visitor';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleNewVisitorChange = (field: string, value: any) => {
    setNewVisitor((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateNewVisitor = () => {
    const required = ['firstName', 'lastName', 'phone', 'idNumber', 'personToMeet'];
    for (const field of required) {
      if (!newVisitor[field as keyof typeof newVisitor]) {
        toast.error(
          `${field
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase())} is required`,
        );
        return false;
      }
    }

    // Validate email format if provided
    if (newVisitor.email && !/\S+@\S+\.\S+/.test(newVisitor.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    return true;
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
          <Fade in={!!error}>
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 2,
                boxShadow: theme.shadows[1],
              }}
            >
              {error}
            </Alert>
          </Fade>
        )}

        {/* Enhanced Header */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            borderRadius: 3,
            p: 4,
            mb: 4,
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '40%',
              height: '100%',
              background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              opacity: 0.1,
            },
          }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'center' }}
            spacing={3}
          >
            <Box>
              <Typography variant="h3" component="h1" fontWeight="bold" mb={1}>
                Visitor Management
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Monitor, manage and track all visitors in real-time
              </Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              <Tooltip title="Export visitor data">
                <Button
                  variant="contained"
                  startIcon={<IconDownload />}
                  sx={{
                    bgcolor: alpha(theme.palette.common.white, 0.15),
                    '&:hover': { bgcolor: alpha(theme.palette.common.white, 0.25) },
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  Export
                </Button>
              </Tooltip>
              <Tooltip title="Add new visitor">
                <Button
                  variant="contained"
                  startIcon={<IconUserPlus />}
                  onClick={handleAddVisitor}
                  sx={{
                    bgcolor: theme.palette.secondary.main,
                    '&:hover': { bgcolor: theme.palette.secondary.dark },
                    boxShadow: theme.shadows[4],
                  }}
                >
                  New Visitor
                </Button>
              </Tooltip>
            </Stack>
          </Stack>
        </Box>

        {/* Enhanced Stats Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                position: 'relative',
                overflow: 'hidden',
                background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${alpha(
                  theme.palette.primary.main,
                  0.1,
                )} 100%)`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" variant="body2" fontWeight={500} gutterBottom>
                      Total Visitors
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" color="primary.main">
                      {stats.total}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.15),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconEye size={24} color={theme.palette.primary.main} />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                position: 'relative',
                overflow: 'hidden',
                background: `linear-gradient(135deg, ${theme.palette.success.light} 0%, ${alpha(
                  theme.palette.success.main,
                  0.1,
                )} 100%)`,
                border: `1px solid ${alpha(theme.palette.success.main, 0.12)}`,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" variant="body2" fontWeight={500} gutterBottom>
                      Currently In
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" color="success.main">
                      {stats.checkedIn}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.success.main, 0.15),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconCheck size={24} color={theme.palette.success.main} />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                position: 'relative',
                overflow: 'hidden',
                background: `linear-gradient(135deg, ${theme.palette.warning.light} 0%, ${alpha(
                  theme.palette.warning.main,
                  0.1,
                )} 100%)`,
                border: `1px solid ${alpha(theme.palette.warning.main, 0.12)}`,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" variant="body2" fontWeight={500} gutterBottom>
                      Pending Approval
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" color="warning.main">
                      {stats.pending}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.warning.main, 0.15),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconClock size={24} color={theme.palette.warning.main} />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                position: 'relative',
                overflow: 'hidden',
                background: `linear-gradient(135deg, ${theme.palette.grey[100]} 0%, ${alpha(
                  theme.palette.grey[400],
                  0.1,
                )} 100%)`,
                border: `1px solid ${alpha(theme.palette.grey[400], 0.12)}`,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" variant="body2" fontWeight={500} gutterBottom>
                      Checked Out
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" color="text.secondary">
                      {stats.checkedOut}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.grey[400], 0.15),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconX size={24} color={theme.palette.grey[600]} />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Enhanced Filters and Search */}
        <Card
          sx={{
            mb: 4,
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
            boxShadow: theme.shadows[2],
            background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${alpha(
              theme.palette.primary.light,
              0.02,
            )} 100%)`,
          }}
        >
          <CardHeader
            title={
              <Stack direction="row" alignItems="center" spacing={1}>
                <IconFilter size={20} />
                <Typography variant="h6" fontWeight={600}>
                  Search & Filter Visitors
                </Typography>
              </Stack>
            }
            sx={{
              pb: 1,
              '& .MuiCardHeader-title': {
                color: theme.palette.primary.main,
              },
            }}
          />
          <Divider sx={{ borderColor: alpha(theme.palette.primary.main, 0.08) }} />
          <CardContent sx={{ pt: 3 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search by name, email, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="medium"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2.5,
                      backgroundColor: alpha(theme.palette.background.paper, 0.8),
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        backgroundColor: theme.palette.background.paper,
                        boxShadow: theme.shadows[2],
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: alpha(theme.palette.primary.main, 0.4),
                        },
                      },
                      '&.Mui-focused': {
                        backgroundColor: theme.palette.background.paper,
                        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme.palette.primary.main,
                          borderWidth: 2,
                        },
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconSearch
                          size={20}
                          style={{ color: alpha(theme.palette.primary.main, 0.7) }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2.5,
                      backgroundColor: alpha(theme.palette.background.paper, 0.8),
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        backgroundColor: theme.palette.background.paper,
                        boxShadow: theme.shadows[2],
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: alpha(theme.palette.primary.main, 0.4),
                        },
                      },
                      '&.Mui-focused': {
                        backgroundColor: theme.palette.background.paper,
                        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme.palette.primary.main,
                          borderWidth: 2,
                        },
                      },
                    },
                  }}
                >
                  <InputLabel sx={{ color: alpha(theme.palette.primary.main, 0.7) }}>
                    Status
                  </InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          borderRadius: 2,
                          mt: 1,
                          boxShadow: theme.shadows[4],
                          '& .MuiMenuItem-root': {
                            borderRadius: 1,
                            mx: 0.5,
                            my: 0.25,
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.08),
                            },
                            '&.Mui-selected': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.12),
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.16),
                              },
                            },
                          },
                        },
                      },
                    }}
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
                <FormControl
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2.5,
                      backgroundColor: alpha(theme.palette.background.paper, 0.8),
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        backgroundColor: theme.palette.background.paper,
                        boxShadow: theme.shadows[2],
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: alpha(theme.palette.primary.main, 0.4),
                        },
                      },
                      '&.Mui-focused': {
                        backgroundColor: theme.palette.background.paper,
                        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme.palette.primary.main,
                          borderWidth: 2,
                        },
                      },
                    },
                  }}
                >
                  <InputLabel sx={{ color: alpha(theme.palette.primary.main, 0.7) }}>
                    Category
                  </InputLabel>
                  <Select
                    value={categoryFilter}
                    label="Category"
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          borderRadius: 2,
                          mt: 1,
                          boxShadow: theme.shadows[4],
                          '& .MuiMenuItem-root': {
                            borderRadius: 1,
                            mx: 0.5,
                            my: 0.25,
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.08),
                            },
                            '&.Mui-selected': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.12),
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.16),
                              },
                            },
                          },
                        },
                      },
                    }}
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
                <FormControl
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2.5,
                      backgroundColor: alpha(theme.palette.background.paper, 0.8),
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        backgroundColor: theme.palette.background.paper,
                        boxShadow: theme.shadows[2],
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: alpha(theme.palette.primary.main, 0.4),
                        },
                      },
                      '&.Mui-focused': {
                        backgroundColor: theme.palette.background.paper,
                        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme.palette.primary.main,
                          borderWidth: 2,
                        },
                      },
                    },
                  }}
                >
                  <InputLabel sx={{ color: alpha(theme.palette.primary.main, 0.7) }}>
                    Department
                  </InputLabel>
                  <Select
                    value={departmentFilter}
                    label="Department"
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          borderRadius: 2,
                          mt: 1,
                          boxShadow: theme.shadows[4],
                          '& .MuiMenuItem-root': {
                            borderRadius: 1,
                            mx: 0.5,
                            my: 0.25,
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.08),
                            },
                            '&.Mui-selected': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.12),
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.16),
                              },
                            },
                          },
                        },
                      },
                    }}
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
                <Tooltip title="Advanced filtering options">
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<IconFilter size={18} />}
                    sx={{
                      borderRadius: 2.5,
                      height: 56,
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                      color: theme.palette.primary.main,
                      backgroundColor: alpha(theme.palette.primary.main, 0.04),
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                        boxShadow: theme.shadows[2],
                        transform: 'translateY(-1px)',
                      },
                    }}
                  >
                    Filters
                  </Button>
                </Tooltip>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Enhanced Visitors Table */}
        <Card
          sx={{
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
            boxShadow: theme.shadows[2],
            overflow: 'hidden',
          }}
        >
          <TableContainer
            sx={{
              '&::-webkit-scrollbar': { height: 8 },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: alpha(theme.palette.primary.main, 0.3),
                borderRadius: 4,
              },
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow
                  sx={{
                    '& .MuiTableCell-head': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.04),
                      borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.12)}`,
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <IconUser size={18} />
                      <Typography variant="subtitle2" fontWeight={600}>
                        Visitor
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <IconMail size={18} />
                      <Typography variant="subtitle2" fontWeight={600}>
                        Contact
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <IconBuilding size={18} />
                      <Typography variant="subtitle2" fontWeight={600}>
                        Purpose & Department
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <IconCircle size={18} />
                      <Typography variant="subtitle2" fontWeight={600}>
                        Status
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <IconClock size={18} />
                      <Typography variant="subtitle2" fontWeight={600}>
                        Check In
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <IconClock size={18} />
                      <Typography variant="subtitle2" fontWeight={600}>
                        Check Out
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 600, color: theme.palette.primary.main, textAlign: 'center' }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1} justifyContent="center">
                      <IconSettings size={18} />
                      <Typography variant="subtitle2" fontWeight={600}>
                        Actions
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visitors.map((visitor) => (
                  <TableRow
                    key={visitor._id}
                    sx={{
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.04),
                        transform: 'translateY(-1px)',
                        boxShadow: `0 4px 8px ${alpha(theme.palette.primary.main, 0.1)}`,
                      },
                      '& .MuiTableCell-root': {
                        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                      },
                    }}
                  >
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
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleViewVisitor(visitor)}
                            sx={{
                              backgroundColor: alpha(theme.palette.info.main, 0.1),
                              color: theme.palette.info.main,
                              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.info.main, 0.2),
                                transform: 'scale(1.1)',
                                boxShadow: theme.shadows[2],
                              },
                            }}
                          >
                            <IconEye size={16} />
                          </IconButton>
                        </Tooltip>

                        {/* Enhanced Status-based action buttons */}
                        {visitor.status === 'pending' &&
                          (user?.role === 'admin' || user?.role === 'frontdesk') && (
                            <>
                              <Tooltip title="Approve Visitor">
                                <IconButton
                                  size="small"
                                  onClick={() => handleApprove(visitor._id)}
                                  sx={{
                                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                                    color: theme.palette.success.main,
                                    border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                      backgroundColor: alpha(theme.palette.success.main, 0.2),
                                      transform: 'scale(1.1)',
                                      boxShadow: theme.shadows[2],
                                    },
                                  }}
                                >
                                  <IconCheck size={16} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Reject Visitor">
                                <IconButton
                                  size="small"
                                  onClick={() => handleReject(visitor._id, 'Rejected by staff')}
                                  sx={{
                                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                                    color: theme.palette.error.main,
                                    border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                      backgroundColor: alpha(theme.palette.error.main, 0.2),
                                      transform: 'scale(1.1)',
                                      boxShadow: theme.shadows[2],
                                    },
                                  }}
                                >
                                  <IconX size={16} />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}

                        {visitor.status === 'approved' &&
                          (user?.role === 'admin' || user?.role === 'security') && (
                            <Tooltip title="Check In Visitor">
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() => handleCheckIn(visitor._id)}
                                sx={{
                                  minWidth: 'auto',
                                  px: 2,
                                  borderRadius: 2,
                                  backgroundColor: theme.palette.success.main,
                                  color: 'white',
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  textTransform: 'none',
                                  boxShadow: `0 2px 8px ${alpha(theme.palette.success.main, 0.3)}`,
                                  transition: 'all 0.2s ease',
                                  '&:hover': {
                                    backgroundColor: theme.palette.success.dark,
                                    transform: 'translateY(-1px)',
                                    boxShadow: `0 4px 12px ${alpha(
                                      theme.palette.success.main,
                                      0.4,
                                    )}`,
                                  },
                                }}
                              >
                                Check In
                              </Button>
                            </Tooltip>
                          )}

                        {visitor.status === 'checked-in' &&
                          (user?.role === 'admin' || user?.role === 'security') && (
                            <Tooltip title="Check Out Visitor">
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleCheckOut(visitor._id)}
                                sx={{
                                  minWidth: 'auto',
                                  px: 2,
                                  borderRadius: 2,
                                  borderColor: theme.palette.warning.main,
                                  color: theme.palette.warning.main,
                                  backgroundColor: alpha(theme.palette.warning.main, 0.04),
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  textTransform: 'none',
                                  transition: 'all 0.2s ease',
                                  '&:hover': {
                                    borderColor: theme.palette.warning.dark,
                                    color: theme.palette.warning.dark,
                                    backgroundColor: alpha(theme.palette.warning.main, 0.1),
                                    transform: 'translateY(-1px)',
                                    boxShadow: `0 4px 12px ${alpha(
                                      theme.palette.warning.main,
                                      0.2,
                                    )}`,
                                  },
                                }}
                              >
                                Check Out
                              </Button>
                            </Tooltip>
                          )}

                        <Tooltip title="Show QR Code">
                          <IconButton
                            size="small"
                            sx={{
                              backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                              color: theme.palette.secondary.main,
                              border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.secondary.main, 0.2),
                                transform: 'scale(1.1)',
                                boxShadow: theme.shadows[2],
                              },
                            }}
                          >
                            <IconQrcode size={16} />
                          </IconButton>
                        </Tooltip>
                      </Stack>
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

        {/* Add New Visitor Dialog */}
        <Dialog
          open={addDialogOpen}
          onClose={handleCloseAddDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: theme.shadows[10],
            },
          }}
        >
          <DialogTitle
            sx={{
              pb: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: 'white',
              mb: 2,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconUserPlus size={24} />
              <Typography variant="h6" fontWeight={600}>
                Add New Visitor
              </Typography>
            </Stack>
          </DialogTitle>

          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              {/* Personal Information */}
              <Grid item xs={12}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Personal Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={newVisitor.firstName}
                  onChange={(e) => handleNewVisitorChange('firstName', e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={newVisitor.lastName}
                  onChange={(e) => handleNewVisitorChange('lastName', e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={newVisitor.email}
                  onChange={(e) => handleNewVisitorChange('email', e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={newVisitor.phone}
                  onChange={(e) => handleNewVisitorChange('phone', e.target.value)}
                  required
                />
              </Grid>

              {/* ID Information */}
              <Grid item xs={12}>
                <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
                  Identification
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>ID Type</InputLabel>
                  <Select
                    value={newVisitor.idType}
                    label="ID Type"
                    onChange={(e) => handleNewVisitorChange('idType', e.target.value)}
                  >
                    <MenuItem value="national-id">National ID</MenuItem>
                    <MenuItem value="passport">Passport</MenuItem>
                    <MenuItem value="drivers-license">Driver's License</MenuItem>
                    <MenuItem value="student-id">Student ID</MenuItem>
                    <MenuItem value="employee-id">Employee ID</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="ID Number"
                  value={newVisitor.idNumber}
                  onChange={(e) => handleNewVisitorChange('idNumber', e.target.value)}
                  required
                />
              </Grid>

              {/* Visit Information */}
              <Grid item xs={12}>
                <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
                  Visit Details
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Purpose of Visit"
                  multiline
                  rows={2}
                  value={newVisitor.purposeOfVisit}
                  onChange={(e) => handleNewVisitorChange('purposeOfVisit', e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Person to Meet"
                  value={newVisitor.personToMeet}
                  onChange={(e) => handleNewVisitorChange('personToMeet', e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={newVisitor.department}
                    label="Department"
                    onChange={(e) => handleNewVisitorChange('department', e.target.value)}
                  >
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

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Visitor Category</InputLabel>
                  <Select
                    value={newVisitor.visitorCategory}
                    label="Visitor Category"
                    onChange={(e) => handleNewVisitorChange('visitorCategory', e.target.value)}
                  >
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

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Expected Duration (minutes)"
                  type="number"
                  value={newVisitor.expectedDuration}
                  onChange={(e) =>
                    handleNewVisitorChange('expectedDuration', parseInt(e.target.value))
                  }
                  InputProps={{ inputProps: { min: 15, max: 480 } }}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 2 }}>
            <Button onClick={handleCloseAddDialog} variant="outlined" size="large">
              Cancel
            </Button>
            <Button
              onClick={handleSubmitNewVisitor}
              variant="contained"
              size="large"
              disabled={
                loading || !newVisitor.firstName || !newVisitor.lastName || !newVisitor.email
              }
              startIcon={loading ? <CircularProgress size={20} /> : <IconUserPlus />}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.secondary.main} 100%)`,
                },
              }}
            >
              {loading ? 'Adding...' : 'Add Visitor'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PageContainer>
  );
};

export default AllVisitors;
