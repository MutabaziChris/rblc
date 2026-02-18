# Product Images Directory

This directory is for storing product images.

## Placeholder Images

For development, you can use placeholder image services like:
- https://via.placeholder.com/400x300?text=Car+Part
- https://picsum.photos/400/300
- https://placehold.co/400x300

## Production Setup

### Supabase Storage (recommended - used by admin panel)

1. In **Supabase Dashboard** → **Storage** → **New bucket**
2. Create a bucket named **`products`**
3. Set it to **Public** (so product images are viewable)
4. The admin panel can now upload images when adding/editing products

You can also paste image URLs (from any source) instead of uploading.

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
