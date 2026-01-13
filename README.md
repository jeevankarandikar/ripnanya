# In Loving Memory

A memorial website with a beautiful cloud background where people can share photos and videos.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deploying to Vercel

### Option 1: Deploy via Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option 2: Deploy via Vercel Dashboard
1. Push this code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will automatically detect Next.js and deploy

### Connect Your Domain
1. In your Vercel project dashboard, go to "Settings" > "Domains"
2. Add your custom domain
3. Follow the instructions to update your domain's DNS settings

## Features

- Retro pixel art gaming aesthetic with custom animated cursor
- Beautiful sky blue background with animated clouds
- Password-protected upload (password: pig2)
- Grid layout that fills with uploaded photos and videos
- Automatic image compression for optimized loading
- Video autoplay on hover with audio
- Glowing hover effects with retro animations
- Scanline and pixel grid effects for authentic retro feel
- Fully responsive design
- Single page application

## Important Notes for Vercel

**File Storage Limitation:** The current implementation uses the local filesystem for file storage. This works in development but has limitations on Vercel:
- Files uploaded to Vercel's serverless functions are not persisted between deployments
- For a production site, you should integrate a cloud storage solution

**Recommended upgrade for production:**
Consider using Vercel Blob Storage for file persistence:
1. Install: `npm install @vercel/blob`
2. Update the upload API route to use Vercel Blob
3. This will ensure files persist across deployments

To set up Vercel Blob:
```bash
npm install @vercel/blob
```

Then update `/app/api/upload/route.ts` to use the Vercel Blob SDK instead of the filesystem.
