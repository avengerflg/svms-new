import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Paper,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Fab,
} from '@mui/material'; 
import {
  IconCamera,
  IconRefresh,
  IconCheck,
  IconX,
  IconDownload,
  IconUpload,
  IconUser,
  IconSearch,
  IconFilter,
  IconScan,
  IconPhotoCheck,
  IconCameraOff,
  IconFlash,
  IconFlashOff,
} from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import { useAuth } from '../../context/AuthContext';

interface CapturedPhoto {
  id: string;
  visitorName: string;
  captureTime: Date;
  imageData: string;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  faceDetected: boolean;
  isApproved?: boolean;
  metadata: {
    resolution: string;
    lighting: string;
    angle: string;
    clarity: number;
  };
}

interface PhotoSession {
  id: string;
  visitorId: string;
  visitorName: string;
  photos: CapturedPhoto[];
  status: 'active' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  purpose: string;
}

const PhotoCapture: React.FC = () => {
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);
  const [currentSession, setCurrentSession] = useState<PhotoSession | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<CapturedPhoto | null>(null);
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');
  const [photoSessions, setPhotoSessions] = useState<PhotoSession[]>([]);
  const [filters, setFilters] = useState({
    status: 'all',
    quality: 'all',
    dateRange: 'today',
  });

  // Mock data for photo sessions
  const mockPhotoSessions: PhotoSession[] = [
    {
      id: '1',
      visitorId: 'V001',
      visitorName: 'John Doe',
      photos: [],
      status: 'completed',
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      endTime: new Date(Date.now() - 2 * 60 * 60 * 1000 + 10 * 60 * 1000),
      purpose: 'Visitor Registration',
    },
    {
      id: '2',
      visitorId: 'V002',
      visitorName: 'Jane Smith',
      photos: [],
      status: 'active',
      startTime: new Date(Date.now() - 15 * 60 * 1000),
      purpose: 'Security Verification',
    },
  ];

  React.useEffect(() => {
    setPhotoSessions(mockPhotoSessions);
  }, []);

  const startCamera = useCallback(async () => {
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
        setIsStreaming(true);
      }
    } catch (error) {
      console.error('Error starting camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  }, [cameraFacing]);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.9);

        // Simulate photo quality analysis
        const quality = Math.random();
        const qualityLevel =
          quality > 0.8 ? 'excellent' : quality > 0.6 ? 'good' : quality > 0.4 ? 'fair' : 'poor';

        const newPhoto: CapturedPhoto = {
          id: `photo_${Date.now()}`,
          visitorName: currentSession?.visitorName || 'Unknown Visitor',
          captureTime: new Date(),
          imageData,
          quality: qualityLevel,
          faceDetected: Math.random() > 0.2, // 80% chance of face detection
          metadata: {
            resolution: `${canvas.width}x${canvas.height}`,
            lighting: Math.random() > 0.7 ? 'excellent' : Math.random() > 0.4 ? 'good' : 'poor',
            angle: Math.random() > 0.8 ? 'perfect' : 'acceptable',
            clarity: Math.floor(quality * 100),
          },
        };

        setCapturedPhotos((prev) => [newPhoto, ...prev]);

        // Update current session
        if (currentSession) {
          setCurrentSession((prev) =>
            prev
              ? {
                  ...prev,
                  photos: [newPhoto, ...prev.photos],
                }
              : null,
          );
        }
      }
    }
  }, [currentSession]);

  const startNewSession = (visitorName: string, purpose: string) => {
    const newSession: PhotoSession = {
      id: `session_${Date.now()}`,
      visitorId: `V${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      visitorName,
      photos: [],
      status: 'active',
      startTime: new Date(),
      purpose,
    };

    setCurrentSession(newSession);
    setPhotoSessions((prev) => [newSession, ...prev.filter((s) => s.id !== newSession.id)]);
  };

  const endSession = () => {
    if (currentSession) {
      const updatedSession = {
        ...currentSession,
        status: 'completed' as const,
        endTime: new Date(),
      };

      setPhotoSessions((prev) =>
        prev.map((session) => (session.id === currentSession.id ? updatedSession : session)),
      );
      setCurrentSession(null);
      stopCamera();
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        const newPhoto: CapturedPhoto = {
          id: `upload_${Date.now()}`,
          visitorName: currentSession?.visitorName || 'Unknown Visitor',
          captureTime: new Date(),
          imageData,
          quality: 'good',
          faceDetected: true,
          metadata: {
            resolution: 'Unknown',
            lighting: 'unknown',
            angle: 'unknown',
            clarity: 75,
          },
        };

        setCapturedPhotos((prev) => [newPhoto, ...prev]);

        if (currentSession) {
          setCurrentSession((prev) =>
            prev
              ? {
                  ...prev,
                  photos: [newPhoto, ...prev.photos],
                }
              : null,
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const approvePhoto = (photoId: string) => {
    setCapturedPhotos((prev) =>
      prev.map((photo) => (photo.id === photoId ? { ...photo, isApproved: true } : photo)),
    );
  };

  const rejectPhoto = (photoId: string) => {
    setCapturedPhotos((prev) =>
      prev.map((photo) => (photo.id === photoId ? { ...photo, isApproved: false } : photo)),
    );
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent':
        return 'success';
      case 'good':
        return 'primary';
      case 'fair':
        return 'warning';
      case 'poor':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <PageContainer title="Photo Capture" description="Capture and manage visitor photos">
      <Box>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Photo Capture System
          </Typography>
          <Box>
            {!currentSession ? (
              <Button
                variant="contained"
                startIcon={<IconCamera />}
                onClick={() => {
                  const visitorName = prompt('Enter visitor name:');
                  const purpose =
                    prompt('Enter purpose (Registration/Verification):') || 'Registration';
                  if (visitorName) {
                    startNewSession(visitorName, purpose);
                    startCamera();
                  }
                }}
              >
                Start New Session
              </Button>
            ) : (
              <Button variant="outlined" color="error" onClick={endSession} startIcon={<IconX />}>
                End Session
              </Button>
            )}
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Camera Section */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">Camera Preview</Typography>
                  {currentSession && (
                    <Chip
                      label={`Session: ${currentSession.visitorName}`}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                </Box>

                {/* Camera Preview */}
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

                  {!isStreaming && (
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
                      <IconCameraOff xs={64} style={{ marginBottom: 16 }} />
                      <Typography variant="h6" gutterBottom>
                        Camera Not Active
                      </Typography>
                      <Button variant="contained" onClick={startCamera} startIcon={<IconCamera />}>
                        Start Camera
                      </Button>
                    </Box>
                  )}

                  {/* Camera Controls Overlay */}
                  {isStreaming && (
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 16,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        gap: 2,
                      }}
                    >
                      <Fab color="primary" onClick={capturePhoto} disabled={!currentSession}>
                        <IconCamera />
                      </Fab>

                      <Fab
                       
                        onClick={() => setFlashEnabled(!flashEnabled)}
                        color={flashEnabled ? 'secondary' : 'default'}
                      >
                        {flashEnabled ? <IconFlash /> : <IconFlashOff />}
                      </Fab>

                      <Fab
                       
                        onClick={() =>
                          setCameraFacing((prev) => (prev === 'user' ? 'environment' : 'user'))
                        }
                      >
                        <IconRefresh />
                      </Fab>
                    </Box>
                  )}
                </Paper>

                {/* Camera Controls */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" gap={2}>
                    <Button
                      variant="outlined"
                      startIcon={<IconUpload />}
                      onClick={() => fileInputRef.current?.click()}
                      disabled={!currentSession}
                    >
                      Upload Photo
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handlePhotoUpload}
                    />
                  </Box>

                  <Typography variant="caption" color="textSecondary">
                    {isStreaming ? 'Camera Active' : 'Camera Inactive'}
                  </Typography>
                </Box>

                <canvas ref={canvasRef} style={{ display: 'none' }} />
              </CardContent>
            </Card>

            {/* Recent Photos */}
            {capturedPhotos.length > 0 && (
              <Card sx={{ mt: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Captured Photos ({capturedPhotos.length})
                  </Typography>

                  <Grid container spacing={2}>
                    {capturedPhotos.slice(0, 6).map((photo) => (
                      <Grid item xs={6} sm={4} xs={12} md={2} key={photo.id}>
                        <Paper
                          sx={{
                            cursor: 'pointer',
                            border:
                              photo.isApproved === true
                                ? '2px solid green'
                                : photo.isApproved === false
                                ? '2px solid red'
                                : '1px solid #ddd',
                          }}
                          onClick={() => {
                            setSelectedPhoto(photo);
                            setShowPhotoDialog(true);
                          }}
                        >
                          <img
                            src={photo.imageData}
                            alt={`Captured at ${photo.captureTime.toLocaleTimeString()}`}
                            style={{
                              width: '100%',
                              height: '120px',
                              objectFit: 'cover',
                            }}
                          />
                          <Box p={1}>
                            <Chip
                              label={photo.quality}
                              color={getQualityColor(photo.quality) as any}
                             
                            />
                            {photo.faceDetected && (
                              <Chip label="Face" color="success" sx={{ ml: 0.5 }} />
                            )}
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Session Info & History */}
          <Grid item xs={12} md={4}>
            {/* Current Session */}
            {currentSession && (
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Current Session
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText primary="Visitor" secondary={currentSession.visitorName} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Purpose" secondary={currentSession.purpose} />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Started"
                        secondary={currentSession.startTime.toLocaleTimeString()}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Photos Captured"
                        secondary={currentSession.photos.length}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            )}

            {/* Photo Sessions History */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Photo Sessions
                </Typography>

                {/* Filters */}
                <Box display="flex" gap={1} mb={2}>
                  <FormControl sx={{ minWidth: 100 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <List>
                  {photoSessions
                    .filter(
                      (session) => filters.status === 'all' || session.status === filters.status,
                    )
                    .map((session, index) => (
                      <React.Fragment key={session.id}>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar>
                              <IconUser />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={session.visitorName}
                            secondary={
                              <Box>
                                <Typography variant="caption">{session.purpose}</Typography>
                                <br />
                                <Typography variant="caption">
                                  {session.startTime.toLocaleString()}
                                </Typography>
                                <br />
                                <Chip
                                  label={session.status}
                                  color={session.status === 'active' ? 'primary' : 'success'}
                                 
                                />
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < photoSessions.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                </List>
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
                    <Typography variant="h4" color="primary">
                      {capturedPhotos.length}
                    </Typography>
                    <Typography variant="caption">Photos Captured</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h4" color="success.main">
                      {capturedPhotos.filter((p) => p.isApproved === true).length}
                    </Typography>
                    <Typography variant="caption">Approved</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Photo Detail Dialog */}
        <Dialog
          open={showPhotoDialog}
          onClose={() => setShowPhotoDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Photo Details</DialogTitle>
          <DialogContent>
            {selectedPhoto && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <img
                    src={selectedPhoto.imageData}
                    alt="Selected photo"
                    style={{
                      width: '100%',
                      height: 'auto',
                      border: '1px solid #ddd',
                      borderRadius: 8,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <List>
                    <ListItem>
                      <ListItemText primary="Visitor" secondary={selectedPhoto.visitorName} />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Capture Time"
                        secondary={selectedPhoto.captureTime.toLocaleString()}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Quality"
                        secondary={
                          <Chip
                            label={selectedPhoto.quality}
                            color={getQualityColor(selectedPhoto.quality) as any}
                          />
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Face Detected"
                        secondary={selectedPhoto.faceDetected ? 'Yes' : 'No'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Resolution"
                        secondary={selectedPhoto.metadata.resolution}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Lighting"
                        secondary={selectedPhoto.metadata.lighting}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Clarity Score"
                        secondary={`${selectedPhoto.metadata.clarity}%`}
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowPhotoDialog(false)}>Close</Button>
            {selectedPhoto && selectedPhoto.isApproved === undefined && (
              <>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    rejectPhoto(selectedPhoto.id);
                    setShowPhotoDialog(false);
                  }}
                  startIcon={<IconX />}
                >
                  Reject
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => {
                    approvePhoto(selectedPhoto.id);
                    setShowPhotoDialog(false);
                  }}
                  startIcon={<IconCheck />}
                >
                  Approve
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>
      </Box>
    </PageContainer>
  );
};

export default PhotoCapture;
