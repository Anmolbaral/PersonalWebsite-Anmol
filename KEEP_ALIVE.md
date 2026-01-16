# Keep Vercel Alive - Prevent 7-Day Sleep

Vercel's free tier pauses projects after 7 days of inactivity. Here are several **free** solutions to keep your site active:

## ✅ Solution 1: GitHub Actions (Recommended - Free & Easy)

If your code is on GitHub, this is the easiest solution:

### Setup Steps:

1. **Update the workflow file** (`.github/workflows/keep-alive.yml`):
   - Replace `YOUR_SITE.vercel.app` with your actual Vercel URL
   - Or add it as a GitHub Secret (Settings → Secrets → Actions)

2. **Add GitHub Secret (Optional but recommended)**:
   - Go to your GitHub repo → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `VERCEL_URL`
   - Value: `https://your-site.vercel.app` (your actual Vercel URL)

3. **Enable GitHub Actions**:
   - The workflow runs automatically every 6 hours
   - You can also trigger it manually: Actions tab → "Keep Vercel Alive" → Run workflow

**That's it!** Your site will be pinged every 6 hours automatically.

---

## ✅ Solution 2: Free Cron Services

### Option A: cron-job.org (Free)

1. Go to [cron-job.org](https://cron-job.org) and sign up (free)
2. Create a new cron job:
   - **URL**: `https://your-site.vercel.app/api/health`
   - **Schedule**: Every 6 hours (or daily at minimum)
   - **Method**: GET
3. Save and activate

### Option B: EasyCron (Free)

1. Sign up at [EasyCron](https://www.easycron.com)
2. Create cron job:
   - **URL**: `https://your-site.vercel.app/api/health`
   - **Schedule**: Every 6 hours
3. Save

### Option C: UptimeRobot (Free - 50 monitors)

1. Sign up at [UptimeRobot](https://uptimerobot.com) (free)
2. Add a new monitor:
   - **Type**: HTTP(s)
   - **URL**: `https://your-site.vercel.app/api/health`
   - **Interval**: 5 minutes (free tier)
3. This also gives you uptime monitoring!

---

## ✅ Solution 3: Vercel Cron Jobs (Requires Pro Plan)

If you upgrade to Vercel Pro, you can use built-in cron jobs in `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/health",
    "schedule": "0 */6 * * *"
  }]
}
```

**Note**: This requires Pro plan ($20/month), so not ideal for free tier.

---

## 🎯 Recommended Setup

**Best for most users**: **GitHub Actions** (Solution 1)
- ✅ Completely free
- ✅ No external services needed
- ✅ Runs automatically
- ✅ Easy to set up

**If you want uptime monitoring too**: **UptimeRobot** (Solution 2C)
- ✅ Free tier available
- ✅ Monitors your site every 5 minutes
- ✅ Sends alerts if site goes down
- ✅ Keeps site active

---

## 📝 Quick Setup Checklist

- [ ] Choose a solution above
- [ ] Get your Vercel URL (e.g., `https://your-site.vercel.app`)
- [ ] Test the health endpoint: `https://your-site.vercel.app/api/health`
- [ ] Set up your chosen keep-alive method
- [ ] Verify it's working (check logs/status)

---

## 🔍 Verify It's Working

1. **Check health endpoint manually**:
   ```bash
   curl https://your-site.vercel.app/api/health
   ```
   Should return: `{"status":"OK","timestamp":"...","service":"Anmol Portfolio API"}`

2. **Check GitHub Actions** (if using Solution 1):
   - Go to your repo → Actions tab
   - You should see "Keep Vercel Alive" runs every 6 hours

3. **Check Vercel logs**:
   - Vercel dashboard → Your project → Functions
   - You should see `/api/health` requests coming in

---

## ⚠️ Important Notes

- **Minimum frequency**: Ping at least once every 6 days (to be safe, every 6 hours)
- **Health endpoint**: Already set up at `/api/health` - no changes needed
- **No cost**: All solutions above are free
- **Privacy**: Health endpoint doesn't expose sensitive data

---

## 🚀 After Setup

Your Vercel site will stay active and won't pause after 7 days of inactivity!
