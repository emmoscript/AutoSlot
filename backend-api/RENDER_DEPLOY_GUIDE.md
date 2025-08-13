# RENDER DEPLOYMENT GUIDE

## Quick Deploy Steps

1. **Fork/Clone** this repository to your GitHub account
2. **Connect** your GitHub repo to Render
3. **Create New Web Service** in Render
4. **Configure** the service with these settings:

### Service Configuration
- **Name:** `autoslot-backend-api`
- **Environment:** `Node`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Plan:** `Free` (or paid for better performance)

### Environment Variables
Add these in Render's Environment Variables section:

```
NODE_ENV=production
PORT=10000
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
```

### Health Check
- **Path:** `/health`

## Database Persistence Issue ⚠️

**PROBLEM:** SQLite database resets on Render service restarts, losing all data including admin user.

**SOLUTIONS:**

### Option 1: PostgreSQL Database (Recommended)
1. **Create PostgreSQL service** in Render
2. **Update database connection** to use PostgreSQL
3. **Data persists** across service restarts

### Option 2: Auto-admin Creation
The current setup includes automatic admin user creation on startup:
- Admin user is recreated automatically when service starts
- Credentials: `admin@autoslot.com` / `admin123`
- Works but users still lose their data

### Option 3: External Database
Use services like:
- **Supabase** (PostgreSQL)
- **PlanetScale** (MySQL)
- **MongoDB Atlas**

## Current Status
- ✅ Backend deployed to Render
- ✅ Admin Dashboard deployed to Vercel
- ✅ Mobile app connects to deployed backend
- ⚠️ Database resets on service restart

## Troubleshooting

### Admin Login Issues
If admin credentials don't work:
1. Wait for service restart (admin auto-created)
2. Or manually trigger admin creation via API

### Connection Issues
- Check if Render service is running
- Verify environment variables
- Check logs in Render dashboard

## Next Steps
1. **Implement PostgreSQL** for data persistence
2. **Add data backup** functionality
3. **Monitor service** performance
