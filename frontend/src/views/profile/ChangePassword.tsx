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
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
} from '@mui/material'; 
import {
  IconKey,
  IconCheck,
  IconX,
  IconEye,
  IconEyeOff,
  IconShield,
  IconAlertTriangle,
} from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import { useAuth } from 'src/context/AuthContext';
import { toast } from 'react-toastify';

const ChangePassword = () => {
  const { user } = useAuth();
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Password strength calculation
  const calculatePasswordStrength = (password: string) => {
    let score = 0;
    const requirements = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };

    score += requirements.length ? 20 : 0;
    score += requirements.lowercase ? 20 : 0;
    score += requirements.uppercase ? 20 : 0;
    score += requirements.number ? 20 : 0;
    score += requirements.special ? 20 : 0;

    return { score, requirements };
  };

  const { score: passwordStrength, requirements } = calculatePasswordStrength(
    passwordData.newPassword,
  );

  const getStrengthColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    if (score >= 40) return 'info';
    return 'error';
  };

  const getStrengthText = (score: number) => {
    if (score >= 80) return 'Very Strong';
    if (score >= 60) return 'Strong';
    if (score >= 40) return 'Medium';
    if (score >= 20) return 'Weak';
    return 'Very Weak';
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (passwordStrength < 60) {
      newErrors.newPassword = 'Password is not strong enough';
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordChange = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/user/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (response.ok) {
        toast.success('Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setErrors({});
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <PageContainer title="Change Password" description="Update your account password">
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight={600}>
            Change Password
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Choose a strong password to keep your account secure
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Password Form */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <IconKey xs={24} />
                <Typography variant="h6" fontWeight={600}>
                  Password Information
                </Typography>
              </Stack>

              <Stack spacing={3}>
                {/* Current Password */}
                <TextField
                  fullWidth
                  type={showPasswords.current ? 'text' : 'password'}
                  label="Current Password"
                  value={passwordData.currentPassword}
                  onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                  error={!!errors.currentPassword}
                  helperText={errors.currentPassword}
                  InputProps={{
                    endAdornment: (
                      <Button
                        onClick={() => togglePasswordVisibility('current')}
                        sx={{ minWidth: 'auto', p: 1 }}
                      >
                        {showPasswords.current ? <IconEyeOff xs={20} /> : <IconEye xs={20} />}
                      </Button>
                    ),
                  }}
                />

                {/* New Password */}
                <TextField
                  fullWidth
                  type={showPasswords.new ? 'text' : 'password'}
                  label="New Password"
                  value={passwordData.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                  error={!!errors.newPassword}
                  helperText={errors.newPassword}
                  InputProps={{
                    endAdornment: (
                      <Button
                        onClick={() => togglePasswordVisibility('new')}
                        sx={{ minWidth: 'auto', p: 1 }}
                      >
                        {showPasswords.new ? <IconEyeOff xs={20} /> : <IconEye xs={20} />}
                      </Button>
                    ),
                  }}
                />

                {/* Password Strength Indicator */}
                {passwordData.newPassword && (
                  <Box>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1}
                    >
                      <Typography variant="body2">Password Strength</Typography>
                      <Typography
                        variant="body2"
                        color={`${getStrengthColor(passwordStrength)}.main`}
                        fontWeight={600}
                      >
                        {getStrengthText(passwordStrength)}
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={passwordStrength}
                      color={getStrengthColor(passwordStrength) as any}
                      sx={{ height: 8, borderRadius: 1 }}
                    />
                  </Box>
                )}

                {/* Confirm Password */}
                <TextField
                  fullWidth
                  type={showPasswords.confirm ? 'text' : 'password'}
                  label="Confirm New Password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  InputProps={{
                    endAdornment: (
                      <Button
                        onClick={() => togglePasswordVisibility('confirm')}
                        sx={{ minWidth: 'auto', p: 1 }}
                      >
                        {showPasswords.confirm ? <IconEyeOff xs={20} /> : <IconEye xs={20} />}
                      </Button>
                    ),
                  }}
                />

                {/* Action Buttons */}
                <Box sx={{ pt: 2 }}>
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      onClick={handlePasswordChange}
                      disabled={isLoading || passwordStrength < 60}
                      startIcon={isLoading ? null : <IconCheck />}
                      sx={{ minWidth: 150 }}
                    >
                      {isLoading ? 'Changing...' : 'Change Password'}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setPasswordData({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: '',
                        });
                        setErrors({});
                      }}
                      disabled={isLoading}
                    >
                      Clear Form
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Password Requirements */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <IconShield xs={24} />
                <Typography variant="h6" fontWeight={600}>
                  Password Requirements
                </Typography>
              </Stack>

              <List dense>
                <ListItem>
                  <ListItemIcon>
                    {requirements.length ? (
                      <IconCheck xs={20} color="green" />
                    ) : (
                      <IconX xs={20} color="red" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary="At least 8 characters"
                    primaryTypographyProps={{
                      color: requirements.length ? 'success.main' : 'text.secondary',
                    }}
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    {requirements.lowercase ? (
                      <IconCheck xs={20} color="green" />
                    ) : (
                      <IconX xs={20} color="red" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary="One lowercase letter"
                    primaryTypographyProps={{
                      color: requirements.lowercase ? 'success.main' : 'text.secondary',
                    }}
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    {requirements.uppercase ? (
                      <IconCheck xs={20} color="green" />
                    ) : (
                      <IconX xs={20} color="red" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary="One uppercase letter"
                    primaryTypographyProps={{
                      color: requirements.uppercase ? 'success.main' : 'text.secondary',
                    }}
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    {requirements.number ? (
                      <IconCheck xs={20} color="green" />
                    ) : (
                      <IconX xs={20} color="red" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary="One number"
                    primaryTypographyProps={{
                      color: requirements.number ? 'success.main' : 'text.secondary',
                    }}
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    {requirements.special ? (
                      <IconCheck xs={20} color="green" />
                    ) : (
                      <IconX xs={20} color="red" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary="One special character"
                    primaryTypographyProps={{
                      color: requirements.special ? 'success.main' : 'text.secondary',
                    }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Security Tips */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <IconAlertTriangle xs={24} />
                <Typography variant="h6" fontWeight={600}>
                  Security Tips
                </Typography>
              </Stack>

              <Stack spacing={2}>
                <Alert severity="info" sx={{ fontSize: '0.875rem' }}>
                  Use a unique password that you don't use for other websites
                </Alert>

                <Alert severity="warning" sx={{ fontSize: '0.875rem' }}>
                  Consider using a password manager to generate and store strong passwords
                </Alert>

                <Alert severity="success" sx={{ fontSize: '0.875rem' }}>
                  Enable two-factor authentication for additional security
                </Alert>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default ChangePassword;
