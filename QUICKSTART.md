# Quick Start Guide - AutoConnect RW

## 🚀 Getting Started in 5 Minutes

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```bash
cp .env.local.example .env.local
```

**Required Services:**
- **Supabase**: Free tier available at https://supabase.com
- **OpenAI**: Get API key from https://platform.openai.com/api-keys
- **Twilio**: Free trial available at https://www.twilio.com (optional for local dev)

### 3. Set Up Supabase Database

1. Create a new Supabase project
2. Go to SQL Editor
3. Run the SQL from `lib/supabase/schema.sql`
4. Copy your Supabase URL and keys to `.env.local`

### 4. Seed the Database

```bash
npm run seed
```

This populates your database with sample data:
- 50 products
- 10 suppliers  
- 5 mechanics
- 10 FAQs

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## 📁 Project Structure

```
autoconnect/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── admin/             # Admin dashboard
│   ├── products/          # Product pages
│   ├── suppliers/         # Supplier pages
│   ├── mechanics/         # Mechanic pages
│   └── request/           # Part request form
├── components/            # React components
├── lib/                   # Utilities & clients
│   ├── supabaseClient.ts # Supabase setup
│   ├── openai.ts          # OpenAI integration
│   ├── twilio.ts          # WhatsApp integration
│   └── seed.ts            # Database seeding
├── types/                 # TypeScript types
└── public/                # Static assets
```

## 🎯 Key Features

### For Customers
- ✅ Browse products by category, brand, model
- ✅ Search for specific parts
- ✅ Request parts via WhatsApp
- ✅ AI-powered customer support
- ✅ View supplier and mechanic networks

### For Admin
- ✅ Dashboard with analytics
- ✅ Order management
- ✅ Supplier & mechanic management
- ✅ AI conversation logs
- ✅ Revenue tracking

### For Mechanics
- ✅ Registration system
- ✅ Referral code generation
- ✅ Customer referrals

## 🔧 Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run seed         # Seed database
```

## 📱 WhatsApp Integration

The app includes WhatsApp integration via Twilio:

1. **Product Pages**: Direct WhatsApp links for ordering
2. **AI Assistant**: Automatic responses via WhatsApp webhook
3. **Order Updates**: WhatsApp notifications for order status

To test locally without Twilio:
- WhatsApp links will still work (opens WhatsApp app)
- Webhook responses require Twilio setup

## 🤖 AI Assistant

The AI assistant uses OpenAI GPT-4 to:
- Answer customer FAQs
- Suggest related parts
- Escalate complex issues to admin
- Provide product recommendations

## 🗄️ Database Schema

- **products**: Car parts catalog
- **suppliers**: Supplier information
- **mechanics**: Mechanic/garage information
- **orders**: Customer orders
- **faqs**: Frequently asked questions
- **car_models**: Car brand/model reference
- **ai_conversations**: AI chat history

## 🚢 Deployment

See `DEPLOYMENT.md` for detailed deployment instructions to Vercel.

## 📝 Next Steps

1. Customize branding and colors in `tailwind.config.ts`
2. Add product images to Supabase Storage
3. Configure payment integration
4. Set up email notifications
5. Add analytics tracking

## 💡 Tips

- Use Supabase Storage for product images
- Enable Row Level Security policies for production
- Set up monitoring for API usage (OpenAI, Twilio)
- Use Vercel Analytics for performance monitoring

## 🆘 Need Help?

- Check `DEPLOYMENT.md` for deployment issues
- Review API route files in `app/api/`
- Check Supabase logs for database issues
- Review Vercel function logs for runtime errors
