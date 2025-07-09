import React, { useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Badge,
  InputBase,
  alpha,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  MonetizationOn as CreditIcon,
  AccountCircle as AccountIcon,
  VideoLibrary as VideoIcon,
  TrendingUp as TrendingIcon,
  Star as PremiumIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  ChatBubble as ChatIcon,
} from "@mui/icons-material";
import { AuthContext } from "../auth/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch',
      },
    },
  },
}));

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleSearch = (event) => {
    if (event.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const mockNotifications = [
    { id: 1, type: 'like', message: 'John liked your video "Epic Coding Session"', time: '2 min ago' },
    { id: 2, type: 'comment', message: 'Sarah commented on your video', time: '5 min ago' },
    { id: 3, type: 'upload', message: 'Video processing complete!', time: '10 min ago' },
  ];

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
      }}
    >
      <Toolbar>
        {/* Logo & Brand */}
        <Box sx={{ display: "flex", alignItems: "center", mr: 4 }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Typography
              variant="h5"
              component={Link}
              to="/"
              color="inherit"
              sx={{ 
                textDecoration: "none",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                background: "linear-gradient(45deg, #fff, #f0f0f0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}
            >
              🎬 VideoVault
            </Typography>
          </motion.div>
        </Box>

        {/* Navigation Links */}
        {user && (
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, mr: 2 }}>
            <Button 
              color="inherit" 
              component={Link} 
              to="/"
              startIcon={<TrendingIcon />}
              sx={{ borderRadius: 2 }}
            >
              Trending
            </Button>
            <Button 
              color="inherit" 
              component={Link} 
              to="/my-videos"
              startIcon={<VideoIcon />}
              sx={{ borderRadius: 2 }}
            >
              My Videos
            </Button>
          </Box>
        )}

        {/* Search Bar */}
        {user && (
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearch}
            />
          </Search>
        )}

        <Box sx={{ flexGrow: 1 }} />

        {user ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Upload Button */}
            <Tooltip title="Upload Video (+5 Credits)">
              <Button
                color="inherit"
                component={Link}
                to="/upload"
                startIcon={<UploadIcon />}
                variant="outlined"
                sx={{ 
                  borderColor: "rgba(255,255,255,0.3)",
                  "&:hover": {
                    borderColor: "white",
                    bgcolor: "rgba(255,255,255,0.1)",
                    transform: "translateY(-1px)"
                  }
                }}
              >
                Upload
              </Button>
            </Tooltip>

            {/* Credits Display */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card 
                sx={{ 
                  bgcolor: "rgba(255,255,255,0.15)", 
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.2)"
                }}
              >
                <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                  <Box sx={{ display: "flex", alignItems: "center", color: "white" }}>
                    <CreditIcon sx={{ mr: 1, color: "#FFD700" }} />
                    <Typography variant="h6" fontWeight="bold">
                      {user.credits || 25}
                    </Typography>
                    <Typography variant="caption" sx={{ ml: 0.5, opacity: 0.8 }}>
                      credits
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>

            {/* AI Chat Button */}
            <Tooltip title="AI Assistant">
              <IconButton 
                color="inherit"
                sx={{ 
                  bgcolor: "rgba(255,255,255,0.1)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.2)" }
                }}
              >
                <ChatIcon />
              </IconButton>
            </Tooltip>

            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton 
                color="inherit" 
                onClick={handleNotificationClick}
                sx={{ 
                  bgcolor: "rgba(255,255,255,0.1)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.2)" }
                }}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* User Menu */}
            <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
              <Avatar
                src={user.avatar}
                alt={user.fullName}
                sx={{ 
                  width: 36, 
                  height: 36, 
                  cursor: "pointer",
                  border: "2px solid rgba(255,255,255,0.3)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    border: "2px solid white",
                    transform: "scale(1.05)"
                  }
                }}
                onClick={handleMenuOpen}
              />
              <Box sx={{ display: { xs: "none", sm: "block" }, ml: 1 }}>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {user.fullName}
                </Typography>
                {user.isPremium && (
                  <Chip 
                    label="Premium" 
                    size="small" 
                    icon={<PremiumIcon />}
                    sx={{ 
                      height: 16, 
                      fontSize: "0.6rem",
                      bgcolor: "#FFD700",
                      color: "black",
                      fontWeight: "bold"
                    }} 
                  />
                )}
              </Box>
            </Box>

            {/* User Menu Dropdown */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 220,
                  borderRadius: 2,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                  backdropFilter: "blur(10px)"
                }
              }}
            >
              <MenuItem 
                onClick={() => {
                  navigate(`/profile/${user.username}`);
                  handleMenuClose();
                }}
                sx={{ py: 1.5 }}
              >
                <AccountIcon sx={{ mr: 2 }} />
                View Profile
              </MenuItem>
              <MenuItem 
                onClick={() => {
                  navigate("/dashboard");
                  handleMenuClose();
                }}
                sx={{ py: 1.5 }}
              >
                <VideoIcon sx={{ mr: 2 }} />
                My Videos
              </MenuItem>
              {!user.isPremium && (
                <MenuItem 
                  onClick={() => {
                    setShowPremiumDialog(true);
                    handleMenuClose();
                  }}
                  sx={{ py: 1.5, color: "warning.main" }}
                >
                  <PremiumIcon sx={{ mr: 2 }} />
                  Upgrade to Premium
                </MenuItem>
              )}
              <MenuItem 
                onClick={() => {
                  navigate("/settings");
                  handleMenuClose();
                }}
                sx={{ py: 1.5 }}
              >
                <SettingsIcon sx={{ mr: 2 }} />
                Settings
              </MenuItem>
              <MenuItem 
                onClick={handleLogout}
                sx={{ py: 1.5, color: "error.main" }}
              >
                <LogoutIcon sx={{ mr: 2 }} />
                Logout
              </MenuItem>
            </Menu>

            {/* Notifications Menu */}
            <Menu
              anchorEl={notificationAnchor}
              open={Boolean(notificationAnchor)}
              onClose={handleNotificationClose}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 300,
                  maxWidth: 400,
                  borderRadius: 2,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
                }
              }}
            >
              <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
                <Typography variant="h6" fontWeight="bold">
                  Notifications
                </Typography>
              </Box>
              {mockNotifications.map((notification) => (
                <MenuItem key={notification.id} sx={{ py: 2, flexDirection: "column", alignItems: "flex-start" }}>
                  <Typography variant="body2">
                    {notification.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {notification.time}
                  </Typography>
                </MenuItem>
              ))}
              <Box sx={{ p: 1, textAlign: "center", borderTop: 1, borderColor: "divider" }}>
                <Button size="small" onClick={handleNotificationClose}>
                  View All
                </Button>
              </Box>
            </Menu>
          </Box>
        ) : (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button 
              color="inherit" 
              component={Link} 
              to="/login"
              variant="outlined"
              sx={{ 
                borderColor: "rgba(255,255,255,0.3)",
                "&:hover": {
                  borderColor: "white",
                  bgcolor: "rgba(255,255,255,0.1)"
                }
              }}
            >
              Login
            </Button>
            <Button 
              component={Link} 
              to="/register"
              variant="contained"
              sx={{ 
                bgcolor: "white",
                color: "primary.main",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.9)",
                  transform: "translateY(-1px)"
                }
              }}
            >
              Join VideoVault
            </Button>
          </Box>
        )}
      </Toolbar>

      {/* Premium Upgrade Dialog */}
      <Dialog
        open={showPremiumDialog}
        onClose={() => setShowPremiumDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: "center", bgcolor: "warning.light" }}>
          <PremiumIcon sx={{ fontSize: 48, color: "warning.main", mb: 1 }} />
          <Typography variant="h5" fontWeight="bold">
            Upgrade to Premium! ⭐
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={2}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Premium Benefits:
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body2">• Upload videos up to 3 minutes (180s)</Typography>
                  <Typography variant="body2">• Watch unlimited videos for free</Typography>
                  <Typography variant="body2">• Priority video processing</Typography>
                  <Typography variant="body2">• Advanced analytics</Typography>
                  <Typography variant="body2">• Premium badge & profile perks</Typography>
                  <Typography variant="body2">• Early access to new features</Typography>
                </Stack>
              </CardContent>
            </Card>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4" fontWeight="bold" color="primary">
                $9.99/month
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cancel anytime
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button 
            onClick={() => setShowPremiumDialog(false)}
            variant="outlined"
          >
            Maybe Later
          </Button>
          <Button 
            variant="contained"
            size="large"
            sx={{ 
              bgcolor: "warning.main",
              "&:hover": { bgcolor: "warning.dark" }
            }}
          >
            Upgrade Now! 🚀
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
}
