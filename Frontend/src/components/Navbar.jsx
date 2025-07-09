import React, { useContext } from "react";
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
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountIcon,
} from "@mui/icons-material";
import { AuthContext } from "../auth/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

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

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        background: "linear-gradient(135deg, #5C6AC4 0%, #667eea 100%)",
        backdropFilter: "blur(10px)"
      }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
          <Typography
            variant="h5"
            component={Link}
            to="/"
            color="inherit"
            sx={{ 
              textDecoration: "none",
              fontWeight: "bold",
              mr: 4,
              background: "linear-gradient(45deg, #fff, #f0f0f0)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
          >
            ⚡ BarterSkills
          </Typography>

          {user && (
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
              <Button 
                color="inherit" 
                component={Link} 
                to="/"
                sx={{ borderRadius: 2 }}
              >
                Browse Skills
              </Button>
              <Button 
                color="inherit" 
                component={Link} 
                to="/dashboard"
                sx={{ borderRadius: 2 }}
              >
                Dashboard
              </Button>
            </Box>
          )}
        </Box>

        {user ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              color="inherit"
              component={Link}
              to="/offer-skill"
              startIcon={<AddIcon />}
              variant="outlined"
              sx={{ 
                borderColor: "rgba(255,255,255,0.3)",
                "&:hover": {
                  borderColor: "white",
                  bgcolor: "rgba(255,255,255,0.1)"
                }
              }}
            >
              Offer Skill
            </Button>

            <IconButton color="inherit">
              <SearchIcon />
            </IconButton>

            <IconButton color="inherit">
              <NotificationsIcon />
            </IconButton>

            <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
              <Avatar
                src={user.avatar}
                alt={user.fullName}
                sx={{ 
                  width: 32, 
                  height: 32, 
                  mr: 1,
                  cursor: "pointer",
                  border: "2px solid rgba(255,255,255,0.3)"
                }}
                onClick={handleMenuOpen}
              />
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {user.fullName}
                </Typography>
                {user.isPremium && (
                  <Chip 
                    label="Premium" 
                    size="small" 
                    sx={{ 
                      height: 16, 
                      fontSize: "0.6rem",
                      bgcolor: "rgba(255,215,0,0.2)",
                      color: "#FFD700"
                    }} 
                  />
                )}
              </Box>
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 200,
                  borderRadius: 2,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
                }
              }}
            >
              <MenuItem 
                onClick={() => {
                  navigate(`/profile/${user.username}`);
                  handleMenuClose();
                }}
              >
                View Profile
              </MenuItem>
              <MenuItem 
                onClick={() => {
                  navigate("/dashboard");
                  handleMenuClose();
                }}
              >
                Dashboard
              </MenuItem>
              <MenuItem 
                onClick={() => {
                  navigate("/offer-skill");
                  handleMenuClose();
                }}
              >
                Offer New Skill
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                Logout
              </MenuItem>
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
                  bgcolor: "rgba(255,255,255,0.9)"
                }
              }}
            >
              Join BarterSkills
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
