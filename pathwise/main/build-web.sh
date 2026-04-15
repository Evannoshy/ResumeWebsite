#!/bin/bash

# PathSkill - Web Build & Deploy Script

echo "🚀 PathSkill Web Deployment"
echo "============================"
echo ""

# Check if expo CLI is installed
if ! command -v expo &> /dev/null; then
    echo "❌ Expo CLI not found. Installing..."
    npm install -g expo-cli
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🔨 Building for web..."
expo export --platform web

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "📁 Output folder: ./dist"
    echo ""
    echo "Deploy options:"
    echo "1. Vercel:  vercel --prod"
    echo "2. Netlify: netlify deploy --prod --dir=dist"
    echo "3. Firebase: firebase deploy --only hosting"
else
    echo "❌ Build failed. Check errors above."
    exit 1
fi
