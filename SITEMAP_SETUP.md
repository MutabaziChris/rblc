# Sitemap Setup – Verification Instructions

## What Was Configured

1. **app/sitemap.ts** – Next.js native sitemap (served at /sitemap.xml)
   - Static pages: home, products, faq, mechanics, suppliers, request, returns-policy
   - Dynamic: all product detail pages from Supabase
2. **app/robots.ts** – Next.js native robots.txt (served at /robots.txt)
   - Allows all crawlers except /admin and /api
   - References https://rblc.rw/sitemap.xml

---

## Verification Steps

### 1. Verify locally (before deploy)

```bash
npm run build
```

After the build, check:
- `public/sitemap.xml` exists
- `public/sitemap-0.xml` exists
- `public/robots.txt` exists

### 2. Verify on live site

**Option A: Browser**

1. Go to **https://rblc.rw/sitemap.xml**
2. You should see XML listing `sitemap-0.xml`
3. Go to **https://rblc.rw/sitemap-0.xml**
4. You should see all page URLs (home, products, product details, FAQ, etc.)

**Option B: cURL (terminal)**

```bash
curl -I https://rblc.rw/sitemap.xml
```

Expect `200 OK` and `Content-Type: application/xml` (or similar).

**Option C: Google Search Console**

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add your property: https://rblc.rw
3. **Sitemaps** → Add `https://rblc.rw/sitemap.xml`
4. Google will crawl and index your pages

### 3. Verify robots.txt

1. Go to **https://rblc.rw/robots.txt**
2. Confirm it contains: `Sitemap: https://rblc.rw/sitemap.xml`

---

## Important: Vercel deployment

Ensure **`NEXT_PUBLIC_APP_URL`** is set in Vercel:

- Value: `https://rblc.rw`
- Used as `siteUrl` for correct absolute URLs in the sitemap

Files in `/public` are served at the root, so `public/sitemap.xml` → `https://rblc.rw/sitemap.xml`.

---

## Regenerating the sitemap

The sitemap is generated on every build:

- **Local:** `npm run build`
- **Vercel:** Every deployment runs `postbuild` automatically

To update the sitemap after adding products, run a new build and deploy.
