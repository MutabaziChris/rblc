# Complete Vercel Deployment Guide - AutoConnect RW

## 🚀 Free Deployment on Vercel

This guide walks you through deploying AutoConnect RW to Vercel **completely free** with custom domain support.

---

## Prerequisites Checklist

- [ ] GitHub account (free)
- [ ] Vercel account (free) - Sign up at https://vercel.com
- [ ] Supabase project created
- [ ] OpenAI API key
- [ ] Twilio account (optional for WhatsApp)
- [ ] Domain name (optional, but free on Vercel)

---

## Part 1: Prepare Your Code

### 1.1 Initialize Git Repository

```bash
cd autoconnect
git init
git add .
git commit -m "Initial commit: AutoConnect RW marketplace"
```

### 1.2 Push to GitHub

```bash
# Create a new repository on GitHub first, then:
git remote add origin https://github.com/yourusername/autoconnect-rw.git
git branch -M main
git push -u origin main
```

---

## Part 2: Deploy to Vercel

### 2.1 Import Project

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your GitHub repository (`autoconnect-rw`)
4. Click **"Import"**

### 2.2 Configure Project Settings

Vercel will auto-detect Next.js. Verify these settings:

- **Framework Preset:** Next.js ✅
- **Root Directory:** `./` ✅
- **Build Command:** `next build` ✅
- **Output Directory:** `.next` ✅
- **Install Command:** `npm install` ✅

**DO NOT CLICK DEPLOY YET!**

### 2.3 Add Environment Variables

Before deploying, add all environment variables:

1. Click **"Environment Variables"** section
2. Add each variable from `.env.local.example`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
WHATSAPP_BUSINESS_NUMBER=your_whatsapp_number
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

3. For each variable, select:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. Click **"Add"** for each variable

### 2.4 Deploy

1. Click **"Deploy"**
2. Wait 2-5 minutes for build
3. Your app is live at: `https://your-project.vercel.app`

---

## Part 3: Connect Custom Domain (FREE)

### 3.1 Add Domain in Vercel

1. Go to your project dashboard
2. Click **Settings** > **Domains**
3. Enter your domain: `autoconnect.rw` (or your domain)
4. Click **"Add"**

### 3.2 Configure DNS Records

Vercel will show you DNS records. Choose one:

#### Option A: Root Domain (autoconnect.rw)

Add an **A Record**:
```
Type: A
Name: @ (or leave blank)
Value: 76.76.21.21
TTL: 3600 (or default)
```

#### Option B: Subdomain (www.autoconnect.rw)

Add a **CNAME Record**:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600 (or default)
```

### 3.3 Add DNS Records at Your Registrar

1. Log in to your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.)
2. Go to **DNS Management** or **DNS Settings**
3. Add the record(s) shown in Vercel
4. Save changes

### 3.4 Wait for DNS Propagation

- **Usually takes:** 5 minutes to 2 hours
- **Check status:** Vercel dashboard will show "Valid Configuration"
- **Test DNS:** Use https://dnschecker.org

### 3.5 SSL Certificate

- Vercel **automatically** provisions SSL certificates
- HTTPS is enabled automatically
- No additional configuration needed
- Certificate is issued within minutes

---

## Part 4: Post-Deployment Configuration

### 4.1 Update App URL

1. Go to Vercel Dashboard > Settings > Environment Variables
2. Update `NEXT_PUBLIC_APP_URL`:
   - Production: `https://your-domain.com` (your custom domain)
   - Preview: `https://your-project-git-branch.vercel.app`
   - Development: `http://localhost:3000`
3. Redeploy: Go to Deployments > Click "..." > Redeploy

### 4.2 Configure Twilio Webhook

1. Go to Twilio Console > Phone Numbers
2. Click your WhatsApp number
3. Under "Messaging Configuration":
   - Webhook URL: `https://your-domain.com/api/whatsapp/webhook`
   - HTTP Method: **POST**
4. Save configuration

### 4.3 Seed Production Database

1. Update `.env.local` with production Supabase credentials
2. Run seed script locally:
   ```bash
   npm run seed
   ```
   Or use Supabase SQL Editor to run seed data manually

---

## Part 5: Automatic Deployments

### 5.1 How It Works

- **Push to `main` branch** → Production deployment
- **Push to other branches** → Preview deployment
- **Open Pull Request** → Preview deployment

### 5.2 Enable Automatic Deployments

Already enabled by default! Every git push triggers a deployment.

---

## Part 6: Monitoring & Analytics

### 6.1 Vercel Analytics (Free)

1. Go to Settings > Analytics
2. Enable **Web Analytics**
3. View:
   - Real-time visitors
   - Page views
   - Performance metrics
   - Geographic data

### 6.2 Function Logs

1. Go to Deployments > Select a deployment
2. Click **"Functions"** tab
3. View API route logs
4. Debug errors in real-time

### 6.3 Error Tracking

- Check Function Logs for API errors
- Monitor Supabase logs for database issues
- Review OpenAI API usage in OpenAI dashboard

---

## Troubleshooting

### Build Fails

**Error: Missing environment variables**
- Solution: Add all variables in Vercel dashboard
- Redeploy after adding variables

**Error: Module not found**
- Solution: Ensure `package.json` has all dependencies
- Check `node_modules` are committed (they shouldn't be)

### Domain Not Working

**DNS not propagating**
- Wait up to 48 hours (usually 1-2 hours)
- Check DNS with https://dnschecker.org
- Verify records match Vercel instructions exactly

**SSL certificate pending**
- Wait 5-10 minutes after DNS propagation
- Vercel automatically issues certificates
- Check certificate status in Vercel dashboard

### API Routes Not Working

**CORS errors**
- Check `NEXT_PUBLIC_APP_URL` is set correctly
- Verify environment variables are set for Production

**Database connection errors**
- Verify Supabase URL and keys
- Check Row Level Security policies
- Ensure tables exist in Supabase

---

## Free Tier Limits

### Vercel Free Tier Includes:

- ✅ **100GB bandwidth/month**
- ✅ **100 serverless function executions/day**
- ✅ **Unlimited deployments**
- ✅ **Free SSL certificates**
- ✅ **Custom domains**
- ✅ **Automatic HTTPS**
- ✅ **Preview deployments**
- ✅ **Analytics**

### When You Might Need to Upgrade:

- High traffic (>100GB/month)
- Many API calls (>100/day)
- Team collaboration features
- Advanced analytics

For most projects, the free tier is sufficient!

---

## Quick Reference

### Important URLs

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Project Settings:** https://vercel.com/your-project/settings
- **Deployments:** https://vercel.com/your-project/deployments
- **Environment Variables:** Settings > Environment Variables
- **Domains:** Settings > Domains
- **Analytics:** Settings > Analytics

### Useful Commands

```bash
# Deploy to production
vercel --prod

# Deploy preview
vercel

# View logs
vercel logs

# List projects
vercel list
```

---

## Success Checklist

After deployment, verify:

- [ ] App loads at your Vercel URL
- [ ] Custom domain works (if configured)
- [ ] HTTPS is enabled
- [ ] Products page loads
- [ ] Admin dashboard accessible
- [ ] API routes work
- [ ] Database connection successful
- [ ] Environment variables set
- [ ] Twilio webhook configured (if using WhatsApp)
- [ ] Analytics enabled

---

## Support

- **Vercel Docs:** https://vercel.com/docs
- **Vercel Support:** https://vercel.com/support
- **Next.js Docs:** https://nextjs.org/docs
- **Supabase Docs:** https://supabase.com/docs

---

## 🎉 You're Live!

Your AutoConnect RW marketplace is now deployed and accessible worldwide!

**Next Steps:**
1. Share your domain with users
2. Monitor analytics
3. Add product images
4. Customize branding
5. Scale as needed

Happy deploying! 🚀
