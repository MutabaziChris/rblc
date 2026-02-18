-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- Create tables in dependency order (no table references another
-- that hasn't been created yet).
-- ============================================================

-- 1. Suppliers table (no foreign keys)
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  location VARCHAR(255) NOT NULL,
  specialization VARCHAR(255),
  trust_score DECIMAL(3, 2) DEFAULT 0.0 CHECK (trust_score >= 0 AND trust_score <= 1),
  email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Mechanics table (no foreign keys)
CREATE TABLE IF NOT EXISTS mechanics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  garage_name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  referral_code VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Products table (references suppliers)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  car_brand VARCHAR(100) NOT NULL,
  car_model VARCHAR(100) NOT NULL,
  stock_status VARCHAR(20) CHECK (stock_status IN ('in_stock', 'out_of_stock', 'low_stock')) DEFAULT 'in_stock',
  supplier_id UUID REFERENCES suppliers(id),
  image_url TEXT,
  image_urls JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Orders table (references suppliers and mechanics)
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_phone VARCHAR(20) NOT NULL,
  customer_name VARCHAR(255),
  requested_part VARCHAR(255) NOT NULL,
  car_brand VARCHAR(100),
  car_model VARCHAR(100),
  status VARCHAR(20) CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')) DEFAULT 'pending',
  profit_margin DECIMAL(5, 2) DEFAULT 0.0,
  supplier_used UUID REFERENCES suppliers(id),
  mechanic_referred UUID REFERENCES mechanics(id),
  total_amount DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. FAQs table (no foreign keys)
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Car models table (no foreign keys)
CREATE TABLE IF NOT EXISTS car_models (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year_start INTEGER NOT NULL,
  year_end INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Visitor Analytics table (no foreign keys)
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

-- 8. AI Conversations table (no foreign keys)
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_phone VARCHAR(20) NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  escalated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_car_brand ON products(car_brand);
CREATE INDEX IF NOT EXISTS idx_products_car_model ON products(car_model);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_car_models_brand ON car_models(brand);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE mechanics ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

-- Create policies (allow public read access, admin write access)
CREATE POLICY "Public read access for products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read access for suppliers" ON suppliers FOR SELECT USING (true);
CREATE POLICY "Public read access for mechanics" ON mechanics FOR SELECT USING (true);
CREATE POLICY "Public read access for faqs" ON faqs FOR SELECT USING (true);
CREATE POLICY "Public read access for car_models" ON car_models FOR SELECT USING (true);

-- Allow authenticated users to create orders
CREATE POLICY "Authenticated users can create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (true);

-- Admin policies (using service role key bypasses RLS, but adding policies for reference)
CREATE POLICY "Admin can insert products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can update products" ON products FOR UPDATE USING (true);
CREATE POLICY "Admin can delete products" ON products FOR DELETE USING (true);

CREATE POLICY "Admin can insert suppliers" ON suppliers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can update suppliers" ON suppliers FOR UPDATE USING (true);
CREATE POLICY "Admin can delete suppliers" ON suppliers FOR DELETE USING (true);

CREATE POLICY "Admin can insert mechanics" ON mechanics FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can update mechanics" ON mechanics FOR UPDATE USING (true);
CREATE POLICY "Admin can delete mechanics" ON mechanics FOR DELETE USING (true);

CREATE POLICY "Admin can insert faqs" ON faqs FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can update faqs" ON faqs FOR UPDATE USING (true);
CREATE POLICY "Admin can delete faqs" ON faqs FOR DELETE USING (true);

CREATE POLICY "Admin can update orders" ON orders FOR UPDATE USING (true);
CREATE POLICY "Admin can view all orders" ON orders FOR SELECT USING (true);

-- Backwards-compatible migrations for existing databases
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;

-- Visitor Analytics: create visits table if missing (run this if analytics show zeros)
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

