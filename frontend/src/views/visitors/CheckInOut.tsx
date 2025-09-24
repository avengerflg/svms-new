import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Paper,
  Divider,
  Stack,
  Fade,
  Slide,
  Tooltip,
  InputAdornment,
  useTheme,
  alpha,
} from '@mui/material';
import {
  IconQrcode,
  IconCamera,
  IconUserCheck,
  IconUserX,
  IconClock,
  IconMapPin,
  IconId,
  IconCheck,
  IconAlertTriangle,
  IconRefresh,
  IconSearch,
  IconScan,
  IconUsers,
  IconLogin,
  IconLogout,
  IconEye,
} from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import { useAuth } from '../../context/AuthContext';
import { visitorAPI } from '../../services/api';

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
  department: string;
  status: 'pending' | 'approved' | 'checked-in' | 'checked-out' | 'rejected';
  checkInTime?: Date;
  checkOutTime?: Date;
  expectedDuration?: number;
  visitorCategory: string;
  school: string;
  badgeNumber?: string;
  approvalBy?: string;
  approvalDate?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CheckInOut: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'checkin' | 'checkout'>('checkin');
  const [searchTerm, setSearchTerm] = useState('');
  const [qrCodeDialogOpen, setQrCodeDialogOpen] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [checkInDialogOpen, setCheckInDialogOpen] = useState(false);
  const [checkOutDialogOpen, setCheckOutDialogOpen] = useState(false);
  const [currentlyInVisitors, setCurrentlyInVisitors] = useState<Visitor[]>([]);
  const [pendingVisitors, setPendingVisitors] = useState<Visitor[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  // Fetch visitors data
  const fetchVisitors = async () => {
    try {
      const response = await visitorAPI.getAllVisitors({
        page: 1,
        limit: 100,
      });

      const checkedInVisitors = response.visitors?.filter((v) => v.status === 'checked-in') || [];
      // Include both approved and pending visitors for check-in (excluding rejected and checked-out)
      const availableForCheckin =
        response.visitors?.filter((v) => v.status === 'approved' || v.status === 'pending') || [];

      setCurrentlyInVisitors(checkedInVisitors);
      setPendingVisitors(availableForCheckin);

      console.log('Fetched visitors:', response.visitors);
      console.log('Available for check-in:', availableForCheckin);
      console.log('Currently checked in:', checkedInVisitors);
    } catch (error) {
      console.error('Error fetching visitors:', error);
      // Fallback to mock data for testing
      setPendingVisitors(mockPendingVisitors);
      setCurrentlyInVisitors(mockCurrentVisitors);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  // Mock data kept for fallback - will be replaced by API data
  const mockCurrentVisitors: Visitor[] = [
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
      department: 'administration',
      status: 'checked-in',
      checkInTime: new Date('2024-03-15T09:30:00'),
      expectedDuration: 60,
      visitorCategory: 'Parent',
      school: 'Main Campus',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: '4',
      firstName: 'Sarah',
      lastName: 'Wilson',
      email: 'sarah.wilson@vendor.com',
      phone: '+1444555666',
      idType: 'National ID',
      idNumber: 'ID444555666',
      purposeOfVisit: 'Equipment Installation',
      personToMeet: 'IT Manager',
      department: 'information-technology',
      status: 'checked-in',
      checkInTime: new Date('2024-03-15T10:15:00'),
      expectedDuration: 180,
      visitorCategory: 'Vendor',
      school: 'Main Campus',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // Mock data for pending approval visitors
  const mockPendingVisitors: Visitor[] = [
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
      department: 'facilities',
      status: 'approved',
      expectedDuration: 120,
      visitorCategory: 'Contractor',
      school: 'Main Campus',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const handleQRScan = () => {
    setIsScanning(true);
    setQrCodeDialogOpen(true);

    // Simulate QR code scanning
    setTimeout(() => {
      setIsScanning(false);
      // Mock finding a visitor
      const foundVisitor = pendingVisitors[0];
      if (foundVisitor) {
        setSelectedVisitor(foundVisitor);
        setCheckInDialogOpen(true);
        setQrCodeDialogOpen(false);
      }
    }, 2000);
  };

  const handleCheckIn = async (visitor: Visitor) => {
    try {
      const response = await visitorAPI.checkIn(visitor._id);

      // Update local state
      setCurrentlyInVisitors((prev) => [...prev, response.visitor]);
      setPendingVisitors((prev) => prev.filter((v) => v._id !== visitor._id));
      setCheckInDialogOpen(false);
      setSelectedVisitor(null);

      // Refresh data
      fetchVisitors();
    } catch (error) {
      console.error('Error checking in visitor:', error);
    }
  };

  const handleCheckOut = async (visitor: Visitor) => {
    try {
      const response = await visitorAPI.checkOut(visitor._id);

      // Update local state
      setCurrentlyInVisitors((prev) => prev.filter((v) => v._id !== visitor._id));
      setCheckOutDialogOpen(false);
      setSelectedVisitor(null);

      // Refresh data
      fetchVisitors();
    } catch (error) {
      console.error('Error checking out visitor:', error);
    }
  };

  const openCheckOutDialog = (visitor: Visitor) => {
    setSelectedVisitor(visitor);
    setCheckOutDialogOpen(true);
  };

  const getTimeInBuilding = (checkInTime: Date | undefined) => {
    if (!checkInTime) return 'N/A';
    const now = new Date();
    const diff = now.getTime() - new Date(checkInTime).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const isOverstaying = (visitor: Visitor) => {
    if (!visitor.checkInTime || !visitor.expectedDuration) return false;
    const now = new Date();
    const checkIn = new Date(visitor.checkInTime);
    const expectedEnd = new Date(checkIn.getTime() + visitor.expectedDuration * 60000);
    return now > expectedEnd;
  };

  const theme = useTheme();

  return (
    <PageContainer title="Check In/Out" description="Visitor check-in and check-out management">
      <Box>
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
                Check In/Out Management
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Streamlined visitor check-in and check-out process with QR code scanning
              </Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              <Tooltip title="Scan visitor QR code">
                <Button
                  variant="contained"
                  startIcon={<IconQrcode />}
                  onClick={handleQRScan}
                  sx={{
                    bgcolor: alpha(theme.palette.common.white, 0.15),
                    '&:hover': { bgcolor: alpha(theme.palette.common.white, 0.25) },
                    backdropFilter: 'blur(10px)',
                    boxShadow: theme.shadows[4],
                  }}
                >
                  Scan QR Code
                </Button>
              </Tooltip>
              <Tooltip title="Manual search">
                <Button
                  variant="contained"
                  startIcon={<IconSearch />}
                  sx={{
                    bgcolor: theme.palette.secondary.main,
                    '&:hover': { bgcolor: theme.palette.secondary.dark },
                    boxShadow: theme.shadows[4],
                  }}
                >
                  Manual Search
                </Button>
              </Tooltip>
              <Tooltip title="Refresh data">
                <Button
                  variant="contained"
                  startIcon={<IconRefresh />}
                  onClick={fetchVisitors}
                  sx={{
                    bgcolor: theme.palette.info.main,
                    '&:hover': { bgcolor: theme.palette.info.dark },
                    boxShadow: theme.shadows[4],
                  }}
                >
                  Refresh
                </Button>
              </Tooltip>
            </Stack>
          </Stack>
        </Box>

        {/* Enhanced Tab Navigation */}
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
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant={activeTab === 'checkin' ? 'contained' : 'outlined'}
                onClick={() => setActiveTab('checkin')}
                startIcon={<IconLogin />}
                size="large"
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  ...(activeTab === 'checkin'
                    ? {
                        background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                        boxShadow: theme.shadows[4],
                        '&:hover': {
                          background: `linear-gradient(135deg, ${theme.palette.success.dark} 0%, ${theme.palette.success.main} 100%)`,
                        },
                      }
                    : {
                        borderColor: alpha(theme.palette.success.main, 0.5),
                        color: theme.palette.success.main,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.success.main, 0.08),
                          borderColor: theme.palette.success.main,
                        },
                      }),
                }}
              >
                Check In ({pendingVisitors.length})
              </Button>
              <Button
                variant={activeTab === 'checkout' ? 'contained' : 'outlined'}
                onClick={() => setActiveTab('checkout')}
                startIcon={<IconLogout />}
                size="large"
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  ...(activeTab === 'checkout'
                    ? {
                        background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
                        boxShadow: theme.shadows[4],
                        '&:hover': {
                          background: `linear-gradient(135deg, ${theme.palette.warning.dark} 0%, ${theme.palette.warning.main} 100%)`,
                        },
                      }
                    : {
                        borderColor: alpha(theme.palette.warning.main, 0.5),
                        color: theme.palette.warning.main,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.warning.main, 0.08),
                          borderColor: theme.palette.warning.main,
                        },
                      }),
                }}
              >
                Check Out ({currentlyInVisitors.length})
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Enhanced Check In Tab */}
        {activeTab === 'checkin' && (
          <Fade in={activeTab === 'checkin'} timeout={500}>
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      border: `1px solid ${alpha(theme.palette.success.main, 0.12)}`,
                      boxShadow: theme.shadows[3],
                      background: `linear-gradient(145deg, ${
                        theme.palette.background.paper
                      } 0%, ${alpha(theme.palette.success.light, 0.02)} 100%)`,
                    }}
                  >
                    <CardHeader
                      title={
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <IconUsers size={24} color={theme.palette.success.main} />
                          <Typography variant="h5" fontWeight={600} color="success.main">
                            Pending Check-In
                          </Typography>
                        </Stack>
                      }
                      action={
                        <Chip
                          label={`${pendingVisitors.length} visitors waiting`}
                          sx={{
                            background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                            color: 'white',
                            fontWeight: 600,
                          }}
                        />
                      }
                      sx={{ pb: 2 }}
                    />
                    <Divider sx={{ borderColor: alpha(theme.palette.success.main, 0.1) }} />
                    <CardContent sx={{ pt: 3 }}>
                      {pendingVisitors.length === 0 ? (
                        <Box textAlign="center" py={4}>
                          <Typography variant="body1" color="textSecondary">
                            No visitors pending check-in
                          </Typography>
                        </Box>
                      ) : (
                        <List>
                          {pendingVisitors.map((visitor, index) => (
                            <React.Fragment key={visitor._id}>
                              <ListItem
                                sx={{
                                  borderRadius: 2,
                                  mb: 2,
                                  p: 2,
                                  border: `1px solid ${alpha(theme.palette.success.main, 0.12)}`,
                                  background: `linear-gradient(145deg, ${alpha(
                                    theme.palette.success.light,
                                    0.02,
                                  )} 0%, ${theme.palette.background.paper} 100%)`,
                                  transition: 'all 0.3s ease-in-out',
                                  '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: theme.shadows[4],
                                    borderColor: alpha(theme.palette.success.main, 0.3),
                                  },
                                }}
                              >
                                <ListItemAvatar>
                                  <Avatar
                                    sx={{
                                      width: 48,
                                      height: 48,
                                      background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                                      fontWeight: 600,
                                      fontSize: 18,
                                    }}
                                  >
                                    {visitor.firstName[0]}
                                    {visitor.lastName[0]}
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                  primary={`${visitor.firstName} ${visitor.lastName}`}
                                  secondary={
                                    <Box>
                                      <Typography variant="body2">
                                        Purpose: {visitor.purposeOfVisit}
                                      </Typography>
                                      <Typography variant="body2">
                                        Meeting: {visitor.personToMeet}
                                      </Typography>
                                      <Typography variant="body2">
                                        Expected Duration: {visitor.expectedDuration} minutes
                                      </Typography>
                                      <Chip
                                        label={visitor.visitorCategory}
                                        sx={{
                                          mt: 1,
                                          background: `linear-gradient(135deg, ${alpha(
                                            theme.palette.success.main,
                                            0.2,
                                          )} 0%, ${alpha(theme.palette.success.dark, 0.1)} 100%)`,
                                          color: theme.palette.success.main,
                                          fontWeight: 600,
                                          border: `1px solid ${alpha(
                                            theme.palette.success.main,
                                            0.3,
                                          )}`,
                                        }}
                                      />
                                    </Box>
                                  }
                                />
                                <Box>
                                  <Stack direction="row" spacing={1}>
                                    <Tooltip title="Check in visitor">
                                      <Button
                                        variant="contained"
                                        startIcon={<IconUserCheck />}
                                        size="large"
                                        onClick={() => {
                                          setSelectedVisitor(visitor);
                                          setCheckInDialogOpen(true);
                                        }}
                                        sx={{
                                          background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                                          boxShadow: theme.shadows[3],
                                          borderRadius: 2,
                                          px: 3,
                                          '&:hover': {
                                            background: `linear-gradient(135deg, ${theme.palette.success.dark} 0%, ${theme.palette.success.main} 100%)`,
                                            boxShadow: theme.shadows[6],
                                          },
                                        }}
                                      >
                                        Check In
                                      </Button>
                                    </Tooltip>
                                    <Tooltip title="Verify identification">
                                      <Button
                                        variant="outlined"
                                        startIcon={<IconId />}
                                        sx={{
                                          borderColor: alpha(theme.palette.success.main, 0.5),
                                          color: theme.palette.success.main,
                                          borderRadius: 2,
                                          '&:hover': {
                                            backgroundColor: alpha(
                                              theme.palette.success.main,
                                              0.08,
                                            ),
                                            borderColor: theme.palette.success.main,
                                          },
                                        }}
                                      >
                                        Verify ID
                                      </Button>
                                    </Tooltip>
                                  </Stack>
                                </Box>
                              </ListItem>
                              {index < pendingVisitors.length - 1 && <Divider />}
                            </React.Fragment>
                          ))}
                        </List>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Fade>
        )}

        {/* Enhanced Check Out Tab */}
        {activeTab === 'checkout' && (
          <Fade in={activeTab === 'checkout'} timeout={500}>
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      border: `1px solid ${alpha(theme.palette.warning.main, 0.12)}`,
                      boxShadow: theme.shadows[3],
                      background: `linear-gradient(145deg, ${
                        theme.palette.background.paper
                      } 0%, ${alpha(theme.palette.warning.light, 0.02)} 100%)`,
                    }}
                  >
                    <CardHeader
                      title={
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <IconEye size={24} color={theme.palette.warning.main} />
                          <Typography variant="h5" fontWeight={600} color="warning.main">
                            Currently In Building
                          </Typography>
                        </Stack>
                      }
                      action={
                        <Chip
                          label={`${currentlyInVisitors.length} visitors inside`}
                          sx={{
                            background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
                            color: 'white',
                            fontWeight: 600,
                          }}
                        />
                      }
                      sx={{ pb: 2 }}
                    />
                    <Divider sx={{ borderColor: alpha(theme.palette.warning.main, 0.1) }} />
                    <CardContent sx={{ pt: 3 }}>
                      {currentlyInVisitors.length === 0 ? (
                        <Box textAlign="center" py={4}>
                          <Typography variant="body1" color="textSecondary">
                            No visitors currently in building
                          </Typography>
                        </Box>
                      ) : (
                        <List>
                          {currentlyInVisitors.map((visitor, index) => (
                            <React.Fragment key={visitor._id}>
                              <ListItem
                                sx={{
                                  borderRadius: 2,
                                  mb: 2,
                                  p: 2,
                                  border: `1px solid ${alpha(theme.palette.warning.main, 0.12)}`,
                                  background: `linear-gradient(145deg, ${alpha(
                                    theme.palette.warning.light,
                                    0.02,
                                  )} 0%, ${theme.palette.background.paper} 100%)`,
                                  transition: 'all 0.3s ease-in-out',
                                  '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: theme.shadows[4],
                                    borderColor: alpha(theme.palette.warning.main, 0.3),
                                  },
                                }}
                              >
                                <ListItemAvatar>
                                  <Avatar
                                    sx={{
                                      width: 48,
                                      height: 48,
                                      background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
                                      fontWeight: 600,
                                      fontSize: 18,
                                    }}
                                  >
                                    {visitor.firstName[0]}
                                    {visitor.lastName[0]}
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                  primary={
                                    <Box display="flex" alignItems="center" gap={1}>
                                      <Typography variant="subtitle1">
                                        {visitor.firstName} {visitor.lastName}
                                      </Typography>
                                      {isOverstaying(visitor) && (
                                        <Chip
                                          label="Overstaying"
                                          color="warning"
                                          icon={<IconAlertTriangle />}
                                        />
                                      )}
                                    </Box>
                                  }
                                  secondary={
                                    <Box>
                                      <Typography variant="body2">
                                        Purpose: {visitor.purposeOfVisit}
                                      </Typography>
                                      <Typography variant="body2">
                                        Meeting: {visitor.personToMeet}
                                      </Typography>
                                      <Typography variant="body2">
                                        Check-in:{' '}
                                        {visitor.checkInTime
                                          ? new Date(visitor.checkInTime).toLocaleTimeString()
                                          : 'N/A'}
                                      </Typography>
                                      <Typography variant="body2">
                                        Time in building: {getTimeInBuilding(visitor.checkInTime)}
                                      </Typography>
                                      <Box display="flex" gap={1} mt={1}>
                                        <Chip
                                          label={visitor.visitorCategory}
                                          sx={{
                                            background: `linear-gradient(135deg, ${alpha(
                                              theme.palette.warning.main,
                                              0.2,
                                            )} 0%, ${alpha(theme.palette.warning.dark, 0.1)} 100%)`,
                                            color: theme.palette.warning.main,
                                            fontWeight: 600,
                                            border: `1px solid ${alpha(
                                              theme.palette.warning.main,
                                              0.3,
                                            )}`,
                                          }}
                                        />
                                        <Chip
                                          label="IN BUILDING"
                                          sx={{
                                            background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                                            color: 'white',
                                            fontWeight: 600,
                                          }}
                                        />
                                      </Box>
                                    </Box>
                                  }
                                />
                                <Box>
                                  <Tooltip title="Check out visitor">
                                    <Button
                                      variant="contained"
                                      startIcon={<IconUserX />}
                                      onClick={() => openCheckOutDialog(visitor)}
                                      size="large"
                                      sx={{
                                        background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
                                        boxShadow: theme.shadows[3],
                                        borderRadius: 2,
                                        px: 3,
                                        '&:hover': {
                                          background: `linear-gradient(135deg, ${theme.palette.error.dark} 0%, ${theme.palette.error.main} 100%)`,
                                          boxShadow: theme.shadows[6],
                                        },
                                      }}
                                    >
                                      Check Out
                                    </Button>
                                  </Tooltip>
                                </Box>
                              </ListItem>
                              {index < currentlyInVisitors.length - 1 && <Divider />}
                            </React.Fragment>
                          ))}
                        </List>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Fade>
        )}

        {/* QR Code Scan Dialog */}
        <Dialog open={qrCodeDialogOpen} onClose={() => setQrCodeDialogOpen(false)}>
          <DialogTitle>QR Code Scanner</DialogTitle>
          <DialogContent>
            <Box textAlign="center" py={4}>
              {isScanning ? (
                <Box>
                  <IconQrcode size={100} />
                  <Typography variant="h6" mt={2}>
                    Scanning QR Code...
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Please hold the QR code steady
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <IconQrcode size={100} />
                  <Typography variant="h6" mt={2}>
                    Position QR Code in Frame
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    The camera will automatically detect the QR code
                  </Typography>
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setQrCodeDialogOpen(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>

        {/* Check In Confirmation Dialog */}
        <Dialog open={checkInDialogOpen} onClose={() => setCheckInDialogOpen(false)}>
          <DialogTitle>Confirm Check In</DialogTitle>
          <DialogContent>
            {selectedVisitor && (
              <Box>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Please verify visitor details before checking in
                </Alert>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Name
                    </Typography>
                    <Typography variant="body1">
                      {selectedVisitor.firstName} {selectedVisitor.lastName}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Phone
                    </Typography>
                    <Typography variant="body1">{selectedVisitor.phone}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Purpose
                    </Typography>
                    <Typography variant="body1">{selectedVisitor.purposeOfVisit}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Meeting With
                    </Typography>
                    <Typography variant="body1">{selectedVisitor.personToMeet}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Expected Duration
                    </Typography>
                    <Typography variant="body1">
                      {selectedVisitor.expectedDuration} minutes
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Category
                    </Typography>
                    <Typography variant="body1">{selectedVisitor.visitorCategory}</Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCheckInDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={() => selectedVisitor && handleCheckIn(selectedVisitor)}
              startIcon={<IconCheck />}
            >
              Confirm Check In
            </Button>
          </DialogActions>
        </Dialog>

        {/* Check Out Confirmation Dialog */}
        <Dialog open={checkOutDialogOpen} onClose={() => setCheckOutDialogOpen(false)}>
          <DialogTitle>Confirm Check Out</DialogTitle>
          <DialogContent>
            {selectedVisitor && (
              <Box>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Visitor will be checked out of the building
                </Alert>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Name
                    </Typography>
                    <Typography variant="body1">
                      {selectedVisitor.firstName} {selectedVisitor.lastName}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Check In Time
                    </Typography>
                    <Typography variant="body1">
                      {selectedVisitor.checkInTime
                        ? new Date(selectedVisitor.checkInTime).toLocaleString()
                        : 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Time in Building
                    </Typography>
                    <Typography variant="body1">
                      {getTimeInBuilding(selectedVisitor.checkInTime)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Purpose
                    </Typography>
                    <Typography variant="body1">{selectedVisitor.purposeOfVisit}</Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCheckOutDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={() => selectedVisitor && handleCheckOut(selectedVisitor)}
              startIcon={<IconCheck />}
              color="primary"
            >
              Confirm Check Out
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PageContainer>
  );
};

export default CheckInOut;
