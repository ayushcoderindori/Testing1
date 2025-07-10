import React from "react";
import {
  Box,
  Container,
  Typography,
  Link,
  IconButton,
  Stack,
  Divider,
} from "@mui/material";
import Grid from '@mui/material/Grid';
import {
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
} from "@mui/icons-material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "primary.main",
        color: "white",
        mt: 8,
        py: 6,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              ⚡ BarterSkills
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
              The world's largest skill exchange platform. Learn what you need, 
              teach what you know, and transform lives through knowledge sharing.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton 
                color="inherit" 
                size="small"
                sx={{ bgcolor: "rgba(255,255,255,0.1)" }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton 
                color="inherit" 
                size="small"
                sx={{ bgcolor: "rgba(255,255,255,0.1)" }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton 
                color="inherit" 
                size="small"
                sx={{ bgcolor: "rgba(255,255,255,0.1)" }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton 
                color="inherit" 
                size="small"
                sx={{ bgcolor: "rgba(255,255,255,0.1)" }}
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton 
                color="inherit" 
                size="small"
                sx={{ bgcolor: "rgba(255,255,255,0.1)" }}
              >
                <GitHubIcon />
              </IconButton>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom>
              Platform
            </Typography>
            <Stack spacing={1}>
              <Link color="inherit" href="/" underline="hover">
                Browse Skills
              </Link>
              <Link color="inherit" href="/offer-skill" underline="hover">
                Offer Skill
              </Link>
              <Link color="inherit" href="/how-it-works" underline="hover">
                How It Works
              </Link>
              <Link color="inherit" href="/success-stories" underline="hover">
                Success Stories
              </Link>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom>
              Community
            </Typography>
            <Stack spacing={1}>
              <Link color="inherit" href="/blog" underline="hover">
                Blog
              </Link>
              <Link color="inherit" href="/forums" underline="hover">
                Forums
              </Link>
              <Link color="inherit" href="/events" underline="hover">
                Events
              </Link>
              <Link color="inherit" href="/newsletter" underline="hover">
                Newsletter
              </Link>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom>
              Support
            </Typography>
            <Stack spacing={1}>
              <Link color="inherit" href="/help" underline="hover">
                Help Center
              </Link>
              <Link color="inherit" href="/contact" underline="hover">
                Contact Us
              </Link>
              <Link color="inherit" href="/safety" underline="hover">
                Safety
              </Link>
              <Link color="inherit" href="/guidelines" underline="hover">
                Guidelines
              </Link>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom>
              Legal
            </Typography>
            <Stack spacing={1}>
              <Link color="inherit" href="/privacy" underline="hover">
                Privacy Policy
              </Link>
              <Link color="inherit" href="/terms" underline="hover">
                Terms of Service
              </Link>
              <Link color="inherit" href="/cookies" underline="hover">
                Cookie Policy
              </Link>
              <Link color="inherit" href="/dmca" underline="hover">
                DMCA
              </Link>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.2)" }} />

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © 2024 BarterSkills. All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Made with ❤️ for the learning community
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
