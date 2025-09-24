import React, { useState } from 'react';
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Checkbox,
  FormGroup,
  FormHelperText,
} from '@mui/material'; 
import {
  IconCamera,
  IconUpload,
  IconCalendar,
  IconClock,
  IconUser,
  IconId,
  IconCheck,
  IconArrowLeft,
  IconArrowRight,
  IconQrcode,
  IconMail,
  IconPhone,
  IconMapPin,
} from '@tabler/icons-react';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import PageContainer from 'src/components/container/PageContainer';
import { useAuth } from '../../context/AuthContext';



interface VisitorFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idType: string;
  idNumber: string;
  photo?: string;
  purposeOfVisit: string;
  personToMeet: string;
  department: string;
  visitDate: Date | null;
  expectedDuration: number;
  visitorCategory: string;
  emergencyContact: string;
  emergencyPhone: string;
  vehicleNumber: string;
  specialRequirements: string;
  agreement: boolean;
}

const steps = ['Personal Information', 'Visit Details', 'Verification', 'Review & Submit'];

const PreRegistration: React.FC = () => {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<VisitorFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    idType: '',
    idNumber: '',
    purposeOfVisit: '',
    personToMeet: '',
    department: '',
    visitDate: null,
    expectedDuration: 60,
    visitorCategory: '',
    emergencyContact: '',
    emergencyPhone: '',
    vehicleNumber: '',
    specialRequirements: '',
    agreement: false,
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [generatedQR, setGeneratedQR] = useState<string | null>(null);

  const handleNext = () => {
    if (validateCurrentStep()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleInputChange = (field: keyof VisitorFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setFormData((prev) => ({
          ...prev,
          photo: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateCurrentStep = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    switch (activeStep) {
      case 0: // Personal Information
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.idType) newErrors.idType = 'ID type is required';
        if (!formData.idNumber.trim()) newErrors.idNumber = 'ID number is required';
        break;

      case 1: // Visit Details
        if (!formData.purposeOfVisit.trim())
          newErrors.purposeOfVisit = 'Purpose of visit is required';
        if (!formData.personToMeet.trim()) newErrors.personToMeet = 'Person to meet is required';
        if (!formData.department.trim()) newErrors.department = 'Department is required';
        if (!formData.visitDate) newErrors.visitDate = 'Visit date is required';
        if (!formData.visitorCategory) newErrors.visitorCategory = 'Visitor category is required';
        break;

      case 2: // Verification
        if (!photoPreview) newErrors.photo = 'Photo is required';
        if (!formData.emergencyContact.trim())
          newErrors.emergencyContact = 'Emergency contact is required';
        if (!formData.emergencyPhone.trim())
          newErrors.emergencyPhone = 'Emergency phone is required';
        break;

      case 3: // Review
        if (!formData.agreement) newErrors.agreement = 'You must agree to the terms';
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        idType: formData.idType,
        idNumber: formData.idNumber,
        personToMeet: formData.personToMeet,
        department: formData.department,
        expectedDuration: formData.expectedDuration,
        photo: formData.photo,
        visitorCategory: formData.visitorCategory,
        emergencyContact: formData.emergencyContact,
        emergencyPhone: formData.emergencyPhone,
        vehicleNumber: formData.vehicleNumber,
        specialRequirements: formData.specialRequirements,
        agreement: formData.agreement,
      };

      const response = await axios.post(
        "http://localhost:3001/api/visitors",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        console.log(response.data);
        setGeneratedQR(response.data.qrCode);
        setSubmitDialogOpen(true);
      }
    } catch (error: any) {
      console.error("Error submitting visitor:", error);
      alert(
        error.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };
  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                error={!!errors.firstName}
                helperText={errors.firstName}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                error={!!errors.lastName}
                helperText={errors.lastName}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                error={!!errors.phone}
                helperText={errors.phone}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.idType} required>
                <InputLabel>ID Type</InputLabel>
                <Select
                  value={formData.idType}
                  label="ID Type"
                  onChange={(e) => handleInputChange('idType', e.target.value)}
                >
                  <MenuItem value="passport">Passport</MenuItem>
                  <MenuItem value="drivers-license">Driver's License</MenuItem>
                  <MenuItem value="national-id">National ID</MenuItem>
                  <MenuItem value="employee-id">Employee ID</MenuItem>
                  <MenuItem value="student-id">Student ID</MenuItem>
                </Select>
                 {errors.idType && <FormHelperText>{errors.idType}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="ID Number"
                value={formData.idNumber}
                onChange={(e) => handleInputChange('idNumber', e.target.value)}
                error={!!errors.idNumber}
                helperText={errors.idNumber}
                required
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.visitorCategory} required>
                <InputLabel>Visitor Category</InputLabel>
                <Select
                  value={formData.visitorCategory}
                  label="Visitor Category"
                  onChange={(e) => handleInputChange('visitorCategory', e.target.value)}
                >
                  <MenuItem value="parent">Parent/Guardian</MenuItem>
                  <MenuItem value="contractor">Contractor</MenuItem>
                  <MenuItem value="vendor">Vendor/Supplier</MenuItem>
                  <MenuItem value="guest">Guest Speaker</MenuItem>
                  <MenuItem value="alumni">Alumni</MenuItem>
                  <MenuItem value="official">Government Official</MenuItem>
                  <MenuItem value="media">Media Representative</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
                {errors.visitorCategory && <FormHelperText>{errors.visitorCategory}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Purpose of Visit"
                multiline
                rows={3}
                value={formData.purposeOfVisit}
                onChange={(e) => handleInputChange('purposeOfVisit', e.target.value)}
                error={!!errors.purposeOfVisit}
                helperText={errors.purposeOfVisit}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Person to Meet"
                value={formData.personToMeet}
                onChange={(e) => handleInputChange('personToMeet', e.target.value)}
                error={!!errors.personToMeet}
                helperText={errors.personToMeet}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.department} required>
                <InputLabel>Department</InputLabel>
                <Select
                  value={formData.department}
                  label="Department"
                  onChange={(e) => handleInputChange('department', e.target.value)}
                >
                  <MenuItem value="administration">Administration</MenuItem>
                  <MenuItem value="academics">Academics</MenuItem>
                  <MenuItem value="student-affairs">Student Affairs</MenuItem>
                  <MenuItem value="facilities">Facilities</MenuItem>
                  <MenuItem value="it">IT Department</MenuItem>
                  <MenuItem value="library">Library</MenuItem>
                  <MenuItem value="security">Security</MenuItem>
                  <MenuItem value="cafeteria">Cafeteria</MenuItem>
                </Select>
                {errors.department && <FormHelperText>{errors.department}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Visit Date & Time"
                  value={formData.visitDate}
                  onChange={(newValue) => handleInputChange('visitDate', newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.visitDate,
                      helperText: errors.visitDate,
                      required: true,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Expected Duration (minutes)</InputLabel>
                <Select
                  value={formData.expectedDuration}
                  label="Expected Duration (minutes)"
                  onChange={(e) => handleInputChange('expectedDuration', e.target.value)}
                >
                  <MenuItem value={30}>30 minutes</MenuItem>
                  <MenuItem value={60}>1 hour</MenuItem>
                  <MenuItem value={90}>1.5 hours</MenuItem>
                  <MenuItem value={120}>2 hours</MenuItem>
                  <MenuItem value={180}>3 hours</MenuItem>
                  <MenuItem value={240}>4 hours</MenuItem>
                  <MenuItem value={480}>Full day</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Vehicle Number (Optional)"
                value={formData.vehicleNumber}
                onChange={(e) => handleInputChange('vehicleNumber', e.target.value)}
                placeholder="Enter vehicle registration number if driving"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Special Requirements (Optional)"
                multiline
                rows={2}
                value={formData.specialRequirements}
                onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                placeholder="Wheelchair access, dietary requirements, etc."
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 3,
                  textAlign: 'center',
                  border: errors.photo ? '1px solid red' : '1px dashed #ccc',
                }}
              >
                {photoPreview ? (
                  <Box>
                    <Avatar
                      src={photoPreview}
                      sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                    />
                    <Button variant="outlined" component="label" startIcon={<IconCamera />}>
                      Change Photo
                      <input type="file" hidden accept="image/*" onChange={handlePhotoUpload} />
                    </Button>
                  </Box>
                ) : (
                  <Box>
                    <IconCamera xs={60} style={{ color: '#ccc', marginBottom: 16 }} />
                    <Typography variant="h6" gutterBottom>
                      Upload Your Photo
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      This photo will be used for your visitor badge
                    </Typography>
                    <Button variant="contained" component="label" startIcon={<IconUpload />}>
                      Upload Photo
                      <input type="file" hidden accept="image/*" onChange={handlePhotoUpload} />
                    </Button>
                    {errors.photo && (
                      <Typography variant="caption" color="error" display="block" mt={1}>
                        {errors.photo}
                      </Typography>
                    )}
                  </Box>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Emergency Contact Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Emergency Contact Name"
                      value={formData.emergencyContact}
                      onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                      error={!!errors.emergencyContact}
                      helperText={errors.emergencyContact}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Emergency Contact Phone"
                      value={formData.emergencyPhone}
                      onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                      error={!!errors.emergencyPhone}
                      helperText={errors.emergencyPhone}
                      required
                    />
                  </Grid>
                </Grid>

                <Alert severity="info" sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Photo Requirements:
                  </Typography>
                  <Typography variant="body2">
                    • Clear, recent photo showing your face • Good lighting and contrast • No
                    sunglasses or hat • Maximum file size: 5MB
                  </Typography>
                </Alert>
              </Box>
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Your Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom color="primary">
                    Personal Information
                  </Typography>
                  <Typography variant="body2">
                    <strong>Name:</strong> {formData.firstName} {formData.lastName}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Email:</strong> {formData.email}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Phone:</strong> {formData.phone}
                  </Typography>
                  <Typography variant="body2">
                    <strong>ID:</strong> {formData.idType} - {formData.idNumber}
                  </Typography>
                </Paper>

                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom color="primary">
                    Emergency Contact
                  </Typography>
                  <Typography variant="body2">
                    <strong>Name:</strong> {formData.emergencyContact}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Phone:</strong> {formData.emergencyPhone}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom color="primary">
                    Visit Details
                  </Typography>
                  <Typography variant="body2">
                    <strong>Category:</strong> {formData.visitorCategory}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Purpose:</strong> {formData.purposeOfVisit}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Meeting:</strong> {formData.personToMeet}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Department:</strong> {formData.department}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Date:</strong> {formData.visitDate?.toLocaleString()}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Duration:</strong> {formData.expectedDuration} minutes
                  </Typography>
                  {formData.vehicleNumber && (
                    <Typography variant="body2">
                      <strong>Vehicle:</strong> {formData.vehicleNumber}
                    </Typography>
                  )}
                </Paper>

                {photoPreview && (
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="subtitle1" gutterBottom color="primary">
                      Photo
                    </Typography>
                    <Avatar src={photoPreview} sx={{ width: 80, height: 80, mx: 'auto' }} />
                  </Paper>
                )}
              </Grid>
            </Grid>

            <Box mt={3}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.agreement}
                      onChange={(e) => handleInputChange('agreement', e.target.checked)}
                    />
                  }
                  label={
                    <Typography variant="body2">
                      I agree to follow all school policies and security protocols during my visit.
                      I understand that my information will be used for security purposes and
                      visitor management.
                    </Typography>
                  }
                />
              </FormGroup>
              {errors.agreement && (
                <Typography variant="caption" color="error">
                  {errors.agreement}
                </Typography>
              )}
            </Box>
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <PageContainer title="Pre-Registration" description="Register for a visit in advance">
      <Box>
        {/* Header */}
        <Box mb={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Visitor Pre-Registration
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Complete your registration before your visit for faster check-in
          </Typography>
        </Box>

        {/* Stepper */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>

        {/* Form Content */}
        <Card>
          <CardContent sx={{ p: 4 }}>
            {renderStepContent(activeStep)}

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                startIcon={<IconArrowLeft />}
              >
                Back
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  startIcon={<IconCheck />}
                  disabled={!formData.agreement}
                >
                  Submit Registration
                </Button>
              ) : (
                <Button variant="contained" onClick={handleNext} endIcon={<IconArrowRight />}>
                  Next
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Success Dialog */}
        <Dialog
          open={submitDialogOpen}
          onClose={() => setSubmitDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={2}>
              <IconCheck color="green" />
              Registration Successful!
            </Box>
          </DialogTitle>
          <DialogContent>
            <Alert severity="success" sx={{ mb: 3 }}>
              Your visitor registration has been submitted successfully. You will receive a
              confirmation email shortly.
            </Alert>

            <Box textAlign="center" mb={3}>
              <Typography variant="h6" gutterBottom>
                Your QR Code
              </Typography>
              <Paper sx={{ p: 3, display: 'inline-block' }}>
                <IconQrcode xs={120} />
                <Typography variant="caption" display="block" mt={1}>
                  QR Code: {generatedQR}
                </Typography>
              </Paper>
            </Box>

            <Typography variant="body2" paragraph>
              <strong>Next Steps:</strong>
            </Typography>
            <Typography variant="body2" paragraph>
              1. Save this QR code or take a screenshot
            </Typography>
            <Typography variant="body2" paragraph>
              2. Show this QR code at the security desk when you arrive
            </Typography>
            <Typography variant="body2" paragraph>
              3. Wait for approval from the person you're meeting
            </Typography>

            <Alert severity="info" sx={{ mt: 2 }}>
              Your registration is pending approval. You will be notified once approved.
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSubmitDialogOpen(false)}>Close</Button>
            <Button variant="contained" startIcon={<IconQrcode />}>
              Download QR Code
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PageContainer>
  );
};

export default PreRegistration;
