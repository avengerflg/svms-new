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
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Autocomplete,
  CardHeader,
  LinearProgress,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/material'; 
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { CalendarPicker } from '@mui/x-date-pickers/CalendarPicker';
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
  IconCalendarTime,
  IconChevronLeft,
  IconChevronRight,
  IconSettings,
  IconNotification,
  IconShare,
} from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import { useAuth } from '../../context/AuthContext';

interface Meeting {
  id: string;
  title: string;
  description?: string;
  type:
    | 'one-on-one'
    | 'team'
    | 'department'
    | 'all-hands'
    | 'board'
    | 'client'
    | 'training'
    | 'other';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'postponed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  organizer: {
    id: string;
    name: string;
    email: string;
    department: string;
    role: string;
  };
  attendees: {
    id: string;
    name: string;
    email: string;
    role: string;
    department: string;
    status: 'invited' | 'accepted' | 'declined' | 'tentative' | 'no-response';
    required: boolean;
    lastResponseTime?: Date;
  }[];
  guests?: {
    name: string;
    email?: string;
    organization?: string;
    role?: string;
  }[];
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  location: {
    type: 'room' | 'office' | 'virtual' | 'hybrid' | 'external';
    name: string;
    address?: string;
    virtualLink?: string;
    dialInNumber?: string;
    capacity?: number;
    equipment?: string[];
  };
  agenda?: {
    item: string;
    duration: number;
    presenter?: string;
    notes?: string;
  }[];
  recurrence?: {
    type: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: Date;
    occurrences?: number;
    daysOfWeek?: number[];
  };
  resources?: string[];
  documents?: {
    name: string;
    url: string;
    type: string;
  }[];
  reminders: {
    time: number; // minutes before
    method: 'email' | 'notification' | 'sms';
    sent?: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
  actionItems?: {
    item: string;
    assignee: string;
    dueDate?: Date;
    status: 'pending' | 'in-progress' | 'completed';
  }[];
  isPrivate: boolean;
  requiresApproval: boolean;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  meetingMinutes?: string;
  recordingUrl?: string;
  followUpRequired: boolean;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  meetings: Meeting[];
  isToday: boolean;
  isSelected: boolean;
}

const MeetingScheduler: React.FC = () => {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [filteredMeetings, setFilteredMeetings] = useState<Meeting[]>([]);
  const [view, setView] = useState<'calendar' | 'list' | 'agenda'>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
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
    attendee: 'all',
  });

  // New meeting form state
  const [newMeeting, setNewMeeting] = useState<Partial<Meeting>>({
    title: '',
    description: '',
    type: 'team',
    priority: 'medium',
    startTime: new Date(),
    endTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
    location: { type: 'room', name: '' },
    attendees: [],
    guests: [],
    agenda: [],
    reminders: [{ time: 15, method: 'email' }],
    isPrivate: false,
    requiresApproval: false,
    recurrence: { type: 'none', interval: 1 },
    resources: [],
    followUpRequired: false,
  });

  // Mock meeting data
  const mockMeetings: Meeting[] = [
    {
      id: 'meet_001',
      title: 'Weekly Department Head Meeting',
      description: 'Regular coordination meeting for all department heads',
      type: 'department',
      status: 'scheduled',
      priority: 'high',
      organizer: {
        id: 'principal_001',
        name: 'Dr. Emily Davis',
        email: 'emily.davis@school.edu',
        department: 'Administration',
        role: 'Principal',
      },
      attendees: [
        {
          id: 'dept_head_001',
          name: 'Dr. Sarah Wilson',
          email: 'sarah.wilson@school.edu',
          role: 'Department Head',
          department: 'Mathematics',
          status: 'accepted',
          required: true,
        },
        {
          id: 'dept_head_002',
          name: 'Prof. Robert Johnson',
          email: 'robert.johnson@school.edu',
          role: 'Department Head',
          department: 'Science',
          status: 'accepted',
          required: true,
        },
        {
          id: 'dept_head_003',
          name: 'Ms. Jennifer Lee',
          email: 'jennifer.lee@school.edu',
          role: 'Department Head',
          department: 'English',
          status: 'tentative',
          required: true,
        },
      ],
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 90 * 60 * 1000), // 90 min meeting
      duration: 90,
      location: {
        type: 'room',
        name: "Principal's Conference Room",
        capacity: 15,
        equipment: ['Projector', 'Whiteboard', 'Video Conferencing'],
      },
      agenda: [
        { item: 'Budget Review', duration: 30, presenter: 'Principal' },
        { item: 'Curriculum Updates', duration: 45, presenter: 'Department Heads' },
        { item: 'Upcoming Events', duration: 15, presenter: 'All' },
      ],
      recurrence: {
        type: 'weekly',
        interval: 1,
        daysOfWeek: [1], // Monday
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      },
      resources: ['Budget Reports', 'Curriculum Documents'],
      reminders: [
        { time: 60, method: 'email' },
        { time: 15, method: 'notification' },
      ],
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      isPrivate: false,
      requiresApproval: false,
      followUpRequired: true,
    },
    {
      id: 'meet_002',
      title: 'Parent-Teacher Association Meeting',
      description: 'Monthly PTA meeting to discuss school policies and events',
      type: 'board',
      status: 'scheduled',
      priority: 'medium',
      organizer: {
        id: 'pta_chair_001',
        name: 'Mrs. Patricia Martinez',
        email: 'patricia.martinez@pta.org',
        department: 'PTA',
        role: 'Chairperson',
      },
      attendees: [
        {
          id: 'principal_001',
          name: 'Dr. Emily Davis',
          email: 'emily.davis@school.edu',
          role: 'Principal',
          department: 'Administration',
          status: 'accepted',
          required: true,
        },
        {
          id: 'teacher_rep_001',
          name: 'Dr. Sarah Wilson',
          email: 'sarah.wilson@school.edu',
          role: 'Teacher Representative',
          department: 'Mathematics',
          status: 'accepted',
          required: true,
        },
      ],
      guests: [
        { name: 'John Smith', organization: 'Parent Representative' },
        { name: 'Mary Johnson', organization: 'Parent Representative' },
        { name: 'David Brown', organization: 'Community Member' },
      ],
      startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 120 * 60 * 1000), // 2 hour meeting
      duration: 120,
      location: {
        type: 'room',
        name: 'School Auditorium',
        capacity: 100,
        equipment: ['Microphone', 'Projector', 'Sound System'],
      },
      agenda: [
        { item: "Principal's Report", duration: 20, presenter: 'Dr. Emily Davis' },
        { item: 'Budget Discussion', duration: 30, presenter: 'Treasurer' },
        { item: 'Upcoming Events Planning', duration: 45, presenter: 'Event Committee' },
        { item: 'Open Forum', duration: 25, presenter: 'All' },
      ],
      resources: ['Financial Reports', 'Event Proposals'],
      reminders: [
        { time: 120, method: 'email' },
        { time: 30, method: 'notification' },
      ],
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      isPrivate: false,
      requiresApproval: false,
      followUpRequired: true,
    },
    {
      id: 'meet_003',
      title: 'Student Performance Review',
      description: 'Quarterly review of student academic performance and intervention strategies',
      type: 'team',
      status: 'scheduled',
      priority: 'high',
      organizer: {
        id: 'counselor_001',
        name: 'Dr. Michael Thompson',
        email: 'michael.thompson@school.edu',
        department: 'Student Services',
        role: 'Counselor',
      },
      attendees: [
        {
          id: 'teacher_001',
          name: 'Dr. Sarah Wilson',
          email: 'sarah.wilson@school.edu',
          role: 'Mathematics Teacher',
          department: 'Mathematics',
          status: 'accepted',
          required: true,
        },
        {
          id: 'teacher_002',
          name: 'Prof. Robert Johnson',
          email: 'robert.johnson@school.edu',
          role: 'Science Teacher',
          department: 'Science',
          status: 'accepted',
          required: true,
        },
        {
          id: 'special_ed_001',
          name: 'Ms. Lisa Anderson',
          email: 'lisa.anderson@school.edu',
          role: 'Special Education Coordinator',
          department: 'Special Education',
          status: 'accepted',
          required: false,
        },
      ],
      startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 75 * 60 * 1000), // 75 min meeting
      duration: 75,
      location: {
        type: 'room',
        name: 'Conference Room B',
        capacity: 8,
        equipment: ['Computer', 'Whiteboard'],
      },
      agenda: [
        { item: 'Individual Student Reviews', duration: 45, presenter: 'Teachers' },
        { item: 'Intervention Strategies', duration: 20, presenter: 'Counselor' },
        { item: 'Action Plan Development', duration: 10, presenter: 'All' },
      ],
      resources: ['Student Performance Data', 'Assessment Results'],
      reminders: [{ time: 60, method: 'email' }],
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      notes: 'Focus on students showing academic decline in the past quarter',
      isPrivate: true,
      requiresApproval: false,
      followUpRequired: true,
    },
    {
      id: 'meet_004',
      title: 'Virtual Training: New Learning Management System',
      description: 'Training session for all staff on the new LMS platform',
      type: 'training',
      status: 'scheduled',
      priority: 'urgent',
      organizer: {
        id: 'it_manager_001',
        name: 'Alex Martinez',
        email: 'alex.martinez@school.edu',
        department: 'IT Department',
        role: 'IT Manager',
      },
      attendees: [
        {
          id: 'teacher_001',
          name: 'Dr. Sarah Wilson',
          email: 'sarah.wilson@school.edu',
          role: 'Teacher',
          department: 'Mathematics',
          status: 'invited',
          required: true,
        },
        {
          id: 'teacher_002',
          name: 'Prof. Robert Johnson',
          email: 'robert.johnson@school.edu',
          role: 'Teacher',
          department: 'Science',
          status: 'accepted',
          required: true,
        },
        {
          id: 'admin_001',
          name: 'Ms. Jennifer Lee',
          email: 'jennifer.lee@school.edu',
          role: 'Administrator',
          department: 'Administration',
          status: 'accepted',
          required: true,
        },
      ],
      startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000), // 90 min training
      duration: 90,
      location: {
        type: 'virtual',
        name: 'Zoom Training Room',
        virtualLink: 'https://zoom.us/j/training123',
        dialInNumber: '+1-555-ZOOM-123',
      },
      agenda: [
        { item: 'LMS Overview', duration: 20, presenter: 'IT Manager' },
        { item: 'Creating Courses', duration: 30, presenter: 'IT Manager' },
        { item: 'Student Management', duration: 25, presenter: 'IT Manager' },
        { item: 'Q&A Session', duration: 15, presenter: 'All' },
      ],
      resources: ['LMS User Manual', 'Training Videos'],
      reminders: [
        { time: 120, method: 'email' },
        { time: 30, method: 'notification' },
      ],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      isPrivate: false,
      requiresApproval: false,
      followUpRequired: true,
    },
  ];

  useEffect(() => {
    setMeetings(mockMeetings);
    setFilteredMeetings(mockMeetings);
    generateCalendarDays();
  }, []);

  useEffect(() => {
    generateCalendarDays();
  }, [selectedDate, meetings]);

  useEffect(() => {
    let filtered = meetings.filter((meeting) => {
      const matchesSearch =
        meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.organizer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.location.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filters.status === 'all' || meeting.status === filters.status;
      const matchesType = filters.type === 'all' || meeting.type === filters.type;
      const matchesPriority = filters.priority === 'all' || meeting.priority === filters.priority;

      // Time range filtering
      let matchesTimeRange = true;
      const now = new Date();
      const startTime = meeting.startTime;

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

      return matchesSearch && matchesStatus && matchesType && matchesPriority && matchesTimeRange;
    });

    setFilteredMeetings(filtered);
    setPage(0);
  }, [meetings, searchTerm, filters]);

  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday

    const days: CalendarDay[] = [];
    const today = new Date();

    for (let i = 0; i < 42; i++) {
      // 6 weeks
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const dayMeetings = meetings.filter(
        (meeting) => meeting.startTime.toDateString() === date.toDateString(),
      );

      days.push({
        date,
        isCurrentMonth: date.getMonth() === month,
        meetings: dayMeetings,
        isToday: date.toDateString() === today.toDateString(),
        isSelected: date.toDateString() === selectedDate.toDateString(),
      });
    }

    setCalendarDays(days);
  };

  const handleCreateMeeting = () => {
    const meeting: Meeting = {
      id: `meet_${Date.now()}`,
      ...(newMeeting as Meeting),
      organizer: {
        id: user?.id || 'current_user',
        name: user?.name || 'Current User',
        email: user?.email || 'user@school.edu',
        department: user?.department || 'Administration',
        role: user?.role || 'Staff',
      },
      status: 'scheduled',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setMeetings((prev) => [...prev, meeting]);
    setNewMeeting({
      title: '',
      description: '',
      type: 'team',
      priority: 'medium',
      startTime: new Date(),
      endTime: new Date(Date.now() + 60 * 60 * 1000),
      location: { type: 'room', name: '' },
      attendees: [],
      guests: [],
      agenda: [],
      reminders: [{ time: 15, method: 'email' }],
      isPrivate: false,
      requiresApproval: false,
      recurrence: { type: 'none', interval: 1 },
      resources: [],
      followUpRequired: false,
    });
    setShowCreateDialog(false);
    setCurrentStep(0);
    setSnackbar({ open: true, message: 'Meeting scheduled successfully', severity: 'success' });
  };

  const handleCancelMeeting = (id: string) => {
    setMeetings((prev) =>
      prev.map((meeting) =>
        meeting.id === id ? { ...meeting, status: 'cancelled', updatedAt: new Date() } : meeting,
      ),
    );
    setSnackbar({ open: true, message: 'Meeting cancelled', severity: 'warning' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'info';
      case 'in-progress':
        return 'warning';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'postponed':
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

  const renderCalendarView = () => (
    <Box>
      {/* Calendar Header */}
      <Card sx={{ mb: 3 }}>
        <CardHeader
          title={
            <Box display="flex" justifyContent="between" alignItems="center">
              <Typography variant="h5">
                {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </Typography>
              <Box>
                <IconButton
                  onClick={() =>
                    setSelectedDate(
                      new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1),
                    )
                  }
                >
                  <IconChevronLeft />
                </IconButton>
                <Button
                  variant="outlined"
                  onClick={() => setSelectedDate(new Date())}
                  sx={{ mx: 1 }}
                >
                  Today
                </Button>
                <IconButton
                  onClick={() =>
                    setSelectedDate(
                      new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1),
                    )
                  }
                >
                  <IconChevronRight />
                </IconButton>
              </Box>
            </Box>
          }
        />
        <CardContent>
          {/* Calendar Grid */}
          <Grid >
            {/* Day Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <Grid xs key={day}>
                <Typography variant="subtitle2" align="center" sx={{ p: 1, fontWeight: 'bold' }}>
                  {day}
                </Typography>
              </Grid>
            ))}

            {/* Calendar Days */}
            {calendarDays.map((day, index) => (
              <Grid xs key={index}>
                <Card
                  variant={day.isCurrentMonth ? 'outlined' : 'elevation'}
                  sx={{
                    minHeight: 100,
                    m: 0.5,
                    backgroundColor: day.isToday
                      ? 'primary.light'
                      : day.isSelected
                      ? 'action.selected'
                      : 'background.paper',
                    opacity: day.isCurrentMonth ? 1 : 0.6,
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: 'action.hover' },
                  }}
                  onClick={() => setSelectedDate(day.date)}
                >
                  <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: day.isToday ? 'bold' : 'normal',
                        color: day.isToday ? 'primary.contrastText' : 'text.primary',
                      }}
                    >
                      {day.date.getDate()}
                    </Typography>

                    {/* Meeting indicators */}
                    {day.meetings.slice(0, 3).map((meeting, meetingIndex) => (
                      <Chip
                        key={meetingIndex}
                        label={meeting.title}
                       
                        color={getPriorityColor(meeting.priority) as any}
                        sx={{
                          fontSize: '0.7rem',
                          height: 18,
                          mb: 0.5,
                          display: 'block',
                          '& .MuiChip-label': {
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: 80,
                          },
                        }}
                      />
                    ))}

                    {day.meetings.length > 3 && (
                      <Typography variant="caption" color="textSecondary">
                        +{day.meetings.length - 3} more
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Today's Meetings */}
      <Card>
        <CardHeader
          title={`Meetings for ${selectedDate.toLocaleDateString()}`}
          action={
            <Button
              variant="contained"
              startIcon={<IconPlus />}
              onClick={() => setShowCreateDialog(true)}
            >
              New Meeting
            </Button>
          }
        />
        <CardContent>
          {calendarDays.find((day) => day.date.toDateString() === selectedDate.toDateString())
            ?.meetings.length === 0 ? (
            <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 4 }}>
              No meetings scheduled for this date
            </Typography>
          ) : (
            <List>
              {calendarDays
                .find((day) => day.date.toDateString() === selectedDate.toDateString())
                ?.meetings.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
                .map((meeting) => (
                  <ListItem
                    key={meeting.id}
                    sx={{
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                      mb: 1,
                      backgroundColor: 'background.paper',
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: `${getPriorityColor(meeting.priority)}.main` }}>
                        <IconCalendarTime />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {meeting.title}
                          </Typography>
                          <Chip
                            label={meeting.type.replace('-', ' ').toUpperCase()}
                           
                            variant="outlined"
                          />
                          <Chip
                            label={meeting.status.toUpperCase()}
                           
                            color={getStatusColor(meeting.status) as any}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            <IconClock xs={16} style={{ marginRight: 4 }} />
                            {meeting.startTime.toLocaleTimeString()} -{' '}
                            {meeting.endTime.toLocaleTimeString()}({meeting.duration} min)
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            <IconMapPin xs={16} style={{ marginRight: 4 }} />
                            {meeting.location.name}
                            {meeting.location.type === 'virtual' && ' (Virtual)'}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            <IconUsers xs={16} style={{ marginRight: 4 }} />
                            {meeting.attendees.length} attendees
                            {meeting.guests &&
                              meeting.guests.length > 0 &&
                              `, ${meeting.guests.length} guests`}
                          </Typography>
                        </Box>
                      }
                    />
                    <Box display="flex" gap={1}>
                      <Tooltip title="View Details">
                        <IconButton
                         
                          onClick={() => {
                            setSelectedMeeting(meeting);
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
                      {meeting.status === 'scheduled' && (
                        <Tooltip title="Cancel">
                          <IconButton
                           
                            color="error"
                            onClick={() => handleCancelMeeting(meeting.id)}
                          >
                            <IconX />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </ListItem>
                ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );

  const renderListView = () => (
    <Box>
      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Search meetings..."
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
                  <MenuItem value="in-progress">In Progress</MenuItem>
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
                  <MenuItem value="one-on-one">One-on-One</MenuItem>
                  <MenuItem value="team">Team</MenuItem>
                  <MenuItem value="department">Department</MenuItem>
                  <MenuItem value="all-hands">All Hands</MenuItem>
                  <MenuItem value="board">Board</MenuItem>
                  <MenuItem value="training">Training</MenuItem>
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
                {filteredMeetings.length} meetings
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Meetings Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Meeting</TableCell>
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
              {filteredMeetings
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((meeting) => (
                  <TableRow key={meeting.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {meeting.title}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {meeting.type.replace('-', ' ').toUpperCase()}
                        </Typography>
                        {meeting.recurrence?.type !== 'none' && (
                          <Chip
                            label={<IconRepeat xs={12} />}
                           
                            variant="outlined"
                            sx={{ ml: 1 }}
                          />
                        )}
                        {meeting.isPrivate && (
                          <Chip label="Private" color="warning" sx={{ ml: 0.5 }} />
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
                            {meeting.organizer.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {meeting.organizer.department}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          <IconCalendar xs={16} style={{ marginRight: 4 }} />
                          {meeting.startTime.toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2">
                          <IconClock xs={16} style={{ marginRight: 4 }} />
                          {meeting.startTime.toLocaleTimeString()} -{' '}
                          {meeting.endTime.toLocaleTimeString()}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {meeting.duration} minutes
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {meeting.location.type === 'virtual' ? (
                            <IconVideo xs={16} />
                          ) : meeting.location.type === 'hybrid' ? (
                            <IconBuilding xs={16} />
                          ) : (
                            <IconMapPin xs={16} />
                          )}
                          <span style={{ marginLeft: 4 }}>{meeting.location.name}</span>
                        </Typography>
                        {meeting.location.capacity && (
                          <Typography variant="caption" color="textSecondary">
                            Capacity: {meeting.location.capacity}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">{meeting.attendees.length} staff</Typography>
                        {meeting.guests && meeting.guests.length > 0 && (
                          <Typography variant="body2" color="textSecondary">
                            + {meeting.guests.length} guests
                          </Typography>
                        )}
                        <Typography variant="caption" color="textSecondary">
                          {meeting.attendees.filter((a) => a.status === 'accepted').length}{' '}
                          confirmed
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={meeting.priority.toUpperCase()}
                        color={getPriorityColor(meeting.priority) as any}
                       
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={meeting.status.replace('-', ' ').toUpperCase()}
                        color={getStatusColor(meeting.status) as any}
                       
                      />
                      {meeting.followUpRequired && (
                        <Chip label="Follow-up" color="info" sx={{ ml: 0.5 }} />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" gap={1}>
                        <Tooltip title="View Details">
                          <IconButton
                           
                            onClick={() => {
                              setSelectedMeeting(meeting);
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
                        {meeting.status === 'scheduled' && (
                          <Tooltip title="Cancel">
                            <IconButton
                             
                              color="error"
                              onClick={() => handleCancelMeeting(meeting.id)}
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
          count={filteredMeetings.length}
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
              {
                meetings.filter((m) => m.startTime.toDateString() === new Date().toDateString())
                  .length
              }
            </Typography>
            <Typography variant="body2">Today's Meetings</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h4" color="warning.main">
              {meetings.filter((m) => m.priority === 'urgent' && m.status === 'scheduled').length}
            </Typography>
            <Typography variant="body2">Urgent Meetings</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h4" color="success.main">
              {meetings.filter((m) => m.status === 'completed').length}
            </Typography>
            <Typography variant="body2">Completed</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h4" color="error.main">
              {meetings.filter((m) => m.requiresApproval && m.approvalStatus === 'pending').length}
            </Typography>
            <Typography variant="body2">Pending Approval</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Upcoming Meetings */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Upcoming Meetings
            </Typography>
            <List>
              {meetings
                .filter(
                  (meeting) => meeting.startTime > new Date() && meeting.status === 'scheduled',
                )
                .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
                .slice(0, 6)
                .map((meeting) => (
                  <ListItem key={meeting.id}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: `${getPriorityColor(meeting.priority)}.main` }}>
                        <IconCalendarTime />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={meeting.title}
                      secondary={`${meeting.startTime.toLocaleDateString()} at ${meeting.startTime.toLocaleTimeString()} - ${
                        meeting.organizer.name
                      }`}
                    />
                    <Chip
                      label={meeting.priority}
                      color={getPriorityColor(meeting.priority) as any}
                     
                    />
                  </ListItem>
                ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Meeting Types Distribution */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Meeting Types
            </Typography>
            <List>
              {['team', 'department', 'one-on-one', 'training', 'board'].map((type) => {
                const count = meetings.filter((m) => m.type === type).length;
                return (
                  <ListItem key={type}>
                    <ListItemText
                      primary={type.replace('-', ' ').toUpperCase()}
                      secondary={`${count} meetings`}
                    />
                    <LinearProgress
                      variant="determinate"
                      value={(count / meetings.length) * 100}
                      sx={{ width: 60, mr: 2 }}
                    />
                  </ListItem>
                );
              })}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <PageContainer title="Meeting Scheduler" description="Schedule and manage meetings">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" component="h1">
              Meeting Scheduler
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
                Schedule Meeting
              </Button>
            </Box>
          </Box>

          {/* View Toggle */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
              <Tab label="Overview" />
              <Tab label="Calendar View" />
              <Tab label="List View" />
            </Tabs>
          </Box>

          {/* Tab Content */}
          {activeTab === 0 && renderOverviewTab()}
          {activeTab === 1 && renderCalendarView()}
          {activeTab === 2 && renderListView()}

          {/* Meeting Details Dialog */}
          <Dialog open={showDialog} onClose={() => setShowDialog(false)} maxWidth="lg" fullWidth>
            <DialogTitle>Meeting Details</DialogTitle>
            <DialogContent>
              {selectedMeeting && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h5" gutterBottom>
                      {selectedMeeting.title}
                    </Typography>
                    <Box display="flex" gap={1} mb={2}>
                      <Chip
                        label={selectedMeeting.type.replace('-', ' ').toUpperCase()}
                        variant="outlined"
                      />
                      <Chip
                        label={selectedMeeting.status.replace('-', ' ').toUpperCase()}
                        color={getStatusColor(selectedMeeting.status) as any}
                      />
                      <Chip
                        label={selectedMeeting.priority.toUpperCase()}
                        color={getPriorityColor(selectedMeeting.priority) as any}
                      />
                      {selectedMeeting.isPrivate && <Chip label="Private" color="warning" />}
                    </Box>
                    <Typography variant="body1" paragraph>
                      {selectedMeeting.description}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Organizer"
                          secondary={`${selectedMeeting.organizer.name} (${selectedMeeting.organizer.department})`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Date & Time"
                          secondary={`${selectedMeeting.startTime.toLocaleString()} - ${selectedMeeting.endTime.toLocaleString()}`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Duration"
                          secondary={`${selectedMeeting.duration} minutes`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Location"
                          secondary={
                            <Box>
                              <Typography variant="body2">
                                {selectedMeeting.location.name}
                              </Typography>
                              {selectedMeeting.location.virtualLink && (
                                <Typography variant="caption" color="primary">
                                  {selectedMeeting.location.virtualLink}
                                </Typography>
                              )}
                              {selectedMeeting.location.capacity && (
                                <Typography variant="caption" display="block">
                                  Capacity: {selectedMeeting.location.capacity}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                    </List>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Attendees ({selectedMeeting.attendees.length})
                    </Typography>
                    <List>
                      {selectedMeeting.attendees.map((attendee, index) => (
                        <ListItem key={index}>
                          <ListItemAvatar>
                            <Avatar>
                              <IconUser />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={attendee.name}
                            secondary={`${attendee.role} - ${attendee.department}`}
                          />
                          <Box display="flex" gap={1}>
                            <Chip
                              label={attendee.status}
                             
                              color={
                                attendee.status === 'accepted'
                                  ? 'success'
                                  : attendee.status === 'declined'
                                  ? 'error'
                                  : 'warning'
                              }
                            />
                            {attendee.required && (
                              <Chip label="Required" color="info" />
                            )}
                          </Box>
                        </ListItem>
                      ))}
                    </List>

                    {selectedMeeting.guests && selectedMeeting.guests.length > 0 && (
                      <>
                        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                          Guests ({selectedMeeting.guests.length})
                        </Typography>
                        <List>
                          {selectedMeeting.guests.map((guest, index) => (
                            <ListItem key={index}>
                              <ListItemAvatar>
                                <Avatar>
                                  <IconUsers />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText primary={guest.name} secondary={guest.organization} />
                            </ListItem>
                          ))}
                        </List>
                      </>
                    )}
                  </Grid>

                  {selectedMeeting.agenda && selectedMeeting.agenda.length > 0 && (
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>
                        Agenda
                      </Typography>
                      <List>
                        {selectedMeeting.agenda.map((item, index) => (
                          <ListItem key={index}>
                            <ListItemText
                              primary={item.item}
                              secondary={`${item.duration} minutes ${
                                item.presenter ? `- ${item.presenter}` : ''
                              }`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                  )}

                  {selectedMeeting.notes && (
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>
                        Notes
                      </Typography>
                      <Typography variant="body2">{selectedMeeting.notes}</Typography>
                    </Grid>
                  )}
                </Grid>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowDialog(false)}>Close</Button>
              {selectedMeeting?.status === 'scheduled' && (
                <>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      handleCancelMeeting(selectedMeeting.id);
                      setShowDialog(false);
                    }}
                    startIcon={<IconX />}
                  >
                    Cancel Meeting
                  </Button>
                  <Button variant="outlined" startIcon={<IconEdit />}>
                    Edit
                  </Button>
                  <Button variant="contained" startIcon={<IconShare />}>
                    Share
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

export default MeetingScheduler;
