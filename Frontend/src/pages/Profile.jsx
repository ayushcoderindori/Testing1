import React, { useState } from "react";
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
  Rating,
  Tab,
  Tabs,
  Paper,
  Stack,
  Divider,
  Badge,
  LinearProgress,
} from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import {
  School as SchoolIcon,
  Work as WorkIcon,
  Star as StarIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Verified as VerifiedIcon,
  Language as LanguageIcon,
  EmojiEvents as AchievementIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";

const mockUserData = {
  username: "sarah-chen",
  fullName: "Sarah Chen",
  avatar: "/api/placeholder/120/120",
  coverImage: "/api/placeholder/800/200",
  location: "San Francisco, CA",
  joined: "March 2023",
  rating: 4.9,
  totalReviews: 47,
  verified: true,
  bio: "Full-stack developer passionate about teaching and learning. I love helping others master React and modern web technologies while continuously expanding my own skill set.",
  languages: ["English (Native)", "Mandarin (Fluent)", "Spanish (Intermediate)"],
  achievements: [
    { title: "Top Teacher", description: "Rated 5 stars by 20+ students", icon: "🏆" },
    { title: "Quick Responder", description: "Responds within 2 hours", icon: "⚡" },
    { title: "Skill Master", description: "Expert in 5+ skills", icon: "🎯" }
  ],
  skillsOffering: [
    {
      id: 1,
      title: "React.js Development",
      category: "Web Development",
      level: "Expert",
      rating: 4.9,
      students: 23,
      description: "Master React hooks, state management, and modern patterns",
      tags: ["React", "JavaScript", "Frontend"],
      seeking: "UI/UX Design"
    },
    {
      id: 2,
      title: "Node.js Backend",
      category: "Web Development", 
      level: "Advanced",
      rating: 4.8,
      students: 15,
      description: "Build scalable APIs and server-side applications",
      tags: ["Node.js", "Express", "MongoDB"],
      seeking: "DevOps"
    }
  ],
  skillsLearning: [
    {
      title: "UI/UX Design",
      teacher: "Emma Watson",
      progress: 75,
      status: "Active"
    },
    {
      title: "Spanish Conversation",
      teacher: "Carlos Rodriguez", 
      progress: 40,
      status: "Active"
    }
  ],
  reviews: [
    {
      id: 1,
      reviewer: "John Doe",
      rating: 5,
      date: "2 weeks ago",
      skill: "React.js Development",
      comment: "Sarah is an amazing teacher! Her explanations are clear and she's very patient with beginners."
    },
    {
      id: 2,
      reviewer: "Alice Smith",
      rating: 5,
      date: "1 month ago", 
      skill: "Node.js Backend",
      comment: "Learned so much about backend development. Sarah's practical approach made complex concepts easy to understand."
    }
  ]
};

export default function Profile() {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const user = mockUserData; // In real app, fetch based on username

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Cover Image & Profile Header */}
      <Box
        sx={{
          height: 250,
          background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${user.coverImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative"
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ position: "absolute", bottom: -60, left: 0, right: 0 }}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Box sx={{ display: "flex", alignItems: "end", gap: 3 }}>
                <Badge
                  badgeContent={user.verified ? <VerifiedIcon color="primary" /> : null}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                >
                  <Avatar
                    src={user.avatar}
                    sx={{ width: 120, height: 120, border: "4px solid white" }}
                  />
                </Badge>
                
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h4" fontWeight="bold">
                    {user.fullName}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1, mb: 2 }}>
                    <LocationIcon color="action" sx={{ mr: 1 }} />
                    <Typography color="text.secondary" sx={{ mr: 3 }}>
                      {user.location}
                    </Typography>
                    <TimeIcon color="action" sx={{ mr: 1 }} />
                    <Typography color="text.secondary">
                      Member since {user.joined}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Rating value={user.rating} precision={0.1} readOnly />
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        {user.rating}
                      </Typography>
                      <Typography color="text.secondary" sx={{ ml: 1 }}>
                        ({user.totalReviews} reviews)
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Stack spacing={2}>
                  <Button variant="contained" size="large">
                    Send Message
                  </Button>
                  <Button variant="outlined" size="large">
                    Propose Barter
                  </Button>
                </Stack>
              </Box>
            </Paper>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 10, pb: 4 }}>
        <Grid container spacing={4}>
          {/* Left Column */}
          <Grid xs={12} md={4}>
            {/* Bio */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  About
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.bio}
                </Typography>
              </CardContent>
            </Card>

            {/* Languages */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <LanguageIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Languages</Typography>
                </Box>
                <Stack spacing={1}>
                  {user.languages.map((lang, index) => (
                    <Chip key={index} label={lang} variant="outlined" />
                  ))}
                </Stack>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <AchievementIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Achievements</Typography>
                </Box>
                <Stack spacing={2}>
                  {user.achievements.map((achievement, index) => (
                    <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
                      <Typography sx={{ fontSize: "1.5rem", mr: 2 }}>
                        {achievement.icon}
                      </Typography>
                      <Box>
                        <Typography variant="subtitle2">
                          {achievement.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {achievement.description}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column */}
          <Grid xs={12} md={8}>
            <Paper sx={{ width: "100%" }}>
              <Tabs value={activeTab} onChange={handleTabChange} sx={{ px: 2 }}>
                <Tab label="Skills Offering" />
                <Tab label="Currently Learning" />
                <Tab label="Reviews" />
              </Tabs>

              <Box sx={{ p: 3 }}>
                {/* Skills Offering Tab */}
                {activeTab === 0 && (
                  <Grid container spacing={3}>
                    {user.skillsOffering.map((skill) => (
                      <Grid key={skill.id} xs={12}>
                        <motion.div whileHover={{ scale: 1.02 }}>
                          <Card variant="outlined">
                            <CardContent>
                              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                <Box>
                                  <Typography variant="h6">{skill.title}</Typography>
                                  <Typography color="primary" fontWeight="bold">
                                    {skill.category} • {skill.level}
                                  </Typography>
                                </Box>
                                <Chip
                                  label={`${skill.students} students`}
                                  color="primary"
                                  variant="outlined"
                                />
                              </Box>
                              
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {skill.description}
                              </Typography>
                              
                              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                <Rating value={skill.rating} precision={0.1} readOnly size="small" />
                                <Typography variant="body2" sx={{ ml: 1 }}>
                                  {skill.rating}
                                </Typography>
                              </Box>
                              
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Box sx={{ display: "flex", gap: 1 }}>
                                  {skill.tags.map((tag) => (
                                    <Chip key={tag} label={tag} size="small" variant="outlined" />
                                  ))}
                                </Box>
                                <Typography variant="caption" color="primary">
                                  Seeking: {skill.seeking}
                                </Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                )}

                {/* Currently Learning Tab */}
                {activeTab === 1 && (
                  <Stack spacing={3}>
                    {user.skillsLearning.map((skill, index) => (
                      <Card key={index} variant="outlined">
                        <CardContent>
                          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                            <Box>
                              <Typography variant="h6">{skill.title}</Typography>
                              <Typography color="text.secondary">
                                Learning from {skill.teacher}
                              </Typography>
                            </Box>
                            <Chip
                              label={skill.status}
                              color="success"
                              variant="outlined"
                            />
                          </Box>
                          
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" gutterBottom>
                              Progress: {skill.progress}%
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={skill.progress}
                              sx={{ height: 8, borderRadius: 1 }}
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                )}

                {/* Reviews Tab */}
                {activeTab === 2 && (
                  <Stack spacing={3}>
                    {user.reviews.map((review) => (
                      <Card key={review.id} variant="outlined">
                        <CardContent>
                          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                            <Box>
                              <Typography variant="subtitle1">{review.reviewer}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {review.date} • {review.skill}
                              </Typography>
                            </Box>
                            <Rating value={review.rating} readOnly size="small" />
                          </Box>
                          <Typography variant="body2">{review.comment}</Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
