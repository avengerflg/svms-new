import React, { useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Stack,
  Divider,
  Button,
  Chip,
  TextField,
  IconButton,
  Alert,
  CircularProgress,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'; 
import {
  IconMail,
  IconPhone,
  IconBuilding,
  IconCalendar,
  IconUser,
  IconEdit,
  IconShield,
  IconCheck,
  IconX,
  IconLock,
  IconActivity,
  IconSettings,
} from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import { useAuth } from 'src/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import userimg from 'src/assets/images/profile/user-1.jpg';

const MyProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editData, setEditData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState<{ [key: string]: string }>({});

  // Update editData when user changes (in case of context updates)
  React.useEffect(() => {
    if (user) {
      setEditData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'security':
        return 'Security Officer';
      case 'frontdesk':
        return 'Front Desk';
      case 'teacher':
        return 'Teacher';
      default:
        return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'security':
        return 'warning';
      case 'frontdesk':
        return 'info';
      case 'teacher':
        return 'success';
      default:
        return 'default';
    }
  };

  const getUserInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!editData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!editData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!editData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(editData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (editData.phone && !/^\+?[\d\s\-\(\)]+$/.test(editData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call to update user profile
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        // TODO: Update user context with new data
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
    setErrors({});
    setIsEditing(false);
  };

  const validatePasswordForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordChange = async () => {
    if (!validatePasswordForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call to change password
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
        setPasswordDialogOpen(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setPasswordErrors({});
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

  const handlePasswordDialogClose = () => {
    setPasswordDialogOpen(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setPasswordErrors({});
  };

  if (!user) {
    return (
      <PageContainer title="My Profile" description="User profile page">
        <Typography variant="h6">Loading...</Typography>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="My Profile"
      description="User profile management for school visiting system"
    >
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight={600}>
            My Profile
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage your account information and preferences
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<IconLock />}
            onClick={() => setPasswordDialogOpen(true)}
          >
            Change Password
          </Button>
          {!isEditing ? (
            <Button variant="contained" startIcon={<IconEdit />} onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          ) : (
            <Box display="flex" gap={1}>
              <Button
                variant="contained"
                color="success"
                startIcon={
                  isLoading ? <CircularProgress xs={16} color="inherit" /> : <IconCheck />
                }
                onClick={handleSave}
                disabled={isLoading}
              >
                Save Changes
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<IconX />}
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {/* Main Profile Card */}
      <Card>
        <CardContent>
          {/* Profile Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #5D87FF 0%, #1976D2 100%)',
              borderRadius: 2,
              p: 3,
              mb: 3,
              position: 'relative',
              color: 'white',
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Stack direction="row" spacing={3} alignItems="center">
                  <Avatar
                    src={userimg}
                    sx={{
                      width: 80,
                      height: 80,
                      border: '4px solid rgba(255,255,255,0.2)',
                      fontSize: '24px',
                      fontWeight: 600,
                    }}
                  >
                    {getUserInitials(user.firstName, user.lastName)}
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight={600} mb={1}>
                      {isEditing
                        ? `${editData.firstName} ${editData.lastName}`
                        : `${user.firstName} ${user.lastName}`}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={getRoleDisplayName(user.role)}
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          fontWeight: 600,
                        }}
                       
                      />
                      <Chip
                        label={user.isActive ? 'Active' : 'Inactive'}
                        sx={{
                          bgcolor: user.isActive
                            ? 'rgba(76, 175, 80, 0.8)'
                            : 'rgba(244, 67, 54, 0.8)',
                          color: 'white',
                        }}
                       
                      />
                      {isEditing && (
                        <Chip
                          label="Editing..."
                          sx={{
                            bgcolor: 'rgba(255, 193, 7, 0.8)',
                            color: 'white',
                          }}
                         
                        />
                      )}
                    </Stack>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box textAlign={{ xs: 'left', md: 'right' }}>
                  <Typography variant="body2" sx={{ opacity: 0.9 }} mb={1}>
                    Member since {formatDate(user.createdAt)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    ID: {user._id?.slice(-8) || 'N/A'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Error Alert */}
          {Object.keys(errors).length > 0 && (
            <Alert severity="error" sx={{ mb: 3 }}>
              Please fix the errors below before saving.
            </Alert>
          )}

          {/* Profile Information Form */}
          <Typography variant="h6" fontWeight={600} mb={3}>
            Personal Information
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                {/* First Name */}
                <Box>
                  <Typography variant="subtitle2" color="textSecondary" mb={1}>
                    First Name
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      value={editData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      error={!!errors.firstName}
                      helperText={errors.firstName}
                      InputProps={{
                        startAdornment: <IconUser xs={20} style={{ marginRight: 8 }} />,
                      }}
                    />
                  ) : (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <IconUser xs={20} color="gray" />
                      <Typography variant="body1" fontWeight={500}>
                        {user.firstName}
                      </Typography>
                    </Stack>
                  )}
                </Box>

                {/* Email */}
                <Box>
                  <Typography variant="subtitle2" color="textSecondary" mb={1}>
                    Email Address
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      type="email"
                      value={editData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      error={!!errors.email}
                      helperText={errors.email}
                      InputProps={{
                        startAdornment: <IconMail xs={20} style={{ marginRight: 8 }} />,
                      }}
                    />
                  ) : (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <IconMail xs={20} color="gray" />
                      <Typography variant="body1" fontWeight={500}>
                        {user.email}
                      </Typography>
                    </Stack>
                  )}
                </Box>

                {/* Role */}
                <Box>
                  <Typography variant="subtitle2" color="textSecondary" mb={1}>
                    Role & Permissions
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <IconShield xs={20} color="gray" />
                    <Typography variant="body1" fontWeight={500}>
                      {getRoleDisplayName(user.role)}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                {/* Last Name */}
                <Box>
                  <Typography variant="subtitle2" color="textSecondary" mb={1}>
                    Last Name
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      value={editData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      error={!!errors.lastName}
                      helperText={errors.lastName}
                      InputProps={{
                        startAdornment: <IconUser xs={20} style={{ marginRight: 8 }} />,
                      }}
                    />
                  ) : (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <IconUser xs={20} color="gray" />
                      <Typography variant="body1" fontWeight={500}>
                        {user.lastName}
                      </Typography>
                    </Stack>
                  )}
                </Box>

                {/* Phone */}
                <Box>
                  <Typography variant="subtitle2" color="textSecondary" mb={1}>
                    Phone Number
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      value={editData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      error={!!errors.phone}
                      helperText={errors.phone}
                      placeholder="Enter phone number"
                      InputProps={{
                        startAdornment: <IconPhone xs={20} style={{ marginRight: 8 }} />,
                      }}
                    />
                  ) : (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <IconPhone xs={20} color="gray" />
                      <Typography variant="body1" fontWeight={500}>
                        {user.phone || 'Not provided'}
                      </Typography>
                    </Stack>
                  )}
                </Box>

                {/* School */}
                <Box>
                  <Typography variant="subtitle2" color="textSecondary" mb={1}>
                    School
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <IconBuilding xs={20} color="gray" />
                    <Box>
                      <Typography variant="body1" fontWeight={500}>
                        {user.school?.name || 'No school assigned'}
                      </Typography>
                      {user.school?.address && (
                        <Typography variant="body2" color="textSecondary">
                          {user.school.address.street}, {user.school.address.city}
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                </Box>
              </Stack>
            </Grid>
          </Grid>

          {/* Account Security Section */}
          <Divider sx={{ my: 4 }} />
          <Typography variant="h6" fontWeight={600} mb={3}>
            Account Security
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                    <IconLock xs={24} color="gray" />
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        Password
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Last changed 30 days ago
                      </Typography>
                    </Box>
                  </Stack>
                  <Button variant="outlined" fullWidth onClick={() => setPasswordDialogOpen(true)}>
                    Change Password
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                    <IconSettings xs={24} color="gray" />
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        Account Settings
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Privacy and security preferences
                      </Typography>
                    </Box>
                  </Stack>
                  <Button variant="outlined" fullWidth>
                    Manage Settings
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Change Password Dialog */}
      <Dialog open={passwordDialogOpen} onClose={handlePasswordDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconLock xs={24} />
            <Typography variant="h6">Change Password</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {Object.keys(passwordErrors).length > 0 && (
            <Alert severity="error" sx={{ mb: 3 }}>
              Please fix the errors below before saving.
            </Alert>
          )}

          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              type="password"
              label="Current Password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({
                  ...prev,
                  currentPassword: e.target.value,
                }))
              }
              error={!!passwordErrors.currentPassword}
              helperText={passwordErrors.currentPassword}
              autoComplete="current-password"
            />

            <TextField
              fullWidth
              type="password"
              label="New Password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }))
              }
              error={!!passwordErrors.newPassword}
              helperText={passwordErrors.newPassword || 'Must be at least 6 characters'}
              autoComplete="new-password"
            />

            <TextField
              fullWidth
              type="password"
              label="Confirm New Password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              error={!!passwordErrors.confirmPassword}
              helperText={passwordErrors.confirmPassword}
              autoComplete="new-password"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePasswordDialogClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handlePasswordChange}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress xs={16} /> : <IconCheck />}
          >
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default MyProfile;
