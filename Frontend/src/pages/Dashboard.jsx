import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  Tab,
  Tabs,
  Stack,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  CardMedia,
  Menu,
  MenuItem,
  Alert,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import Grid from '@mui/material/Grid';
import {
  TrendingUp as TrendingIcon,
  VideoLibrary as VideoIcon,
  People as PeopleIcon,
  Star as StarIcon,
  MonetizationOn as CreditIcon,
  Visibility as ViewIcon,
  ThumbUp as LikeIcon,
  Comment as CommentIcon,
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
  Analytics as AnalyticsIcon,
  CloudUpload as UploadIcon,
  CalendarToday as CalendarIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../auth/useAuth.js";
import { useNavigate } from "react-router-dom";
import { getDashboardStats, getChannelAnalytics, fetchVideos, deleteVideo } from "../api/videos.js";

export default function Dashboard() {
  const { user, connectionError } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(0);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Fetch dashboard stats
  const { data: dashboardStats, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
    enabled: !!user && !connectionError,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch user videos
  const { data: videosData, isLoading: videosLoading, error: videosError, refetch: refetchVideos } = useQuery({
    queryKey: ['userVideos'],
    queryFn: () => fetchVideos({ owner: user?._id }),
    enabled: !!user && !connectionError,
    retry: 2,
  });

  // Fetch analytics
  const { data: analyticsData, isLoading: analyticsLoading, error: analyticsError } = useQuery({
    queryKey: ['channelAnalytics'],
    queryFn: getChannelAnalytics,
    enabled: !!user && !connectionError && activeTab === 1,
    retry: 2,
  });

  // Delete video mutation
  const deleteVideoMutation = useMutation({
    mutationFn: deleteVideo,
    onSuccess: () => {
      queryClient.invalidateQueries(['userVideos']);
      queryClient.invalidateQueries(['dashboardStats']);
      handleMenuClose();
    },
    onError: (error) => {
      console.error('Delete video error:', error);
    }
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleVideoMenu = (event, video) => {
    event.stopPropagation();
    setSelectedVideo(video);
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedVideo(null);
  };

  const handleDeleteVideo = () => {
    if (selectedVideo) {
      deleteVideoMutation.mutate(selectedVideo._id);
    }
  };

  const handleRefresh = () => {
    refetchStats();
    refetchVideos();
    queryClient.invalidateQueries(['channelAnalytics']);
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Default stats for when API is not available
  const defaultStats = {
    totalVideos: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    creditsEarned: 0,
    subscribersGained: 0,
    watchTimeHours: 0,
    avgRating: 0
  };

  const stats = dashboardStats?.data || defaultStats;
  const videos = videosData?.data || [];

  // Show connection error
  if (connectionError) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={handleRefresh} startIcon={<RefreshIcon />}>
              Retry
            </Button>
          }
        >
          Cannot connect to server. Please ensure the backend is running and try again.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h3" gutterBottom fontWeight="bold">
            Welcome back, {user?.fullName || "Creator"}! 🎬
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Track your video performance and grow your audience
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          startIcon={<RefreshIcon />} 
          onClick={handleRefresh}
          disabled={statsLoading || videosLoading}
        >
          Refresh
        </Button>
      </Box>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { 
            label: "Total Videos", 
            value: stats.totalVideos, 
            icon: <VideoIcon />,
            color: "primary.main",
            change: "+2 this week"
          },
          { 
            label: "Total Views", 
            value: formatNumber(stats.totalViews), 
            icon: <ViewIcon />,
            color: "success.main",
            change: "+1.2K this week"
          },
          { 
            label: "Total Likes", 
            value: formatNumber(stats.totalLikes), 
            icon: <LikeIcon />,
            color: "error.main",
            change: "+89 this week"
          },
          { 
            label: "Credits Earned", 
            value: stats.creditsEarned, 
            icon: <CreditIcon />,
            color: "warning.main",
            change: "+15 this week"
          },
          { 
            label: "Watch Time", 
            value: `${stats.watchTimeHours}h`, 
            icon: <TrendingIcon />,
            color: "info.main",
            change: "+23h this week"
          },
          { 
            label: "Avg Rating", 
            value: stats.avgRating || "N/A", 
            icon: <StarIcon />,
            color: "secondary.main",
            change: "↑0.2 this month"
          }
        ].map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={stat.label}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card 
                sx={{ 
                  height: "100%",
                  transition: "all 0.3s ease",
                  "&:hover": { transform: "translateY(-4px)", boxShadow: 4 }
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box 
                      sx={{ 
                        p: 1, 
                        borderRadius: 2, 
                        bgcolor: stat.color,
                        color: "white",
                        mr: 2 
                      }}
                    >
                      {stat.icon}
                    </Box>
                    {statsLoading ? (
                      <Skeleton variant="text" width={60} height={40} />
                    ) : (
                      <Typography variant="h4" fontWeight="bold">
                        {stat.value}
                      </Typography>
                    )}
                  </Box>
                  <Typography variant="subtitle2" gutterBottom>
                    {stat.label}
                  </Typography>
                  <Typography variant="caption" color="success.main">
                    {stat.change}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Error handling */}
      {(statsError || videosError) && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Some data couldn't be loaded. {statsError?.message || videosError?.message}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ mb: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="My Videos" />
              <Tab label="Analytics" />
              <Tab label="Comments & Reviews" />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {/* My Videos Tab */}
              {activeTab === 0 && (
                <Stack spacing={3}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6">
                      Your Videos ({videos.length})
                    </Typography>
                    <Button 
                      variant="contained" 
                      startIcon={<UploadIcon />}
                      onClick={() => navigate("/upload")}
                    >
                      Upload New Video
                    </Button>
                  </Box>

                  {videosLoading ? (
                    <Grid container spacing={3}>
                      {[1, 2, 3, 4].map((item) => (
                        <Grid item xs={12} md={6} key={item}>
                          <Card>
                            <Skeleton variant="rectangular" height={160} />
                            <CardContent>
                              <Skeleton variant="text" height={30} />
                              <Skeleton variant="text" height={20} />
                              <Skeleton variant="text" height={20} />
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  ) : videos.length === 0 ? (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <VideoIcon sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No videos uploaded yet
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Start creating content to see your videos here
                      </Typography>
                      <Button 
                        variant="contained" 
                        startIcon={<UploadIcon />}
                        onClick={() => navigate("/upload")}
                      >
                        Upload Your First Video
                      </Button>
                    </Box>
                  ) : (
                    <Grid container spacing={3}>
                      {videos.map((video) => (
                        <Grid item xs={12} md={6} key={video._id}>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Card 
                              sx={{ 
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                "&:hover": { boxShadow: 4 }
                              }}
                              onClick={() => navigate(`/video/${video._id}`)}
                            >
                              <Box sx={{ position: "relative" }}>
                                <CardMedia
                                  component="img"
                                  height="160"
                                  image={video.thumbnail || "https://picsum.photos/300/170?random=" + video._id}
                                  alt={video.title}
                                />
                                <Chip
                                  label={formatDuration(video.duration)}
                                  size="small"
                                  sx={{
                                    position: "absolute",
                                    bottom: 8,
                                    right: 8,
                                    bgcolor: "rgba(0,0,0,0.8)",
                                    color: "white"
                                  }}
                                />
                                <IconButton
                                  onClick={(e) => handleVideoMenu(e, video)}
                                  sx={{
                                    position: "absolute",
                                    top: 8,
                                    right: 8,
                                    bgcolor: "rgba(0,0,0,0.5)",
                                    color: "white",
                                    "&:hover": { bgcolor: "rgba(0,0,0,0.8)" }
                                  }}
                                >
                                  <MoreIcon />
                                </IconButton>
                              </Box>
                              <CardContent>
                                <Typography variant="subtitle1" fontWeight="bold" noWrap>
                                  {video.title}
                                </Typography>
                                
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
                                  <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <ViewIcon sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }} />
                                    <Typography variant="caption">{formatNumber(video.views || 0)}</Typography>
                                  </Box>
                                  <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <LikeIcon sx={{ fontSize: 16, mr: 0.5, color: "success.main" }} />
                                    <Typography variant="caption">{video.likesCount || 0}</Typography>
                                  </Box>
                                  <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <CommentIcon sx={{ fontSize: 16, mr: 0.5, color: "info.main" }} />
                                    <Typography variant="caption">{video.commentsCount || 0}</Typography>
                                  </Box>
                                </Box>

                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
                                  <Typography variant="caption" color="text.secondary">
                                    {new Date(video.createdAt).toLocaleDateString()}
                                  </Typography>
                                  <Chip 
                                    label={video.isPublished ? "Published" : "Draft"}
                                    size="small"
                                    color={video.isPublished ? "success" : "default"}
                                    variant="outlined"
                                  />
                                </Box>
                              </CardContent>
                            </Card>
                          </motion.div>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Stack>
              )}

              {/* Analytics Tab */}
              {activeTab === 1 && (
                <Stack spacing={3}>
                  <Typography variant="h6">Video Analytics</Typography>
                  
                  {analyticsLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : analyticsError ? (
                    <Alert severity="info">
                      Analytics data is currently unavailable. Please check back later.
                    </Alert>
                  ) : (
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={8}>
                        <Card>
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              Views This Week
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Analytics visualization coming soon
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <Card>
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              Performance Summary
                            </Typography>
                            <Stack spacing={1}>
                              <Typography variant="body2">
                                Total Views: {formatNumber(stats.totalViews)}
                              </Typography>
                              <Typography variant="body2">
                                Total Likes: {formatNumber(stats.totalLikes)}
                              </Typography>
                              <Typography variant="body2">
                                Watch Time: {stats.watchTimeHours}h
                              </Typography>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  )}
                </Stack>
              )}

              {/* Comments Tab */}
              {activeTab === 2 && (
                <Stack spacing={3}>
                  <Typography variant="h6">Recent Comments & Feedback</Typography>
                  <Typography variant="body1" color="text.secondary">
                    Comments and feedback management coming soon! 💬
                  </Typography>
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <CommentIcon sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      No recent comments to display
                    </Typography>
                  </Box>
                </Stack>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={3}>
            {/* Quick Actions */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Stack spacing={2}>
                  <Button 
                    variant="contained" 
                    startIcon={<UploadIcon />} 
                    fullWidth
                    onClick={() => navigate("/upload")}
                  >
                    Upload New Video
                  </Button>
                  <Button variant="outlined" startIcon={<AnalyticsIcon />} fullWidth>
                    View Analytics
                  </Button>
                  <Button variant="outlined" startIcon={<CreditIcon />} fullWidth>
                    Earnings Report
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            {/* Upload Tips */}
            <Card sx={{ bgcolor: "info.light" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  💡 Upload Tips
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body2">
                    • Keep videos under {user?.isPremium ? "180" : "90"} seconds
                  </Typography>
                  <Typography variant="body2">
                    • Use catchy titles with emojis
                  </Typography>
                  <Typography variant="body2">
                    • Upload consistently for more views
                  </Typography>
                  <Typography variant="body2">
                    • Engage with your audience in comments
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      {/* Video Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <EditIcon sx={{ mr: 2 }} />
          Edit Video
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ShareIcon sx={{ mr: 2 }} />
          Share Video
        </MenuItem>
        <MenuItem 
          onClick={handleDeleteVideo} 
          sx={{ color: "error.main" }}
          disabled={deleteVideoMutation.isPending}
        >
          <DeleteIcon sx={{ mr: 2 }} />
          {deleteVideoMutation.isPending ? "Deleting..." : "Delete Video"}
        </MenuItem>
      </Menu>
    </Container>
  );
}
