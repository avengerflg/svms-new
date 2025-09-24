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
  FormControlLabel,
  Switch,
  DatePicker,
  TimePicker,
  TextareaAutosize,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Autocomplete,
} from '@mui/material'; 
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
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
  IconPlus,
  IconEdit,
  IconTrash,
  IconUsers,
  IconVideo,
  IconLocation,
  IconBuilding,
  IconTime,
  IconRepeat,
} from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import { useAuth } from '../../context/AuthContext';

interface Appointment {
  id: string;
  title: string;
  description?: string;
  type: 'meeting' | 'interview' | 'conference' | 'consultation' | 'training' | 'other';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  organizer: {
    id: string;
    name: string;
    email: string;
    department: string;
  };
  attendees: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'invited' | 'accepted' | 'declined' | 'tentative';
    required: boolean;
  }[];
  visitors?: {
    name: string;
    email?: string;
    phone?: string;
    organization?: string;
  }[];
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  location: {
    type: 'room' | 'office' | 'virtual' | 'external';
    name: string;
    address?: string;
    virtualLink?: string;
    capacity?: number;
  };
  recurrence?: {
    type: 'none' | 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate?: Date;
    occurrences?: number;
  };
  resources?: string[];
  reminders: {
    time: number; // minutes before
    method: 'email' | 'notification' | 'sms';
  }[];
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
  attachments?: string[];
  isPrivate: boolean;
  requiresApproval: boolean;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
}

const Appointments: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [view, setView] = useState<'list' | 'calendar' | 'agenda'>('list');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning',
  });
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    priority: 'all',
    timeRange: 'upcoming',
    organizer: 'all',
  });

  // New appointment form state
  const [newAppointment, setNewAppointment] = useState<Partial<Appointment>>({
    title: '',
    description: '',
    type: 'meeting',
    priority: 'medium',
    startTime: new Date(),
    endTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
    location: { type: 'room', name: '' },
    attendees: [],
    visitors: [],
    reminders: [{ time: 15, method: 'email' }],
    isPrivate: false,
    requiresApproval: false,
    recurrence: { type: 'none', interval: 1 },
    resources: [],
  });

  // Mock appointment data
  const mockAppointments: Appointment[] = [
    {
      id: 'apt_001',
      title: 'Parent-Teacher Conference',
      description: 'Quarterly progress discussion for mathematics class',
      type: 'conference',
      status: 'scheduled',
      priority: 'medium',
      organizer: {
        id: 'teacher_001',
        name: 'Dr. Sarah Wilson',
        email: 'sarah.wilson@school.edu',
        department: 'Mathematics Department',
      },
      attendees: [
        {
          id: 'teacher_001',
          name: 'Dr. Sarah Wilson',
          email: 'sarah.wilson@school.edu',
          role: 'Teacher',
          status: 'accepted',
          required: true,
        },
      ],
      visitors: [
        {
          name: 'John Smith',
          email: 'john.smith@email.com',
          phone: '+1-555-0123',
          organization: 'Parent',
        },
        {
          name: 'Mary Smith',
          email: 'mary.smith@email.com',
          phone: '+1-555-0124',
          organization: 'Parent',
        },
      ],
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 30 * 60 * 1000), // 30 min meeting
      duration: 30,
      location: {
        type: 'room',
        name: 'Classroom 201',
        capacity: 30,
      },
      reminders: [
        { time: 60, method: 'email' },
        { time: 15, method: 'notification' },
      ],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      isPrivate: false,
      requiresApproval: false,
    },
    {
      id: 'apt_002',
      title: 'Job Interview - Mathematics Teacher',
      description: 'Interview for senior mathematics teacher position',
      type: 'interview',
      status: 'confirmed',
      priority: 'high',
      organizer: {
        id: 'hr_001',
        name: 'Dr. Michael Brown',
        email: 'michael.brown@school.edu',
        department: 'Human Resources',
      },
      attendees: [
        {
          id: 'hr_001',
          name: 'Dr. Michael Brown',
          email: 'michael.brown@school.edu',
          role: 'HR Manager',
          status: 'accepted',
          required: true,
        },
        {
          id: 'principal_001',
          name: 'Dr. Emily Davis',
          email: 'emily.davis@school.edu',
          role: 'Principal',
          status: 'accepted',
          required: true,
        },
        {
          id: 'dept_head_001',
          name: 'Prof. Robert Johnson',
          email: 'robert.johnson@school.edu',
          role: 'Department Head',
          status: 'tentative',
          required: false,
        },
      ],
      visitors: [
        {
          name: 'Lisa Johnson',
          email: 'lisa.johnson@email.com',
          phone: '+1-555-0789',
          organization: 'Candidate',
        },
      ],
      startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000), // 90 min interview
      duration: 90,
      location: {
        type: 'room',
        name: 'Conference Room A',
        capacity: 10,
      },
      reminders: [
        { time: 120, method: 'email' },
        { time: 30, method: 'notification' },
      ],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      notes: 'Candidate has 15 years of experience in secondary education',
      isPrivate: false,
      requiresApproval: true,
      approvalStatus: 'approved',
    },
    {
      id: 'apt_003',
      title: 'Weekly Staff Meeting',
      description: 'Regular departmental coordination meeting',
      type: 'meeting',
      status: 'scheduled',
      priority: 'medium',
      organizer: {
        id: 'principal_001',
        name: 'Dr. Emily Davis',
        email: 'emily.davis@school.edu',
        department: 'Administration',
      },
      attendees: [
        {
          id: 'teacher_001',
          name: 'Dr. Sarah Wilson',
          email: 'sarah.wilson@school.edu',
          role: 'Teacher',
          status: 'accepted',
          required: true,
        },
        {
          id: 'teacher_002',
          name: 'Prof. Robert Johnson',
          email: 'robert.johnson@school.edu',
          role: 'Teacher',
          status: 'accepted',
          required: true,
        },
        {
          id: 'coordinator_001',
          name: 'Ms. Jennifer Lee',
          email: 'jennifer.lee@school.edu',
          role: 'Coordinator',
          status: 'declined',
          required: false,
        },
      ],
      startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // 1 hour meeting
      duration: 60,
      location: {
        type: 'room',
        name: 'Staff Lounge',
        capacity: 20,
      },
      recurrence: {
        type: 'weekly',
        interval: 1,
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 3 months
      },
      resources: ['Projector', 'Whiteboard', 'WiFi'],
      reminders: [{ time: 30, method: 'email' }],
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      isPrivate: false,
      requiresApproval: false,
    },
    {
      id: 'apt_004',
      title: 'Virtual Training Session',
      description: 'Online training for new learning management system',
      type: 'training',
      status: 'scheduled',
      priority: 'high',
      organizer: {
        id: 'it_001',
        name: 'Alex Martinez',
        email: 'alex.martinez@school.edu',
        department: 'IT Department',
      },
      attendees: [
        {
          id: 'teacher_001',
          name: 'Dr. Sarah Wilson',
          email: 'sarah.wilson@school.edu',
          role: 'Teacher',
          status: 'invited',
          required: true,
        },
        {
          id: 'teacher_002',
          name: 'Prof. Robert Johnson',
          email: 'robert.johnson@school.edu',
          role: 'Teacher',
          status: 'invited',
          required: true,
        },
      ],
      startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 120 * 60 * 1000), // 2 hour training
      duration: 120,
      location: {
        type: 'virtual',
        name: 'Zoom Meeting',
        virtualLink: 'https://zoom.us/j/123456789',
      },
      reminders: [
        { time: 60, method: 'email' },
        { time: 15, method: 'notification' },
      ],
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      isPrivate: false,
      requiresApproval: false,
    },
  ];

  useEffect(() => {
    setAppointments(mockAppointments);
    setFilteredAppointments(mockAppointments);
  }, []);

  useEffect(() => {
    let filtered = appointments.filter((appointment) => {
      const matchesSearch =
        appointment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.organizer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.location.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filters.status === 'all' || appointment.status === filters.status;
      const matchesType = filters.type === 'all' || appointment.type === filters.type;
      const matchesPriority =
        filters.priority === 'all' || appointment.priority === filters.priority;
      const matchesOrganizer =
        filters.organizer === 'all' || appointment.organizer.id === filters.organizer;

      // Time range filtering
      let matchesTimeRange = true;
      const now = new Date();
      const startTime = appointment.startTime;

      switch (filters.timeRange) {
        case 'today':
          matchesTimeRange = startTime.toDateString() === now.toDateString();
          break;
        case 'upcoming':
          matchesTimeRange = startTime >= now;
          break;
        case 'week':
          const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          matchesTimeRange = startTime >= now && startTime <= weekFromNow;
          break;
        case 'month':
          const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          matchesTimeRange = startTime >= now && startTime <= monthFromNow;
          break;
        case 'past':
          matchesTimeRange = startTime < now;
          break;
      }

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType &&
        matchesPriority &&
        matchesOrganizer &&
        matchesTimeRange
      );
    });

    setFilteredAppointments(filtered);
    setPage(0);
  }, [appointments, searchTerm, filters]);

  const handleCreateAppointment = () => {
    const appointment: Appointment = {
      id: `apt_${Date.now()}`,
      ...(newAppointment as Appointment),
      organizer: {
        id: user?.id || 'current_user',
        name: user?.name || 'Current User',
        email: user?.email || 'user@school.edu',
        department: user?.department || 'Administration',
      },
      status: 'scheduled',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setAppointments((prev) => [...prev, appointment]);
    setNewAppointment({
      title: '',
      description: '',
      type: 'meeting',
      priority: 'medium',
      startTime: new Date(),
      endTime: new Date(Date.now() + 60 * 60 * 1000),
      location: { type: 'room', name: '' },
      attendees: [],
      visitors: [],
      reminders: [{ time: 15, method: 'email' }],
      isPrivate: false,
      requiresApproval: false,
      recurrence: { type: 'none', interval: 1 },
      resources: [],
    });
    setShowCreateDialog(false);
    setCurrentStep(0);
    setSnackbar({ open: true, message: 'Appointment created successfully', severity: 'success' });
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((appointment) =>
        appointment.id === id
          ? { ...appointment, status: 'cancelled', updatedAt: new Date() }
          : appointment,
      ),
    );
    setSnackbar({ open: true, message: 'Appointment cancelled', severity: 'warning' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'scheduled':
        return 'info';
      case 'completed':
        return 'success';
      case 'rescheduled':
        return 'warning';
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

  const renderCreateAppointmentDialog = () => (
    <Dialog
      open={showCreateDialog}
      onClose={() => setShowCreateDialog(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Create New Appointment</DialogTitle>
      <DialogContent>
        <Stepper activeStep={currentStep} orientation="vertical">
          <Step>
            <StepLabel>Basic Information</StepLabel>
            <StepContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Title"
                    value={newAppointment.title}
                    onChange={(e) =>
                      setNewAppointment({ ...newAppointment, title: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={3}
                    value={newAppointment.description}
                    onChange={(e) =>
                      setNewAppointment({ ...newAppointment, description: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select
                      value={newAppointment.type}
                      onChange={(e) =>
                        setNewAppointment({ ...newAppointment, type: e.target.value as any })
                      }
                    >
                      <MenuItem value="meeting">Meeting</MenuItem>
                      <MenuItem value="interview">Interview</MenuItem>
                      <MenuItem value="conference">Conference</MenuItem>
                      <MenuItem value="consultation">Consultation</MenuItem>
                      <MenuItem value="training">Training</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={newAppointment.priority}
                      onChange={(e) =>
                        setNewAppointment({ ...newAppointment, priority: e.target.value as any })
                      }
                    >
                      <MenuItem value="low">Low</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                      <MenuItem value="urgent">Urgent</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => setCurrentStep(1)}
                  disabled={!newAppointment.title}
                >
                  Next
                </Button>
              </Box>
            </StepContent>
          </Step>

          <Step>
            <StepLabel>Date & Time</StepLabel>
            <StepContent>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <DateTimePicker
                      label="Start Time"
                      value={newAppointment.startTime}
                      onChange={(newValue) => {
                        if (newValue) {
                          setNewAppointment({
                            ...newAppointment,
                            startTime: newValue,
                            endTime: new Date(newValue.getTime() + 60 * 60 * 1000), // Default 1 hour
                          });
                        }
                      }}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <DateTimePicker
                      label="End Time"
                      value={newAppointment.endTime}
                      onChange={(newValue) => {
                        if (newValue) {
                          setNewAppointment({ ...newAppointment, endTime: newValue });
                        }
                      }}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={newAppointment.recurrence?.type !== 'none'}
                          onChange={(e) =>
                            setNewAppointment({
                              ...newAppointment,
                              recurrence: {
                                ...newAppointment.recurrence!,
                                type: e.target.checked ? 'weekly' : 'none',
                              },
                            })
                          }
                        />
                      }
                      label="Recurring Appointment"
                    />
                  </Grid>
                  {newAppointment.recurrence?.type !== 'none' && (
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Recurrence</InputLabel>
                        <Select
                          value={newAppointment.recurrence?.type}
                          onChange={(e) =>
                            setNewAppointment({
                              ...newAppointment,
                              recurrence: {
                                ...newAppointment.recurrence!,
                                type: e.target.value as any,
                              },
                            })
                          }
                        >
                          <MenuItem value="daily">Daily</MenuItem>
                          <MenuItem value="weekly">Weekly</MenuItem>
                          <MenuItem value="monthly">Monthly</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  )}
                </Grid>
              </LocalizationProvider>
              <Box sx={{ mt: 2 }}>
                <Button onClick={() => setCurrentStep(0)} sx={{ mr: 1 }}>
                  Back
                </Button>
                <Button variant="contained" onClick={() => setCurrentStep(2)}>
                  Next
                </Button>
              </Box>
            </StepContent>
          </Step>

          <Step>
            <StepLabel>Location & Settings</StepLabel>
            <StepContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Location Type</InputLabel>
                    <Select
                      value={newAppointment.location?.type}
                      onChange={(e) =>
                        setNewAppointment({
                          ...newAppointment,
                          location: {
                            ...newAppointment.location!,
                            type: e.target.value as any,
                          },
                        })
                      }
                    >
                      <MenuItem value="room">Room</MenuItem>
                      <MenuItem value="office">Office</MenuItem>
                      <MenuItem value="virtual">Virtual</MenuItem>
                      <MenuItem value="external">External</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Location Name"
                    value={newAppointment.location?.name}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        location: {
                          ...newAppointment.location!,
                          name: e.target.value,
                        },
                      })
                    }
                  />
                </Grid>
                {newAppointment.location?.type === 'virtual' && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Virtual Meeting Link"
                      value={newAppointment.location?.virtualLink || ''}
                      onChange={(e) =>
                        setNewAppointment({
                          ...newAppointment,
                          location: {
                            ...newAppointment.location!,
                            virtualLink: e.target.value,
                          },
                        })
                      }
                    />
                  </Grid>
                )}
                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={newAppointment.isPrivate}
                        onChange={(e) =>
                          setNewAppointment({ ...newAppointment, isPrivate: e.target.checked })
                        }
                      />
                    }
                    label="Private Appointment"
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={newAppointment.requiresApproval}
                        onChange={(e) =>
                          setNewAppointment({
                            ...newAppointment,
                            requiresApproval: e.target.checked,
                          })
                        }
                      />
                    }
                    label="Requires Approval"
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 2 }}>
                <Button onClick={() => setCurrentStep(1)} sx={{ mr: 1 }}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleCreateAppointment}
                  disabled={!newAppointment.location?.name}
                >
                  Create Appointment
                </Button>
              </Box>
            </StepContent>
          </Step>
        </Stepper>
      </DialogContent>
    </Dialog>
  );

  const renderAppointmentsList = () => (
    <Box>
      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Search appointments..."
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
                  <MenuItem value="scheduled">Scheduled</MenuItem>
                  <MenuItem value="confirmed">Confirmed</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="meeting">Meeting</MenuItem>
                  <MenuItem value="interview">Interview</MenuItem>
                  <MenuItem value="conference">Conference</MenuItem>
                  <MenuItem value="training">Training</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
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
                <InputLabel>Time Range</InputLabel>
                <Select
                  value={filters.timeRange}
                  onChange={(e) => setFilters({ ...filters, timeRange: e.target.value })}
                >
                  <MenuItem value="all">All Time</MenuItem>
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="upcoming">Upcoming</MenuItem>
                  <MenuItem value="week">This Week</MenuItem>
                  <MenuItem value="month">This Month</MenuItem>
                  <MenuItem value="past">Past</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={1}>
              <Typography variant="body2" color="textSecondary">
                {filteredAppointments.length} appointments
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Organizer</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Attendees</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAppointments
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((appointment) => (
                  <TableRow key={appointment.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {appointment.title}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)}
                        </Typography>
                        {appointment.recurrence?.type !== 'none' && (
                          <Chip
                            label={<IconRepeat xs={12} />}
                           
                            variant="outlined"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar>
                          <IconUser />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {appointment.organizer.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {appointment.organizer.department}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          <IconCalendar xs={16} style={{ marginRight: 4 }} />
                          {appointment.startTime.toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2">
                          <IconClock xs={16} style={{ marginRight: 4 }} />
                          {appointment.startTime.toLocaleTimeString()} -{' '}
                          {appointment.endTime.toLocaleTimeString()}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {appointment.duration} minutes
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {appointment.location.type === 'virtual' ? (
                            <IconVideo xs={16} />
                          ) : (
                            <IconMapPin xs={16} />
                          )}
                          <span style={{ marginLeft: 4 }}>{appointment.location.name}</span>
                        </Typography>
                        {appointment.location.virtualLink && (
                          <Typography variant="caption" color="primary">
                            Virtual Meeting
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body2">
                          {appointment.attendees.length} staff
                        </Typography>
                        {appointment.visitors && appointment.visitors.length > 0 && (
                          <Typography variant="body2" color="textSecondary">
                            + {appointment.visitors.length} visitors
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={appointment.priority.toUpperCase()}
                        color={getPriorityColor(appointment.priority) as any}
                       
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={appointment.status.toUpperCase()}
                        color={getStatusColor(appointment.status) as any}
                       
                      />
                      {appointment.requiresApproval && appointment.approvalStatus && (
                        <Typography variant="caption" display="block" color="textSecondary">
                          {appointment.approvalStatus}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" gap={1}>
                        <Tooltip title="View Details">
                          <IconButton
                           
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setShowDialog(true);
                            }}
                          >
                            <IconEye />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton>
                            <IconEdit />
                          </IconButton>
                        </Tooltip>
                        {appointment.status === 'scheduled' && (
                          <Tooltip title="Cancel">
                            <IconButton
                             
                              color="error"
                              onClick={() => handleCancelAppointment(appointment.id)}
                            >
                              <IconX />
                            </IconButton>
                          </Tooltip>
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
          count={filteredAppointments.length}
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
            <Typography variant="h4" color="info.main">
              {appointments.filter((a) => a.status === 'scheduled').length}
            </Typography>
            <Typography variant="body2">Scheduled Today</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h4" color="warning.main">
              {appointments.filter((a) => a.priority === 'urgent').length}
            </Typography>
            <Typography variant="body2">Urgent Appointments</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h4" color="success.main">
              {appointments.filter((a) => a.status === 'confirmed').length}
            </Typography>
            <Typography variant="body2">Confirmed</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h4" color="error.main">
              {
                appointments.filter((a) => a.requiresApproval && a.approvalStatus === 'pending')
                  .length
              }
            </Typography>
            <Typography variant="body2">Pending Approval</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Today's Schedule */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Today's Schedule
            </Typography>
            <List>
              {appointments
                .filter((apt) => apt.startTime.toDateString() === new Date().toDateString())
                .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
                .slice(0, 6)
                .map((appointment) => (
                  <ListItem key={appointment.id}>
                    <ListItemAvatar>
                      <Avatar>
                        <IconClock />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={appointment.title}
                      secondary={`${appointment.startTime.toLocaleTimeString()} - ${
                        appointment.organizer.name
                      }`}
                    />
                    <Chip
                      label={appointment.status}
                      color={getStatusColor(appointment.status) as any}
                     
                    />
                  </ListItem>
                ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Upcoming Interviews */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Upcoming Interviews
            </Typography>
            <List>
              {appointments
                .filter((apt) => apt.type === 'interview' && apt.startTime > new Date())
                .slice(0, 4)
                .map((appointment) => (
                  <ListItem key={appointment.id}>
                    <ListItemAvatar>
                      <Avatar>
                        <IconUserCheck />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={appointment.visitors?.[0]?.name || 'Interview'}
                      secondary={appointment.startTime.toLocaleDateString()}
                    />
                    <Chip
                      label={appointment.priority}
                      color={getPriorityColor(appointment.priority) as any}
                     
                    />
                  </ListItem>
                ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <PageContainer title="Appointments" description="Manage appointments and meetings">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" component="h1">
              Appointments
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
              <Button
                variant="contained"
                startIcon={<IconPlus />}
                onClick={() => setShowCreateDialog(true)}
              >
                New Appointment
              </Button>
            </Box>
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
              <Tab label="Overview" />
              <Tab label="All Appointments" />
            </Tabs>
          </Box>

          {/* Tab Content */}
          {activeTab === 0 && renderOverviewTab()}
          {activeTab === 1 && renderAppointmentsList()}

          {/* Create Appointment Dialog */}
          {renderCreateAppointmentDialog()}

          {/* Appointment Details Dialog */}
          <Dialog open={showDialog} onClose={() => setShowDialog(false)} maxWidth="md" fullWidth>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogContent>
              {selectedAppointment && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h6">{selectedAppointment.title}</Typography>
                    <Typography variant="body2" color="textSecondary" paragraph>
                      {selectedAppointment.description}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Organizer"
                          secondary={`${selectedAppointment.organizer.name} (${selectedAppointment.organizer.department})`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Date & Time"
                          secondary={`${selectedAppointment.startTime.toLocaleString()} - ${selectedAppointment.endTime.toLocaleString()}`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Duration"
                          secondary={`${selectedAppointment.duration} minutes`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Location"
                          secondary={selectedAppointment.location.name}
                        />
                      </ListItem>
                    </List>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Attendees ({selectedAppointment.attendees.length})
                    </Typography>
                    <List>
                      {selectedAppointment.attendees.map((attendee, index) => (
                        <ListItem key={index}>
                          <ListItemAvatar>
                            <Avatar>
                              <IconUser />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={attendee.name}
                            secondary={`${attendee.role} - ${attendee.status}`}
                          />
                          {attendee.required && (
                            <Chip label="Required" color="warning" />
                          )}
                        </ListItem>
                      ))}
                    </List>

                    {selectedAppointment.visitors && selectedAppointment.visitors.length > 0 && (
                      <>
                        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                          Visitors ({selectedAppointment.visitors.length})
                        </Typography>
                        <List>
                          {selectedAppointment.visitors.map((visitor, index) => (
                            <ListItem key={index}>
                              <ListItemAvatar>
                                <Avatar>
                                  <IconUsers />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={visitor.name}
                                secondary={visitor.organization}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </>
                    )}
                  </Grid>

                  {selectedAppointment.notes && (
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>
                        Notes
                      </Typography>
                      <Typography variant="body2">{selectedAppointment.notes}</Typography>
                    </Grid>
                  )}
                </Grid>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowDialog(false)}>Close</Button>
              {selectedAppointment?.status === 'scheduled' && (
                <>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      handleCancelAppointment(selectedAppointment.id);
                      setShowDialog(false);
                    }}
                    startIcon={<IconX />}
                  >
                    Cancel
                  </Button>
                  <Button variant="outlined" startIcon={<IconEdit />}>
                    Edit
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
      </LocalizationProvider>
    </PageContainer>
  );
};

export default Appointments;
