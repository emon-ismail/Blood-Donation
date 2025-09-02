# 🚀 Supabase Keep-Alive Setup Guide

## Overview
This setup prevents your Supabase project from pausing after 7 days of inactivity using triple redundancy:

1. **Client-side pings** (every 6 hours)
2. **Netlify function** (on-demand + scheduled)
3. **GitHub Actions** (every 4 hours)
4. **UptimeRobot** (every 5 minutes)

## 📁 Files Created

```
netlify/functions/keep-alive.js    # Netlify serverless function
src/utils/keepAlive.js            # Client-side keep-alive service
.github/workflows/keep-alive.yml   # GitHub Actions workflow
netlify.toml                      # Netlify configuration
```

## 🔧 Setup Steps

### 1. Netlify Environment Variables
Add these to your Netlify dashboard:
- `VITE_SUPABASE_URL` = your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` = your Supabase anon key

### 2. GitHub Secrets
Add these to your GitHub repository secrets:
- `VITE_SUPABASE_URL` = your Supabase project URL  
- `VITE_SUPABASE_ANON_KEY` = your Supabase anon key

### 3. UptimeRobot Setup
1. Go to [UptimeRobot.com](https://uptimerobot.com)
2. Create free account
3. Add new monitor:
   - **Monitor Type**: HTTP(s)
   - **URL**: `https://bloood.netlify.app/.netlify/functions/keep-alive`
   - **Monitoring Interval**: 5 minutes
   - **Monitor Timeout**: 30 seconds

### 4. Deploy & Test

```bash
# Deploy to Netlify
git add .
git commit -m "Add Supabase keep-alive system"
git push origin main

# Test endpoints
curl https://bloood.netlify.app/.netlify/functions/keep-alive
```

## 🔍 Monitoring

### Check Function Status
```bash
# Test Netlify function
curl https://bloood.netlify.app/.netlify/functions/keep-alive

# Expected response:
{
  "success": true,
  "message": "Supabase keep-alive ping successful",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "recordCount": 1
}
```

### GitHub Actions
- Check Actions tab in your repository
- Workflow runs every 4 hours automatically
- Can be triggered manually

### Client-side Logs
Open browser console to see:
```
🚀 Starting keep-alive service...
✅ Supabase ping successful
⏰ Keep-alive service started (ping every 6 hours)
```

## 🛡️ Redundancy Levels

1. **Primary**: UptimeRobot (every 5 min) → Netlify Function → Supabase
2. **Secondary**: GitHub Actions (every 4 hours) → Direct Supabase ping
3. **Tertiary**: Client-side service (every 6 hours) → Supabase + Netlify Function
4. **Backup**: Manual trigger via GitHub Actions

## 📊 Expected Behavior

- **Supabase never pauses** (activity every 5 minutes minimum)
- **Zero downtime** from database sleeping
- **Automatic recovery** if one system fails
- **Minimal resource usage** (simple SELECT queries)

## 🚨 Troubleshooting

### Function Not Working?
1. Check Netlify function logs
2. Verify environment variables are set
3. Test function URL directly

### GitHub Actions Failing?
1. Check repository secrets are set correctly
2. Verify workflow permissions
3. Check Actions tab for error details

### UptimeRobot Issues?
1. Verify URL is correct
2. Check monitor status in dashboard
3. Ensure 5-minute interval is set

## ✅ Success Indicators

- ✅ Netlify function returns 200 status
- ✅ GitHub Actions show green checkmarks
- ✅ UptimeRobot shows "Up" status
- ✅ Supabase project never shows "paused"
- ✅ Browser console shows keep-alive logs

Your Supabase project will now stay active 24/7! 🎉