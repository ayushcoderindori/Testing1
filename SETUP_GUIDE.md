# 🚀 VideoVault Setup Guide

## Quick Start (For Immediate Testing)

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- MongoDB Atlas account (free) OR local MongoDB installation

### 1. Clone and Install Dependencies

```bash
# Clone the repository (if not already done)
# git clone <your-repo-url>
# cd videovault

# Install Backend Dependencies
cd Backend
npm install

# Install Frontend Dependencies
cd ../Frontend
npm install
```

### 2. Setup Environment Variables

#### Backend Environment Setup
1. Navigate to `Backend/.env`
2. **CRITICAL**: Update the following variables:

```env
# Replace with your MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.mongodb.net/videovault

# Generate random secrets (use a password generator)
ACCESS_TOKEN_SECRET=your_generated_secret_here_64_chars_minimum
REFRESH_TOKEN_SECRET=your_generated_secret_here_64_chars_minimum
SESSION_SECRET=your_generated_session_secret_here
```

#### Frontend Environment Setup
Frontend `.env` is already configured, but you can modify:
```env
VITE_API_URL=http://localhost:8000/api/v1
```

### 3. Start the Application

```bash
# Terminal 1: Start Backend
cd Backend
npm run dev

# Terminal 2: Start Frontend  
cd Frontend
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000

---

## 📋 Detailed Setup Instructions

### Database Setup Options

#### Option A: MongoDB Atlas (Recommended - Free & Easy)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (free tier available)
4. Create a database user
5. Whitelist your IP address (or use 0.0.0.0/0 for development)
6. Get your connection string and update `MONGODB_URI` in `.env`

#### Option B: Local MongoDB
```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS
brew install mongodb/brew/mongodb-community

# Start MongoDB
sudo systemctl start mongod

# Use local URI in .env
MONGODB_URI=mongodb://localhost:27017/videovault
```

### OAuth Setup (Optional but Recommended)

#### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:8000/api/v1/users/auth/google/callback`
6. Update `.env` with your credentials:
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Cloud Services Setup (Optional)

#### Cloudinary (for file uploads)
1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get your cloud name, API key, and API secret
3. Update `.env`:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🧪 Testing the Features

### 1. Authentication Testing
- ✅ Visit http://localhost:5173/register
- ✅ Create a new account
- ✅ Try login with created credentials
- ✅ Test Google OAuth (if configured)

### 2. Dashboard Testing
- ✅ Access dashboard after login
- ✅ Check if stats load properly
- ✅ Test refresh functionality
- ✅ Try uploading a video (if Cloudinary configured)

### 3. Video Player Testing
- ✅ Navigate to any video
- ✅ Test like/dislike buttons
- ✅ Test comment functionality
- ✅ Test share buttons
- ✅ Verify counts display correctly

### 4. Error Handling Testing
- ✅ Stop backend server and test frontend behavior
- ✅ Try actions without authentication
- ✅ Test with invalid data

---

## 🔧 Troubleshooting

### Common Issues

#### Backend won't start
```bash
# Check if port 8000 is available
lsof -i :8000

# Kill process if needed
kill -9 <PID>
```

#### Database connection issues
- Verify MongoDB URI is correct
- Check if MongoDB Atlas IP is whitelisted
- Ensure database user has proper permissions

#### Frontend connection errors
- Verify backend is running on port 8000
- Check CORS configuration
- Verify API base URL in frontend `.env`

#### OAuth not working
- Verify redirect URI matches exactly
- Check Google Cloud Console settings
- Ensure credentials are correct in `.env`

### Development Tools

#### MongoDB Compass (GUI)
- Download [MongoDB Compass](https://www.mongodb.com/products/compass)
- Connect using your MongoDB URI
- View and manage your data visually

#### React Query Devtools
- Already included in development build
- Open browser dev tools to see React Query cache

---

## 🚀 Production Deployment

### Environment Variables for Production
```env
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
MONGODB_URI=mongodb+srv://prod_user:prod_pass@cluster.mongodb.net/videovault_prod

# Generate strong secrets
ACCESS_TOKEN_SECRET=<64-character-random-string>
REFRESH_TOKEN_SECRET=<64-character-random-string>
SESSION_SECRET=<32-character-random-string>
```

### Recommended Hosting Platforms

#### Frontend (Static)
- Vercel (recommended)
- Netlify
- GitHub Pages

#### Backend (API)
- Railway
- Render
- Heroku
- DigitalOcean App Platform

#### Database
- MongoDB Atlas (recommended)
- AWS DocumentDB
- DigitalOcean Managed Databases

---

## 📖 API Documentation

### Authentication Endpoints
```
POST /api/v1/users/register
POST /api/v1/users/login
POST /api/v1/users/logout
POST /api/v1/users/refresh-token
GET  /api/v1/users/current-user
```

### Video Endpoints
```
GET    /api/v1/videos
POST   /api/v1/videos
GET    /api/v1/videos/:id
PATCH  /api/v1/videos/:id
DELETE /api/v1/videos/:id
```

### Interaction Endpoints
```
POST /api/v1/likes/toggle/v/:videoId
GET  /api/v1/comments/:videoId
POST /api/v1/comments/:videoId
```

---

## 🎯 Next Development Steps

1. **Complete OAuth Setup**: Configure Google OAuth credentials
2. **Database Seeding**: Add sample data for testing
3. **File Upload**: Configure Cloudinary for video uploads
4. **Email Service**: Add email verification and notifications
5. **Payment Integration**: Complete Razorpay setup for premium features
6. **Testing**: Add comprehensive test suite
7. **Performance**: Implement caching and optimization
8. **Security**: Add rate limiting and security headers

---

## 🆘 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Ensure all services (MongoDB, etc.) are running
4. Check browser console and network tab for errors
5. Review backend logs for error messages

---

## ✅ Checklist for Going Live

- [ ] MongoDB Atlas configured and connected
- [ ] Strong secrets generated for production
- [ ] Google OAuth configured (optional)
- [ ] Cloudinary configured for file uploads
- [ ] CORS properly configured for production domain
- [ ] Error monitoring setup
- [ ] Backup strategy implemented
- [ ] SSL certificates configured
- [ ] Performance monitoring enabled

**Happy coding! 🎉 Your VideoVault application is now ready to become the best website in the world!**