# Deploy RBLC Ltd to AOS Hosting (Rwanda)

Step-by-step guide to transfer and run your Next.js project on AOS Cloud Hosting.

---

## What You Need

- **AOS Cloud Hosting plan** (Professional or higher recommended for Node.js)
- **SSH access** to your server
- **Domain** (e.g. rblc.rw) pointed to your AOS server
- **Supabase** project (unchanged – runs in the cloud)
- **Environment variables** (Supabase, OpenAI, Resend, etc.)

---

## Part 1: Prepare Your Project Locally

### 1.1 Create a clean deployment package

On your computer (in the project folder):

```bash
# Exclude unnecessary files
# Create a zip or use Git

# Option A: Using Git (recommended)
git add .
git commit -m "Ready for AOS deployment"
git push origin main

# Option B: Create ZIP (if no Git on server)
# Exclude: node_modules, .next, .git, .env.local
# Include: everything else
```

### 1.2 List of files/folders to transfer

**Include:**
- `app/` `components/` `lib/` `public/`
- `package.json` `package-lock.json`
- `next.config.js` `tailwind.config.ts` `tsconfig.json` `postcss.config.js`
- `middleware.ts` (if exists)
- `supabase/` (migrations - optional)

**Exclude (recreate on server):**
- `node_modules/`
- `.next/`
- `.env.local` (create on server, never upload secrets)

---

## Part 2: Set Up Your AOS Server

### 2.1 Connect via SSH

AOS will provide:
- Server IP address
- SSH username (often `root` or a user name)
- SSH password or key

```bash
ssh username@your-server-ip
```

### 2.2 Install Node.js 18+

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node -v   # Should show v18 or v20
npm -v
```

### 2.3 Install PM2 (process manager)

```bash
sudo npm install -g pm2
```

### 2.4 Install Nginx (reverse proxy)

```bash
sudo apt update
sudo apt install -y nginx
```

---

## Part 3: Upload Your Project

### 3.1 Clone from GitHub (if you use Git)

```bash
cd /var/www   # or your preferred directory
sudo mkdir -p rblc
sudo chown $USER:$USER rblc
cd rblc

git clone https://github.com/MutabaziChris/rblc.git .
```

### 3.2 Or upload via FTP/SFTP

1. Use FileZilla or similar.
2. Connect: Host = your AOS server IP, Username/Password from AOS.
3. Upload all project files (except `node_modules`, `.next`, `.git`).

---

## Part 4: Configure Environment Variables

### 4.1 Create `.env.local` on the server

```bash
cd /var/www/rblc   # or your project path

nano .env.local
```

Paste your variables (get values from Supabase, etc.):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
OPENAI_API_KEY=sk-...
RESEND_API_KEY=re_...
NEXT_PUBLIC_APP_URL=https://rblc.rw
# Add others as needed
```

Save and exit (`Ctrl+X`, then `Y`, then `Enter`).

---

## Part 5: Build and Run

### 5.1 Install dependencies and build

```bash
cd /var/www/rblc

npm install
npm run build
```

### 5.2 Start with PM2

```bash
pm2 start npm --name "rblc" -- start
pm2 save
pm2 startup   # Run the command it outputs to enable auto-start on reboot
```

### 5.3 Verify the app runs

```bash
pm2 status
pm2 logs rblc
```

App should be listening on port 3000. Test locally on the server:

```bash
curl http://localhost:3000
```

---

## Part 6: Nginx Reverse Proxy

### 6.1 Create Nginx config

```bash
sudo nano /etc/nginx/sites-available/rblc
```

Paste:

```nginx
server {
    listen 80;
    server_name rblc.rw www.rblc.rw;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 6.2 Enable and reload Nginx

```bash
sudo ln -s /etc/nginx/sites-available/rblc /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Part 7: Domain and SSL

### 7.1 Point your domain to AOS

In your domain DNS (where rblc.rw is registered):

- Add **A record**: `@` → your AOS server IP
- Add **A record**: `www` → your AOS server IP

### 7.2 SSL (HTTPS) with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d rblc.rw -d www.rblc.rw
```

Follow the prompts. Certbot will configure HTTPS for you.

---

## Part 8: Supabase Configuration

Update your Supabase project:

1. Supabase Dashboard → **Authentication** → **URL Configuration**
2. **Site URL**: `https://rblc.rw`
3. **Redirect URLs**: add `https://rblc.rw/auth/callback`

---

## Part 9: Updating Your Site Later

```bash
cd /var/www/rblc

# If using Git
git pull origin main

npm install
npm run build
pm2 restart rblc
```

---

## Quick Reference

| Task                | Command                          |
|---------------------|----------------------------------|
| View logs           | `pm2 logs rblc`                 |
| Restart app         | `pm2 restart rblc`              |
| Stop app            | `pm2 stop rblc`                 |
| Check status        | `pm2 status`                    |
| Nginx reload        | `sudo systemctl reload nginx`   |

---

## Troubleshooting

| Issue                  | Check                                            |
|------------------------|--------------------------------------------------|
| App won't start        | `pm2 logs rblc`, verify `.env.local` exists     |
| 502 Bad Gateway        | Is app running? `pm2 status`                    |
| Domain not loading     | DNS propagation, Nginx config, firewall (port 80)|
| Build fails            | `node -v` (use Node 18+), check dependencies    |

---

## Support

- **AOS Support**: 4747 (toll free), info@aos.rw
- **Supabase**: supabase.com/docs
