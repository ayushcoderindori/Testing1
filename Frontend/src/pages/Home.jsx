import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
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
import Grid from '@mui/material/Unstable_Grid2';
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

// Reduced mock data for testing (under 100 items as requested)
const mockSkills = [
  {
    id: 1,
    title: "Master React Hooks: Complete Guide �",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    duration: 85,
    views: 245,
    likes: 42,
    dislikes: 2,
    uploadedAt: "2 hours ago",
    creator: {
      username: "react_master",
      avatar: "https://picsum.photos/40/40?random=1",
      isVerified: true,
      subscribers: 85
    },
    category: "Programming",
    tags: ["react", "hooks", "javascript"],
    isPremium: false,
    skillLevel: "Intermediate",
    creditsEarned: 15
  },
  {
    id: 2,
    title: "Guitar Basics: Learn Your First Song 🎸",
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    duration: 73,
    views: 189,
    likes: 38,
    dislikes: 1,
    uploadedAt: "4 hours ago",
    creator: {
      username: "guitar_guru",
      avatar: "https://picsum.photos/40/40?random=2",
      isVerified: false,
      subscribers: 67
    },
    category: "Music",
    tags: ["guitar", "beginner", "chords"],
    isPremium: false,
    skillLevel: "Beginner",
    creditsEarned: 12
  },
  {
    id: 3,
    title: "Digital Marketing Strategy in 90 Seconds 📈",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    duration: 90,
    views: 156,
    likes: 29,
    dislikes: 3,
    uploadedAt: "1 day ago",
    creator: {
      username: "marketing_pro",
      avatar: "https://picsum.photos/40/40?random=3",
      isVerified: true,
      subscribers: 92
    },
    category: "Business",
    tags: ["marketing", "strategy", "digital"],
    isPremium: true,
    skillLevel: "Advanced",
    creditsEarned: 25
  },
  {
    id: 4,
    title: "Photoshop Quick Tips & Tricks ✨",
    thumbnail: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=400",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    duration: 65,
    views: 198,
    likes: 45,
    dislikes: 2,
    uploadedAt: "3 hours ago",
    creator: {
      username: "design_wizard",
      avatar: "https://picsum.photos/40/40?random=4",
      isVerified: true,
      subscribers: 73
    },
    category: "Design",
    tags: ["photoshop", "design", "tips"],
    isPremium: false,
    skillLevel: "Intermediate",
    creditsEarned: 18
  },
  {
    id: 5,
    title: "Public Speaking Confidence Boost 🎤",
    thumbnail: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    duration: 88,
    views: 134,
    likes: 31,
    dislikes: 1,
    uploadedAt: "6 hours ago",
    creator: {
      username: "speaker_coach",
      avatar: "https://picsum.photos/40/40?random=5",
      isVerified: true,
      subscribers: 58
    },
    category: "Communication",
    tags: ["speaking", "confidence", "presentation"],
    isPremium: false,
    skillLevel: "Beginner",
    creditsEarned: 20
  },
  {
    id: 6,
    title: "Python Data Analysis Fundamentals 🐍",
    thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    duration: 78,
    views: 167,
    likes: 35,
    dislikes: 4,
    uploadedAt: "1 day ago",
    creator: {
      username: "data_scientist",
      avatar: "https://picsum.photos/40/40?random=6",
      isVerified: true,
      subscribers: 94
    },
    category: "Data Science",
    tags: ["python", "data", "analysis"],
    isPremium: false,
    skillLevel: "Intermediate",
    creditsEarned: 22
  }
];

const categories = ["All", "Programming", "Business", "Design", "Music", "Communication", "Data Science", "Creative"];

export default function Home() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [likedVideos, setLikedVideos] = useState(new Set());
  const [dislikedVideos, setDislikedVideos] = useState(new Set());

  const { data: skills = mockSkills, isPending } = useQuery({
    queryKey: ["skills", selectedCategory],
    queryFn: async () => {
      // Simulate API call
      return mockSkills.filter(skill => 
        selectedCategory === "All" || skill.category === selectedCategory
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
                  🚀 Welcome to BarterSkills
                </Typography>
                <Typography variant="h5" sx={{ opacity: 0.9 }}>
                  Where skills are shared, learned, and mastered ✨
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
                { label: "Skills Shared", value: "89", icon: "�" },
                { label: "Active Learners", value: "64", icon: "👥" },
                { label: "Credits Earned", value: "1.2K", icon: "💰" },
                { label: "Premium Users", value: "18", icon: "⭐" }
              ].map((stat, index) => (
                <Grid xs={6} md={3} key={stat.label}>
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

        {/* Skills Grid */}
        <AnimatePresence>
          <Grid container spacing={3}>
            {skills.map((skill, index) => (
              <Grid xs={12} sm={6} md={4} lg={3} key={skill.id}>
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
                        "& .skill-overlay": {
                          opacity: 1
                        }
                      }
                    }}
                    onClick={() => handleVideoPlay(skill)}
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
