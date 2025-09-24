import React, { useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'; 
import {
  IconHelp,
  IconMail,
  IconPhone,
  IconMessage,
  IconBook,
  IconChevronDown,
  IconBug,
  IconQuestionMark,
  IconSettings,
  IconSend,
  IconDownload,
  IconExternalLink,
} from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import { useAuth } from 'src/context/AuthContext';
import { toast } from 'react-toastify';

const Help = () => {
  const { user } = useAuth();
  const [supportDialogOpen, setSupportDialogOpen] = useState(false);
  const [supportForm, setSupportForm] = useState({
    type: '',
    subject: '',
    description: '',
    priority: 'medium',
  });

  const faqs = [
    {
      question: 'How do I register a new visitor?',
      answer:
        'To register a new visitor, navigate to the Visitor Management section and click on "Pre-Registration". Fill in the required information including visitor details, purpose of visit, and the person they\'re meeting.',
    },
    {
      question: 'How can I check in a visitor?',
      answer:
        'Go to the "Check In/Out" section, scan the visitor\'s QR code or search for them by name. Click "Check In" and the system will generate a visitor badge automatically.',
    },
    {
      question: 'How do I view visitor reports?',
      answer:
        'Access the Reports & Analytics section from the main menu. You can view visitor statistics, generate custom reports, and export data in various formats.',
    },
    {
      question: 'What should I do if a visitor is on the blacklist?',
      answer:
        "If a visitor appears on the blacklist, do not allow entry. Contact security immediately and follow your school's security protocols. Document the incident in the system.",
    },
    {
      question: 'How do I reset my password?',
      answer:
        'Click on your profile icon in the top right corner, select "Security", then "Change Password". You\'ll need to enter your current password and create a new one.',
    },
    {
      question: 'Can I customize notification settings?',
      answer:
        'Yes, go to your Account Settings and adjust notification preferences for emails, push notifications, and specific alert types.',
    },
  ];

  const contactOptions = [
    {
      icon: <IconMail xs={24} />,
      title: 'Email Support',
      description: 'Get help via email',
      contact: 'support@schoolvisiting.com',
      availability: '24/7',
    },
    {
      icon: <IconPhone xs={24} />,
      title: 'Phone Support',
      description: 'Call our support team',
      contact: '+1 (555) 123-4567',
      availability: 'Mon-Fri 8AM-6PM',
    },
    {
      icon: <IconMessage xs={24} />,
      title: 'Live Chat',
      description: 'Chat with support',
      contact: 'Available in app',
      availability: 'Mon-Fri 9AM-5PM',
    },
  ];

  const resources = [
    {
      title: 'User Manual',
      description: 'Complete guide to using the system',
      icon: <IconBook xs={20} />,
      type: 'PDF',
    },
    {
      title: 'Video Tutorials',
      description: 'Step-by-step video guides',
      icon: <IconExternalLink xs={20} />,
      type: 'Video',
    },
    {
      title: 'API Documentation',
      description: 'Technical documentation for developers',
      icon: <IconSettings xs={20} />,
      type: 'Web',
    },
    {
      title: 'System Requirements',
      description: 'Minimum system requirements',
      icon: <IconDownload xs={20} />,
      type: 'PDF',
    },
  ];

  const handleSupportSubmit = async () => {
    if (!supportForm.type || !supportForm.subject || !supportForm.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Support ticket submitted successfully!');
      setSupportDialogOpen(false);
      setSupportForm({ type: '', subject: '', description: '', priority: 'medium' });
    } catch (error) {
      toast.error('Failed to submit support ticket');
    }
  };

  return (
    <PageContainer
      title="Help & Support"
      description="Get help and support for the school visiting system"
    >
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight={600}>
            Help & Support
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Find answers to common questions and get assistance
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<IconMail />}
          onClick={() => setSupportDialogOpen(true)}
        >
          Contact Support
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Contact Options */}
        <Grid item xs={12}>
          <Typography variant="h5" fontWeight={600} mb={2}>
            Contact Support
          </Typography>
          <Grid container spacing={3}>
            {contactOptions.map((option, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Stack spacing={2} alignItems="center" textAlign="center">
                      {option.icon}
                      <Typography variant="h6" fontWeight={600}>
                        {option.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {option.description}
                      </Typography>
                      <Typography variant="subtitle2" color="primary">
                        {option.contact}
                      </Typography>
                      <Chip label={option.availability} />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Frequently Asked Questions */}
        <Grid item xs={12} md={8}>
          <Typography variant="h5" fontWeight={600} mb={2}>
            Frequently Asked Questions
          </Typography>
          <Stack spacing={1}>
            {faqs.map((faq, index) => (
              <Accordion key={index}>
                <AccordionSummary expandIcon={<IconChevronDown />}>
                  <Typography variant="subtitle1" fontWeight={500}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" color="textSecondary">
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Typography variant="h5" fontWeight={600} mb={2}>
            Quick Actions
          </Typography>
          <Stack spacing={2}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<IconBug />}
              onClick={() => {
                setSupportForm((prev) => ({ ...prev, type: 'bug' }));
                setSupportDialogOpen(true);
              }}
            >
              Report a Bug
            </Button>

            <Button
              variant="outlined"
              fullWidth
              startIcon={<IconQuestionMark />}
              onClick={() => {
                setSupportForm((prev) => ({ ...prev, type: 'question' }));
                setSupportDialogOpen(true);
              }}
            >
              Ask a Question
            </Button>

            <Button
              variant="outlined"
              fullWidth
              startIcon={<IconSettings />}
              onClick={() => {
                setSupportForm((prev) => ({ ...prev, type: 'feature' }));
                setSupportDialogOpen(true);
              }}
            >
              Request Feature
            </Button>
          </Stack>

          <Typography variant="h6" fontWeight={600} mt={4} mb={2}>
            System Status
          </Typography>
          <Card variant="outlined">
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: 'success.main',
                  }}
                />
                <Box>
                  <Typography variant="subtitle2">All Systems Operational</Typography>
                  <Typography variant="caption" color="textSecondary">
                    Last updated: 2 minutes ago
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Resources */}
        <Grid item xs={12}>
          <Typography variant="h5" fontWeight={600} mb={2}>
            Resources & Documentation
          </Typography>
          <Grid container spacing={3}>
            {resources.map((resource, index) => (
              <Grid item xs={12} sm={6} xs={12} md={3} key={index}>
                <Card>
                  <CardContent>
                    <Stack spacing={2}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        {resource.icon}
                        <Chip label={resource.type} />
                      </Stack>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {resource.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {resource.description}
                      </Typography>
                      <Button variant="outlined" startIcon={<IconDownload />}>
                        Access
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {/* Support Ticket Dialog */}
      <Dialog
        open={supportDialogOpen}
        onClose={() => setSupportDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconMail xs={24} />
            <Typography variant="h6">Contact Support</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Issue Type</InputLabel>
              <Select
                value={supportForm.type}
                onChange={(e) => setSupportForm((prev) => ({ ...prev, type: e.target.value }))}
                label="Issue Type"
              >
                <MenuItem value="bug">Bug Report</MenuItem>
                <MenuItem value="question">General Question</MenuItem>
                <MenuItem value="feature">Feature Request</MenuItem>
                <MenuItem value="account">Account Issue</MenuItem>
                <MenuItem value="technical">Technical Support</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={supportForm.priority}
                onChange={(e) => setSupportForm((prev) => ({ ...prev, priority: e.target.value }))}
                label="Priority"
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Subject"
              value={supportForm.subject}
              onChange={(e) => setSupportForm((prev) => ({ ...prev, subject: e.target.value }))}
              placeholder="Brief description of your issue"
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              value={supportForm.description}
              onChange={(e) => setSupportForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Please provide detailed information about your issue"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSupportDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSupportSubmit} startIcon={<IconSend />}>
            Submit Ticket
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default Help;
