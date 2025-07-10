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
  Alert,
  CircularProgress,
  Snackbar,
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
  ContentCopy as CopyIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  WhatsApp as WhatsAppIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../auth/useAuth.js";
import { 
  fetchVideo, 
  toggleVideoLike, 
  getVideoComments, 
  addVideoComment,
  fetchVideos 
} from "../api/videos.js";
import Grid from '@mui/material/Grid';

export default function VideoPlayer() {
  const { id } = useParams();
  const { user, connectionError } = useAuth();
  const queryClient = useQueryClient();
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  // Fetch video data
  const { data: videoData, isLoading: videoLoading, error: videoError } = useQuery({
    queryKey: ['video', id],
    queryFn: () => fetchVideo(id),
    enabled: !!id,
    retry: 2,
  });

  // Fetch video comments
  const { data: commentsData, isLoading: commentsLoading } = useQuery({
    queryKey: ['videoComments', id],
    queryFn: () => getVideoComments(id),
    enabled: !!id,
    retry: 2,
  });

  // Fetch related videos
  const { data: relatedVideosData, isLoading: relatedLoading } = useQuery({
    queryKey: ['relatedVideos'],
    queryFn: () => fetchVideos({ limit: 5 }),
    retry: 2,
  });

  // Like/Unlike video mutation
  const likeMutation = useMutation({
    mutationFn: () => toggleVideoLike(id),
    onSuccess: (response) => {
      setHasLiked(!hasLiked);
      if (hasDisliked) setHasDisliked(false);
      
      // Update the video data in cache
      queryClient.setQueryData(['video', id], (oldData) => {
        if (oldData && oldData.data) {
          return {
            ...oldData,
            data: {
              ...oldData.data,
              likesCount: hasLiked ? oldData.data.likesCount - 1 : oldData.data.likesCount + 1,
              isLiked: !hasLiked
            }
          };
        }
        return oldData;
      });

      setSnackbar({
        open: true,
        message: hasLiked ? "Removed from liked videos" : "Added to liked videos",
        severity: "success"
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: "Failed to update like. Please try again.",
        severity: "error"
      });
    }
  });

  // Add comment mutation
  const commentMutation = useMutation({
    mutationFn: (content) => addVideoComment(id, content),
    onSuccess: () => {
      setNewComment("");
      queryClient.invalidateQueries(['videoComments', id]);
      setSnackbar({
        open: true,
        message: "Comment added successfully!",
        severity: "success"
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: "Failed to add comment. Please try again.",
        severity: "error"
      });
    }
  });

  useEffect(() => {
    // Set initial like status from video data
    if (videoData?.data?.isLiked !== undefined) {
      setHasLiked(videoData.data.isLiked);
    }
    
    // Deduct 1 credit for watching (if not premium)
    if (user && !user.isPremium && videoData?.data) {
      console.log("Deducting 1 credit for watching video");
    }
  }, [user, videoData]);

  const handleLike = () => {
    if (!user) {
      setSnackbar({
        open: true,
        message: "Please log in to like videos",
        severity: "warning"
      });
      return;
    }
    likeMutation.mutate();
  };

  const handleDislike = () => {
    if (!user) {
      setSnackbar({
        open: true,
        message: "Please log in to interact with videos",
        severity: "warning"
      });
      return;
    }
    setHasDisliked(!hasDisliked);
    if (hasLiked) setHasLiked(false);
    // TODO: Implement dislike API call
  };

  const handleSubscribe = () => {
    if (!user) {
      setSnackbar({
        open: true,
        message: "Please log in to subscribe",
        severity: "warning"
      });
      return;
    }
    setIsSubscribed(!isSubscribed);
    // TODO: Implement subscribe API call
  };

  const handleAddComment = () => {
    if (!user) {
      setSnackbar({
        open: true,
        message: "Please log in to comment",
        severity: "warning"
      });
      return;
    }
    
    if (newComment.trim()) {
      commentMutation.mutate(newComment.trim());
    }
  };

  const handleShare = (platform) => {
    const videoUrl = window.location.href;
    const videoTitle = videoData?.data?.title || "Check out this video";
    
    let shareUrl = "";
    
    switch (platform) {
      case 'copy':
        navigator.clipboard.writeText(videoUrl);
        setSnackbar({
          open: true,
          message: "Link copied to clipboard!",
          severity: "success"
        });
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(videoUrl)}`;
        window.open(shareUrl, '_blank');
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(videoUrl)}&text=${encodeURIComponent(videoTitle)}`;
        window.open(shareUrl, '_blank');
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(videoTitle + ' ' + videoUrl)}`;
        window.open(shareUrl, '_blank');
        break;
    }
    
    setShowShareDialog(false);
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

  // Show connection error
  if (connectionError) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Alert severity="error">
          Cannot connect to server. Please ensure the backend is running and try again.
        </Alert>
      </Container>
    );
  }

  // Show loading state
  if (videoLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Card sx={{ mb: 3 }}>
              <Box sx={{ position: "relative", paddingTop: "56.25%", bgcolor: "grey.300" }}>
                <CircularProgress 
                  sx={{ 
                    position: "absolute", 
                    top: "50%", 
                    left: "50%", 
                    transform: "translate(-50%, -50%)" 
                  }} 
                />
              </Box>
            </Card>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} />
                  <Typography>Loading video...</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    );
  }

  // Show error state
  if (videoError) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Alert severity="error">
          {videoError.message || "Failed to load video. Please try again."}
        </Alert>
      </Container>
    );
  }

  const video = videoData?.data;
  const comments = commentsData?.data || [];
  const relatedVideos = relatedVideosData?.data || [];

  if (!video) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Alert severity="warning">
          Video not found.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Grid container spacing={3}>
        {/* Main Video Section */}
        <Grid item xs={12} lg={8}>
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
                {video.videoFile ? (
                  <Box
                    component="video"
                    src={video.videoFile}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                    controls
                    poster={video.thumbnail}
                  />
                ) : (
                  <Box
                    component="img"
                    src={video.thumbnail || "https://picsum.photos/1280/720?random=" + video._id}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                )}
                
                {/* Play/Pause Overlay (only if no video file) */}
                {!video.videoFile && (
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
                )}

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
                        {formatNumber(video.views || 0)} views
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(video.createdAt).toLocaleDateString()}
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
                        disabled={likeMutation.isPending}
                      >
                        {formatNumber((video.likesCount || 0) + (hasLiked && !video.isLiked ? 1 : 0))}
                      </Button>
                    </Tooltip>

                    <Tooltip title={hasDisliked ? "Remove dislike" : "Dislike this video"}>
                      <Button
                        startIcon={hasDisliked ? <DislikeIcon /> : <DislikeBorderIcon />}
                        onClick={handleDislike}
                        color={hasDisliked ? "primary" : "inherit"}
                        variant={hasDisliked ? "contained" : "outlined"}
                      >
                        {formatNumber(video.dislikesCount || 0)}
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
                      onClick={() => {
                        setSnackbar({
                          open: true,
                          message: "Download feature coming soon!",
                          severity: "info"
                        });
                      }}
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
                    src={video.owner?.avatar}
                    sx={{ width: 56, height: 56, mr: 2 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {video.owner?.fullName || video.owner?.username}
                      </Typography>
                      {video.owner?.isVerified && (
                        <Chip
                          label="✓"
                          size="small"
                          color="primary"
                          sx={{ ml: 1, minWidth: 24, height: 20 }}
                        />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {formatNumber(video.owner?.subscribersCount || 0)} subscribers
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
                {video.tags && video.tags.length > 0 && (
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {video.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={`#${tag}`}
                        variant="outlined"
                        size="small"
                        clickable
                      />
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Comments ({comments.length})
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
                        disabled={!newComment.trim() || commentMutation.isPending}
                        startIcon={<SendIcon />}
                      >
                        {commentMutation.isPending ? "Posting..." : "Comment"}
                      </Button>
                    </Box>
                  </Box>
                )}

                {/* Comments List */}
                {commentsLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : comments.length === 0 ? (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <CommentIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      No comments yet. Be the first to comment!
                    </Typography>
                  </Box>
                ) : (
                  <Stack spacing={3}>
                    {comments.map((comment) => (
                      <Box key={comment._id}>
                        <Box sx={{ display: "flex", gap: 2 }}>
                          <Avatar src={comment.owner?.avatar} sx={{ width: 36, height: 36 }} />
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                              <Typography variant="subtitle2" fontWeight="bold">
                                {comment.owner?.username}
                              </Typography>
                              {comment.owner?.isVerified && (
                                <Chip
                                  label="✓"
                                  size="small"
                                  color="primary"
                                  sx={{ minWidth: 20, height: 16 }}
                                />
                              )}
                              <Typography variant="caption" color="text.secondary">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                            <Typography variant="body2" paragraph>
                              {comment.content}
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                              <Button size="small" startIcon={<LikeIcon />}>
                                {comment.likesCount || 0}
                              </Button>
                              <Button size="small">Reply</Button>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Related Videos Sidebar */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Related Videos
              </Typography>
              
              {relatedLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : relatedVideos.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No related videos found
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {relatedVideos.slice(0, 5).map((relatedVideo) => (
                    <Card 
                      key={relatedVideo._id} 
                      sx={{ cursor: "pointer", "&:hover": { boxShadow: 2 } }}
                      onClick={() => window.location.href = `/video/${relatedVideo._id}`}
                    >
                      <Box sx={{ display: "flex" }}>
                        <CardMedia
                          component="img"
                          sx={{ width: 120, height: 68 }}
                          image={relatedVideo.thumbnail || "https://picsum.photos/320/180?random=" + relatedVideo._id}
                          alt={relatedVideo.title}
                        />
                        <Box sx={{ display: "flex", flexDirection: "column", flex: 1, p: 1 }}>
                          <Typography variant="subtitle2" fontWeight="bold" noWrap>
                            {relatedVideo.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {relatedVideo.owner?.username}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatNumber(relatedVideo.views || 0)} views
                          </Typography>
                        </Box>
                      </Box>
                    </Card>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onClose={() => setShowShareDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Share this video</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Button
              fullWidth
              startIcon={<CopyIcon />}
              onClick={() => handleShare('copy')}
              variant="outlined"
            >
              Copy Link
            </Button>
            <Button
              fullWidth
              startIcon={<FacebookIcon />}
              onClick={() => handleShare('facebook')}
              variant="outlined"
              sx={{ color: '#1877F2', borderColor: '#1877F2' }}
            >
              Share on Facebook
            </Button>
            <Button
              fullWidth
              startIcon={<TwitterIcon />}
              onClick={() => handleShare('twitter')}
              variant="outlined"
              sx={{ color: '#1DA1F2', borderColor: '#1DA1F2' }}
            >
              Share on Twitter
            </Button>
            <Button
              fullWidth
              startIcon={<WhatsAppIcon />}
              onClick={() => handleShare('whatsapp')}
              variant="outlined"
              sx={{ color: '#25D366', borderColor: '#25D366' }}
            >
              Share on WhatsApp
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowShareDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Report Dialog */}
      <Dialog open={showReportDialog} onClose={() => setShowReportDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Report this video</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Help us understand what's happening with this video.
          </Typography>
          <Stack spacing={1}>
            <Button fullWidth variant="outlined" onClick={() => setShowReportDialog(false)}>
              Spam or misleading
            </Button>
            <Button fullWidth variant="outlined" onClick={() => setShowReportDialog(false)}>
              Violent or repulsive content
            </Button>
            <Button fullWidth variant="outlined" onClick={() => setShowReportDialog(false)}>
              Hateful or abusive content
            </Button>
            <Button fullWidth variant="outlined" onClick={() => setShowReportDialog(false)}>
              Harmful or dangerous acts
            </Button>
            <Button fullWidth variant="outlined" onClick={() => setShowReportDialog(false)}>
              Copyright infringement
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowReportDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
