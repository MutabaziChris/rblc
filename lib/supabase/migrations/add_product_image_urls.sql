-- Add image_urls column for multiple product images (JSONB array of URL strings)
-- First image in array is used as primary; image_url remains for backward compatibility
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS image_urls JSONB DEFAULT '[]'::jsonb;
