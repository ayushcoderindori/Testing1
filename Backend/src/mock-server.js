// Simple mock server for development without MongoDB
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

const app = express();

// Mock database
const mockUsers = [
  {
    _id: "user1",
    fullName: "John Doe",
    username: "johndoe",
    email: "john@barterskills.com",
    password: "$2b$10$hashedpassword", // This would be properly hashed
    avatar: "https://picsum.photos/80/80?random=1",
    credits: 45,
    isPremium: false,
    isVerified: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: "user2", 
    fullName: "Jane Smith",
    username: "janesmith",
    email: "jane@barterskills.com",
    password: "$2b$10$hashedpassword",
    avatar: "https://picsum.photos/80/80?random=2",
    credits: 23,
    isPremium: true,
    isVerified: true,
    createdAt: new Date().toISOString()
  }
];

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Mock JWT tokens
const ACCESS_TOKEN_SECRET = "mock-access-secret";
const REFRESH_TOKEN_SECRET = "mock-refresh-secret";

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ _id: userId }, ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
  const refreshToken = jwt.sign({ _id: userId }, REFRESH_TOKEN_SECRET, { expiresIn: '10d' });
  return { accessToken, refreshToken };
};

// Routes
app.post('/api/v1/users/register', (req, res) => {
  const { fullName, username, email, password } = req.body;
  
  // Check if user exists
  const existingUser = mockUsers.find(u => u.email === email || u.username === username);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User already exists"
    });
  }
  
  // Create new user
  const newUser = {
    _id: `user${mockUsers.length + 1}`,
    fullName,
    username,
    email,
    password: "$2b$10$hashedpassword", // Would be properly hashed
    avatar: `https://picsum.photos/80/80?random=${mockUsers.length + 1}`,
    credits: 25,
    isPremium: false,
    isVerified: false,
    createdAt: new Date().toISOString()
  };
  
  mockUsers.push(newUser);
  
  const { password: _, ...userWithoutPassword } = newUser;
  const { accessToken, refreshToken } = generateTokens(newUser._id);
  
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: false, // Set to true in production
    maxAge: 10 * 24 * 60 * 60 * 1000 // 10 days
  });
  
  res.status(201).json({
    success: true,
    data: {
      user: userWithoutPassword,
      accessToken
    }
  });
});

app.post('/api/v1/users/login', (req, res) => {
  const { email, password } = req.body;
  
  // Find user
  const user = mockUsers.find(u => u.email === email);
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid credentials"
    });
  }
  
  // In real app, verify password hash here
  // For mock, we accept any password
  
  const { password: _, ...userWithoutPassword } = user;
  const { accessToken, refreshToken } = generateTokens(user._id);
  
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: false,
    maxAge: 10 * 24 * 60 * 60 * 1000
  });
  
  res.json({
    success: true,
    data: {
      user: userWithoutPassword,
      accessToken
    }
  });
});

app.get('/api/v1/users/current-user', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token required"
    });
  }
  
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    const user = mockUsers.find(u => u._id === decoded._id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token"
      });
    }
    
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
});

app.post('/api/v1/users/refresh-token', (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  
  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "Refresh token required"
    });
  }
  
  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const user = mockUsers.find(u => u._id === decoded._id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token"
      });
    }
    
    const { accessToken } = generateTokens(user._id);
    
    res.json({
      success: true,
      data: { accessToken }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid refresh token"
    });
  }
});

app.post('/api/v1/users/logout', (req, res) => {
  res.clearCookie('refreshToken');
  res.json({
    success: true,
    message: "Logged out successfully"
  });
});

// Health check
app.get('/api/v1/healthcheck', (req, res) => {
  res.json({
    success: true,
    message: "Mock server is running"
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Mock BarterSkills server running on port ${PORT}`);
  console.log(`📝 Available test users:`);
  console.log(`   - john@barterskills.com (any password)`);
  console.log(`   - jane@barterskills.com (any password)`);
});