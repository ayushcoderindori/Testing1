import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Avatar,
  IconButton,
  Fab,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Tabs,
  Tab,
  Stack,
  Badge,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import {
  PlayArrow as PlayIcon,
  Favorite as LikeIcon,
  FavoriteBorder as LikeBorderIcon,
  ThumbDown as DislikeIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  CloudUpload as UploadIcon,
  TrendingUp as TrendingIcon,
  Whatshot as FireIcon,
  AccessTime as TimeIcon,
  Visibility as ViewIcon,
  Star as StarIcon,
  MonetizationOn as CreditIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import axios from "../api/axios.js";
import useAuth from "../auth/useAuth.js";

const mockVideos = [
  {
    id: 1,
    title: "Epic Coding Session: Building React in 60 Seconds! 🔥",
    thumbnail: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    duration: 85,
    views: 12500,
    likes: 890,
    dislikes: 12,
    uploadedAt: "2 hours ago",
    creator: {
      username: "codemaster_alex",
      avatar: "https://picsum.photos/40/40?random=101",
      isVerified: true,
      subscribers: 45200
    },
    category: "Tech",
    tags: ["coding", "react", "tutorial"],
    isPremium: false
  },
  {
    id: 2,
    title: "Mind-Blowing Magic Trick That Will Amaze You! ✨",
    thumbnail: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    duration: 73,
    views: 8900,
    likes: 1200,
    dislikes: 5,
    uploadedAt: "5 hours ago",
    creator: {
      username: "magic_sarah",
      avatar: "https://picsum.photos/40/40?random=102",
      isVerified: false,
      subscribers: 15600
    },
    category: "Entertainment",
    tags: ["magic", "amazing", "viral"],
    isPremium: false
  },
  {
    id: 3,
    title: "PREMIUM: Advanced AI Concepts Explained (3 Minutes) 🤖",
    thumbnail: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    duration: 165,
    views: 25600,
    likes: 2100,
    dislikes: 45,
    uploadedAt: "1 day ago",
    creator: {
      username: "ai_guru_mike",
      avatar: "https://picsum.photos/40/40?random=103",
      isVerified: true,
      subscribers: 125000
    },
    category: "Education",
    tags: ["AI", "machine learning", "premium"],
    isPremium: true
  },
  {
    id: 4,
    title: "VIRAL Dance Challenge Everyone's Doing! 💃",
    thumbnail: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    duration: 45,
    views: 45600,
    likes: 3200,
    dislikes: 89,
    uploadedAt: "3 hours ago",
    creator: {
      username: "dance_queen_emma",
      avatar: "https://picsum.photos/40/40?random=104",
      isVerified: true,
      subscribers: 89500
    },
    category: "Dance",
    tags: ["dance", "viral", "trending"],
    isPremium: false
  },
  {
    id: 5,
    title: "Learn JavaScript in 90 Seconds! ⚡",
    thumbnail: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    duration: 89,
    views: 18700,
    likes: 1560,
    dislikes: 23,
    uploadedAt: "6 hours ago",
    creator: {
      username: "js_master_dev",
      avatar: "https://picsum.photos/40/40?random=105",
      isVerified: true,
      subscribers: 67800
    },
    category: "Tech",
    tags: ["javascript", "programming", "beginner"],
    isPremium: false
  },
  {
    id: 6,
    title: "Incredible Nature Documentary - Wildlife Footage 🦁",
    thumbnail: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    duration: 78,
    views: 34200,
    likes: 2890,
    dislikes: 18,
    uploadedAt: "1 day ago",
    creator: {
      username: "nature_explorer",
      avatar: "https://picsum.photos/40/40?random=106",
      isVerified: true,
      subscribers: 156000
    },
    category: "Education",
    tags: ["nature", "animals", "documentary"],
    isPremium: false
  }
];

const categories = ["All", "Tech", "Entertainment", "Education", "Dance", "Gaming", "Art", "Music"];

export default function Home() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [likedVideos, setLikedVideos] = useState(new Set());
  const [dislikedVideos, setDislikedVideos] = useState(new Set());

  const { data: videos = mockVideos, isPending } = useQuery({
    queryKey: ["videos", selectedCategory],
    queryFn: async () => {
      // Simulate API call
      return mockVideos.filter(video => 
        selectedCategory === "All" || video.category === selectedCategory
      );
    },
  });

  const handleVideoPlay = (video) => {
    if (!user) {
      // Redirect to login
      return;
    }
    
    if (video.isPremium && !user.isPremium) {
      // Show premium upgrade dialog
      return;
    }
    
    if (user.credits < 1 && !user.isPremium) {
      // Show insufficient credits dialog
      return;
    }
    
    setSelectedVideo(video);
    setPlayingVideo(video.id);
  };

  const handleLike = (videoId) => {
    setLikedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
      } else {
        newSet.add(videoId);
        setDislikedVideos(prevDislikes => {
          const newDislikes = new Set(prevDislikes);
          newDislikes.delete(videoId);
          return newDislikes;
        });
      }
      return newSet;
    });
  };

  const handleDislike = (videoId) => {
    setDislikedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
      } else {
        newSet.add(videoId);
        setLikedVideos(prevLikes => {
          const newLikes = new Set(prevLikes);
          newLikes.delete(videoId);
          return newLikes;
        });
      }
      return newSet;
    });
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Hero Section with User Credits */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: 6,
          position: "relative",
          overflow: "hidden"
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "url('https://picsum.photos/1920/400?random=bg') center/cover",
            opacity: 0.1,
            animation: "float 20s ease-in-out infinite"
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
              <Box>
                <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
                  🎬 Welcome to VideoVault
                </Typography>
                <Typography variant="h5" sx={{ opacity: 0.9 }}>
                  Where every video is worth watching ✨
                </Typography>
              </Box>
              
              {user && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  <Card sx={{ p: 3, bgcolor: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}>
                    <Box sx={{ display: "flex", alignItems: "center", color: "white" }}>
                      <CreditIcon sx={{ mr: 1, color: "#FFD700" }} />
                      <Typography variant="h4" fontWeight="bold">
                        {user.credits || 25}
                      </Typography>
                      <Typography variant="body2" sx={{ ml: 1, opacity: 0.8 }}>
                        Credits
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      Watch: -1 • Upload: +5
                    </Typography>
                  </Card>
                </motion.div>
              )}
            </Box>

            {/* Quick Stats */}
            <Grid container spacing={2}>
              {[
                { label: "Videos Today", value: "1.2K", icon: "🎥" },
                { label: "Active Creators", value: "850", icon: "👥" },
                { label: "Credits Earned", value: "45K", icon: "💰" },
                { label: "Premium Users", value: "320", icon: "⭐" }
              ].map((stat, index) => (
                <Grid size={{ xs: 6, md: 3 }} key={stat.label}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="h3">{stat.icon}</Typography>
                      <Typography variant="h5" fontWeight="bold">
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        {stat.label}
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Category Tabs */}
        <Box sx={{ mb: 4 }}>
          <Tabs
            value={selectedCategory}
            onChange={(e, value) => setSelectedCategory(value)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": {
                minWidth: "auto",
                fontWeight: "bold",
                borderRadius: 3,
                mx: 0.5
              }
            }}
          >
            {categories.map((category) => (
              <Tab
                key={category}
                label={category}
                value={category}
                icon={category === "All" ? <TrendingIcon /> : <FireIcon />}
                iconPosition="start"
              />
            ))}
          </Tabs>
        </Box>

        {/* Video Grid */}
        <AnimatePresence>
          <Grid container spacing={3}>
            {videos.map((video, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={video.id}>
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                >
                  <Card
                    sx={{
                      position: "relative",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      overflow: "hidden",
                      "&:hover": {
                        boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
                        "& .video-overlay": {
                          opacity: 1
                        }
                      }
                    }}
                    onClick={() => handleVideoPlay(video)}
                  >
                    {/* Thumbnail with Play Overlay */}
                    <Box sx={{ position: "relative" }}>
                      <CardMedia
                        component="img"
                        height="180"
                        image={video.thumbnail}
                        alt={video.title}
                      />
                      
                      {/* Duration Badge */}
                      <Chip
                        label={formatDuration(video.duration)}
                        size="small"
                        sx={{
                          position: "absolute",
                          bottom: 8,
                          right: 8,
                          bgcolor: "rgba(0,0,0,0.8)",
                          color: "white",
                          fontWeight: "bold"
                        }}
                      />

                      {/* Premium Badge */}
                      {video.isPremium && (
                        <Chip
                          label="PREMIUM"
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 8,
                            left: 8,
                            bgcolor: "#FFD700",
                            color: "black",
                            fontWeight: "bold"
                          }}
                        />
                      )}

                      {/* Play Overlay */}
                      <Box
                        className="video-overlay"
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          bgcolor: "rgba(0,0,0,0.5)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: 0,
                          transition: "opacity 0.3s ease"
                        }}
                      >
                        <IconButton
                          size="large"
                          sx={{
                            bgcolor: "primary.main",
                            color: "white",
                            "&:hover": { bgcolor: "primary.dark", transform: "scale(1.1)" }
                          }}
                        >
                          <PlayIcon sx={{ fontSize: 40 }} />
                        </IconButton>
                      </Box>
                    </Box>

                    <CardContent sx={{ p: 2 }}>
                      {/* Creator Info */}
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <Avatar src={video.creator.avatar} sx={{ width: 32, height: 32, mr: 1 }} />
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {video.creator.username}
                            {video.creator.isVerified && " ✓"}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {video.uploadedAt}
                        </Typography>
                      </Box>

                      {/* Title */}
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        sx={{
                          mb: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          lineHeight: 1.3
                        }}
                      >
                        {video.title}
                      </Typography>

                      {/* Stats */}
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <ViewIcon sx={{ fontSize: 14, color: "text.secondary", mr: 0.5 }} />
                            <Typography variant="caption" color="text.secondary">
                              {formatNumber(video.views)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <LikeIcon sx={{ fontSize: 14, color: "success.main", mr: 0.5 }} />
                            <Typography variant="caption" color="text.secondary">
                              {formatNumber(video.likes)}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Action Buttons */}
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(video.id);
                            }}
                            color={likedVideos.has(video.id) ? "error" : "default"}
                          >
                            {likedVideos.has(video.id) ? <LikeIcon /> : <LikeBorderIcon />}
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDislike(video.id);
                            }}
                            color={dislikedVideos.has(video.id) ? "primary" : "default"}
                          >
                            <DislikeIcon />
                          </IconButton>
                          <IconButton size="small">
                            <ShareIcon />
                          </IconButton>
                        </Box>
                      </Box>

                      {/* Tags */}
                      <Box sx={{ mt: 1, display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                        {video.tags.slice(0, 2).map((tag) => (
                          <Chip
                            key={tag}
                            label={`#${tag}`}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: "0.7rem", height: 20 }}
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </AnimatePresence>

        {/* Upload FAB */}
        <Tooltip title="Upload Video (+5 Credits)">
          <Fab
            color="primary"
            size="large"
            sx={{
              position: "fixed",
              bottom: 24,
              right: 24,
              background: "linear-gradient(45deg, #FF6B6B, #FF8E53)",
              "&:hover": {
                transform: "scale(1.1)",
                background: "linear-gradient(45deg, #FF5252, #FF7043)"
              }
            }}
            onClick={() => {/* Navigate to upload */}}
          >
            <UploadIcon />
          </Fab>
        </Tooltip>
      </Container>

      {/* Video Player Dialog */}
      <Dialog
        open={Boolean(selectedVideo)}
        onClose={() => setSelectedVideo(null)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "black",
            minHeight: "70vh"
          }
        }}
      >
        {selectedVideo && (
          <>
            <DialogTitle sx={{ color: "white", display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6">{selectedVideo.title}</Typography>
              <IconButton onClick={() => setSelectedVideo(null)} sx={{ color: "white" }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
              <Box
                sx={{
                  width: "100%",
                  height: "400px",
                  bgcolor: "black",
                  position: "relative"
                }}
              >
                <video
                  width="100%"
                  height="100%"
                  controls
                  autoPlay
                  style={{ backgroundColor: "black" }}
                >
                  <source src={selectedVideo.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
                {/* Video Info Overlay */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    bgcolor: "rgba(0,0,0,0.8)",
                    color: "white",
                    p: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar src={selectedVideo.creator.avatar} sx={{ width: 32, height: 32, mr: 1 }} />
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {selectedVideo.creator.username}
                        {selectedVideo.creator.isVerified && " ✓"}
                      </Typography>
                      <Typography variant="caption" color="rgba(255,255,255,0.7)">
                        {formatNumber(selectedVideo.views)} views • {selectedVideo.uploadedAt}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton size="small" sx={{ color: "white" }}>
                      <LikeIcon />
                    </IconButton>
                    <Typography variant="caption">
                      {formatNumber(selectedVideo.likes)}
                    </Typography>
                    <IconButton size="small" sx={{ color: "white" }}>
                      <ShareIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
        }
      `}</style>
    </Box>
  );
}
