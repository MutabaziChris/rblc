# Product Images Directory

This directory is for storing product images.

## Placeholder Images

For development, you can use placeholder image services like:
- https://via.placeholder.com/400x300?text=Car+Part
- https://picsum.photos/400/300
- https://placehold.co/400x300

## Production Setup

For production, upload product images to:
1. **Supabase Storage** (recommended)
   - Create a `products` bucket in Supabase Storage
   - Upload images and get public URLs
   - Update `image_url` field in products table

2. **Cloudinary** or **AWS S3**
   - Upload images to your cloud storage
   - Use CDN URLs for fast loading

## Image Guidelines

- Recommended size: 400x300px or 800x600px
- Format: JPEG or PNG
- Max file size: 2MB
- Aspect ratio: 4:3 or 16:9

## Example Usage

```typescript
// In product data
image_url: 'https://via.placeholder.com/400x300?text=Brake+Pads'
```
