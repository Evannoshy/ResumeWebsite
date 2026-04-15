#!/bin/bash

# PathSkill - Deploy to Free Hosting
# This script helps you deploy to Vercel, Netlify, or Firebase

echo ""
echo "🚀 PathSkill Deployment Helper"
echo "=============================="
echo ""
echo "Choose your hosting service:"
echo ""
echo "1) Vercel (Recommended - Fastest)"
echo "2) Netlify (Great alternative)"
echo "3) Firebase (Google Cloud - includes backend)"
echo "4) GitHub Pages (Built into GitHub)"
echo ""
read -p "Enter choice (1-4): " choice

case $choice in
  1)
    echo ""
    echo "🔷 Deploying to Vercel..."
    echo ""
    echo "Installing Vercel CLI..."
    npm install -g vercel
    
    echo ""
    echo "Deploying your app..."
    vercel --prod
    
    echo ""
    echo "✅ Your app is live on Vercel!"
    echo "   Check your dashboard for the URL"
    ;;
    
  2)
    echo ""
    echo "🔶 Deploying to Netlify..."
    echo ""
    echo "Option A: Drag & Drop (Easiest)"
    echo "  1. Go to https://app.netlify.com/drop"
    echo "  2. Drag the 'dist' folder here"
    echo ""
    echo "Option B: CLI"
    echo ""
    read -p "Use CLI? (y/n): " use_cli
    
    if [ "$use_cli" = "y" ]; then
      npm install -g netlify-cli
      netlify deploy --prod --dir=dist
      echo ""
      echo "✅ Your app is live on Netlify!"
    else
      echo "Please visit: https://app.netlify.com/drop"
      open "https://app.netlify.com/drop" || xdg-open "https://app.netlify.com/drop"
    fi
    ;;
    
  3)
    echo ""
    echo "🔥 Deploying to Firebase..."
    echo ""
    echo "Installing Firebase CLI..."
    npm install -g firebase-tools
    
    echo ""
    echo "Logging in to Firebase..."
    firebase login
    
    echo ""
    echo "Initializing Firebase project..."
    firebase init hosting
    
    echo ""
    echo "Deploying..."
    firebase deploy --only hosting
    
    echo ""
    echo "✅ Your app is live on Firebase!"
    ;;
    
  4)
    echo ""
    echo "📄 GitHub Pages Deployment"
    echo ""
    echo "Steps:"
    echo "1. Go to your GitHub repository settings"
    echo "2. Scroll down to 'Pages'"
    echo "3. Under 'Build and deployment'"
    echo "   - Branch: main"
    echo "   - Folder: dist"
    echo "4. Save"
    echo ""
    echo "Your app will be available at:"
    echo "https://evannoshy.github.io/ResumeWebsite/"
    echo ""
    read -p "Open GitHub repository now? (y/n): " open_github
    if [ "$open_github" = "y" ]; then
      open "https://github.com/Evannoshy/ResumeWebsite/settings/pages" || xdg-open "https://github.com/Evannoshy/ResumeWebsite/settings/pages"
    fi
    ;;
    
  *)
    echo "Invalid choice"
    exit 1
    ;;
esac

echo ""
echo "📚 For more details, see HOSTING_GUIDE.md"
echo ""
