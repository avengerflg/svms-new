import React, { useState, useRef } from 'react';
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
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from '@mui/material'; 
import {
  IconCamera,
  IconUpload,
  IconCheck,
  IconX,
  IconId,
  IconScan,
  IconUser,
  IconAlertTriangle,
  IconShield,
  IconRefresh,
  IconDownload,
  IconEdit,
} from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import { useAuth } from '../../context/AuthContext';

interface IDDocument {
  type: string;
  number: string;
  image?: string;
  isVerified: boolean;
  verificationDate?: Date;
  verifiedBy?: string;
  expiryDate?: Date;
  issueDate?: Date;
  issuingAuthority?: string;
}

interface VerificationResult {
  isValid: boolean;
  confidence: number;
  extractedData: {
    name?: string;
    dateOfBirth?: string;
    address?: string;
    idNumber?: string;
    expiryDate?: string;
  };
  securityFeatures: {
    hologram: boolean;
    barcode: boolean;
    microprint: boolean;
    uvSecurity: boolean;
  };
  warnings: string[];
}

const IDVerification: React.FC = () => {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedIDType, setSelectedIDType] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [pendingVerifications, setPendingVerifications] = useState<any[]>([]);
  const [manualData, setManualData] = useState({
    name: '',
    idNumber: '',
    dateOfBirth: '',
    address: '',
    expiryDate: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const idTypes = [
    { value: 'passport', label: 'Passport', icon: '📘' },
    { value: 'drivers-license', label: "Driver's License", icon: '🚗' },
    { value: 'national-id', label: 'National ID Card', icon: '🆔' },
    { value: 'employee-id', label: 'Employee ID', icon: '👔' },
    { value: 'student-id', label: 'Student ID', icon: '🎓' },
    { value: 'military-id', label: 'Military ID', icon: '🪖' },
  ];

  const mockPendingVerifications = [
    {
      id: '1',
      visitorName: 'John Doe',
      idType: "Driver's License",
      submitTime: new Date(),
      status: 'pending',
      urgency: 'normal',
    },
    {
      id: '2',
      visitorName: 'Jane Smith',
      idType: 'Passport',
      submitTime: new Date(Date.now() - 15 * 60 * 1000),
      status: 'pending',
      urgency: 'high',
    },
  ];

  React.useEffect(() => {
    setPendingVerifications(mockPendingVerifications);
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setActiveStep(1);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcessID = async () => {
    setIsProcessing(true);
    setActiveStep(2);

    // Simulate ID processing
    setTimeout(() => {
      const mockResult: VerificationResult = {
        isValid: Math.random() > 0.2, // 80% success rate
        confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
        extractedData: {
          name: 'John Doe',
          dateOfBirth: '1985-03-15',
          address: '123 Main St, City, State',
          idNumber: 'DL123456789',
          expiryDate: '2025-03-15',
        },
        securityFeatures: {
          hologram: true,
          barcode: true,
          microprint: true,
          uvSecurity: Math.random() > 0.3,
        },
        warnings: Math.random() > 0.7 ? ['Document may be expired', 'Low image quality'] : [],
      };

      setVerificationResult(mockResult);
      setIsProcessing(false);
      setActiveStep(3);
    }, 3000);
  };

  const handleManualVerification = () => {
    setActiveStep(4);
  };

  const handleApprove = () => {
    console.log('ID verification approved');
    resetVerification();
  };

  const handleReject = () => {
    console.log('ID verification rejected');
    resetVerification();
  };

  const resetVerification = () => {
    setActiveStep(0);
    setSelectedIDType('');
    setUploadedImage(null);
    setVerificationResult(null);
    setManualData({
      name: '',
      idNumber: '',
      dateOfBirth: '',
      address: '',
      expiryDate: '',
    });
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select ID Document Type
            </Typography>
            <Grid container spacing={2}>
              {idTypes.map((type) => (
                <Grid item xs={12} md={4} key={type.value}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border:
                        selectedIDType === type.value ? '2px solid #1976d2' : '1px solid #ddd',
                      '&:hover': { borderColor: '#1976d2' },
                    }}
                    onClick={() => setSelectedIDType(type.value)}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                      <Typography variant="h4" mb={1}>
                        {type.icon}
                      </Typography>
                      <Typography variant="body2">{type.label}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {selectedIDType && (
              <Box mt={3}>
                <Typography variant="h6" gutterBottom>
                  Upload Document Image
                </Typography>
                <Paper
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    border: '2px dashed #ccc',
                    cursor: 'pointer',
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <IconUpload xs={48} style={{ color: '#ccc', marginBottom: 16 }} />
                  <Typography variant="h6" gutterBottom>
                    Upload {idTypes.find((t) => t.value === selectedIDType)?.label}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Click to browse or drag and drop your document
                  </Typography>
                  <input
                    ref={fileInputRef}
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </Paper>
              </Box>
            )}
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Uploaded Document
            </Typography>
            {uploadedImage && (
              <Box textAlign="center">
                <img
                  src={uploadedImage}
                  alt="Uploaded ID"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    border: '1px solid #ddd',
                    borderRadius: 8,
                  }}
                />
                <Box mt={2}>
                  <Button
                    variant="contained"
                    onClick={handleProcessID}
                    startIcon={<IconScan />}
                   
                  >
                    Process Document
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        );

      case 2:
        return (
          <Box textAlign="center">
            <IconScan xs={64} style={{ color: '#1976d2', marginBottom: 16 }} />
            <Typography variant="h6" gutterBottom>
              Processing Document...
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Please wait while we verify the document authenticity and extract information
            </Typography>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Verification Results
            </Typography>
            {verificationResult && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Alert severity={verificationResult.isValid ? 'success' : 'error'} sx={{ mb: 2 }}>
                    Document is {verificationResult.isValid ? 'VALID' : 'INVALID'} (Confidence:{' '}
                    {verificationResult.confidence}%)
                  </Alert>

                  <Typography variant="subtitle1" gutterBottom>
                    Extracted Information:
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Name"
                        secondary={verificationResult.extractedData.name}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="ID Number"
                        secondary={verificationResult.extractedData.idNumber}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Date of Birth"
                        secondary={verificationResult.extractedData.dateOfBirth}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Expiry Date"
                        secondary={verificationResult.extractedData.expiryDate}
                      />
                    </ListItem>
                  </List>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Security Features:
                  </Typography>
                  <List dense>
                    {Object.entries(verificationResult.securityFeatures).map(
                      ([feature, present]) => (
                        <ListItem key={feature}>
                          <ListItemText
                            primary={feature
                              .replace(/([A-Z])/g, ' $1')
                              .replace(/^./, (str) => str.toUpperCase())}
                            secondary={
                              <Chip
                                label={present ? 'Present' : 'Not Detected'}
                                color={present ? 'success' : 'warning'}
                               
                              />
                            }
                          />
                        </ListItem>
                      ),
                    )}
                  </List>

                  {verificationResult.warnings.length > 0 && (
                    <Box mt={2}>
                      <Typography variant="subtitle1" gutterBottom>
                        Warnings:
                      </Typography>
                      {verificationResult.warnings.map((warning, index) => (
                        <Alert key={index} severity="warning" sx={{ mb: 1 }}>
                          {warning}
                        </Alert>
                      ))}
                    </Box>
                  )}
                </Grid>
              </Grid>
            )}

            <Box mt={3} display="flex" justifyContent="space-between">
              <Button
                variant="outlined"
                onClick={handleManualVerification}
                startIcon={<IconEdit />}
              >
                Manual Review
              </Button>
              <Box>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleReject}
                  startIcon={<IconX />}
                  sx={{ mr: 2 }}
                >
                  Reject
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleApprove}
                  startIcon={<IconCheck />}
                >
                  Approve
                </Button>
              </Box>
            </Box>
          </Box>
        );

      case 4:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Manual Verification
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              Please manually verify the document details and enter the correct information.
            </Alert>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={manualData.name}
                  onChange={(e) => setManualData({ ...manualData, name: e.target.value })}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="ID Number"
                  value={manualData.idNumber}
                  onChange={(e) => setManualData({ ...manualData, idNumber: e.target.value })}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  value={manualData.dateOfBirth}
                  onChange={(e) => setManualData({ ...manualData, dateOfBirth: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Address"
                  multiline
                  rows={3}
                  value={manualData.address}
                  onChange={(e) => setManualData({ ...manualData, address: e.target.value })}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Expiry Date"
                  type="date"
                  value={manualData.expiryDate}
                  onChange={(e) => setManualData({ ...manualData, expiryDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  margin="normal"
                />
              </Grid>
            </Grid>

            <Box mt={3} display="flex" justifyContent="space-between">
              <Button variant="outlined" onClick={() => setActiveStep(3)}>
                Back to Results
              </Button>
              <Box>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleReject}
                  startIcon={<IconX />}
                  sx={{ mr: 2 }}
                >
                  Reject
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleApprove}
                  startIcon={<IconCheck />}
                >
                  Approve Manual Entry
                </Button>
              </Box>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <PageContainer title="ID Verification" description="Verify visitor identification documents">
      <Box>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            ID Verification System
          </Typography>
          <Button variant="outlined" startIcon={<IconRefresh />} onClick={resetVerification}>
            New Verification
          </Button>
        </Box>

        <Grid container spacing={3}>
          {/* Main Verification Process */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Document Verification Process
                </Typography>

                <Stepper activeStep={activeStep} orientation="vertical">
                  <Step>
                    <StepLabel>Select Document Type</StepLabel>
                    <StepContent>{getStepContent(0)}</StepContent>
                  </Step>
                  <Step>
                    <StepLabel>Review Document</StepLabel>
                    <StepContent>{getStepContent(1)}</StepContent>
                  </Step>
                  <Step>
                    <StepLabel>Processing</StepLabel>
                    <StepContent>{getStepContent(2)}</StepContent>
                  </Step>
                  <Step>
                    <StepLabel>Verification Results</StepLabel>
                    <StepContent>{getStepContent(3)}</StepContent>
                  </Step>
                  <Step>
                    <StepLabel>Manual Review</StepLabel>
                    <StepContent>{getStepContent(4)}</StepContent>
                  </Step>
                </Stepper>

                {activeStep < 4 && getStepContent(activeStep)}
              </CardContent>
            </Card>
          </Grid>

          {/* Pending Verifications */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Pending Verifications
                </Typography>

                {pendingVerifications.length === 0 ? (
                  <Typography variant="body2" color="textSecondary">
                    No pending verifications
                  </Typography>
                ) : (
                  <List>
                    {pendingVerifications.map((verification, index) => (
                      <React.Fragment key={verification.id}>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar>
                              <IconUser />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={verification.visitorName}
                            secondary={
                              <Box>
                                <Typography variant="caption">{verification.idType}</Typography>
                                <br />
                                <Typography variant="caption">
                                  {verification.submitTime.toLocaleTimeString()}
                                </Typography>
                              </Box>
                            }
                          />
                          <Chip
                            label={verification.urgency}
                            color={verification.urgency === 'high' ? 'error' : 'default'}
                           
                          />
                        </ListItem>
                        {index < pendingVerifications.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Today's Stats
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="h4" color="success.main">
                      24
                    </Typography>
                    <Typography variant="caption">Verified</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h4" color="error.main">
                      3
                    </Typography>
                    <Typography variant="caption">Rejected</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default IDVerification;
