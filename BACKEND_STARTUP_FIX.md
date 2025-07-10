# Backend Startup Issues - Fixed

## Issues Identified and Resolved

### 1. **Connection Refused Error**
**Problem**: The frontend was trying to connect to `http://localhost:8000/api/v1/users/refresh-token` but getting `ERR_CONNECTION_REFUSED`.

**Root Cause**: The backend server wasn't running due to missing environment variables.

### 2. **Missing Google OAuth Configuration**
**Error**: `TypeError: OAuth2Strategy requires a clientID option`

**Root Cause**: The `GOOGLE_CLIENT_ID` environment variable was undefined.

**Fix**: Created `Backend/.env` file with dummy OAuth credentials:
```env
GOOGLE_CLIENT_ID=dummy_client_id
GOOGLE_CLIENT_SECRET=dummy_client_secret
```

### 3. **Missing Razorpay Configuration**
**Error**: `Error: 'key_id' or 'oauthToken' is mandatory`

**Root Cause**: Razorpay configuration was missing required keys.

**Fix**: Added Razorpay dummy credentials to `Backend/.env`:
```env
RAZORPAY_KEY_ID=dummy_razorpay_key_id
RAZORPAY_KEY_SECRET=dummy_razorpay_key_secret
RAZORPAY_PLAN_MONTHLY=dummy_monthly_plan
RAZORPAY_PLAN_YEARLY=dummy_yearly_plan
```

### 4. **ErrorBoundary useNavigate Issue**
**Error**: `useNavigate() may be used only in the context of a <Router> component`

**Root Cause**: The ErrorFallback component was using `useNavigate()` hook outside of Router context.

**Fix**: Replaced `navigate('/')` with `window.location.href = '/'` and removed the useNavigate import.

## Files Modified

### Created: `Backend/.env`
```env
PORT=8000
NODE_ENV=development

# Google OAuth (optional - can be left empty for basic functionality)
GOOGLE_CLIENT_ID=dummy_client_id
GOOGLE_CLIENT_SECRET=dummy_client_secret

# Session secret
SESSION_SECRET=your_session_secret_key_here

# Database (optional)
MONGODB_URI=

# JWT Secrets (you should change these)
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=10d

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# CORS Origin
CORS_ORIGIN=http://localhost:5173

# Razorpay (optional - can be left empty for basic functionality)
RAZORPAY_KEY_ID=dummy_razorpay_key_id
RAZORPAY_KEY_SECRET=dummy_razorpay_key_secret
RAZORPAY_PLAN_MONTHLY=dummy_monthly_plan
RAZORPAY_PLAN_YEARLY=dummy_yearly_plan
```

### Modified: `Frontend/src/components/ErrorBoundary.jsx`
- Removed `import { useNavigate } from 'react-router-dom'`
- Changed `navigate('/')` to `window.location.href = '/'`

## Current Status

✅ **Backend Server**: Now running successfully on `http://localhost:8000`
✅ **Health Check**: Responding at `http://localhost:8000/api/v1/healthcheck`
✅ **Frontend Connection**: Should now connect without errors
✅ **Error Boundary**: Fixed Router context issue

## How to Start the Backend

1. Navigate to Backend directory: `cd Backend`
2. Install dependencies: `npm install`
3. Start the server: `npm run dev` or `node src/index.js`

The server will start on port 8000 and display:
```
⚙️ VideoVault Server running on http://localhost:8000
🎯 API available at http://localhost:8000/api/v1
🏥 Health check: http://localhost:8000/api/v1/healthcheck
🔗 Frontend should connect to: http://localhost:5173
```

## Next Steps

1. **For Production**: Replace dummy credentials with real API keys
2. **Database**: Add `MONGODB_URI` to `.env` if you want database functionality
3. **Security**: Update JWT secrets and session secret for production use

The frontend should now successfully connect to the backend without connection errors!