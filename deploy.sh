#!/bin/bash
# Ghana Health App - Deployment Script
# Deploy the web/ folder to Netlify

echo "🇬🇭 Ghana Health App - Deploying..."
echo "=================================="

# Verify data files exist
if [ ! -f "data/meal-plan-30-days.json" ]; then
    echo "❌ Error: data/meal-plan-30-days.json not found"
    exit 1
fi

if [ ! -f "data/workout-plan-4-weeks.json" ]; then
    echo "❌ Error: data/workout-plan-4-weeks.json not found"
    exit 1
fi

if [ ! -f "data/ghanaian-ingredients.json" ]; then
    echo "❌ Error: data/ghanaian-ingredients.json not found"
    exit 1
fi

# Validate JSON files
echo "📋 Validating data files..."
node -e "JSON.parse(require('fs').readFileSync('data/meal-plan-30-days.json','utf8'))" || { echo "❌ Invalid meal plan JSON"; exit 1; }
node -e "JSON.parse(require('fs').readFileSync('data/workout-plan-4-weeks.json','utf8'))" || { echo "❌ Invalid workout plan JSON"; exit 1; }
node -e "JSON.parse(require('fs').readFileSync('data/ghanaian-ingredients.json','utf8'))" || { echo "❌ Invalid ingredients JSON"; exit 1; }
echo "✅ All data files valid"

# Check for Netlify CLI
if command -v netlify &> /dev/null; then
    echo "🚀 Deploying to Netlify..."
    netlify deploy --prod --dir=.
    echo "✅ Deployment complete!"
else
    echo "⚠️  Netlify CLI not found."
    echo "   Install with: npm install -g netlify-cli"
    echo "   Or deploy manually by pushing to your connected Git repo."
fi