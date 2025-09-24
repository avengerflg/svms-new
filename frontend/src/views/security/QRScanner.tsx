import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Switch,
  FormControlLabel,
  Snackbar,
} from '@mui/material'; 
import {
  IconQrcode,
  IconScan,
  IconCheck,
  IconX,
  IconRefresh,
  IconCopy,
  IconDownload,
  IconUpload,
  IconUser,
  IconClock,
  IconMapPin,
  IconPhone,
  IconMail,
  IconAlertTriangle,
  IconShield,
  IconCamera,
  IconFlash,
  IconFlashOff,
} from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import { useAuth } from '../../context/AuthContext';

interface QRScanResult {
  id: string;
  type: 'visitor-badge' | 'pre-registration' | 'appointment' | 'emergency' | 'staff' | 'unknown';
  data: any;
  scanTime: Date;
  isValid: boolean;
  warnings: string[];
  scannedBy: string;
}

interface ScanHistory {
  id: string;
  visitorName: string;
  qrType: string;
  scanTime: Date;
  status: 'success' | 'failed' | 'suspicious';
  location: string;
  scannedBy: string;
  details?: any;
}

const QRScanner: React.FC = () => {
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<QRScanResult | null>(null);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [scanHistory, setScanHistory] = useState<ScanHistory[]>([]);
  const [continuousMode, setContinuousMode] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('environment');
  const [scanStats, setScanStats] = useState({
    totalScans: 0,
    successfulScans: 0,
    failedScans: 0,
    suspiciousScans: 0,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning',
  });

  // Mock scan history data
  const mockScanHistory: ScanHistory[] = [
    {
      id: '1',
      visitorName: 'John Doe',
      qrType: 'Visitor Badge',
      scanTime: new Date(Date.now() - 10 * 60 * 1000),
      status: 'success',
      location: 'Main Entrance',
      scannedBy: 'Security Guard',
    },
    {
      id: '2',
      visitorName: 'Jane Smith',
      qrType: 'Pre-Registration',
      scanTime: new Date(Date.now() - 30 * 60 * 1000),
      status: 'failed',
      location: 'Reception',
      scannedBy: 'Front Desk',
    },
    {
      id: '3',
      visitorName: 'Mike Johnson',
      qrType: 'Appointment',
      scanTime: new Date(Date.now() - 45 * 60 * 1000),
      status: 'success',
      location: 'Building A',
      scannedBy: 'Security Guard',
    },
  ];

  React.useEffect(() => {
    setScanHistory(mockScanHistory);
    setScanStats({
      totalScans: 127,
      successfulScans: 118,
      failedScans: 6,
      suspiciousScans: 3,
    });
  }, []);

  const startScanner = useCallback(async () => {
    try {
      const constraints = {
        video: {
          facingMode: cameraFacing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);

        // Start QR scanning simulation
        if (continuousMode) {
          startContinuousScanning();
        }
      }
    } catch (error) {
      console.error('Error starting camera:', error);
      setSnackbar({
        open: true,
        message: 'Unable to access camera. Please check permissions.',
        severity: 'error',
      });
    }
  }, [cameraFacing, continuousMode]);

  const stopScanner = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsScanning(false);
    }
  }, []);

  const startContinuousScanning = useCallback(() => {
    const scanInterval = setInterval(() => {
      if (isScanning && Math.random() > 0.7) {
        // 30% chance of detecting QR code
        simulateQRScan();
      }
    }, 2000);

    return () => clearInterval(scanInterval);
  }, [isScanning]);

  const simulateQRScan = useCallback(() => {
    const qrTypes = ['visitor-badge', 'pre-registration', 'appointment', 'staff', 'emergency'];
    const randomType = qrTypes[Math.floor(Math.random() * qrTypes.length)] as any;
    const isValid = Math.random() > 0.15; // 85% success rate

    const mockData = {
      'visitor-badge': {
        visitorId: 'V' + Math.floor(Math.random() * 1000),
        name: 'John Doe',
        purpose: 'Business Meeting',
        validUntil: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        issuedBy: 'Reception',
        issuedAt: new Date().toISOString(),
      },
      'pre-registration': {
        registrationId: 'REG' + Math.floor(Math.random() * 1000),
        visitorName: 'Jane Smith',
        appointmentTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        hostName: 'Dr. Wilson',
        department: 'Administration',
        purpose: 'Parent Meeting',
      },
      appointment: {
        appointmentId: 'APT' + Math.floor(Math.random() * 1000),
        visitorName: 'Mike Johnson',
        scheduledTime: new Date().toISOString(),
        hostEmployee: 'Sarah Connor',
        location: 'Conference Room A',
        duration: '30 minutes',
      },
      staff: {
        employeeId: 'EMP' + Math.floor(Math.random() * 1000),
        name: 'Alice Brown',
        department: 'Teaching Staff',
        accessLevel: 'Standard',
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      },
      emergency: {
        emergencyId: 'EMG' + Math.floor(Math.random() * 1000),
        type: 'Evacuation',
        issuedBy: 'Emergency Services',
        priority: 'High',
        instructions: 'Proceed to nearest exit',
      },
    };

    const warnings = [];
    if (!isValid) {
      warnings.push('QR code may be expired or invalid');
    }
    if (Math.random() > 0.8) {
      warnings.push('Visitor not found in system');
    }
    if (Math.random() > 0.9) {
      warnings.push('Suspicious QR code detected');
    }

    const result: QRScanResult = {
      id: `scan_${Date.now()}`,
      type: randomType,
      data: mockData[randomType] || {},
      scanTime: new Date(),
      isValid,
      warnings,
      scannedBy: user?.name || 'Unknown',
    };

    setScanResult(result);
    setShowResultDialog(true);

    // Add to scan history
    const historyEntry: ScanHistory = {
      id: result.id,
      visitorName: result.data.name || result.data.visitorName || 'Unknown',
      qrType: randomType.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      scanTime: result.scanTime,
      status: isValid ? 'success' : warnings.length > 0 ? 'suspicious' : 'failed',
      location: 'Main Scanner',
      scannedBy: user?.name || 'Unknown',
      details: result.data,
    };

    setScanHistory((prev) => [historyEntry, ...prev.slice(0, 9)]);

    // Update stats
    setScanStats((prev) => ({
      totalScans: prev.totalScans + 1,
      successfulScans: prev.successfulScans + (isValid ? 1 : 0),
      failedScans: prev.failedScans + (!isValid && warnings.length === 0 ? 1 : 0),
      suspiciousScans: prev.suspiciousScans + (warnings.length > 0 ? 1 : 0),
    }));

    if (!continuousMode) {
      stopScanner();
    }
  }, [user, continuousMode]);

  const handleManualScan = () => {
    simulateQRScan();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate QR code detection from uploaded image
      setTimeout(() => {
        simulateQRScan();
      }, 1000);
    }
  };

  const approveEntry = () => {
    if (scanResult) {
      setScanHistory((prev) =>
        prev.map((entry) => (entry.id === scanResult.id ? { ...entry, status: 'success' } : entry)),
      );
      setSnackbar({
        open: true,
        message: 'Entry approved successfully',
        severity: 'success',
      });
    }
    setShowResultDialog(false);
  };

  const denyEntry = () => {
    if (scanResult) {
      setScanHistory((prev) =>
        prev.map((entry) => (entry.id === scanResult.id ? { ...entry, status: 'failed' } : entry)),
      );
      setSnackbar({
        open: true,
        message: 'Entry denied',
        severity: 'warning',
      });
    }
    setShowResultDialog(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'failed':
        return 'error';
      case 'suspicious':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatQRData = (type: string, data: any) => {
    switch (type) {
      case 'visitor-badge':
        return (
          <List dense>
            <ListItem>
              <ListItemText primary="Visitor ID" secondary={data.visitorId} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Name" secondary={data.name} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Purpose" secondary={data.purpose} />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Valid Until"
                secondary={new Date(data.validUntil).toLocaleString()}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="Issued By" secondary={data.issuedBy} />
            </ListItem>
          </List>
        );

      case 'pre-registration':
        return (
          <List dense>
            <ListItem>
              <ListItemText primary="Registration ID" secondary={data.registrationId} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Visitor Name" secondary={data.visitorName} />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Appointment Time"
                secondary={new Date(data.appointmentTime).toLocaleString()}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="Host" secondary={data.hostName} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Department" secondary={data.department} />
            </ListItem>
          </List>
        );

      case 'appointment':
        return (
          <List dense>
            <ListItem>
              <ListItemText primary="Appointment ID" secondary={data.appointmentId} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Visitor Name" secondary={data.visitorName} />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Scheduled Time"
                secondary={new Date(data.scheduledTime).toLocaleString()}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="Host Employee" secondary={data.hostEmployee} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Location" secondary={data.location} />
            </ListItem>
          </List>
        );

      default:
        return <Typography variant="body2">{JSON.stringify(data, null, 2)}</Typography>;
    }
  };

  return (
    <PageContainer title="QR Scanner" description="Scan and verify QR codes for visitor management">
      <Box>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            QR Code Scanner
          </Typography>
          <Box display="flex" gap={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={continuousMode}
                  onChange={(e) => setContinuousMode(e.target.checked)}
                />
              }
              label="Continuous Mode"
            />
            {!isScanning ? (
              <Button variant="contained" startIcon={<IconScan />} onClick={startScanner}>
                Start Scanner
              </Button>
            ) : (
              <Button variant="outlined" color="error" onClick={stopScanner} startIcon={<IconX />}>
                Stop Scanner
              </Button>
            )}
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Scanner Section */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">QR Code Scanner</Typography>
                  <Box display="flex" gap={1}>
                    <IconButton
                      onClick={() =>
                        setCameraFacing((prev) => (prev === 'user' ? 'environment' : 'user'))
                      }
                      disabled={!isScanning}
                    >
                      <IconRefresh />
                    </IconButton>
                    <IconButton
                      onClick={() => setFlashEnabled(!flashEnabled)}
                      color={flashEnabled ? 'secondary' : 'default'}
                      disabled={!isScanning}
                    >
                      {flashEnabled ? <IconFlash /> : <IconFlashOff />}
                    </IconButton>
                  </Box>
                </Box>

                {/* Scanner Preview */}
                <Paper sx={{ position: 'relative', mb: 2 }}>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{
                      width: '100%',
                      height: '400px',
                      objectFit: 'cover',
                      background: '#000',
                    }}
                  />

                  {/* Scanner Overlay */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '200px',
                      height: '200px',
                      border: '3px solid #fff',
                      borderRadius: '12px',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: '-3px',
                        left: '-3px',
                        right: '-3px',
                        bottom: '-3px',
                        border: '3px solid rgba(25, 118, 210, 0.7)',
                        borderRadius: '12px',
                        animation: 'pulse 2s infinite',
                      },
                    }}
                  />

                  {!isScanning && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        color: 'white',
                      }}
                    >
                      <IconQrcode xs={64} style={{ marginBottom: 16 }} />
                      <Typography variant="h6" gutterBottom>
                        Scanner Inactive
                      </Typography>
                      <Button variant="contained" onClick={startScanner} startIcon={<IconScan />}>
                        Start Scanning
                      </Button>
                    </Box>
                  )}
                </Paper>

                {/* Manual Actions */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" gap={2}>
                    <Button
                      variant="outlined"
                      startIcon={<IconUpload />}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Upload QR Image
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleFileUpload}
                    />

                    <Button variant="outlined" startIcon={<IconScan />} onClick={handleManualScan}>
                      Simulate Scan
                    </Button>
                  </Box>

                  <Typography variant="caption" color="textSecondary">
                    {isScanning ? 'Scanning for QR codes...' : 'Scanner stopped'}
                  </Typography>
                </Box>

                <canvas ref={canvasRef} style={{ display: 'none' }} />
              </CardContent>
            </Card>
          </Grid>

          {/* Stats and History */}
          <Grid item xs={12} md={4}>
            {/* Scanner Stats */}
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Today's Scans
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="h4" color="primary">
                      {scanStats.totalScans}
                    </Typography>
                    <Typography variant="caption">Total Scans</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h4" color="success.main">
                      {scanStats.successfulScans}
                    </Typography>
                    <Typography variant="caption">Successful</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h4" color="error.main">
                      {scanStats.failedScans}
                    </Typography>
                    <Typography variant="caption">Failed</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h4" color="warning.main">
                      {scanStats.suspiciousScans}
                    </Typography>
                    <Typography variant="caption">Suspicious</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Recent Scans */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Scans
                </Typography>

                <List>
                  {scanHistory.slice(0, 6).map((scan, index) => (
                    <React.Fragment key={scan.id}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>
                            <IconUser />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={scan.visitorName}
                          secondary={
                            <Box>
                              <Typography variant="caption">
                                {scan.qrType} • {scan.scanTime.toLocaleTimeString()}
                              </Typography>
                              <br />
                              <Chip
                                label={scan.status}
                                color={getStatusColor(scan.status) as any}
                               
                              />
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < scanHistory.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Scan Result Dialog */}
        <Dialog
          open={showResultDialog}
          onClose={() => setShowResultDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={2}>
              <IconQrcode />
              QR Scan Result
              {scanResult && (
                <Chip
                  label={scanResult.isValid ? 'Valid' : 'Invalid'}
                  color={scanResult.isValid ? 'success' : 'error'}
                />
              )}
            </Box>
          </DialogTitle>
          <DialogContent>
            {scanResult && (
              <Box>
                {/* Warnings */}
                {scanResult.warnings.length > 0 && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Warnings:
                    </Typography>
                    {scanResult.warnings.map((warning, index) => (
                      <Typography key={index} variant="body2">
                        • {warning}
                      </Typography>
                    ))}
                  </Alert>
                )}

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Scan Information
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText
                          primary="QR Type"
                          secondary={scanResult.type
                            .replace('-', ' ')
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Scan Time"
                          secondary={scanResult.scanTime.toLocaleString()}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Scanned By" secondary={scanResult.scannedBy} />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Status"
                          secondary={scanResult.isValid ? 'Valid' : 'Invalid'}
                        />
                      </ListItem>
                    </List>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      QR Data
                    </Typography>
                    {formatQRData(scanResult.type, scanResult.data)}
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowResultDialog(false)}>Close</Button>
            {scanResult?.isValid && (
              <>
                <Button variant="outlined" color="error" onClick={denyEntry} startIcon={<IconX />}>
                  Deny Entry
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={approveEntry}
                  startIcon={<IconCheck />}
                >
                  Approve Entry
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

      <style jsx>{`
        @keyframes pulse {
          0% {
            border-color: rgba(25, 118, 210, 0.7);
          }
          50% {
            border-color: rgba(25, 118, 210, 1);
          }
          100% {
            border-color: rgba(25, 118, 210, 0.7);
          }
        }
      `}</style>
    </PageContainer>
  );
};

export default QRScanner;
