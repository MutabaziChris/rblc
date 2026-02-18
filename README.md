# AutoConnect RW - Car Spare Parts Marketplace

A complete, production-ready, scalable web application for a car spare parts marketplace built with Next.js 14, Supabase, OpenAI, and WhatsApp integration.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your credentials

# Set up Supabase database
# Run lib/supabase/schema.sql in Supabase SQL Editor

# Seed database
npm run seed

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## ✨ Features

- 🚗 **Product Catalog** - Search and browse car parts by brand, model, category
- 🤖 **AI Assistant** - OpenAI GPT-powered customer support
- 📱 **WhatsApp Integration** - Order via WhatsApp with Twilio
- 👥 **Multi-Supplier Marketplace** - Products linked to suppliers
- 🔧 **Mechanic Network** - Mechanics can register and track referrals
- 📊 **Admin Dashboard** - Full CRUD for products, suppliers, mechanics, orders, FAQs
- 📱 **Responsive Design** - Mobile & desktop ready
- 🔐 **Secure** - Row Level Security, TypeScript throughout

## 🛠️ Tech Stack

- **Frontend:** Next.js 14+ (App Router), Tailwind CSS, TypeScript
- **Backend:** Next.js API Routes, Supabase (PostgreSQL)
- **AI:** OpenAI GPT-4 integration
- **Messaging:** Twilio WhatsApp Business API
- **Hosting:** Vercel (free tier supported)
- **Database:** Supabase PostgreSQL

## 📁 Project Structure

```
autoconnect/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   │   ├── admin/        # Admin CRUD endpoints
│   │   ├── ai/           # AI chat endpoint
│   │   ├── orders/       # Order management
│   │   └── whatsapp/     # WhatsApp webhook
│   ├── admin/            # Admin dashboard pages
│   ├── products/         # Product pages
│   ├── suppliers/        # Supplier directory
│   ├── mechanics/        # Mechanic directory
│   └── request/          # Part request form
├── components/           # React components
├── lib/                  # Utilities & clients
│   ├── supabaseClient.ts # Supabase setup
│   ├── openai.ts         # OpenAI integration
│   ├── twilio.ts         # WhatsApp integration
│   └── seed.ts           # Database seeding
├── types/                # TypeScript types
└── public/               # Static assets
```

## 🗄️ Database Schema

- `products` - Car spare parts catalog (50 seeded)
- `suppliers` - Supplier information (10 seeded)
- `mechanics` - Mechanic/garage information (5 seeded)
- `orders` - Customer orders
- `faqs` - Frequently asked questions (10 seeded)
- `car_models` - Car brand/model reference data
- `ai_conversations` - AI chat history

## 🚢 Deployment

### Free Deployment on Vercel

See **[VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)** for complete step-by-step guide including:
- Free Vercel deployment
- Custom domain connection (FREE)
- SSL certificate setup (automatic)
- Environment variable configuration
- Post-deployment checklist

### Quick Deploy

1. Push code to GitHub
2. Import to Vercel: https://vercel.com/new
3. Add environment variables
4. Deploy!

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - 5-minute setup guide
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Detailed deployment instructions
- **[VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)** - Complete Vercel guide with domain setup
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Feature overview

## 🔑 Environment Variables

See `.env.local.example` for all required variables:

- Supabase URL and keys
- OpenAI API key
- Twilio credentials (for WhatsApp)
- App URL

## 🎯 Admin Features

Full CRUD operations available at `/admin`:

- **Products** (`/admin/products`) - Add, edit, delete products
- **Orders** (`/admin/orders`) - View and update order statuses
- **Suppliers** (`/admin/suppliers`) - Manage supplier network
- **Mechanics** (`/admin/mechanics`) - Manage mechanic network
- **FAQs** (`/admin/faqs`) - Manage frequently asked questions

## 🤖 AI Assistant

- Answers customer FAQs automatically
- Suggests related parts
- Escalates complex inquiries to admin
- Conversation history tracking
- WhatsApp integration ready

## 📱 WhatsApp Integration

- Pre-filled order links on product pages
- Webhook endpoint for incoming messages
- Automatic order status notifications
- AI-powered auto-replies

## 🧪 Development

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm run seed     # Seed database
```

## 📝 License

MIT

## 🙏 Support

For issues or questions:
- Check documentation files
- Review API route files in `app/api/`
- Check Supabase logs for database issues
- Review Vercel function logs for runtime errors

---

**Built with ❤️ for Rwanda's automotive industry**
