# Complete Beginner Setup Guide

Step-by-step guide to set up and run this project from scratch.

---

## Part 1: Before You Start

### What you need

- [ ] **Node.js** (version 18 or higher) – [nodejs.org](https://nodejs.org)
- [ ] **Git** – [git-scm.com/download/win](https://git-scm.com/download/win)
- [ ] **Code editor** – Cursor, VS Code, or any editor
- [ ] **Accounts (all have free tiers):**
  - [Supabase](https://supabase.com) – Database
  - [Vercel](https://vercel.com) – Hosting
  - [GitHub](https://github.com) – Code storage
  - [Google Analytics](https://analytics.google.com) – Optional, for visitor stats
  - [OpenAI](https://platform.openai.com) – Optional, for AI chat
  - [Resend](https://resend.com) – Optional, for emails

---

## Part 2: Install Node.js and Git

### Step 2.1: Node.js

1. Go to [nodejs.org](https://nodejs.org)
2. Download the **LTS** version
3. Run the installer and follow the steps (keep defaults)
4. Open a new terminal and run:
   ```
   node -v
   ```
   You should see something like `v20.x.x`

### Step 2.2: Git

1. Go to [git-scm.com/download/win](https://git-scm.com/download/win)
2. Download and install Git
3. In a new terminal, run:
   ```
   git --version
   ```
   You should see something like `git version 2.x.x`

---

## Part 3: Get the Project Running Locally

### Step 3.1: Open the project folder

1. Open **File Explorer**
2. Go to `C:\Users\user\Downloads\autoconnect` (or wherever the project is)
3. Open Cursor or your editor and open this folder

### Step 3.2: Install dependencies

1. In your editor, open the terminal (press **Ctrl+`**)
2. Run:
   ```
   npm install
   ```
3. Wait until it finishes (about 1–2 minutes)

### Step 3.3: Create your environment file

1. In the project folder, find **`.env.local.example`**
2. Copy it and rename the copy to **`.env.local`**
   - In terminal: `copy .env.local.example .env.local`
   - Or: copy the file in File Explorer and rename it
3. Open **`.env.local`** in your editor

---

## Part 4: Supabase Setup (required)

### Step 4.1: Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New project**
3. Choose a name (e.g. `rblc`) and a password (save it)
4. Pick a region and click **Create project**
5. Wait a couple of minutes for setup

### Step 4.2: Get your keys

1. In Supabase, open **Project Settings** (gear icon)
2. Go to **API**
3. Copy these values into `.env.local`:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`  
     (use **Reveal** to show it)

### Step 4.3: Run the database setup

1. In Supabase, open **SQL Editor**
2. Click **New query**
3. Copy the contents of `lib/supabase/schema.sql` from your project
4. Paste into the editor and click **Run**
5. Confirm you see “Success”

### Step 4.4: Extra tables (analytics and images)

In the **SQL Editor**, run these one at a time (copy/paste each block and click **Run**):

**Analytics (visitor tracking):**
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
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
```

**Product images:**
```sql
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_urls JSONB DEFAULT '[]'::jsonb;
```

### Step 4.5: Storage for image uploads

1. In Supabase, open **Storage**
2. Click **New bucket**
3. Name it `products`
4. Turn **Public bucket** ON
5. Click **Create bucket**

### Step 4.6: Add sample data (optional)

In the project terminal, run:
```
npm run seed
```

---

## Part 5: Google Analytics (optional)

### Step 5.1: Create a GA4 property

1. Go to [analytics.google.com](https://analytics.google.com)
2. Click **Admin** (gear icon)
3. Under **Property**, click **Create property**
4. Name it (e.g. `RBLC Website`)
5. Add your site URL (e.g. `https://rblc.rw`) when asked
6. Complete the setup

### Step 5.2: Get your Measurement ID

1. In Admin → **Data streams**
2. Click your web stream
3. Copy the **Measurement ID** (e.g. `G-H68PQT8279`)
4. In `.env.local`, set:
   ```
   NEXT_PUBLIC_GA_ID=G-H68PQT8279
   ```
   (replace with your actual ID)

---

## Part 6: Run the App Locally

### Step 6.1: Start the dev server

In the project terminal:
```
npm run dev
```

### Step 6.2: Open in browser

1. Open [http://localhost:3000](http://localhost:3000)
2. You should see the homepage
3. Try: Products, Admin login, etc.

### Step 6.3: Admin login

1. Go to `/admin/login`
2. Create an admin user at `/admin/signup` first (email + password)
3. Then log in at `/admin/login`

---

## Part 7: Deploy to Vercel (make it live)

### Step 7.1: Push code to GitHub

1. Go to [github.com](https://github.com) and sign in
2. Click **New repository**
3. Name it (e.g. `autoconnect`) and create it (no README needed)
4. In your project terminal:
   ```
   git add .
   git commit -m "Initial setup"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
   Replace `YOUR_USERNAME` and `YOUR_REPO` with your repo details.

### Step 7.2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Sign up** → **Continue with GitHub**
3. Click **Add New** → **Project**
4. Import your GitHub repository
5. **Before** clicking Deploy, go to **Environment Variables**
6. Add each variable from `.env.local`:
   - Copy the name and value for each
   - Add them one by one (Production, Preview, Development)
7. Set `NEXT_PUBLIC_APP_URL` to your live URL (e.g. `https://your-project.vercel.app`)
8. Click **Deploy**
9. Wait a few minutes until the build finishes

### Step 7.3: Open your live site

1. Click **Visit** in Vercel
2. Your site is live
3. Optional: add a custom domain in **Settings** → **Domains**

---

## Part 8: Updating Your Live Site

### Option A: Auto-push (recommended)

1. In the project terminal, run:
   ```
   npm run watch-push
   ```
2. Edit and save your files as usual
3. After 15 seconds without changes, it will push to GitHub
4. Vercel will deploy automatically

### Option B: Manual push

1. Run `push-to-github.bat` (double-click), or:
   ```
   git add .
   git commit -m "Your change description"
   git push origin main
   ```
2. Vercel will deploy automatically

---

## Quick Reference

| Task            | Command or step                                      |
|-----------------|------------------------------------------------------|
| Install deps    | `npm install`                                        |
| Run locally     | `npm run dev`                                        |
| Seed database   | `npm run seed`                                       |
| Auto-push       | `npm run watch-push`                                 |
| Manual push     | `push-to-github.bat` or `git push origin main`       |
| Environment     | Copy `.env.local.example` → `.env.local`             |
| Supabase SQL    | Dashboard → SQL Editor → paste and run               |
| Vercel env vars | Project → Settings → Environment Variables           |

---

## Troubleshooting

**"Command not found: npm"**  
Install Node.js and restart the terminal.

**"Command not found: git"**  
Install Git and restart the terminal.

**"Missing Supabase environment variables"**  
Check that `.env.local` has the correct Supabase URL and keys.

**Build fails on Vercel**  
Ensure all env vars from `.env.local` are added in Vercel.

**Admin login doesn’t work**  
Create an account at `/admin/signup` first.

**Image upload fails**  
Confirm the `products` bucket exists in Supabase Storage and is public.
