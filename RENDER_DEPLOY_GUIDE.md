# 🚀 AutoSlot Backend - Render Deployment Guide

This guide will help you deploy the AutoSlot backend API to Render.com with minimal friction.

## 📋 Prerequisites

- A Render.com account (free tier available)
- Your AutoSlot project code pushed to GitHub
- Node.js 18+ (Render will handle this automatically)

## 🚀 Quick Deployment Steps

### 1. Prepare Your Repository

Make sure your `backend-api` folder contains:
- ✅ `package.json` with all dependencies
- ✅ `render.yaml` (already created)
- ✅ `src/` folder with all source code
- ✅ `tsconfig.json` for TypeScript compilation

### 2. Deploy to Render

1. **Go to [Render.com](https://render.com)** and sign in
2. **Click "New +"** and select **"Web Service"**
3. **Connect your GitHub repository** (AutoSlot)
4. **Configure the service:**
   - **Name:** `autoslot-backend-api`
   - **Root Directory:** `backend-api` (important!)
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free (or paid if you prefer)

### 3. Environment Variables

Add these environment variables in Render dashboard:

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Production environment |
| `PORT` | `10000` | Port for the application |
| `JWT_SECRET` | `your-secret-key-here` | Secret for JWT tokens |
| `DATABASE_URL` | `./autoslot.db` | SQLite database path |

### 4. Auto-Deploy Settings

- ✅ **Auto-Deploy:** Enabled
- ✅ **Branch:** `main` (or your default branch)
- ✅ **Health Check Path:** `/api/health`

## 🔧 Manual Configuration (Alternative)

If you prefer manual setup instead of `render.yaml`:

### Build & Start Commands

```bash
# Build Command
npm install && npm run build

# Start Command  
npm start
```

### Health Check

The API includes a health check endpoint at `/api/health` that returns:
```json
{
  "status": "OK",
  "message": "AutoSlot Backend API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🌐 API Endpoints

Once deployed, your API will be available at:
- **Base URL:** `https://your-app-name.onrender.com`
- **Health Check:** `https://your-app-name.onrender.com/health`
- **API Docs:** `https://your-app-name.onrender.com/`

### Available Endpoints:

- `GET /` - API welcome message
- `GET /health` - Health check
- `GET /api/health` - API health check
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/parking-lots` - Get all parking lots
- `GET /api/parking-spaces` - Get parking spaces
- `POST /api/reservations` - Create reservation
- `GET /api/sensors/status` - Get sensor status

## 📱 Update Mobile App Configuration

After deployment, update your mobile app's API configuration:

```dart
// In mobile app/lib/config/api_config.dart
class ApiConfig {
  static const String baseUrl = 'https://your-app-name.onrender.com';
  // ... rest of the configuration
}
```

## 🔍 Troubleshooting

### Common Issues:

1. **Build Fails:**
   - Check that all dependencies are in `package.json`
   - Ensure TypeScript compilation works locally

2. **Service Won't Start:**
   - Verify the start command is correct
   - Check environment variables are set

3. **Health Check Fails:**
   - Ensure the `/api/health` endpoint is working
   - Check logs in Render dashboard

### Viewing Logs:

1. Go to your service in Render dashboard
2. Click on "Logs" tab
3. Check for any error messages

## 🎯 Next Steps

After successful deployment:

1. **Test the API** using the health check endpoint
2. **Update mobile app** with the new API URL
3. **Test mobile app** connectivity
4. **Monitor logs** for any issues

## 📞 Support

If you encounter issues:
1. Check Render's documentation
2. Review the logs in Render dashboard
3. Verify all environment variables are set correctly

---

**🎉 Congratulations!** Your AutoSlot backend is now deployed and ready to serve your mobile application.
