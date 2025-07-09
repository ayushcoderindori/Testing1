import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton,
  Avatar,
  Typography,
  Paper,
  Button,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Card,
  CardContent,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  ChatBubble as ChatIcon,
  Send as SendIcon,
  Close as CloseIcon,
  SmartToy as AIIcon,
  Lightbulb as IdeaIcon,
  VideoLibrary as VideoIcon,
  TrendingUp as TrendingIcon,
  Help as HelpIcon,
  Psychology as BrainIcon,
  AutoAwesome as MagicIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../auth/useAuth.js';

const quickPrompts = [
  { text: "Help me brainstorm video ideas", icon: <IdeaIcon />, color: "primary" },
  { text: "How to get more views?", icon: <TrendingIcon />, color: "success" },
  { text: "Best practices for uploads", icon: <VideoIcon />, color: "info" },
  { text: "Platform help & FAQs", icon: <HelpIcon />, color: "secondary" },
];

const mockAIResponses = {
  "help me brainstorm video ideas": {
    text: "🎬 Here are some trending video ideas perfect for your style:\n\n• **60-Second Tutorials**: Quick how-to videos are super popular!\n• **Behind the Scenes**: Show your creative process\n• **React to Trends**: Put your spin on viral content\n• **Q&A Sessions**: Answer audience questions\n• **Day in the Life**: Personal content performs well\n• **Challenge Videos**: Create or join trending challenges\n\nWhat niche are you most interested in? I can give more specific ideas!",
    suggestions: ["Tech tutorials", "Lifestyle content", "Educational videos", "Entertainment"]
  },
  "how to get more views": {
    text: "📈 Want to boost your views? Here's my proven strategy:\n\n**Optimize for Discovery:**\n• Use trending hashtags (#coding #tutorial #react)\n• Post at peak times (7-9 PM your timezone)\n• Create eye-catching thumbnails\n• Write compelling titles with emojis\n\n**Engagement Tactics:**\n• Ask questions to encourage comments\n• Respond to every comment quickly\n• Create series to keep viewers coming back\n• Use cliffhangers in longer videos\n\n**Platform Features:**\n• Upload consistently (aim for daily)\n• Use all available tags\n• Share on social media\n\nWhich area would you like me to dive deeper into?",
    suggestions: ["Thumbnail tips", "Best posting times", "Hashtag strategy", "Engagement tactics"]
  },
  "best practices for uploads": {
    text: "✨ Here's your ultimate upload checklist:\n\n**Before Upload:**\n• Keep videos under your time limit (90s free, 180s premium)\n• Record in good lighting & clear audio\n• Plan your content structure\n• Have a strong hook in first 3 seconds\n\n**During Upload:**\n• Write descriptive, keyword-rich titles\n• Add 3-5 relevant tags\n• Create compelling descriptions\n• Set appropriate privacy settings\n\n**After Upload:**\n• Share immediately on social media\n• Engage with early comments\n• Monitor analytics\n• Plan your next video\n\n**Pro Tips:**\n• Batch upload content\n• Create content calendars\n• Always have backup ideas ready\n\nNeed help with any specific part?",
    suggestions: ["Video quality tips", "Title optimization", "Description writing", "Analytics tracking"]
  },
  "platform help & faqs": {
    text: "🤖 VideoVault FAQ - I've got you covered!\n\n**Credits System:**\n• Earn 5 credits per upload\n• Watching costs 1 credit (free for Premium)\n• Premium users get unlimited viewing\n\n**Video Limits:**\n• Free users: 90 seconds max\n• Premium users: 180 seconds max\n• All videos processed in HD\n\n**Community Guidelines:**\n• Keep content family-friendly\n• No spam or misleading content\n• Respect copyright laws\n• Be kind in comments\n\n**Getting Help:**\n• Use this AI chat anytime\n• Check our Help Center\n• Contact support team\n• Join our Discord community\n\nWhat specific question can I help you with?",
    suggestions: ["Credit system", "Premium benefits", "Community rules", "Technical issues"]
  }
};

const AIMessage = ({ message, isUser }) => {
  const theme = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: isUser ? 'flex-end' : 'flex-start',
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            maxWidth: '80%',
            flexDirection: isUser ? 'row-reverse' : 'row',
          }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              mx: 1,
              bgcolor: isUser ? 'primary.main' : 'secondary.main',
            }}
          >
            {isUser ? message.userAvatar : <AIIcon />}
          </Avatar>
          
          <Paper
            elevation={1}
            sx={{
              p: 2,
              bgcolor: isUser 
                ? alpha(theme.palette.primary.main, 0.1)
                : alpha(theme.palette.secondary.main, 0.1),
              borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                whiteSpace: 'pre-wrap',
                lineHeight: 1.5,
              }}
            >
              {message.text}
            </Typography>
            
            {message.suggestions && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  Quick actions:
                </Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  {message.suggestions.map((suggestion, index) => (
                    <Chip
                      key={index}
                      label={suggestion}
                      size="small"
                      variant="outlined"
                      clickable
                      sx={{ fontSize: '0.7rem' }}
                    />
                  ))}
                </Stack>
              </Box>
            )}
            
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              {message.timestamp}
            </Typography>
          </Paper>
        </Box>
      </Box>
    </motion.div>
  );
};

export default function AIChatbot() {
  const { user } = useAuth();
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hey ${user?.fullName || 'there'}! 👋 I'm your AI assistant for VideoVault!\n\nI can help you with:\n• Video creation tips\n• Growing your audience\n• Platform features\n• Creative inspiration\n\nWhat would you like to know?`,
      isUser: false,
      timestamp: 'Just now',
      suggestions: quickPrompts.map(p => p.text)
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickPrompts, setShowQuickPrompts] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Find matching response
    for (const [key, response] of Object.entries(mockAIResponses)) {
      if (lowerMessage.includes(key) || key.includes(lowerMessage.slice(0, 10))) {
        return response;
      }
    }
    
    // Default response
    return {
      text: `🤔 That's an interesting question! While I'm still learning, here are some things I can definitely help you with:\n\n• **Video Creation**: Tips for making engaging content\n• **Growth Strategy**: How to get more views and subscribers\n• **Platform Features**: Understanding credits, premium benefits, etc.\n• **Technical Help**: Upload issues, video quality, etc.\n\nTry asking me something like "How do I get more views?" or "Help me brainstorm video ideas!" 💡`,
      suggestions: ["Help with video ideas", "Growth tips", "Platform features", "Technical support"]
    };
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: newMessage,
      isUser: true,
      timestamp: 'Just now',
      userAvatar: user?.avatar
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);
    setShowQuickPrompts(false);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = generateAIResponse(newMessage);
      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponse.text,
        isUser: false,
        timestamp: 'Just now',
        suggestions: aiResponse.suggestions
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickPrompt = (promptText) => {
    setNewMessage(promptText);
    handleSendMessage();
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <Tooltip title="AI Assistant - Get help anytime!">
        <motion.div
          style={{ position: 'fixed', bottom: 80, right: 24, zIndex: 1000 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Fab
            color="secondary"
            onClick={() => setIsOpen(true)}
            sx={{
              background: 'linear-gradient(45deg, #9c27b0, #e91e63)',
              '&:hover': {
                background: 'linear-gradient(45deg, #7b1fa2, #c2185b)',
              },
              boxShadow: '0 4px 20px rgba(156, 39, 176, 0.3)',
            }}
          >
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <BrainIcon />
            </motion.div>
          </Fab>
        </motion.div>
      </Tooltip>

      {/* Chat Dialog */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            height: '80vh',
            maxHeight: 600,
            borderRadius: 3,
            overflow: 'hidden',
          }
        }}
      >
        {/* Header */}
        <DialogTitle
          sx={{
            background: 'linear-gradient(45deg, #9c27b0, #e91e63)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ mr: 2, bgcolor: 'rgba(255,255,255,0.2)' }}>
              <AIIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                VideoVault AI Assistant
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                {isTyping ? 'AI is typing...' : 'Online • Ready to help!'}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={() => setIsOpen(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {/* Messages */}
        <DialogContent
          sx={{
            p: 0,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            bgcolor: alpha(theme.palette.background.default, 0.5),
          }}
        >
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Quick Prompts */}
            <AnimatePresence>
              {showQuickPrompts && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Card sx={{ mb: 3, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <MagicIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="subtitle2" fontWeight="bold">
                          Quick Start Options
                        </Typography>
                      </Box>
                      <Stack spacing={1}>
                        {quickPrompts.map((prompt, index) => (
                          <Button
                            key={index}
                            variant="outlined"
                            startIcon={prompt.icon}
                            onClick={() => handleQuickPrompt(prompt.text)}
                            color={prompt.color}
                            size="small"
                            sx={{
                              justifyContent: 'flex-start',
                              textTransform: 'none',
                              borderRadius: 2,
                            }}
                          >
                            {prompt.text}
                          </Button>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Message List */}
            <Box sx={{ flex: 1 }}>
              {messages.map((message) => (
                <AIMessage key={message.id} message={message} isUser={message.isUser} />
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'secondary.main' }}>
                      <AIIcon />
                    </Avatar>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        bgcolor: alpha(theme.palette.secondary.main, 0.1),
                        borderRadius: '20px 20px 20px 4px',
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: i * 0.2,
                            }}
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: theme.palette.secondary.main,
                            }}
                          />
                        ))}
                      </Box>
                    </Paper>
                  </Box>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </Box>
          </Box>

          {/* Input Area */}
          <Box
            sx={{
              p: 2,
              borderTop: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
              <TextField
                fullWidth
                multiline
                maxRows={3}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about VideoVault..."
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  }
                }}
              />
              <IconButton
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || isTyping}
                color="primary"
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' },
                  '&:disabled': { bgcolor: 'grey.300' },
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
            
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              AI can make mistakes. Always verify important information.
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}