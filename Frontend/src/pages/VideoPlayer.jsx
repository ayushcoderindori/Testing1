import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Avatar,
  Card,
  CardContent,
  Chip,
  Button,
  IconButton,
  TextField,
  Stack,
  Divider,
  CardMedia,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Tooltip,
  Tabs,
  Tab,
} from "@mui/material";
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Favorite as LikeIcon,
  FavoriteBorder as LikeBorderIcon,
  ThumbDown as DislikeIcon,
  ThumbDownOffAlt as DislikeBorderIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  Flag as ReportIcon,
  Send as SendIcon,
  MoreVert as MoreIcon,
  PersonAdd as SubscribeIcon,
  Notifications as NotificationIcon,
  Comment as CommentIcon,
  Visibility as ViewIcon,
  MonetizationOn as CreditIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../auth/useAuth.js";
import Grid from '@mui/material/Unstable_Grid2';

const mockVideoData = {
  id: 1,
  title: "Epic Coding Session: Building React in 60 Seconds! 🔥",
  description: "In this amazing tutorial, I'll show you how to build a complete React component from scratch in under 60 seconds! Perfect for beginners and intermediate developers looking to level up their React skills. We'll cover hooks, state management, and modern React patterns.",
  videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
  thumbnail: "https://picsum.photos/1280/720?random=1",
  duration: 85,
  views: 12500,
  likes: 890,
  dislikes: 12,
  uploadedAt: "2 hours ago",
  category: "Tech",
  tags: ["React", "JavaScript", "Tutorial", "Coding"],
  
  creator: {
    id: 1,
    username: "codemaster_alex",
    fullName: "Alex Chen",
    avatar: "https://picsum.photos/80/80?random=101",
    isVerified: true,
    subscribers: 45200,
    videosCount: 127,
    bio: "Full-stack developer and coding educator. Helping developers level up their skills one video at a time! 🚀",
    socialLinks: {
      twitter: "@codemaster_alex",
      github: "github.com/alexchen",
      website: "alexchen.dev"
    }
  },

  comments: [
    {
      id: 1,
      user: {
        username: "john_dev",
        avatar: "https://picsum.photos/40/40?random=201",
        isVerified: false
      },
      text: "This is absolutely incredible! I learned more in 60 seconds than in hours of other tutorials. Thanks Alex! 🙌",
      timestamp: "1 hour ago",
      likes: 23,
      replies: [
        {
          id: 11,
          user: {
            username: "codemaster_alex",
            avatar: "https://picsum.photos/40/40?random=101",
            isVerified: true
          },
          text: "Thanks John! Really glad it helped you out! Keep coding! 💪",
          timestamp: "45 minutes ago",
          likes: 8
        }
      ]
    },
    {
      id: 2,
      user: {
        username: "sarah_codes",
        avatar: "https://picsum.photos/40/40?random=202",
        isVerified: true
      },
      text: "The way you explained hooks is just perfect! Could you make a longer version covering more advanced patterns?",
      timestamp: "30 minutes ago",
      likes: 15,
      replies: []
    }
  ],

  relatedVideos: [
    {
      id: 2,
      title: "Advanced React Patterns You Should Know",
      thumbnail: "https://picsum.photos/320/180?random=2",
      creator: "Alex Chen",
      views: 8900,
      duration: 125,
      uploadedAt: "1 day ago"
    },
    {
      id: 3,
      title: "JavaScript ES6+ Features Explained",
      thumbnail: "https://picsum.photos/320/180?random=3", 
      creator: "Alex Chen",
      views: 15600,
      duration: 95,
      uploadedAt: "3 days ago"
    },
    {
      id: 4,
      title: "Building Your First React App",
      thumbnail: "https://picsum.photos/320/180?random=4",
      creator: "Alex Chen", 
      views: 22300,
      duration: 180,
      uploadedAt: "1 week ago"
    }
  ]
};

export default function VideoPlayer() {
  const { id } = useParams();
  const { user } = useAuth();
  const [video, setVideo] = useState(mockVideoData);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    // Deduct 1 credit for watching (if not premium)
    if (user && !user.isPremium) {
      // API call to deduct credit
      console.log("Deducting 1 credit for watching video");
    }
  }, [user]);

  const handleLike = () => {
    setHasLiked(!hasLiked);
    if (hasDisliked) setHasDisliked(false);
    // API call to like video
  };

  const handleDislike = () => {
    setHasDisliked(!hasDisliked);
    if (hasLiked) setHasLiked(false);
    // API call to dislike video
  };

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
    // API call to subscribe/unsubscribe
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      // API call to add comment
      console.log("Adding comment:", newComment);
      setNewComment("");
    }
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
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Grid container spacing={3}>
        {/* Main Video Section */}
        <Grid xs={12} lg={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Video Player */}
            <Card sx={{ mb: 3, overflow: "hidden", borderRadius: 3 }}>
              <Box
                sx={{
                  position: "relative",
                  paddingTop: "56.25%", // 16:9 aspect ratio
                  bgcolor: "black",
                  cursor: "pointer"
                }}
                onClick={() => setIsPlaying(!isPlaying)}
              >
                <Box
                  component="img"
                  src={video.thumbnail}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
                
                {/* Play/Pause Overlay */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: isPlaying ? "transparent" : "rgba(0,0,0,0.3)",
                    transition: "all 0.3s ease"
                  }}
                >
                  {!isPlaying && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <IconButton
                        size="large"
                        sx={{
                          bgcolor: "rgba(255,255,255,0.9)",
                          color: "black",
                          width: 80,
                          height: 80,
                          "&:hover": { bgcolor: "white" }
                        }}
                      >
                        <PlayIcon sx={{ fontSize: 40 }} />
                      </IconButton>
                    </motion.div>
                  )}
                </Box>

                {/* Duration Badge */}
                <Chip
                  label={formatDuration(video.duration)}
                  size="small"
                  sx={{
                    position: "absolute",
                    bottom: 12,
                    right: 12,
                    bgcolor: "rgba(0,0,0,0.8)",
                    color: "white",
                    fontWeight: "bold"
                  }}
                />
              </Box>
            </Card>

            {/* Video Info */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {video.title}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <ViewIcon sx={{ mr: 0.5, color: "text.secondary" }} />
                      <Typography variant="body2">
                        {formatNumber(video.views)} views
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {video.uploadedAt}
                    </Typography>
                  </Box>

                  <Box sx={{ flexGrow: 1 }} />

                  {/* Action Buttons */}
                  <Stack direction="row" spacing={1}>
                    <Tooltip title={hasLiked ? "Remove like" : "Like this video"}>
                      <Button
                        startIcon={hasLiked ? <LikeIcon /> : <LikeBorderIcon />}
                        onClick={handleLike}
                        color={hasLiked ? "error" : "inherit"}
                        variant={hasLiked ? "contained" : "outlined"}
                      >
                        {formatNumber(video.likes + (hasLiked ? 1 : 0))}
                      </Button>
                    </Tooltip>

                    <Tooltip title={hasDisliked ? "Remove dislike" : "Dislike this video"}>
                      <Button
                        startIcon={hasDisliked ? <DislikeIcon /> : <DislikeBorderIcon />}
                        onClick={handleDislike}
                        color={hasDisliked ? "primary" : "inherit"}
                        variant={hasDisliked ? "contained" : "outlined"}
                      >
                        {formatNumber(video.dislikes + (hasDisliked ? 1 : 0))}
                      </Button>
                    </Tooltip>

                    <Button
                      startIcon={<ShareIcon />}
                      variant="outlined"
                      onClick={() => setShowShareDialog(true)}
                    >
                      Share
                    </Button>

                    <Button
                      startIcon={<DownloadIcon />}
                      variant="outlined"
                    >
                      Save
                    </Button>

                    <IconButton onClick={() => setShowReportDialog(true)}>
                      <MoreIcon />
                    </IconButton>
                  </Stack>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* Creator Info */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Avatar
                    src={video.creator.avatar}
                    sx={{ width: 56, height: 56, mr: 2 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {video.creator.fullName}
                      </Typography>
                      {video.creator.isVerified && (
                        <Chip
                          label="✓"
                          size="small"
                          color="primary"
                          sx={{ ml: 1, minWidth: 24, height: 20 }}
                        />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {formatNumber(video.creator.subscribers)} subscribers • {video.creator.videosCount} videos
                    </Typography>
                  </Box>
                  
                  <Button
                    variant={isSubscribed ? "outlined" : "contained"}
                    color={isSubscribed ? "inherit" : "error"}
                    startIcon={isSubscribed ? <NotificationIcon /> : <SubscribeIcon />}
                    onClick={handleSubscribe}
                    sx={{ ml: 2 }}
                  >
                    {isSubscribed ? "Subscribed" : "Subscribe"}
                  </Button>
                </Box>

                {/* Description */}
                <Typography variant="body1" paragraph>
                  {video.description}
                </Typography>

                {/* Tags */}
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {video.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={`#${tag}`}
                      variant="outlined"
                      size="small"
                      clickable
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Comments ({video.comments.length})
                </Typography>

                {/* Add Comment */}
                {user && (
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                      <Avatar src={user.avatar} sx={{ width: 36, height: 36 }} />
                      <TextField
                        fullWidth
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        variant="outlined"
                        size="small"
                        multiline
                        maxRows={3}
                      />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                      <Button
                        size="small"
                        onClick={() => setNewComment("")}
                        disabled={!newComment.trim()}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        startIcon={<SendIcon />}
                      >
                        Comment
                      </Button>
                    </Box>
                  </Box>
                )}

                {/* Comments List */}
                <Stack spacing={3}>
                  {video.comments.map((comment) => (
                    <Box key={comment.id}>
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Avatar src={comment.user.avatar} sx={{ width: 36, height: 36 }} />
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {comment.user.username}
                            </Typography>
                            {comment.user.isVerified && (
                              <Chip
                                label="✓"
                                size="small"
                                color="primary"
                                sx={{ minWidth: 20, height: 16 }}
                              />
                            )}
                            <Typography variant="caption" color="text.secondary">
                              {comment.timestamp}
                            </Typography>
                          </Box>
                          <Typography variant="body2" paragraph>
                            {comment.text}
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Button size="small" startIcon={<LikeIcon />}>
                              {comment.likes}
                            </Button>
                            <Button size="small">Reply</Button>
                          </Box>

                          {/* Replies */}
                          {comment.replies.length > 0 && (
                            <Box sx={{ ml: 4, mt: 2 }}>
                              {comment.replies.map((reply) => (
                                <Box key={reply.id} sx={{ display: "flex", gap: 2, mb: 2 }}>
                                  <Avatar src={reply.user.avatar} sx={{ width: 28, height: 28 }} />
                                  <Box sx={{ flex: 1 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                                      <Typography variant="caption" fontWeight="bold">
                                        {reply.user.username}
                                      </Typography>
                                      {reply.user.isVerified && (
                                        <Chip
                                          label="✓"
                                          size="small"
                                          color="primary"
                                          sx={{ minWidth: 16, height: 14 }}
                                        />
                                      )}
                                      <Typography variant="caption" color="text.secondary">
                                        {reply.timestamp}
                                      </Typography>
                                    </Box>
                                    <Typography variant="body2">
                                      {reply.text}
                                    </Typography>
                                  </Box>
                                </Box>
                              ))}
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Sidebar */}
        <Grid xs={12} lg={4}>
          <Stack spacing={3}>
            {/* Creator Profile Card */}
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar
                    src={video.creator.avatar}
                    sx={{ width: 48, height: 48, mr: 2 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                      {video.creator.fullName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      @{video.creator.username}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {video.creator.bio}
                </Typography>
                <Button variant="outlined" fullWidth>
                  View Channel
                </Button>
              </CardContent>
            </Card>

            {/* Related Videos */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  More from {video.creator.fullName}
                </Typography>
                <Stack spacing={2}>
                  {video.relatedVideos.map((relatedVideo) => (
                    <motion.div
                      key={relatedVideo.id}
                      whileHover={{ scale: 1.02 }}
                      style={{ cursor: "pointer" }}
                    >
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Box sx={{ position: "relative" }}>
                          <CardMedia
                            component="img"
                            image={relatedVideo.thumbnail}
                            sx={{ width: 120, height: 68, borderRadius: 1 }}
                          />
                          <Chip
                            label={formatDuration(relatedVideo.duration)}
                            size="small"
                            sx={{
                              position: "absolute",
                              bottom: 4,
                              right: 4,
                              bgcolor: "rgba(0,0,0,0.8)",
                              color: "white",
                              fontSize: "0.7rem",
                              height: 16
                            }}
                          />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            fontWeight="bold"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical"
                            }}
                          >
                            {relatedVideo.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatNumber(relatedVideo.views)} views • {relatedVideo.uploadedAt}
                          </Typography>
                        </Box>
                      </Box>
                    </motion.div>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            {/* Credit Info */}
            {user && !user.isPremium && (
              <Card sx={{ bgcolor: "warning.light" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <CreditIcon sx={{ mr: 1, color: "warning.main" }} />
                    <Typography variant="h6" fontWeight="bold">
                      -1 Credit Used
                    </Typography>
                  </Box>
                  <Typography variant="body2" paragraph>
                    Watching this video cost 1 credit. Upgrade to Premium for unlimited viewing!
                  </Typography>
                  <Button variant="contained" size="small" fullWidth>
                    Upgrade to Premium
                  </Button>
                </CardContent>
              </Card>
            )}
          </Stack>
        </Grid>
      </Grid>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onClose={() => setShowShareDialog(false)}>
        <DialogTitle>Share this video</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ minWidth: 300 }}>
            <TextField
              fullWidth
              label="Video URL"
              value={`https://videovault.com/video/${video.id}`}
              InputProps={{ readOnly: true }}
            />
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button variant="outlined">Twitter</Button>
              <Button variant="outlined">Facebook</Button>
              <Button variant="outlined">Copy Link</Button>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowShareDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Report Dialog */}
      <Dialog open={showReportDialog} onClose={() => setShowReportDialog(false)}>
        <DialogTitle>Report Video</DialogTitle>
        <DialogContent>
          <Typography variant="body2" paragraph>
            Help us keep VideoVault safe. Why are you reporting this video?
          </Typography>
          <Stack spacing={1}>
            <Button variant="outlined" fullWidth>Spam or misleading</Button>
            <Button variant="outlined" fullWidth>Inappropriate content</Button>
            <Button variant="outlined" fullWidth>Harassment or bullying</Button>
            <Button variant="outlined" fullWidth>Copyright violation</Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowReportDialog(false)}>Cancel</Button>
          <Button variant="contained" color="error">Report</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
