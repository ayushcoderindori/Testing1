import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Avatar,
  InputAdornment,
  Paper,
  Stack,
  IconButton,
} from "@mui/material";
import {
  Search as SearchIcon,
  Star as StarIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  TrendingUp as TrendingIcon,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import axios from "../api/axios.js";

const skillCategories = [
  "Web Development", "Mobile Development", "UI/UX Design", "Data Science",
  "Digital Marketing", "Photography", "Music Production", "Language Learning",
  "Writing", "Cooking", "Fitness Training", "Business Consulting"
];

const featuredSkills = [
  {
    id: 1,
    title: "React.js Development",
    description: "Expert React developer offering to teach modern React patterns, hooks, and state management in exchange for UI/UX design lessons.",
    user: { name: "Sarah Chen", avatar: "/api/placeholder/40/40", rating: 4.9, location: "San Francisco" },
    category: "Web Development",
    timeCommitment: "2-3 hours/week",
    tags: ["React", "JavaScript", "Frontend"],
    seeking: "UI/UX Design",
    type: "Teaching"
  },
  {
    id: 2,
    title: "Spanish Conversation Practice",
    description: "Native Spanish speaker looking to improve English skills while helping others become fluent in Spanish through regular conversation sessions.",
    user: { name: "Carlos Rodriguez", avatar: "/api/placeholder/40/40", rating: 4.8, location: "Madrid" },
    category: "Language Learning",
    timeCommitment: "1 hour/week",
    tags: ["Spanish", "Conversation", "Native Speaker"],
    seeking: "English Practice",
    type: "Exchange"
  },
  {
    id: 3,
    title: "Professional Photography",
    description: "Professional photographer offering portrait and event photography lessons in exchange for social media marketing expertise.",
    user: { name: "Emma Thompson", avatar: "/api/placeholder/40/40", rating: 5.0, location: "London" },
    category: "Photography",
    timeCommitment: "4-6 hours/week",
    tags: ["Portrait", "Events", "Professional"],
    seeking: "Social Media Marketing",
    type: "Teaching"
  }
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const { data: skills = featuredSkills, isPending } = useQuery({
    queryKey: ["skills", searchTerm, selectedCategory],
    queryFn: async () => {
      // For now, return mock data. Later connect to actual API
      return featuredSkills.filter(skill => 
        (!searchTerm || skill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
         skill.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!selectedCategory || skill.category === selectedCategory)
      );
    },
  });

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: 8,
          position: "relative",
          overflow: "hidden"
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h2" component="h1" gutterBottom align="center" fontWeight="bold">
              Exchange Skills, Transform Lives
            </Typography>
            <Typography variant="h5" gutterBottom align="center" sx={{ mb: 4, opacity: 0.9 }}>
              Connect with people worldwide to teach what you know and learn what you need
            </Typography>
            
            {/* Search Bar */}
            <Paper
              sx={{
                p: 2,
                maxWidth: 600,
                mx: "auto",
                borderRadius: 3,
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(10px)"
              }}
            >
              <TextField
                fullWidth
                placeholder="What skill do you want to learn today?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2 }
                }}
                variant="outlined"
              />
            </Paper>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Category Filter */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Browse by Category
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
            <Chip
              label="All Categories"
              onClick={() => setSelectedCategory("")}
              color={selectedCategory === "" ? "primary" : "default"}
              variant={selectedCategory === "" ? "filled" : "outlined"}
            />
            {skillCategories.map((category) => (
              <Chip
                key={category}
                label={category}
                onClick={() => setSelectedCategory(category)}
                color={selectedCategory === category ? "primary" : "default"}
                variant={selectedCategory === category ? "filled" : "outlined"}
              />
            ))}
          </Stack>
        </Box>

        {/* Skills Grid */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <TrendingIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h5">
              {selectedCategory ? `${selectedCategory} Skills` : "Featured Skills"}
            </Typography>
          </Box>
          
          {isPending ? (
            <Typography>Loading skills...</Typography>
          ) : skills.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary">
                No skills found matching your criteria
              </Typography>
              <Button
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={() => { setSearchTerm(""); setSelectedCategory(""); }}
              >
                Clear Filters
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {skills.map((skill, index) => (
                <Grid key={skill.id} item xs={12} md={6} lg={4}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card 
                      sx={{ 
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: 4
                        }
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          <Avatar src={skill.user.avatar} sx={{ mr: 2 }} />
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle2">{skill.user.name}</Typography>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <StarIcon sx={{ fontSize: 16, color: "warning.main", mr: 0.5 }} />
                              <Typography variant="caption">{skill.user.rating}</Typography>
                              <LocationIcon sx={{ fontSize: 14, color: "text.secondary", ml: 1, mr: 0.5 }} />
                              <Typography variant="caption" color="text.secondary">
                                {skill.user.location}
                              </Typography>
                            </Box>
                          </Box>
                          <Chip
                            label={skill.type}
                            size="small"
                            color={skill.type === "Exchange" ? "secondary" : "primary"}
                            variant="outlined"
                          />
                        </Box>
                        
                        <Typography variant="h6" gutterBottom>
                          {skill.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {skill.description}
                        </Typography>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="caption" color="primary" fontWeight="bold">
                            SEEKING: {skill.seeking}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          <TimeIcon sx={{ fontSize: 16, color: "text.secondary", mr: 0.5 }} />
                          <Typography variant="caption" color="text.secondary">
                            {skill.timeCommitment}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                          {skill.tags.map((tag) => (
                            <Chip key={tag} label={tag} size="small" variant="outlined" />
                          ))}
                        </Box>
                      </CardContent>
                      
                      <CardActions>
                        <Button size="small" variant="contained" fullWidth>
                          Connect & Barter
                        </Button>
                      </CardActions>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* Call to Action */}
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            color: "white",
            borderRadius: 3
          }}
        >
          <Typography variant="h4" gutterBottom>
            Ready to Start Your Skill Journey?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
            Join thousands of learners and teachers exchanging skills worldwide
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
            <Button variant="contained" size="large" sx={{ bgcolor: "white", color: "primary.main" }}>
              Offer a Skill
            </Button>
            <Button variant="outlined" size="large" sx={{ borderColor: "white", color: "white" }}>
              Find a Teacher
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
