import React, { useState } from "react";
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
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../auth/useAuth.js";
import { useNavigate } from "react-router-dom";

const mockDashboardData = {
  stats: {
    totalVideos: 12,
    totalViews: 25430,
    totalLikes: 1280,
    totalComments: 340,
    creditsEarned: 60,
    subscribersGained: 145,
    watchTimeHours: 142,
    avgRating: 4.7
  },
  recentVideos: [
    {
      id: 1,
      title: "Epic Coding Session: Building React in 60 Seconds! 🔥",
      thumbnail: "https://picsum.photos/300/170?random=1",
      views: 3200,
      likes: 150,
      comments: 23,
      duration: 85,
      uploadedAt: "2 days ago",
      status: "published",
      earnings: 15
    },
    {
      id: 2,
      title: "Mind-Blowing Magic Trick Tutorial ✨",
      thumbnail: "https://picsum.photos/300/170?random=2",
      views: 1800,
      likes: 89,
      comments: 12,
      duration: 73,
      uploadedAt: "5 days ago",
      status: "published",
      earnings: 8
    },
    {
      id: 3,
      title: "AI Explained in Under 2 Minutes 🤖",
      thumbnail: "https://picsum.photos/300/170?random=3",
      views: 5600,
      likes: 420,
      comments: 78,
      duration: 165,
      uploadedAt: "1 week ago",
      status: "published",
      earnings: 25
    }
  ],
  analytics: {
    viewsThisWeek: [120, 150, 89, 200, 310, 280, 195],
    topCountries: ["United States", "India", "Germany", "Brazil", "Canada"],
    deviceTypes: { mobile: 65, desktop: 30, tablet: 5 }
  },
  notifications: [
    { id: 1, type: "milestone", message: "Congratulations! Your video reached 1K views", time: "2 hours ago" },
    { id: 2, type: "comment", message: "John commented on 'Epic Coding Session'", time: "4 hours ago" },
    { id: 3, type: "like", message: "Your video got 50 new likes today!", time: "6 hours ago" }
  ]
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

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

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom fontWeight="bold">
          Welcome back, {user?.fullName || "Creator"}! 🎬
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Track your video performance and grow your audience
        </Typography>
      </Box>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { 
            label: "Total Videos", 
            value: mockDashboardData.stats.totalVideos, 
            icon: <VideoIcon />,
            color: "primary.main",
            change: "+2 this week"
          },
          { 
            label: "Total Views", 
            value: formatNumber(mockDashboardData.stats.totalViews), 
            icon: <ViewIcon />,
            color: "success.main",
            change: "+1.2K this week"
          },
          { 
            label: "Total Likes", 
            value: formatNumber(mockDashboardData.stats.totalLikes), 
            icon: <LikeIcon />,
            color: "error.main",
            change: "+89 this week"
          },
          { 
            label: "Credits Earned", 
            value: mockDashboardData.stats.creditsEarned, 
            icon: <CreditIcon />,
            color: "warning.main",
            change: "+15 this week"
          },
          { 
            label: "Watch Time", 
            value: `${mockDashboardData.stats.watchTimeHours}h`, 
            icon: <TrendingIcon />,
            color: "info.main",
            change: "+23h this week"
          },
          { 
            label: "Avg Rating", 
            value: mockDashboardData.stats.avgRating, 
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
                    <Typography variant="h4" fontWeight="bold">
                      {stat.value}
                    </Typography>
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
                      Your Videos ({mockDashboardData.recentVideos.length})
                    </Typography>
                    <Button 
                      variant="contained" 
                      startIcon={<UploadIcon />}
                      onClick={() => navigate("/upload")}
                    >
                      Upload New Video
                    </Button>
                  </Box>

                  <Grid container spacing={3}>
                    {mockDashboardData.recentVideos.map((video) => (
                      <Grid item xs={12} md={6} key={video.id}>
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
                            onClick={() => navigate(`/video/${video.id}`)}
                          >
                            <Box sx={{ position: "relative" }}>
                              <CardMedia
                                component="img"
                                height="160"
                                image={video.thumbnail}
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
                                  <Typography variant="caption">{formatNumber(video.views)}</Typography>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                  <LikeIcon sx={{ fontSize: 16, mr: 0.5, color: "success.main" }} />
                                  <Typography variant="caption">{video.likes}</Typography>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                  <CommentIcon sx={{ fontSize: 16, mr: 0.5, color: "info.main" }} />
                                  <Typography variant="caption">{video.comments}</Typography>
                                </Box>
                              </Box>

                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
                                <Typography variant="caption" color="text.secondary">
                                  {video.uploadedAt}
                                </Typography>
                                <Chip 
                                  label={`+${video.earnings} credits`}
                                  size="small"
                                  color="success"
                                  variant="outlined"
                                />
                              </Box>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </Stack>
              )}

              {/* Analytics Tab */}
              {activeTab === 1 && (
                <Stack spacing={3}>
                  <Typography variant="h6">Video Analytics</Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Views This Week
                          </Typography>
                          <Box sx={{ height: 200, display: "flex", alignItems: "end", gap: 1 }}>
                            {mockDashboardData.analytics.viewsThisWeek.map((views, index) => (
                              <Box
                                key={index}
                                sx={{
                                  flex: 1,
                                  height: `${(views / 310) * 160}px`,
                                  bgcolor: "primary.main",
                                  borderRadius: 1,
                                  display: "flex",
                                  alignItems: "end",
                                  justifyContent: "center",
                                  pb: 1
                                }}
                              >
                                <Typography variant="caption" color="white">
                                  {views}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Top Countries
                          </Typography>
                          <Stack spacing={1}>
                            {mockDashboardData.analytics.topCountries.map((country, index) => (
                              <Box key={country} sx={{ display: "flex", alignItems: "center" }}>
                                <Typography variant="body2" sx={{ flex: 1 }}>
                                  {index + 1}. {country}
                                </Typography>
                                <LinearProgress
                                  variant="determinate"
                                  value={(5 - index) * 20}
                                  sx={{ width: 60, mr: 1 }}
                                />
                              </Box>
                            ))}
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
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

            {/* Recent Notifications */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Activity
                </Typography>
                <List dense>
                  {mockDashboardData.notifications.map((notification) => (
                    <ListItem key={notification.id} sx={{ px: 0 }}>
                      <ListItemText
                        primary={notification.message}
                        secondary={notification.time}
                        primaryTypographyProps={{ variant: "body2" }}
                        secondaryTypographyProps={{ variant: "caption" }}
                      />
                    </ListItem>
                  ))}
                </List>
                <Button variant="outlined" size="small" fullWidth sx={{ mt: 2 }}>
                  View All Activity
                </Button>
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
        <MenuItem onClick={handleMenuClose} sx={{ color: "error.main" }}>
          <DeleteIcon sx={{ mr: 2 }} />
          Delete Video
        </MenuItem>
      </Menu>
    </Container>
  );
}
