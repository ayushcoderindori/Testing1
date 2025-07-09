import React, { useState, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Stack,
  Alert,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  VideoCall as VideoIcon,
  MonetizationOn as CreditIcon,
  Timer as TimerIcon,
  Visibility as PreviewIcon,
  Delete as DeleteIcon,
  CheckCircle as SuccessIcon,
  Star as PremiumIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../auth/useAuth.js";
import Grid2 from '@mui/material/Grid2';

const categories = [
  "Tech", "Entertainment", "Education", "Gaming", "Art", "Music", 
  "Dance", "Comedy", "Sports", "Cooking", "Travel", "Lifestyle"
];

const UploadZone = ({ onFileSelect, isDragOver, setIsDragOver, maxDuration, userType }) => {
  const fileInputRef = useRef();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    const videoFile = files.find(file => file.type.startsWith('video/'));
    if (videoFile) {
      onFileSelect(videoFile);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Paper
        sx={{
          p: 6,
          textAlign: "center",
          border: `2px dashed ${isDragOver ? '#1976d2' : '#e0e0e0'}`,
          borderRadius: 3,
          bgcolor: isDragOver ? 'rgba(25, 118, 210, 0.05)' : 'background.paper',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden'
        }}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <motion.div
          animate={{ 
            y: isDragOver ? -10 : 0,
            rotate: isDragOver ? 5 : 0 
          }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <VideoIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
        </motion.div>
        
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Drop your video here or click to browse
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Maximum duration: <strong>{maxDuration}s</strong> ({userType} user)
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
          <Chip label="MP4" color="primary" variant="outlined" />
          <Chip label="MOV" color="primary" variant="outlined" />
          <Chip label="AVI" color="primary" variant="outlined" />
          <Chip label="WebM" color="primary" variant="outlined" />
        </Box>

        <Button
          variant="contained"
          size="large"
          startIcon={<UploadIcon />}
          sx={{
            background: 'linear-gradient(45deg, #FF6B6B, #FF8E53)',
            '&:hover': {
              background: 'linear-gradient(45deg, #FF5252, #FF7043)',
            }
          }}
        >
          Choose Video File
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />
      </Paper>
    </motion.div>
  );
};

const VideoPreview = ({ file, duration, onRemove }) => {
  const [previewUrl, setPreviewUrl] = useState('');

  React.useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <Card sx={{ position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'relative' }}>
          <video
            src={previewUrl}
            controls
            style={{
              width: '100%',
              height: '200px',
              objectFit: 'cover'
            }}
          />
          <IconButton
            onClick={onRemove}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(0,0,0,0.7)',
              color: 'white',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.9)' }
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
        <CardContent>
          <Typography variant="subtitle1" noWrap>{file.name}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
            <Chip
              icon={<TimerIcon />}
              label={`${Math.round(duration)}s`}
              size="small"
              color={duration <= 90 ? 'success' : duration <= 180 ? 'warning' : 'error'}
            />
            <Typography variant="caption" color="text.secondary">
              {(file.size / (1024 * 1024)).toFixed(1)} MB
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function UploadVideo() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: [],
    isPrivate: false,
    allowComments: true,
    allowLikes: true
  });
  const [videoFile, setVideoFile] = useState(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentTag, setCurrentTag] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [errors, setErrors] = useState({});

  const maxDuration = user?.isPremium ? 180 : 90;
  const userType = user?.isPremium ? 'Premium' : 'Free';

  const handleVideoSelect = (file) => {
    // Create video element to get duration
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      const duration = video.duration;
      setVideoDuration(duration);
      
      if (duration > maxDuration) {
        setErrors({
          video: `Video duration (${Math.round(duration)}s) exceeds ${maxDuration}s limit for ${userType} users`
        });
        return;
      }
      
      setVideoFile(file);
      setErrors({});
      URL.revokeObjectURL(video.src);
    };
    video.src = URL.createObjectURL(file);
  };

  const handleFormChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim()) && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!videoFile) newErrors.video = 'Video file is required';
    if (formData.tags.length === 0) newErrors.tags = 'At least one tag is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpload = async () => {
    if (!validateForm()) return;
    
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setIsUploading(false);
        setShowSuccessDialog(true);
        // Add 5 credits to user
      }, 500);
      
    } catch (error) {
      clearInterval(progressInterval);
      setIsUploading(false);
      setErrors({ upload: 'Upload failed. Please try again.' });
    }
  };

  const handleNewUpload = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      tags: [],
      isPrivate: false,
      allowComments: true,
      allowLikes: true
    });
    setVideoFile(null);
    setVideoDuration(0);
    setCurrentTag('');
    setErrors({});
    setUploadProgress(0);
    setShowSuccessDialog(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom fontWeight="bold">
            🎬 Upload Your Video
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Share your creativity and earn 5 credits!
          </Typography>
          
          {/* Credit Reward Banner */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <Card
              sx={{
                p: 2,
                bgcolor: 'success.light',
                color: 'success.contrastText',
                maxWidth: 400,
                mx: 'auto',
                mt: 3
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CreditIcon sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  +5 Credits
                </Typography>
                <Typography variant="body2" sx={{ ml: 1 }}>
                  per upload
                </Typography>
              </Box>
            </Card>
          </motion.div>
        </Box>

        <Grid2 container spacing={4}>
          {/* Upload Section */}
          <Grid2 xs={12} md={6}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              1. Select Your Video
            </Typography>
            
            {!videoFile ? (
              <UploadZone
                onFileSelect={handleVideoSelect}
                isDragOver={isDragOver}
                setIsDragOver={setIsDragOver}
                maxDuration={maxDuration}
                userType={userType}
              />
            ) : (
              <VideoPreview
                file={videoFile}
                duration={videoDuration}
                onRemove={() => setVideoFile(null)}
              />
            )}

            {errors.video && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errors.video}
              </Alert>
            )}

            {/* Duration Limits Info */}
            <Card sx={{ mt: 3, p: 2, bgcolor: 'info.light' }}>
              <Typography variant="subtitle2" gutterBottom>
                Duration Limits:
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Chip 
                  label={`Free: ${90}s`}
                  color={!user?.isPremium ? "primary" : "default"}
                  variant={!user?.isPremium ? "filled" : "outlined"}
                />
                <Chip 
                  label={`Premium: ${180}s`}
                  color={user?.isPremium ? "warning" : "default"}
                  variant={user?.isPremium ? "filled" : "outlined"}
                  icon={<PremiumIcon />}
                />
              </Box>
            </Card>
          </Grid2>

          {/* Form Section */}
          <Grid2 xs={12} md={6}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              2. Video Details
            </Typography>

            <Stack spacing={3}>
              <TextField
                label="Video Title"
                placeholder="Give your video an awesome title..."
                value={formData.title}
                onChange={handleFormChange('title')}
                fullWidth
                required
                error={!!errors.title}
                helperText={errors.title}
              />

              <TextField
                label="Description"
                placeholder="Tell viewers what your video is about..."
                value={formData.description}
                onChange={handleFormChange('description')}
                fullWidth
                multiline
                rows={4}
                required
                error={!!errors.description}
                helperText={errors.description}
              />

              <FormControl fullWidth required error={!!errors.category}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  onChange={handleFormChange('category')}
                  label="Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Tags */}
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Tags (up to 5)
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <AnimatePresence>
                    {formData.tags.map((tag) => (
                      <motion.div
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <Chip
                          label={`#${tag}`}
                          onDelete={() => handleRemoveTag(tag)}
                          color="primary"
                          variant="outlined"
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    label="Add Tag"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    size="small"
                    disabled={formData.tags.length >= 5}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleAddTag}
                    disabled={!currentTag.trim() || formData.tags.length >= 5}
                  >
                    Add
                  </Button>
                </Box>
                {errors.tags && (
                  <Typography variant="caption" color="error">
                    {errors.tags}
                  </Typography>
                )}
              </Box>

              {/* Privacy Settings */}
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Privacy & Interaction
                </Typography>
                <Stack spacing={1}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isPrivate}
                        onChange={(e) => setFormData(prev => ({ ...prev, isPrivate: e.target.checked }))}
                      />
                    }
                    label="Make video private"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.allowComments}
                        onChange={(e) => setFormData(prev => ({ ...prev, allowComments: e.target.checked }))}
                      />
                    }
                    label="Allow comments"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.allowLikes}
                        onChange={(e) => setFormData(prev => ({ ...prev, allowLikes: e.target.checked }))}
                      />
                    }
                    label="Allow likes/dislikes"
                  />
                </Stack>
              </Box>
            </Stack>
          </Grid2>
        </Grid2>

        {/* Upload Progress */}
        <AnimatePresence>
          {isUploading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card sx={{ mt: 4, p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Uploading your video...
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={uploadProgress}
                  sx={{ height: 8, borderRadius: 1, mb: 2 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {Math.round(uploadProgress)}% completed
                </Typography>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Button */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleUpload}
            disabled={isUploading || !videoFile}
            sx={{
              px: 6,
              py: 2,
              fontSize: '1.1rem',
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
                transform: 'translateY(-2px)',
              },
              '&:disabled': {
                background: 'grey.300',
              }
            }}
          >
            {isUploading ? 'Uploading...' : 'Upload Video & Earn 5 Credits'}
          </Button>
        </Box>

        {/* Success Dialog */}
        <Dialog
          open={showSuccessDialog}
          onClose={() => setShowSuccessDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <SuccessIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
            </motion.div>
            <Typography variant="h5" fontWeight="bold">
              Upload Successful! 🎉
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ textAlign: 'center' }}>
            <Typography variant="body1" gutterBottom>
              Your video has been uploaded successfully!
            </Typography>
            <Card sx={{ p: 2, bgcolor: 'success.light', mt: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                +5 Credits Earned! 💰
              </Typography>
            </Card>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Your video is now being processed and will be available shortly.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
            <Button variant="outlined" onClick={handleNewUpload}>
              Upload Another
            </Button>
            <Button variant="contained" onClick={() => setShowSuccessDialog(false)}>
              View My Videos
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Container>
  );
}
