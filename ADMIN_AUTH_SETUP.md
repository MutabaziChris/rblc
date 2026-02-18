# Admin Authentication Setup

The admin panel is now protected with email/password authentication using Supabase Auth.

## Quick Start

### 1. Install the new dependency

```bash
npm install
```

### 2. Create your admin account

1. Go to **http://localhost:3000/admin/signup**
2. Enter your email and password (min 6 characters)
3. Click "Create account"
4. If email confirmation is enabled in Supabase, check your email and click the link
5. Sign in at **http://localhost:3000/admin/login**

### 3. Sign in

- Go to **http://localhost:3000/admin**
- You'll be redirected to the login page
- Enter your credentials to access the dashboard

## Supabase Auth Configuration

### Enable Email Auth

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication** → **Providers**
4. Ensure **Email** is enabled (it's on by default)

### Email Confirmation (Optional)

**To allow immediate sign-in (no email confirmation):**
1. Go to **Authentication** → **Providers** → **Email**
2. Turn **OFF** "Confirm email"
3. Users can sign in immediately after signup

**To require email confirmation:**
1. Keep "Confirm email" **ON**
2. Configure **Authentication** → **URL Configuration**:
   - Site URL: `http://localhost:3000` (or your production URL)
   - Redirect URLs: Add `http://localhost:3000/auth/callback`

### Create Admin via Supabase Dashboard (Alternative)

You can also create an admin user directly in Supabase:
1. Go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter email and password
4. User can now sign in at /admin/login

## Protected Routes

- `/admin` - Dashboard (protected)
- `/admin/orders` - Orders (protected)
- `/admin/products` - Products (protected)
- `/admin/suppliers` - Suppliers (protected)
- `/admin/mechanics` - Mechanics (protected)
- `/admin/faqs` - FAQs (protected)
- `/admin/login` - Login (public)
- `/admin/signup` - Signup (public)

## Password Requirements

- Minimum 6 characters (Supabase default)
- You can customize in Supabase: **Authentication** → **Policies**

## Troubleshooting

### "Invalid login credentials"
- Check email and password are correct
- Ensure the user exists in Supabase (Authentication → Users)
- If using email confirmation, ensure you clicked the verification link

### Redirect loop
- Clear your browser cookies
- Check that middleware is correctly configured
- Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set

### Can't create account
- Check Supabase Auth is enabled
- If "Confirm email" is on, check your spam folder for the verification email
- Check Supabase logs for errors: **Authentication** → **Logs**
