import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Avatar,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Rating,
  Paper,
  Stack,
  Divider,
  Tab,
  Tabs,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import {
  Star as StarIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  People as PeopleIcon,
  Language as LanguageIcon,
  School as SchoolIcon,
  Message as MessageIcon,
  SwapHoriz as SwapIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";

const mockSkillData = {
  id: 1,
  title: "Master React.js Development",
  description: "Comprehensive React.js course covering everything from basics to advanced concepts. Learn hooks, state management, performance optimization, and modern React patterns. Perfect for beginners and intermediate developers looking to master React.",
  category: "Web Development",
  level: "Intermediate to Advanced",
  rating: 4.9,
  reviewCount: 47,
  studentCount: 156,
  timeCommitment: "2-3 hours/week",
  duration: "8-12 weeks",
  meetingType: "Online & In-Person",
  maxStudents: 8,
  currentStudents: 6,
  tags: ["React", "JavaScript", "Frontend", "Hooks", "State Management"],
  seeking: "UI/UX Design",
  seekingDescription: "Looking to learn modern UI/UX design principles, Figma, and user research methodologies",
  
  instructor: {
    id: 1,
    name: "Sarah Chen",
    avatar: "/api/placeholder/80/80",
    rating: 4.9,
    totalReviews: 234,
    location: "San Francisco, CA",
    responseTime: "Usually responds within 2 hours",
    verified: true,
    joinedDate: "March 2023",
    skillsOffered: 5,
    studentsHelped: "300+",
    bio: "Senior Software Engineer at a Fortune 500 company with 6+ years of React experience. Passionate about teaching and helping others grow in tech."
  },

  curriculum: [
    {
      week: 1,
      title: "React Fundamentals",
      topics: ["Components", "JSX", "Props", "State"],
      duration: "3 hours"
    },
    {
      week: 2,
      title: "Hooks Deep Dive",
      topics: ["useState", "useEffect", "Custom Hooks"],
      duration: "3 hours"
    },
    {
      week: 3,
      title: "State Management",
      topics: ["Context API", "useReducer", "State Patterns"],
      duration: "3 hours"
    },
    {
      week: 4,
      title: "Performance & Optimization",
      topics: ["React.memo", "useMemo", "useCallback"],
      duration: "3 hours"
    }
  ],

  reviews: [
    {
      id: 1,
      reviewer: "Alex Johnson",
      avatar: "/api/placeholder/40/40",
      rating: 5,
      date: "2 weeks ago",
      comment: "Sarah is an incredible teacher! Her explanations are crystal clear and she provides excellent hands-on projects. I went from React novice to building complex applications."
    },
    {
      id: 2,
      reviewer: "Maria Garcia",
      avatar: "/api/placeholder/40/40",
      rating: 5,
      date: "1 month ago",
      comment: "The best React learning experience I've had. Sarah's teaching style is perfect - patient, thorough, and always available for questions."
    }
  ],

  requirements: [
    "Basic JavaScript knowledge",
    "Familiarity with HTML/CSS",
    "Computer with code editor",
    "Enthusiasm to learn!"
  ],

  whatYoullLearn: [
    "Master React components and JSX",
    "Understand hooks and state management",
    "Build real-world applications",
    "Performance optimization techniques",
    "Testing React applications",
    "Deployment strategies"
  ]
};

export default function SkillDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  
  const skill = mockSkillData; // In real app, fetch based on id

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleContact = () => {
    setShowContactDialog(true);
  };

  const handleSendMessage = () => {
    console.log("Sending message:", contactMessage);
    setShowContactDialog(false);
    setContactMessage("");
  };

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card sx={{ mb: 3 }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                    <Chip label={skill.category} color="primary" />
                    <Box>
                      <IconButton 
                        onClick={() => setIsFavorited(!isFavorited)}
                        color={isFavorited ? "error" : "default"}
                      >
                        <FavoriteIcon />
                      </IconButton>
                      <IconButton>
                        <ShareIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Typography variant="h3" gutterBottom fontWeight="bold">
                    {skill.title}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Rating value={skill.rating} precision={0.1} readOnly />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {skill.rating} ({skill.reviewCount} reviews)
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      <PeopleIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: "middle" }} />
                      {skill.studentCount} students
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Level: {skill.level}
                    </Typography>
                  </Box>

                  <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}>
                    {skill.description}
                  </Typography>

                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
                    {skill.tags.map((tag) => (
                      <Chip key={tag} label={tag} variant="outlined" />
                    ))}
                  </Box>

                  <Paper sx={{ p: 3, bgcolor: "primary.light", color: "primary.contrastText" }}>
                    <Typography variant="h6" gutterBottom>
                      💰 What the instructor is seeking in exchange:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {skill.seeking}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                      {skill.seekingDescription}
                    </Typography>
                  </Paper>
                </CardContent>
              </Card>

              {/* Tabs Section */}
              <Card>
                <Tabs value={activeTab} onChange={handleTabChange}>
                  <Tab label="Curriculum" />
                  <Tab label="Reviews" />
                  <Tab label="Requirements" />
                </Tabs>

                <CardContent sx={{ p: 3 }}>
                  {/* Curriculum Tab */}
                  {activeTab === 0 && (
                    <Stack spacing={3}>
                      <Typography variant="h6" gutterBottom>
                        What You'll Learn
                      </Typography>
                      <Grid container spacing={2}>
                        {skill.whatYoullLearn.map((item, index) => (
                          <Grid key={index} item xs={12} sm={6}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <SchoolIcon color="primary" sx={{ mr: 2 }} />
                              <Typography variant="body2">{item}</Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>

                      <Divider sx={{ my: 3 }} />

                      <Typography variant="h6" gutterBottom>
                        Course Curriculum
                      </Typography>
                      <Stack spacing={2}>
                        {skill.curriculum.map((week) => (
                          <Card key={week.week} variant="outlined">
                            <CardContent>
                              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                  Week {week.week}: {week.title}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {week.duration}
                                </Typography>
                              </Box>
                              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                {week.topics.map((topic) => (
                                  <Chip key={topic} label={topic} size="small" variant="outlined" />
                                ))}
                              </Box>
                            </CardContent>
                          </Card>
                        ))}
                      </Stack>
                    </Stack>
                  )}

                  {/* Reviews Tab */}
                  {activeTab === 1 && (
                    <Stack spacing={3}>
                      {skill.reviews.map((review) => (
                        <Card key={review.id} variant="outlined">
                          <CardContent>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                              <Avatar src={review.avatar} sx={{ mr: 2 }} />
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="subtitle2">{review.reviewer}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {review.date}
                                </Typography>
                              </Box>
                              <Rating value={review.rating} size="small" readOnly />
                            </Box>
                            <Typography variant="body2">{review.comment}</Typography>
                          </CardContent>
                        </Card>
                      ))}
                    </Stack>
                  )}

                  {/* Requirements Tab */}
                  {activeTab === 2 && (
                    <Stack spacing={2}>
                      <Typography variant="h6" gutterBottom>
                        Prerequisites
                      </Typography>
                      {skill.requirements.map((req, index) => (
                        <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              bgcolor: "primary.main",
                              mr: 2
                            }}
                          />
                          <Typography variant="body2">{req}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              {/* Instructor Card */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Your Instructor
                  </Typography>
                  
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Avatar src={skill.instructor.avatar} sx={{ width: 60, height: 60, mr: 2 }} />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {skill.instructor.name}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Rating value={skill.instructor.rating} size="small" readOnly />
                        <Typography variant="caption" sx={{ ml: 1 }}>
                          ({skill.instructor.totalReviews} reviews)
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" paragraph>
                    {skill.instructor.bio}
                  </Typography>

                  <Stack spacing={1}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <LocationIcon sx={{ fontSize: 16, mr: 1, color: "text.secondary" }} />
                      <Typography variant="body2">{skill.instructor.location}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <TimeIcon sx={{ fontSize: 16, mr: 1, color: "text.secondary" }} />
                      <Typography variant="body2">{skill.instructor.responseTime}</Typography>
                    </Box>
                  </Stack>

                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => {/* Navigate to instructor profile */}}
                  >
                    View Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Course Details Card */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Course Details
                  </Typography>
                  
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Time Commitment
                      </Typography>
                      <Typography variant="body2">{skill.timeCommitment}</Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Duration
                      </Typography>
                      <Typography variant="body2">{skill.duration}</Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Format
                      </Typography>
                      <Typography variant="body2">{skill.meetingType}</Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Class Size
                      </Typography>
                      <Typography variant="body2">
                        {skill.currentStudents}/{skill.maxStudents} students
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Stack spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<SwapIcon />}
                  fullWidth
                >
                  Propose Skill Exchange
                </Button>
                
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<MessageIcon />}
                  fullWidth
                  onClick={handleContact}
                >
                  Send Message
                </Button>
                
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<CalendarIcon />}
                  fullWidth
                >
                  Schedule Free Consultation
                </Button>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* Contact Dialog */}
      <Dialog open={showContactDialog} onClose={() => setShowContactDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Send Message to {skill.instructor.name}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Your message"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={contactMessage}
            onChange={(e) => setContactMessage(e.target.value)}
            placeholder="Hi! I'm interested in your React course and would like to discuss a potential skill exchange..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowContactDialog(false)}>Cancel</Button>
          <Button onClick={handleSendMessage} variant="contained">Send Message</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
