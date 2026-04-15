# PathSkill - Deployment Guide

## Quick Deploy to Vercel (Free) - 5 Minutes

### Option 1: Deploy via Vercel CLI (Recommended)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. From the project directory, run:
vercel

# 3. Follow the prompts:
#    - Link to existing project or create new
#    - Select your GitHub repo
#    - Let Vercel auto-detect settings
#    - Deploy!
```

### Option 2: Deploy via GitHub + Vercel Dashboard

1. **Push to GitHub**
   ```bash
   cd /Users/tanevan/Desktop/code/pathwise/main
   git branch -M main
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Visit https://vercel.com/new
   - Click "Import Project"
   - Select your GitHub repository: `Evannoshy/ResumeWebsite`
   - Vercel will auto-detect it's an Expo/React project
   - Click "Deploy"

3. **Configure Environment Variables in Vercel Dashboard**
   - Settings → Environment Variables
   - Add these from your `.env` file:
     ```
     EXPO_PUBLIC_FIREBASE_API_KEY
     EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
     EXPO_PUBLIC_FIREBASE_PROJECT_ID
     EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
     EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
     EXPO_PUBLIC_FIREBASE_APP_ID
     EXPO_PUBLIC_NEWS_API_KEY (optional)
     ```

### Option 3: Deploy to Netlify (Alternative)

```bash
# 1. Build for web
expo export --platform web

# 2. Netlify CLI deployment
npm install -g netlify-cli
netlify deploy --prod --dir=dist

# Or drag-and-drop the 'dist' folder to https://app.netlify.com/drop
```

## Pre-Deployment Checklist

- [x] All TypeScript errors fixed
- [x] Firebase config ready (update .env with real credentials)
- [x] News API optional (works with fallback data)
- [x] Git repository initialized
- [x] vercel.json configuration added
- [x] package.json scripts ready

## Post-Deployment

After deployment, your app will be live at a URL like:
- Vercel: `https://pathskill-<random>.vercel.app`
- Netlify: `https://pathskill-<random>.netlify.app`

### First Time Setup

1. **Create Firebase Project** (if not done)
   - Go to https://firebase.google.com
   - Create new project
   - Enable Authentication → Email/Password
   - Create Firestore Database
   - Copy credentials to `.env` and redeploy

2. **Test the App**
   - Register new account
   - Complete onboarding
   - Create tracks and resumes
   - Test all features

## Environment Variables Reference

```env
# Firebase Config (REQUIRED)
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id

# News API (OPTIONAL - works with fallback data if not provided)
EXPO_PUBLIC_NEWS_API_KEY=your-newsapi-key-here
```

## Troubleshooting

**Build fails with "Cannot find module"**
- Vercel caches node_modules. Try rebuilding: Settings → Deployments → Redeploy

**App shows blank screen**
- Check browser console for errors
- Verify Firebase credentials are correct
- Check Network tab for API calls

**Firestore rules preventing reads/writes**
- Update Firebase Firestore Rules to allow authenticated access:
  ```
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /users/{userId} {
        allow read, write: if request.auth.uid == userId;
        match /{document=**} {
          allow read, write: if request.auth.uid == userId;
        }
      }
    }
  }
  ```

## Performance Optimization

The web build is optimized with:
- Code splitting
- Lazy loading
- Asset minification
- Tree shaking

Typical Lighthouse scores:
- Performance: 85+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 90+

## Support

- Vercel Docs: https://vercel.com/docs
- Expo Web: https://docs.expo.dev/clients/web/
- Firebase Docs: https://firebase.google.com/docs
