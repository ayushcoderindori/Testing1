import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Stack,
  Autocomplete,
  Switch,
  FormControlLabel,
  Slider,
} from "@mui/material";
import {
  Add as AddIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";

const skillCategories = [
  "Web Development", "Mobile Development", "UI/UX Design", "Data Science",
  "Digital Marketing", "Photography", "Music Production", "Language Learning",
  "Writing", "Cooking", "Fitness Training", "Business Consulting",
  "Graphic Design", "Video Editing", "3D Modeling", "Game Development"
];

const skillLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];

const timeCommitmentOptions = [
  "1-2 hours/week", "2-4 hours/week", "4-6 hours/week", 
  "6-10 hours/week", "10+ hours/week", "Flexible"
];

const steps = ["Basic Info", "Skill Details", "What You're Seeking", "Review & Publish"];

export default function OfferSkill() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    level: "",
    description: "",
    tags: [],
    timeCommitment: "",
    isFlexible: false,
    meetingType: "both", // online, in-person, both
    maxStudents: 5,
    seekingSkills: [],
    seekingDescription: "",
    portfolio: "",
    experience: "",
    certification: false
  });

  const [currentTag, setCurrentTag] = useState("");

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleFormChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = () => {
    console.log("Skill offering submitted:", formData);
    // Handle form submission
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Skill Title"
                placeholder="e.g., React.js Development for Beginners"
                value={formData.title}
                onChange={handleFormChange("title")}
                fullWidth
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  onChange={handleFormChange("category")}
                  label="Category"
                >
                  {skillCategories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Your Level</InputLabel>
                <Select
                  value={formData.level}
                  onChange={handleFormChange("level")}
                  label="Your Level"
                >
                  {skillLevels.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Description"
                placeholder="Describe what you'll teach, your approach, and what students will learn..."
                value={formData.description}
                onChange={handleFormChange("description")}
                fullWidth
                multiline
                rows={4}
                required
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Add Skill Tags
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
                {formData.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  label="Add Tag"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                  size="small"
                />
                <Button
                  variant="outlined"
                  onClick={handleAddTag}
                  startIcon={<AddIcon />}
                >
                  Add
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Time Commitment</InputLabel>
                <Select
                  value={formData.timeCommitment}
                  onChange={handleFormChange("timeCommitment")}
                  label="Time Commitment"
                >
                  {timeCommitmentOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography gutterBottom>Maximum Students</Typography>
              <Slider
                value={formData.maxStudents}
                onChange={(e, value) => setFormData(prev => ({ ...prev, maxStudents: value }))}
                min={1}
                max={20}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Meeting Type</InputLabel>
                <Select
                  value={formData.meetingType}
                  onChange={handleFormChange("meetingType")}
                  label="Meeting Type"
                >
                  <MenuItem value="online">Online Only</MenuItem>
                  <MenuItem value="in-person">In-Person Only</MenuItem>
                  <MenuItem value="both">Both Online & In-Person</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Your Experience"
                placeholder="Tell us about your background and experience in this skill..."
                value={formData.experience}
                onChange={handleFormChange("experience")}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Portfolio/Examples (Optional)"
                placeholder="Links to your work, portfolio, or examples..."
                value={formData.portfolio}
                onChange={handleFormChange("portfolio")}
                fullWidth
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                What skills are you looking to learn in exchange?
              </Typography>
              <Autocomplete
                multiple
                options={skillCategories}
                value={formData.seekingSkills}
                onChange={(event, newValue) => {
                  setFormData(prev => ({ ...prev, seekingSkills: newValue }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Skills You Want to Learn"
                    placeholder="Select skills you're interested in learning"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                      key={option}
                    />
                  ))
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Additional Details"
                placeholder="Describe what specific aspects you'd like to learn, your current level, or any preferences..."
                value={formData.seekingDescription}
                onChange={handleFormChange("seekingDescription")}
                fullWidth
                multiline
                rows={4}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isFlexible}
                    onChange={(e) => setFormData(prev => ({ ...prev, isFlexible: e.target.checked }))}
                  />
                }
                label="I'm open to other skill exchanges not listed above"
              />
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Review Your Skill Offering
              </Typography>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {formData.title}
                  </Typography>
                  <Typography color="primary" gutterBottom>
                    {formData.category} • {formData.level}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {formData.description}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Tags:
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {formData.tags.map((tag) => (
                        <Chip key={tag} label={tag} size="small" />
                      ))}
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    <ScheduleIcon sx={{ fontSize: 16, mr: 1, verticalAlign: "middle" }} />
                    {formData.timeCommitment} • Max {formData.maxStudents} students • {formData.meetingType.replace("-", " ")}
                  </Typography>

                  {formData.seekingSkills.length > 0 && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: "action.hover", borderRadius: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Seeking in Exchange:
                      </Typography>
                      <Typography variant="body2">
                        {formData.seekingSkills.join(", ")}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom align="center">
            Offer Your Skill
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Share your expertise and connect with learners worldwide
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ mb: 4 }}>
            {renderStepContent(activeStep)}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
            >
              Back
            </Button>
            
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                size="large"
              >
                Publish Skill Offering
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={
                  (activeStep === 0 && (!formData.title || !formData.category || !formData.level || !formData.description)) ||
                  (activeStep === 1 && formData.tags.length === 0)
                }
              >
                Next
              </Button>
            )}
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
}
