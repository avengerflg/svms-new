import React, { useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Divider,
} from '@mui/material'; 
import {
  IconShield,
  IconKey,
  IconDevices,
  IconLock,
  IconAlertTriangle,
  IconCheck,
  IconX,
  IconSettings,
  IconEye,
  IconEyeOff,
} from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import { useAuth } from 'src/context/AuthContext';
import { toast } from 'react-toastify';

const Security = () => {
  const { user } = useAuth();
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [twoFactorDialogOpen, setTwoFactorDialogOpen] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const mockSessions = [
    {
      id: 1,
      device: 'Chrome on Windows',
      location: 'New York, NY',
      lastActive: '2024-03-15T10:30:00Z',
      current: true,
    },
    {
      id: 2,
      device: 'Safari on iPhone',
      location: 'New York, NY',
      lastActive: '2024-03-14T08:15:00Z',
      current: false,
    },
    {
      id: 3,
      device: 'Firefox on Windows',
      location: 'New York, NY',
      lastActive: '2024-03-12T14:20:00Z',
      current: false,
    },
  ];

  const mockBackupCodes = [
    '1234-5678',
    '9876-5432',
    '1111-2222',
    '3333-4444',
    '5555-6666',
    '7777-8888',
  ];

  const securityScore = 85;

  const handlePasswordChange = async () => {
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast.error('Please fill in all fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Password changed successfully!');
      setPasswordDialogOpen(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Failed to change password');
    }
  };

  const handleEnable2FA = async () => {
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Two-factor authentication enabled!');
      setTwoFactorDialogOpen(false);
    } catch (error) {
      toast.error('Failed to enable 2FA');
    }
  };

  const handleRevokeSession = async (sessionId: number) => {
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success('Session revoked successfully!');
    } catch (error) {
      toast.error('Failed to revoke session');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSecurityScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  return (
    <PageContainer
      title="Security"
      description="Manage your account security and authentication settings"
    >
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight={600}>
            Security Settings
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Keep your account secure with these security options
          </Typography>
        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box textAlign="right">
            <Typography variant="body2" color="textSecondary">
              Security Score
            </Typography>
            <Chip
              label={`${securityScore}%`}
              color={getSecurityScoreColor(securityScore) as any}
              icon={<IconShield xs={16} />}
            />
          </Box>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {/* Password Security */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <IconKey xs={24} />
                <Typography variant="h6" fontWeight={600}>
                  Password Security
                </Typography>
              </Stack>

              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle2" mb={1}>
                    Password Strength
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ flex: 1, height: 8, bgcolor: 'grey.200', borderRadius: 1 }}>
                      <Box
                        sx={{
                          width: '85%',
                          height: '100%',
                          bgcolor: 'success.main',
                          borderRadius: 1,
                        }}
                      />
                    </Box>
                    <Typography variant="caption" color="success.main" fontWeight={600}>
                      Strong
                    </Typography>
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="subtitle2" mb={1}>
                    Last Changed
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    30 days ago
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => setPasswordDialogOpen(true)}
                  startIcon={<IconLock />}
                >
                  Change Password
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Two-Factor Authentication */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <IconShield xs={24} />
                <Typography variant="h6" fontWeight={600}>
                  Two-Factor Authentication
                </Typography>
              </Stack>

              <Stack spacing={3}>
                <Box>
                  <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                    <Typography variant="subtitle2">Status</Typography>
                    <Chip label="Disabled" color="error" icon={<IconX xs={14} />} />
                  </Stack>
                  <Typography variant="body2" color="textSecondary">
                    Add an extra layer of security to your account
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => setTwoFactorDialogOpen(true)}
                  startIcon={<IconShield />}
                >
                  Enable 2FA
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => setShowBackupCodes(!showBackupCodes)}
                  startIcon={<IconEye />}
                >
                  View Backup Codes
                </Button>

                {showBackupCodes && (
                  <Alert severity="info">
                    <Typography variant="subtitle2" mb={1}>
                      Backup Codes
                    </Typography>
                    <Grid container spacing={1}>
                      {mockBackupCodes.map((code, index) => (
                        <Grid item xs={6} key={index}>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {code}
                          </Typography>
                        </Grid>
                      ))}
                    </Grid>
                  </Alert>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Active Sessions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <IconDevices xs={24} />
                <Typography variant="h6" fontWeight={600}>
                  Active Sessions
                </Typography>
              </Stack>

              <List>
                {mockSessions.map((session, index) => (
                  <React.Fragment key={session.id}>
                    <ListItem>
                      <ListItemIcon>
                        <IconDevices xs={20} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="subtitle2">{session.device}</Typography>
                            {session.current && (
                              <Chip label="Current" color="primary" />
                            )}
                          </Stack>
                        }
                        secondary={
                          <Typography variant="body2" color="textSecondary">
                            {session.location} • Last active {formatDate(session.lastActive)}
                          </Typography>
                        }
                      />
                      <ListItemSecondaryAction>
                        {!session.current && (
                          <Button
                            color="error"
                           
                            onClick={() => handleRevokeSession(session.id)}
                          >
                            Revoke
                          </Button>
                        )}
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < mockSessions.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>

              <Box sx={{ mt: 2 }}>
                <Button variant="outlined" color="error" fullWidth>
                  Sign Out All Other Sessions
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Security Recommendations */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <IconAlertTriangle xs={24} />
                <Typography variant="h6" fontWeight={600}>
                  Security Recommendations
                </Typography>
              </Stack>

              <Stack spacing={2}>
                <Alert severity="warning">
                  <Typography variant="subtitle2">Enable Two-Factor Authentication</Typography>
                  <Typography variant="body2">
                    Protect your account with an additional layer of security
                  </Typography>
                </Alert>

                <Alert severity="info">
                  <Typography variant="subtitle2">Regular Password Updates</Typography>
                  <Typography variant="body2">
                    Consider changing your password every 90 days
                  </Typography>
                </Alert>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Change Password Dialog */}
      <Dialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              type="password"
              label="Current Password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))
              }
            />
            <TextField
              fullWidth
              type="password"
              label="New Password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))
              }
            />
            <TextField
              fullWidth
              type="password"
              label="Confirm New Password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handlePasswordChange}>
            Change Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Two-Factor Auth Dialog */}
      <Dialog
        open={twoFactorDialogOpen}
        onClose={() => setTwoFactorDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Alert severity="info">
              <Typography variant="body2">
                Use an authenticator app like Google Authenticator or Authy to scan this QR code
              </Typography>
            </Alert>

            <Box textAlign="center">
              <Box
                sx={{
                  width: 200,
                  height: 200,
                  bgcolor: 'grey.100',
                  mx: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2" color="textSecondary">
                  QR Code Placeholder
                </Typography>
              </Box>
            </Box>

            <TextField
              fullWidth
              label="Verification Code"
              placeholder="Enter 6-digit code"
              inputProps={{ maxLength: 6 }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTwoFactorDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEnable2FA}>
            Enable 2FA
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default Security;
