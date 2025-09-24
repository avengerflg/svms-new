import React, { useState, useRef, useEffect } from 'react';
import { visitorAPI } from '../../services/api';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Badge,
} from '@mui/material';
import {
  IconSearch,
  IconDownload,
  IconQrcode,
  IconUser,
  IconCalendar,
  IconClock,
  IconMapPin,
  IconId,
  IconRefresh,
  IconEdit,
  IconEye,
} from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import { useAuth } from '../../context/AuthContext';

interface Visitor {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  photo?: string;
  purposeOfVisit: string;
  personToMeet: string;
  status: 'checked-in' | 'checked-out' | 'pending' | 'approved';
  checkInTime?: Date;
  expectedDuration?: number;
  visitorCategory: string;
  badgeNumber?: string;
  qrCode?: string;
  department: string;
}

interface BadgeTemplate {
  id: string;
  name: string;
  color: string;
  layout: 'standard' | 'minimal' | 'detailed';
}

const VisitorBadges: React.FC = () => {
  const { user } = useAuth();
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [badgeDialogOpen, setBadgeDialogOpen] = useState(false);
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('standard');
  const badgeRef = useRef<HTMLDivElement>(null);

  const badgeTemplates: BadgeTemplate[] = [
    { id: 'standard', name: 'Standard Badge', color: '#1976d2', layout: 'standard' },
    { id: 'visitor', name: 'Visitor Badge', color: '#2e7d32', layout: 'minimal' },
    { id: 'contractor', name: 'Contractor Badge', color: '#ed6c02', layout: 'detailed' },
    { id: 'vip', name: 'VIP Badge', color: '#9c27b0', layout: 'detailed' },
  ];

  // Mock visitor data
  const mockVisitors: Visitor[] = [
    {
      _id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      purposeOfVisit: 'Parent Meeting',
      personToMeet: 'Mrs. Smith',
      status: 'checked-in',
      checkInTime: new Date(),
      expectedDuration: 60,
      visitorCategory: 'Parent',
      badgeNumber: 'V001',
      qrCode: 'QR_V001_20240315',
      department: 'Administration',
    },
    {
      _id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@contractor.com',
      phone: '+1987654321',
      purposeOfVisit: 'Maintenance Work',
      personToMeet: 'Facilities Manager',
      status: 'pending',
      expectedDuration: 120,
      visitorCategory: 'Contractor',
      badgeNumber: 'V002',
      qrCode: 'QR_V002_20240315',
      department: 'Facilities',
    },
    {
      _id: '3',
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike.johnson@vendor.com',
      phone: '+1555666777',
      purposeOfVisit: 'Equipment Delivery',
      personToMeet: 'IT Department',
      status: 'approved',
      expectedDuration: 90,
      visitorCategory: 'Vendor',
      badgeNumber: 'V003',
      qrCode: 'QR_V003_20240315',
      department: 'IT',
    },
  ];

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const response = await visitorAPI.getAllVisitors({
        page: 1,
        limit: 100,
        status: 'checked-in,approved', // Get visitors who can have badges
      });

      setVisitors(response.visitors || []);
    } catch (error) {
      console.error('Error fetching visitors:', error);
      // Fallback to mock data if API fails
      setVisitors(mockVisitors);
    }
  };

  const filteredVisitors = visitors.filter((visitor) => {
    const matchesSearch =
      visitor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.badgeNumber?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || visitor.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleGenerateBadge = (visitor: Visitor) => {
    setSelectedVisitor(visitor);
    setBadgeDialogOpen(true);
  };

  const handlePrintBadge = () => {
    if (selectedVisitor) {
      setPrintDialogOpen(true);
    }
  };

  const handleDownloadBadge = () => {
    // Implementation for downloading badge as image/PDF
    console.log('Download badge for:', selectedVisitor?.firstName);
  };

  const getBadgeColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'parent':
        return '#1976d2';
      case 'contractor':
        return '#ed6c02';
      case 'vendor':
        return '#2e7d32';
      case 'vip':
        return '#9c27b0';
      default:
        return '#757575';
    }
  };

  const getStatusChipColor = (status: string) => {
    switch (status) {
      case 'checked-in':
        return 'success';
      case 'pending':
        return 'warning';
      case 'approved':
        return 'info';
      default:
        return 'default';
    }
  };

  const BadgePreview = ({ visitor, template }: { visitor: Visitor; template: string }) => {
    const templateConfig = badgeTemplates.find((t) => t.id === template);
    const badgeColor = getBadgeColor(visitor.visitorCategory);

    return (
      <Paper
        ref={badgeRef}
        sx={{
          width: 300,
          height: 400,
          p: 2,
          border: `3px solid ${badgeColor}`,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            width: '100%',
            bgcolor: badgeColor,
            color: 'white',
            p: 1,
            borderRadius: 1,
            mb: 2,
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" fontSize="14px" fontWeight="bold">
            VISITOR BADGE
          </Typography>
          <Typography variant="caption" fontSize="10px">
            {user?.school?.name || 'School Name'}
          </Typography>
        </Box>

        {/* Photo */}
        <Avatar
          src={visitor.photo}
          sx={{
            width: 80,
            height: 80,
            mb: 2,
            border: `2px solid ${badgeColor}`,
          }}
        >
          {visitor.firstName[0]}
          {visitor.lastName[0]}
        </Avatar>

        {/* Visitor Info */}
        <Box textAlign="center" mb={2}>
          <Typography variant="h6" fontSize="16px" fontWeight="bold">
            {visitor.firstName} {visitor.lastName}
          </Typography>
          <Typography variant="body2" fontSize="12px" color="textSecondary">
            {visitor.visitorCategory}
          </Typography>
        </Box>

        {/* Details */}
        <Box width="100%" fontSize="10px">
          <Typography variant="body2" fontSize="10px">
            <strong>Badge #:</strong> {visitor.badgeNumber}
          </Typography>
          <Typography variant="body2" fontSize="10px">
            <strong>Purpose:</strong> {visitor.purposeOfVisit}
          </Typography>
          <Typography variant="body2" fontSize="10px">
            <strong>Meeting:</strong> {visitor.personToMeet}
          </Typography>
          <Typography variant="body2" fontSize="10px">
            <strong>Department:</strong> {visitor.department}
          </Typography>
          <Typography variant="body2" fontSize="10px">
            <strong>Date:</strong> {new Date().toLocaleDateString()}
          </Typography>
          {visitor.checkInTime && (
            <Typography variant="body2" fontSize="10px">
              <strong>Check In:</strong> {new Date(visitor.checkInTime).toLocaleTimeString()}
            </Typography>
          )}
        </Box>

        {/* QR Code */}
        <Box
          sx={{
            mt: 2,
            p: 1,
            bgcolor: 'white',
            border: '1px solid #ddd',
            borderRadius: 1,
            textAlign: 'center',
          }}
        >
          <IconQrcode size={60} />
          <Typography variant="caption" fontSize="8px" display="block">
            {visitor.qrCode}
          </Typography>
        </Box>

        {/* Footer */}
        <Box mt="auto" textAlign="center">
          <Typography variant="caption" fontSize="8px" color="textSecondary">
            This badge must be worn visibly at all times
          </Typography>
        </Box>
      </Paper>
    );
  };

  return (
    <PageContainer title="Visitor Badges" description="Generate and manage visitor badges">
      <Box>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Visitor Badges
          </Typography>
          <Box display="flex" gap={2}>
            <Button variant="outlined" startIcon={<IconRefresh />}>
              Refresh
            </Button>
            <Button variant="contained" startIcon={<IconDownload />} color="primary">
              Bulk Print
            </Button>
          </Box>
        </Box>

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search by name, email, or badge number..."
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
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Visitors List */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Visitors Requiring Badges ({filteredVisitors.length})
            </Typography>

            {filteredVisitors.length === 0 ? (
              <Box textAlign="center" py={4}>
                <Typography variant="body1" color="textSecondary">
                  No visitors found matching your criteria
                </Typography>
              </Box>
            ) : (
              <List>
                {filteredVisitors.map((visitor, index) => (
                  <React.Fragment key={visitor._id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Badge
                          badgeContent={visitor.badgeNumber}
                          color="primary"
                          overlap="circular"
                        >
                          <Avatar src={visitor.photo}>
                            {visitor.firstName[0]}
                            {visitor.lastName[0]}
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={2}>
                            <Typography variant="subtitle1">
                              {visitor.firstName} {visitor.lastName}
                            </Typography>
                            <Chip
                              label={visitor.status.replace('-', ' ').toUpperCase()}
                              color={getStatusChipColor(visitor.status) as any}
                            />
                            <Chip label={visitor.visitorCategory} variant="outlined" />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2">
                              Purpose: {visitor.purposeOfVisit}
                            </Typography>
                            <Typography variant="body2">
                              Meeting: {visitor.personToMeet} ({visitor.department})
                            </Typography>
                            <Typography variant="body2">
                              Badge #: {visitor.badgeNumber} | Phone: {visitor.phone}
                            </Typography>
                          </Box>
                        }
                      />
                      <Box display="flex" gap={1}>
                        <IconButton
                          onClick={() => handleGenerateBadge(visitor)}
                          title="Generate Badge"
                        >
                          <IconId />
                        </IconButton>
                        <IconButton onClick={() => handleGenerateBadge(visitor)} title="View Badge">
                          <IconEye />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            setSelectedVisitor(visitor);
                            setPrintDialogOpen(true);
                          }}
                          title="Print Badge"
                        >
                          <IconDownload />
                        </IconButton>
                        <IconButton title="Download Badge">
                          <IconDownload />
                        </IconButton>
                      </Box>
                    </ListItem>
                    {index < filteredVisitors.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </CardContent>
        </Card>

        {/* Badge Generation Dialog */}
        <Dialog
          open={badgeDialogOpen}
          onClose={() => setBadgeDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Generate Visitor Badge</DialogTitle>
          <DialogContent>
            {selectedVisitor && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box mb={3}>
                    <Typography variant="h6" gutterBottom>
                      Badge Template
                    </Typography>
                    <FormControl fullWidth>
                      <InputLabel>Select Template</InputLabel>
                      <Select
                        value={selectedTemplate}
                        label="Select Template"
                        onChange={(e) => setSelectedTemplate(e.target.value)}
                      >
                        {badgeTemplates.map((template) => (
                          <MenuItem key={template.id} value={template.id}>
                            <Box display="flex" alignItems="center" gap={2}>
                              <Box
                                sx={{
                                  width: 20,
                                  height: 20,
                                  bgcolor: template.color,
                                  borderRadius: 1,
                                }}
                              />
                              {template.name}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Visitor Information
                    </Typography>
                    <Typography variant="body2">
                      <strong>Name:</strong> {selectedVisitor.firstName} {selectedVisitor.lastName}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Category:</strong> {selectedVisitor.visitorCategory}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Purpose:</strong> {selectedVisitor.purposeOfVisit}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Meeting:</strong> {selectedVisitor.personToMeet}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Badge Number:</strong> {selectedVisitor.badgeNumber}
                    </Typography>
                    <Typography variant="body2">
                      <strong>QR Code:</strong> {selectedVisitor.qrCode}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box textAlign="center">
                    <Typography variant="h6" gutterBottom>
                      Badge Preview
                    </Typography>
                    <BadgePreview visitor={selectedVisitor} template={selectedTemplate} />
                  </Box>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBadgeDialogOpen(false)}>Cancel</Button>
            <Button variant="outlined" onClick={handleDownloadBadge} startIcon={<IconDownload />}>
              Download
            </Button>
            <Button variant="contained" onClick={handlePrintBadge} startIcon={<IconDownload />}>
              Print Badge
            </Button>
          </DialogActions>
        </Dialog>

        {/* Print Dialog */}
        <Dialog
          open={printDialogOpen}
          onClose={() => setPrintDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Print Badge</DialogTitle>
          <DialogContent>
            <Alert severity="info" sx={{ mb: 2 }}>
              Please ensure your printer is ready and loaded with badge paper.
            </Alert>

            <Typography variant="body1" paragraph>
              Badge will be printed for:{' '}
              <strong>
                {selectedVisitor?.firstName} {selectedVisitor?.lastName}
              </strong>
            </Typography>

            <Typography variant="body2" color="textSecondary">
              Print Settings:
            </Typography>
            <Typography variant="body2">• Paper Size: Badge (54mm x 86mm)</Typography>
            <Typography variant="body2">• Quality: High</Typography>
            <Typography variant="body2">• Orientation: Portrait</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPrintDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              startIcon={<IconDownload />}
              onClick={() => {
                // Handle actual printing
                console.log('Printing badge...');
                setPrintDialogOpen(false);
              }}
            >
              Print Now
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PageContainer>
  );
};

export default VisitorBadges;
