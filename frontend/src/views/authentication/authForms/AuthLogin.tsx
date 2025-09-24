// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Divider,
  Alert,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { Link } from 'react-router';

import { loginType } from 'src/types/auth/auth';
import CustomCheckbox from '../../../components/forms/theme-elements/CustomCheckbox';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import { useAuth } from '../../../context/AuthContext';

// import AuthSocialButtons from './AuthSocialButtons';

// Demo credentials for all user roles
const demoCredentials = [
  { email: 'admin@school.com', password: 'admin123', role: 'Admin' },
  { email: 'security@school.com', password: 'security123', role: 'Security' },
  { email: 'frontdesk@school.com', password: 'frontdesk123', role: 'Front Desk' },
  { email: 'teacher@school.com', password: 'teacher123', role: 'Teacher' },
];

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const { login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showDemo, setShowDemo] = useState(false);

  // Get the redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    if (error) clearError();
  };

  const handleRoleSelect = (event: SelectChangeEvent) => {
    const selectedEmail = event.target.value;
    const credential = demoCredentials.find((cred) => cred.email === selectedEmail);
    if (credential) {
      setFormData({
        email: credential.email,
        password: credential.password,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return;
    }

    console.log('Login attempt with:', { email: formData.email, from });

    try {
      const success = await login(formData.email, formData.password);
      console.log('Login result:', success);

      if (success) {
        console.log('Login successful, navigating to:', from);
        // Small delay to ensure state is updated
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 100);
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const fillDemoCredentials = (credential: (typeof demoCredentials)[0]) => {
    setFormData({
      email: credential.email,
      password: credential.password,
    });
  };

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h3" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Demo Credentials Section */}
      <Box sx={{ mb: 3 }}>
        <Button variant="outlined" onClick={() => setShowDemo(!showDemo)} sx={{ mb: 2 }}>
          {showDemo ? 'Hide' : 'Show'} Demo Credentials
        </Button>

        {showDemo && (
          <Box>
            <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
              Quick Select Demo Account:
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Demo Role</InputLabel>
              <Select value="" label="Select Demo Role" onChange={handleRoleSelect}>
                {demoCredentials.map((credential) => (
                  <MenuItem key={credential.email} value={credential.email}>
                    {credential.role} - {credential.email}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Or click to fill
              </Typography>
            </Divider>

            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              {demoCredentials.map((credential) => (
                <Chip
                  key={credential.email}
                  label={credential.role}
                  variant="outlined"
                  onClick={() => fillDemoCredentials(credential)}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Stack>
            <Divider sx={{ my: 2 }} />
          </Box>
        )}
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Box>
            <CustomFormLabel htmlFor="email">Email Address</CustomFormLabel>
            <CustomTextField
              id="email"
              type="email"
              variant="outlined"
              fullWidth
              value={formData.email}
              onChange={handleInputChange('email')}
              required
            />
          </Box>
          <Box>
            <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
            <CustomTextField
              id="password"
              type="password"
              variant="outlined"
              fullWidth
              value={formData.password}
              onChange={handleInputChange('password')}
              required
            />
          </Box>
          <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
            <FormGroup>
              <FormControlLabel
                control={<CustomCheckbox defaultChecked />}
                label="Remember this Device"
              />
            </FormGroup>
            <Typography
              component={Link}
              to="/auth/forgot-password"
              fontWeight="500"
              sx={{
                textDecoration: 'none',
                color: 'primary.main',
              }}
            >
              Forgot Password ?
            </Typography>
          </Stack>
        </Stack>
        <Box>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            disabled={isLoading || !formData.email || !formData.password}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </Box>
      </Box>

      {subtitle}
    </>
  );
};

export default AuthLogin;
