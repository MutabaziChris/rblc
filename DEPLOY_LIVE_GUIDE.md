# 🚀 Deploy Your Website Live – Vercel (No Server Needed)

Deploy with **Vercel** – no AOS server, no SSH, no manual builds. Push to GitHub and your site updates automatically.

---

## How It Works

1. You push code to **GitHub**
2. **Vercel** (connected to your GitHub) automatically builds and deploys
3. Your site is live at `https://your-project.vercel.app` (or your custom domain)

---

## One-Time Setup (If Not Done Yet)

### Step 1: Create a Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click **Sign Up**
3. Choose **Continue with GitHub** (recommended)

### Step 2: Import Your Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository**
3. Select your GitHub repository (e.g. `autoconnect` or `rblc`)
4. Click **Import**

### Step 3: Add Environment Variables

**Before** clicking Deploy, add your variables:

1. Expand **Environment Variables**
2. Add each from your `.env.local`:

| Variable | Where to get it |
|----------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API |
| `OPENAI_API_KEY` | OpenAI dashboard (if using AI chat) |
| `NEXT_PUBLIC_APP_URL` | Your live URL, e.g. `https://your-project.vercel.app` |

3. Add for **Production**, **Preview**, and **Development**

### Step 4: Deploy

1. Click **Deploy**
2. Wait 2–5 minutes
3. Your site is live

---

## Updating Your Live Site (Every Time You Make Changes)

### Option A: Double-Click the Script

1. Double-click **`push-to-github.bat`** in your project folder
2. Press Enter when asked for a commit message
3. Wait for the push to finish

Vercel will detect the push and deploy automatically.

### Option B: Use the Terminal

1. Open a terminal in your project folder  
   (File Explorer → `C:\Users\user\Downloads\autoconnect` → type `cmd` in address bar)
2. Run:

```bash
git add .
git commit -m "Your update message"
git push origin main
```

*(Use `master` instead of `main` if that's your branch)*

---

## Check Your Deployment

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Open your project
3. You'll see:
   - **Deployments** – each push creates a new deployment
   - **Visit** – open your live site
   - **Logs** – build output if something fails

---

## Custom Domain (Optional)

1. In Vercel: Project → **Settings** → **Domains**
2. Add your domain (e.g. `rblc.rw`)
3. Follow the DNS instructions (add the records they give you at your domain registrar)
4. Wait a few minutes to a few hours for DNS to propagate

---

## Troubleshooting

**Build fails on Vercel**  
- Check **Deployments** → click the failed deployment → **Building** for the error
- Common: missing env vars (add them in Project → Settings → Environment Variables)

**Site works locally but not on Vercel**  
- Ensure all env vars from `.env.local` are added in Vercel
- Set `NEXT_PUBLIC_APP_URL` to your Vercel URL (e.g. `https://your-project.vercel.app`)

**"Git not found"**  
- Install from [git-scm.com/download/win](https://git-scm.com/download/win)
- Restart the terminal after installing

**Push asks for login**  
- Use a [GitHub Personal Access Token](https://github.com/settings/tokens) instead of password
- Or set up [GitHub CLI](https://cli.github.com/) for easier auth

---

## Supabase Setup for New Features

If you added **image upload** and **analytics**, run these in Supabase Dashboard → SQL Editor:

**1. Image uploads (products bucket)**  
Create in Supabase → Storage → New bucket → name: `products` → Public: ON

**2. Product image_urls column**
```sql
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_urls JSONB DEFAULT '[]'::jsonb;
```

**3. Visitor analytics (visits table)**
```sql
CREATE TABLE IF NOT EXISTS visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  page_url TEXT NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_visits_visited_at ON visits(visited_at DESC);
```

---

## Summary

| What you do       | Where     | Result                    |
|-------------------|-----------|---------------------------|
| `git push`        | Your PC   | Code goes to GitHub       |
| Auto              | Vercel    | New deployment goes live  |

No server, no SSH, no `deploy.sh` – just push.
