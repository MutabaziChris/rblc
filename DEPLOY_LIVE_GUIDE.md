# 🚀 Deploy Your Website Live – Step-by-Step Guide (Beginner)

This guide will help you put all your recent changes (image upload, analytics, Google tag) online.

---

## Before You Start

- **This folder must be your project:** `c:\Users\user\Downloads\autoconnect`
- **You need:** Git installed, GitHub account, AOS server access

---

# Part 1: On Your Computer (Windows)

## Step 1.1: Open the Project Folder in Terminal

1. Open **File Explorer** and go to: `C:\Users\user\Downloads\autoconnect`
2. Click the **address bar** at the top
3. Type `cmd` and press **Enter** (a black terminal window opens in this folder)

OR in Cursor/VS Code: press **Ctrl+`** (backtick) to open the terminal.

---

## Step 1.2: Check if Git is Installed

Type this and press Enter:

```
git --version
```

- If you see a version (e.g. `git version 2.43.0`) → continue
- If you see "not recognized" → [Download Git](https://git-scm.com/download/win) and install it, then restart the terminal

---

## Step 1.3: Connect This Folder to GitHub (If Needed)

If this folder is **not yet** connected to GitHub:

```
git init
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
```

Replace `YOUR_USERNAME` and `YOUR_REPO` with your actual GitHub username and repo name (e.g. `MutabaziChris/rblc`).

To check if already connected:

```
git remote -v
```

If you see a GitHub URL, you're good.

---

## Step 1.4: Save All Your Changes to Git

Run these commands **one at a time**:

```bash
git add .
```

```bash
git status
```

You should see a list of changed files (admin/products, upload API, etc.).

```bash
git commit -m "Image upload, analytics, Google tag, product fixes"
```

```bash
git push origin main
```

- If it says `main` branch doesn't exist, try: `git push origin master`
- If it asks for username/password, use your **GitHub username** and a **Personal Access Token** (not your normal password). Create one: GitHub → Settings → Developer settings → Personal access tokens.

---

## Step 1.5: Confirm the Push Succeeded

- Go to your GitHub repo in the browser
- Check that the latest files (e.g. `app/api/admin/upload`, updated `app/admin/products/page.tsx`) are there
- Note the latest commit message and time

---

# Part 2: On Your AOS Server (Linux)

## Step 2.1: Connect to Your Server via SSH

1. Open a terminal (cmd, PowerShell, or PuTTY)
2. Run (replace with your actual server details from AOS):

```bash
ssh root@YOUR_SERVER_IP
```

or

```bash
ssh YOUR_USERNAME@YOUR_SERVER_IP
```

3. Enter the password when prompted

---

## Step 2.2: Go to Your Project Folder

Example (adjust path if yours is different):

```bash
cd /var/www/rblc
```

or

```bash
cd ~/rblc
```

---

## Step 2.3: Pull the Latest Code from GitHub

```bash
git pull origin main
```

If your branch is `master`:

```bash
git pull origin master
```

You should see something like: `Updating abc1234..def5678` and a list of changed files.

---

## Step 2.4: Deploy (Build and Restart)

Run:

```bash
bash deploy.sh
```

Or manually:

```bash
npm install
npm run build
pm2 restart rblc
```

Wait for `npm run build` to finish (can take 1–2 minutes).

---

## Step 2.5: Check That the Site Is Running

```bash
pm2 status
```

You should see `rblc` with status `online`.

```bash
pm2 logs rblc --lines 20
```

Check for errors. A successful startup shows no red error messages.

---

# Part 3: Verify Features on the Live Site

1. Open your website in a browser (e.g. `https://rblc.rw`)
2. **Admin → Products:** Add or edit a product and try uploading an image
3. **Admin → Analytics:** Visit the site a few times and refresh; numbers should increase
4. **Google Analytics:** Confirm your GA4 property is receiving data

---

# Part 4: Supabase Setup (For New Features)

If image upload or analytics still fail, run these in **Supabase Dashboard → SQL Editor**:

## 4.1: Image Upload Storage Bucket

The code tries to create the bucket automatically. If it fails, create it manually:

1. Supabase Dashboard → **Storage**
2. **New bucket** → name: `products`
3. Set **Public bucket** to ON

## 4.2: Image URLs Column (Products)

```sql
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_urls JSONB DEFAULT '[]'::jsonb;
```

## 4.3: Visitor Analytics (Visits Table)

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
CREATE INDEX IF NOT EXISTS idx_visits_page_url ON visits(page_url);
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
```

---

# Quick Reference

| Step        | Where   | Command / Action                                      |
|-------------|---------|--------------------------------------------------------|
| Push code   | Your PC | `git add .` → `git commit -m "msg"` → `git push origin main` |
| Pull & run  | Server  | `cd /var/www/rblc` → `git pull origin main` → `bash deploy.sh` |

---

# Troubleshooting

**"Git not found"**  
Install Git from https://git-scm.com/download/win

**"Permission denied" or "Authentication failed" on push**  
Use a GitHub Personal Access Token instead of your password.

**"Branch 'main' not found"**  
Use `master` instead: `git push origin master`, `git pull origin master`

**"deploy.sh: permission denied"**  
Run: `chmod +x deploy.sh` then `bash deploy.sh`

**"npm run build" fails on server**  
Check Node version: `node -v` (should be 18+). Install/upgrade if needed.

**Image upload fails**  
Ensure the `products` bucket exists in Supabase Storage and is public.

**Analytics shows zeros**  
Run the `visits` table SQL above in Supabase.

---

Good luck. If you hit a specific error, note the exact message and step for easier debugging.
