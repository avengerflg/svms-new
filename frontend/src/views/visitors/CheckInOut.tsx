import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
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
      const approvedVisitors = response.visitors?.filter((v) => v.status === 'approved') || [];

      setCurrentlyInVisitors(checkedInVisitors);
      setPendingVisitors(approvedVisitors);
    } catch (error) {
      console.error('Error fetching visitors:', error);
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

  return (
    <PageContainer title="Check In/Out" description="Visitor check-in and check-out management">
      <Box>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Check In/Out Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<IconQrcode />}
            onClick={handleQRScan}
            color="primary"
          >
            Scan QR Code
          </Button>
        </Box>

        {/* Tab Navigation */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Box display="flex" gap={2}>
            <Button
              variant={activeTab === 'checkin' ? 'contained' : 'outlined'}
              onClick={() => setActiveTab('checkin')}
              startIcon={<IconUserCheck />}
            >
              Check In ({pendingVisitors.length})
            </Button>
            <Button
              variant={activeTab === 'checkout' ? 'contained' : 'outlined'}
              onClick={() => setActiveTab('checkout')}
              startIcon={<IconUserX />}
            >
              Check Out ({currentlyInVisitors.length})
            </Button>
          </Box>
        </Box>

        {/* Check In Tab */}
        {activeTab === 'checkin' && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="between" alignItems="center" mb={3}>
                    <Typography variant="h6">Pending Check-In</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {pendingVisitors.length} visitors waiting
                    </Typography>
                  </Box>

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
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar>
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
                                  <Chip label={visitor.visitorCategory} sx={{ mt: 1 }} />
                                </Box>
                              }
                            />
                            <Box>
                              <Button
                                variant="contained"
                                startIcon={<IconUserCheck />}
                                onClick={() => {
                                  setSelectedVisitor(visitor);
                                  setCheckInDialogOpen(true);
                                }}
                                sx={{ mr: 1 }}
                              >
                                Check In
                              </Button>
                              <Button variant="outlined" startIcon={<IconId />}>
                                Verify ID
                              </Button>
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
        )}

        {/* Check Out Tab */}
        {activeTab === 'checkout' && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h6">Currently In Building</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {currentlyInVisitors.length} visitors in building
                    </Typography>
                  </Box>

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
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar>
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
                                    <Chip label={visitor.visitorCategory} />
                                    <Chip label="IN BUILDING" color="success" />
                                  </Box>
                                </Box>
                              }
                            />
                            <Box>
                              <Button
                                variant="contained"
                                startIcon={<IconUserX />}
                                onClick={() => openCheckOutDialog(visitor)}
                                color="primary"
                              >
                                Check Out
                              </Button>
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
