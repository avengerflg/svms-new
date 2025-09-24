import React, { useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
} from '@mui/material'; 
import {
  IconSettings,
  IconBell,
  IconMail,
  IconShield,
  IconEye,
  IconMoon,
  IconSun,
  IconLanguage,
  IconDevices,
} from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import { useAuth } from 'src/context/AuthContext';
import { toast } from 'react-toastify';

const AccountSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    visitorAlerts: true,
    emergencyAlerts: true,
    weeklyReports: true,
    theme: 'light',
    language: 'en',
    timezone: 'UTC-5',
    twoFactorAuth: false,
    sessionTimeout: 30,
  });

  const handleSettingChange = (setting: string, value: any) => {
    setSettings((prev) => ({ ...prev, [setting]: value }));
  };

  const handleSaveSettings = async () => {
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  return (
    <PageContainer
      title="Account Settings"
      description="Manage your account preferences and settings"
    >
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight={600}>
            Account Settings
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Customize your account preferences and privacy settings
          </Typography>
        </Box>
        <Button variant="contained" onClick={handleSaveSettings}>
          Save All Settings
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <IconBell xs={24} />
                <Typography variant="h6" fontWeight={600}>
                  Notification Preferences
                </Typography>
              </Stack>

              <Stack spacing={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.emailNotifications}
                      onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                    />
                  }
                  label="Email Notifications"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.pushNotifications}
                      onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                    />
                  }
                  label="Push Notifications"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.smsNotifications}
                      onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                    />
                  }
                  label="SMS Notifications"
                />

                <Divider sx={{ my: 2 }} />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.visitorAlerts}
                      onChange={(e) => handleSettingChange('visitorAlerts', e.target.checked)}
                    />
                  }
                  label="Visitor Check-in Alerts"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.emergencyAlerts}
                      onChange={(e) => handleSettingChange('emergencyAlerts', e.target.checked)}
                    />
                  }
                  label="Emergency Alerts"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.weeklyReports}
                      onChange={(e) => handleSettingChange('weeklyReports', e.target.checked)}
                    />
                  }
                  label="Weekly Reports"
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Display & Appearance */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <IconEye xs={24} />
                <Typography variant="h6" fontWeight={600}>
                  Display & Appearance
                </Typography>
              </Stack>

              <Stack spacing={3}>
                <FormControl fullWidth>
                  <InputLabel>Theme</InputLabel>
                  <Select
                    value={settings.theme}
                    onChange={(e) => handleSettingChange('theme', e.target.value)}
                    label="Theme"
                  >
                    <MenuItem value="light">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <IconSun xs={16} />
                        <span>Light</span>
                      </Stack>
                    </MenuItem>
                    <MenuItem value="dark">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <IconMoon xs={16} />
                        <span>Dark</span>
                      </Stack>
                    </MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={settings.language}
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                    label="Language"
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="es">Spanish</MenuItem>
                    <MenuItem value="fr">French</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Timezone</InputLabel>
                  <Select
                    value={settings.timezone}
                    onChange={(e) => handleSettingChange('timezone', e.target.value)}
                    label="Timezone"
                  >
                    <MenuItem value="UTC-5">Eastern Time (UTC-5)</MenuItem>
                    <MenuItem value="UTC-6">Central Time (UTC-6)</MenuItem>
                    <MenuItem value="UTC-7">Mountain Time (UTC-7)</MenuItem>
                    <MenuItem value="UTC-8">Pacific Time (UTC-8)</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <IconShield xs={24} />
                <Typography variant="h6" fontWeight={600}>
                  Security Settings
                </Typography>
              </Stack>

              <Stack spacing={3}>
                <Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.twoFactorAuth}
                        onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                      />
                    }
                    label="Two-Factor Authentication"
                  />
                  <Typography variant="body2" color="textSecondary" sx={{ ml: 4 }}>
                    Add an extra layer of security to your account
                  </Typography>
                </Box>

                <FormControl fullWidth>
                  <InputLabel>Session Timeout</InputLabel>
                  <Select
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
                    label="Session Timeout"
                  >
                    <MenuItem value={15}>15 minutes</MenuItem>
                    <MenuItem value={30}>30 minutes</MenuItem>
                    <MenuItem value={60}>1 hour</MenuItem>
                    <MenuItem value={480}>8 hours</MenuItem>
                  </Select>
                </FormControl>

                <Box>
                  <Typography variant="subtitle2" mb={1}>
                    Active Sessions
                  </Typography>
                  <Stack spacing={1}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="body2">Current Session</Typography>
                        <Typography variant="caption" color="textSecondary">
                          Chrome on Windows • Active now
                        </Typography>
                      </Box>
                      <Chip label="Current" color="primary" />
                    </Box>
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Data & Privacy */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <IconDevices xs={24} />
                <Typography variant="h6" fontWeight={600}>
                  Data & Privacy
                </Typography>
              </Stack>

              <Stack spacing={3}>
                <Button variant="outlined" fullWidth>
                  Download My Data
                </Button>

                <Button variant="outlined" fullWidth>
                  Clear Activity Log
                </Button>

                <Divider />

                <Button variant="outlined" color="error" fullWidth>
                  Delete Account
                </Button>

                <Typography variant="caption" color="textSecondary">
                  Account deletion is permanent and cannot be undone. All your data will be
                  permanently removed.
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default AccountSettings;
