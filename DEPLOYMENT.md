# RBLC Ltd — Go Live Checklist

Step-by-step guide to publish your RBLC Ltd car spare parts website.

---

## Phase 1: Pre-Deployment

### 1. Test the build locally

```bash
npm run build
npm run start
```

Visit `http://localhost:3000` and verify:

- Homepage loads
- Products, FAQs, Returns Policy load
- Admin login works (if applicable)
- No console errors

### 2. Prepare environment variables

Create a list of all required variables (from `.env.local`):

| Variable | Required | Notes |
|----------|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | From Supabase project |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | From Supabase project |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | For admin API routes |
| `OPENAI_API_KEY` | If using AI chat | From OpenAI |
| `TWILIO_ACCOUNT_SID` | If using WhatsApp | From Twilio |
| `TWILIO_AUTH_TOKEN` | If using WhatsApp | From Twilio |
| `TWILIO_WHATSAPP_NUMBER` | If using WhatsApp | e.g. `whatsapp:+14155238886` |
| `WHATSAPP_BUSINESS_NUMBER` | Optional | e.g. `250786905080` |
| `RESEND_API_KEY` | If using email | From Resend |
| `EMAIL_FROM` | Optional | e.g. `RBLC ltd <noreply@yourdomain.com>` |
| `BUSINESS_EMAIL` | Optional | e.g. `info@rblc.rw` |
| `NEXT_PUBLIC_APP_URL` | Yes (production) | Your live URL |
| `NEXT_PUBLIC_INSTAGRAM_URL` | Optional | Full URL to your Instagram |
| `NEXT_PUBLIC_FACEBOOK_URL` | Optional | Full URL to your Facebook |
| `NEXT_PUBLIC_LINKEDIN_URL` | Optional | Full URL to your LinkedIn |
| `NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER` | Optional | e.g. `250786905080` |

---

## Phase 2: Deploy to Vercel (Recommended)

Vercel is the simplest hosting for Next.js apps.

### 1. Push code to GitHub

```bash
git init
git add .
git commit -m "Initial commit - RBLC Ltd website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/rblc-autoconnect.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (use GitHub).
2. Click **Add New Project**.
3. Import your GitHub repository.
4. **Environment Variables** — Add each variable from the list above.
   - For **Production**, set `NEXT_PUBLIC_APP_URL` to your live URL (e.g. `https://rblc.rw`).
5. Click **Deploy**.
6. After deployment, you get a URL like `https://your-project.vercel.app`.

### 3. Optional: custom domain

1. In Vercel: Project → **Settings** → **Domains**.
2. Add your domain (e.g. `rblc.rw`).
3. Update DNS as instructed:
   - Add the A/CNAME records Vercel shows.
   - Wait for DNS propagation (up to 48 hours, often < 1 hour).

---

## Phase 3: Supabase configuration

### 1. Update Supabase Auth URLs

1. Open [supabase.com](https://supabase.com) → your project → **Authentication** → **URL Configuration**.
2. Set:

   - **Site URL**: `https://yourdomain.com` (e.g. `https://rblc.rw`)
   - **Redirect URLs**: add:
     - `https://yourdomain.com/auth/callback`
     - `https://your-project.vercel.app/auth/callback` (for Vercel URL if used)

3. Save.

### 2. Optional: production Supabase project

If you use a separate Supabase project for production, run migrations or seed scripts against that project before going live.

---

## Phase 4: WhatsApp & Twilio (if used)

1. In [Twilio Console](https://console.twilio.com):
   - Add your production domain to the WhatsApp sandbox/approval list if required.
2. Set `TWILIO_*` variables in Vercel for production.

---

## Phase 5: Email (Resend)

1. In [Resend](https://resend.com):
   - Add and verify your sending domain (e.g. `rblc.rw`).
   - Create an API key for production.
2. Set:
   - `RESEND_API_KEY`
   - `EMAIL_FROM` (from verified domain, e.g. `RBLC ltd <info@rblc.rw>`)

---

## Phase 6: Final checks

1. Visit your live URL.
2. Test:
   - Homepage, Products, FAQs, Returns Policy
   - Search
   - Admin login and dashboard
   - Contact forms and WhatsApp links
3. Check mobile responsiveness.
4. Use [PageSpeed Insights](https://pagespeed.web.dev/) if desired.

---

## Phase 7: Ongoing updates

After deployment:

1. Edit code locally.
2. Commit and push to GitHub.
3. Vercel will automatically redeploy.

---

## Alternative: other hosts

- **Netlify** — similar to Vercel, supports Next.js.
- **Railway** / **Render** — run `npm run build` and `npm run start`.
- **VPS (e.g. DigitalOcean)** — install Node.js, run with PM2, and optionally put Nginx in front.

---

## Quick reference: deployment URLs

| Service | URL |
|---------|-----|
| Vercel | https://vercel.com |
| Supabase | https://supabase.com |
| Resend | https://resend.com |
| Twilio | https://console.twilio.com |

---

**You’re ready to go live.**
