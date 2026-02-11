# Deployment Guide - Vercel + Supabase

Deploy your portfolio website to Vercel with Supabase database. Both services offer free tiers.

## Prerequisites

- GitHub account
- Vercel account (https://vercel.com)
- Supabase account (https://supabase.com)
- OpenAI API key (https://platform.openai.com)

## Part 1: Supabase Setup

### 1.1 Create Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in details and wait for initialization (~2 minutes)

### 1.2 Run Migration

1. Go to **SQL Editor** in your Supabase project
2. Click "New Query"
3. Copy contents of `/supabase/migrations/001_create_notes_table.sql`
4. Click **Run**
5. Verify in **Table Editor** that `notes` table exists

### 1.3 Get Credentials

1. Go to **Project Settings** > **API**
2. Copy:
   - **Project URL** (`https://xxxxx.supabase.co`)
   - **service_role key** (starts with `eyJ...`) - ⚠️ Keep secret!

## Part 2: Vercel Deployment

### 2.1 Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### 2.2 Deploy to Vercel

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** > **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - Leave build/output as detected

### 2.3 Environment Variables

In Vercel: **Settings** > **Environment Variables**

Add these to **Production**, **Preview**, and **Development**:

| Name | Value |
|------|-------|
| `OPENAI_API_KEY` | Your OpenAI API key |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Your Supabase service_role key |
| `RESEND_API_KEY` | (Optional) Resend API key – to receive "Leave a note" submissions in your email |
| `NOTIFY_EMAIL` | (Optional) Your email address – where note notifications are sent |
| `NOTIFY_FROM` | (Optional) Sender line, e.g. `Portfolio <onboarding@resend.dev>`. Default works with Resend free tier |

### 2.4 Deploy

1. Click **Deploy**
2. Wait for build (~2-3 minutes)
3. Site live at `https://your-project.vercel.app`

## Part 3: Post-Deployment

### Add Resume

1. Place resume in `frontend/public/AnmolBaruwal__Resume.pdf`
2. Commit and push - Vercel auto-deploys

### Update Context

Edit `public/context.md` with your information, then commit and push.

### Email notifications (optional)

To receive "Leave a note" submissions in your inbox:

1. Sign up at [Resend](https://resend.com) (free tier: 100 emails/day).
2. Create an API key in **API Keys** and add it as `RESEND_API_KEY` in Vercel.
3. Set `NOTIFY_EMAIL` to your email (e.g. `you@gmail.com`).
4. Default sender is `Portfolio <onboarding@resend.dev>`. To use your own domain, verify it in Resend and set `NOTIFY_FROM` (e.g. `Portfolio <noreply@yourdomain.com>`).

Notes are always saved to Supabase; email is an optional copy to your inbox.

### Test

Visit your Vercel URL and test:
- Chat functionality
- Leave a note form
- Resume download
- Theme toggle

Test endpoints:
- `https://your-project.vercel.app/api/health` - Should return OK
- `https://your-project.vercel.app/api/resume` - Should redirect to PDF

## Troubleshooting

**CORS errors**: Verify `vercel.json` has correct CORS headers

**"Database configuration missing"**: Check environment variables in Vercel settings

**OpenAI rate limit**: Adjust rate limit in `/api/chat.ts` or upgrade OpenAI plan

**Context file not loading**: Ensure `public/context.md` exists and is committed

**Resume not downloading**: Verify PDF is in `public/` folder with correct name

## Cost

**Vercel**: Free tier (100 GB bandwidth/month, 100 deployments/day)

**Supabase**: Free tier (500 MB database, 2 GB bandwidth/month)

**OpenAI**: ~$0-5/month (depends on usage)

**Total**: $0-5/month

## Support

- **Vercel**: https://vercel.com/support
- **Supabase**: https://supabase.com/support
- **OpenAI**: https://help.openai.com
