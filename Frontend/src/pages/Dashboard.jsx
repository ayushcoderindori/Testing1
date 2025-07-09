import React, { useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  Tab,
  Tabs,
  Stack,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  TrendingUp as TrendingIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
  SwapHoriz as ExchangeIcon,
  CalendarToday as CalendarIcon,
  Message as MessageIcon,
  Add as AddIcon,
  NotificationsActive as NotificationIcon,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import axios from "../api/axios.js";
import { motion } from "framer-motion";
import useAuth from "../auth/useAuth.js"; 

const mockDashboardData = {
  stats: {
    skillsOffered: 3,
    skillsLearning: 2,
    totalStudents: 47,
    totalRating: 4.9,
    completedExchanges: 12,
    activeExchanges: 5,
    credits: 45,
    reputation: 850
  },
  skillsOffering: [
    {
      id: 1,
      title: "React.js Development",
      students: 23,
      rating: 4.9,
      status: "active",
      nextSession: "Tomorrow, 2:00 PM"
    },
    {
      id: 2,
      title: "Node.js Backend",
      students: 15,
      rating: 4.8,
      status: "active", 
      nextSession: "Friday, 10:00 AM"
    }
  ],
  skillsLearning: [
    {
      id: 1,
      title: "UI/UX Design",
      teacher: "Emma Watson",
      progress: 75,
      nextSession: "Wednesday, 6:00 PM",
      status: "active"
    },
    {
      id: 2,
      title: "Spanish Conversation",
      teacher: "Carlos Rodriguez",
      progress: 40,
      nextSession: "Thursday, 4:00 PM",
      status: "active"
    }
  ],
  recentMessages: [
    {
      id: 1,
      from: "John Doe",
      message: "Thanks for the React lesson! Very helpful.",
      time: "2 hours ago",
      avatar: "/api/placeholder/40/40"
    },
    {
      id: 2,
      from: "Emma Watson",
      message: "Ready for tomorrow's UI/UX session?",
      time: "5 hours ago", 
      avatar: "/api/placeholder/40/40"
    }
  ],
  upcomingSessions: [
    {
      id: 1,
      title: "React.js - Advanced Patterns",
      type: "teaching",
      participant: "Alice Smith",
      time: "Tomorrow, 2:00 PM",
      duration: "1.5 hours"
    },
    {
      id: 2,
      title: "UI/UX Design Fundamentals",
      type: "learning",
      participant: "Emma Watson",
      time: "Wednesday, 6:00 PM",
      duration: "2 hours"
    }
  ],
  exchangeRequests: [
    {
      id: 1,
      requester: "Mike Johnson",
      requestedSkill: "Python Development",
      offeredSkill: "Digital Marketing",
      message: "Hi! I'd love to learn Python in exchange for digital marketing lessons.",
      time: "1 day ago",
      avatar: "/api/placeholder/40/40"
    }
  ]
};

export default function Dashboard() {
  const { user } = useAuth(); 
  const [activeTab, setActiveTab] = useState(0);
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const dashboardData = mockDashboardData; // In real app, fetch from API

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom fontWeight="bold">
          Welcome back, {user?.fullName || "User"}! 🚀
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Track your skill exchanges and continue your learning journey
        </Typography>
      </Box>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { 
            label: "Skills Offered", 
            value: dashboardData.stats.skillsOffered, 
            icon: <SchoolIcon />,
            color: "primary.main",
            change: "+2 this month"
          },
          { 
            label: "Skills Learning", 
            value: dashboardData.stats.skillsLearning, 
            icon: <TrendingIcon />,
            color: "success.main",
            change: "+1 this month"
          },
          { 
            label: "Total Students", 
            value: dashboardData.stats.totalStudents, 
            icon: <PeopleIcon />,
            color: "warning.main",
            change: "+8 this week"
          },
          { 
            label: "Overall Rating", 
            value: dashboardData.stats.totalRating, 
            icon: <StarIcon />,
            color: "error.main",
            change: "↑0.1 this month"
          },
          { 
            label: "Active Exchanges", 
            value: dashboardData.stats.activeExchanges, 
            icon: <ExchangeIcon />,
            color: "info.main",
            change: "+2 new"
          },
          { 
            label: "Skill Credits", 
            value: dashboardData.stats.credits, 
            icon: <TrophyIcon />,
            color: "secondary.main",
            change: "+12 earned"
          }
        ].map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={stat.label}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box 
                      sx={{ 
                        p: 1, 
                        borderRadius: 2, 
                        bgcolor: stat.color,
                        color: "white",
                        mr: 2 
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Typography variant="h4" fontWeight="bold">
                      {stat.value}
                    </Typography>
                  </Box>
                  <Typography variant="subtitle2" gutterBottom>
                    {stat.label}
                  </Typography>
                  <Typography variant="caption" color="success.main">
                    {stat.change}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {/* Main Content Area */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ mb: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="Skills I'm Teaching" />
              <Tab label="Skills I'm Learning" />
              <Tab label="Exchange Requests" />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {/* Skills Teaching Tab */}
              {activeTab === 0 && (
                <Stack spacing={3}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6">
                      Skills You're Teaching ({dashboardData.skillsOffering.length})
                    </Typography>
                    <Button variant="contained" startIcon={<AddIcon />}>
                      Offer New Skill
                    </Button>
                  </Box>

                  {dashboardData.skillsOffering.map((skill) => (
                    <Card key={skill.id} variant="outlined">
                      <CardContent>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                          <Box>
                            <Typography variant="h6">{skill.title}</Typography>
                            <Typography color="text.secondary">
                              {skill.students} students • Rating: {skill.rating} ⭐
                            </Typography>
                          </Box>
                          <Chip 
                            label={skill.status} 
                            color="success" 
                            variant="outlined" 
                          />
                        </Box>
                        
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          <CalendarIcon sx={{ fontSize: 16, mr: 1, color: "text.secondary" }} />
                          <Typography variant="body2">
                            Next session: {skill.nextSession}
                          </Typography>
                        </Box>

                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button size="small" variant="outlined">
                            View Details
                          </Button>
                          <Button size="small">
                            Manage Students
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}

              {/* Skills Learning Tab */}
              {activeTab === 1 && (
                <Stack spacing={3}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6">
                      Skills You're Learning ({dashboardData.skillsLearning.length})
                    </Typography>
                    <Button variant="contained" startIcon={<AddIcon />}>
                      Find New Skill
                    </Button>
                  </Box>

                  {dashboardData.skillsLearning.map((skill) => (
                    <Card key={skill.id} variant="outlined">
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
                            color="primary" 
                            variant="outlined" 
                          />
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" gutterBottom>
                            Progress: {skill.progress}%
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={skill.progress}
                            sx={{ height: 8, borderRadius: 1 }}
                          />
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          <CalendarIcon sx={{ fontSize: 16, mr: 1, color: "text.secondary" }} />
                          <Typography variant="body2">
                            Next session: {skill.nextSession}
                          </Typography>
                        </Box>

                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button size="small" variant="outlined">
                            View Course
                          </Button>
                          <Button size="small">
                            Message Teacher
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}

              {/* Exchange Requests Tab */}
              {activeTab === 2 && (
                <Stack spacing={3}>
                  <Typography variant="h6">
                    Pending Exchange Requests ({dashboardData.exchangeRequests.length})
                  </Typography>

                  {dashboardData.exchangeRequests.map((request) => (
                    <Card key={request.id} variant="outlined">
                      <CardContent>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          <Avatar src={request.avatar} sx={{ mr: 2 }} />
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {request.requester}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {request.time}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" gutterBottom>
                            <strong>Wants to learn:</strong> {request.requestedSkill}
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            <strong>Offers to teach:</strong> {request.offeredSkill}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            "{request.message}"
                          </Typography>
                        </Box>

                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button size="small" variant="contained" color="success">
                            Accept
                          </Button>
                          <Button size="small" variant="outlined" color="error">
                            Decline
                          </Button>
                          <Button size="small" variant="outlined">
                            Message
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={3}>
            {/* Upcoming Sessions */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Upcoming Sessions
                </Typography>
                <List dense>
                  {dashboardData.upcomingSessions.map((session) => (
                    <ListItem key={session.id} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: session.type === "teaching" ? "primary.main" : "success.main" }}>
                          {session.type === "teaching" ? <SchoolIcon /> : <TrendingIcon />}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={session.title}
                        secondary={`${session.time} • ${session.duration}`}
                      />
                    </ListItem>
                  ))}
                </List>
                <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
                  View All Sessions
                </Button>
              </CardContent>
            </Card>

            {/* Recent Messages */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Messages
                </Typography>
                <List dense>
                  {dashboardData.recentMessages.map((message, index) => (
                    <Box key={message.id}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar src={message.avatar} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={message.from}
                          secondary={message.message}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {message.time}
                        </Typography>
                      </ListItem>
                      {index < dashboardData.recentMessages.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
                <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
                  View All Messages
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Stack spacing={2}>
                  <Button variant="contained" startIcon={<AddIcon />} fullWidth>
                    Offer New Skill
                  </Button>
                  <Button variant="outlined" startIcon={<ExchangeIcon />} fullWidth>
                    Browse Skills
                  </Button>
                  <Button variant="outlined" startIcon={<MessageIcon />} fullWidth>
                    Messages
                  </Button>
                  <Button variant="outlined" startIcon={<CalendarIcon />} fullWidth>
                    Schedule
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
