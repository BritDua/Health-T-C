#!/bin/bash

# Deploy Ghanaian Health App to GitHub Pages
echo "🚀 Deploying Ghanaian Health App..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit: Ghanaian Health App"
fi

# Create gh-pages branch if it doesn't exist
if ! git show-ref --verify --quiet refs/heads/gh-pages; then
    echo "🌿 Creating gh-pages branch..."
    git checkout -b gh-pages
    git checkout main 2>/dev/null || git checkout master
fi

# Build and deploy
echo "📄 Copying files to gh-pages..."
git checkout gh-pages
git checkout main -- web/ 2>/dev/null || git checkout master -- web/
cp web/* . 2>/dev/null || true
git add .
git commit -m "Deploy: $(date)"

echo "✅ Ready to push to GitHub!"
echo ""
echo "📋 Next steps:"
echo "1. Create a GitHub repository"
echo "2. Add remote: git remote add origin https://github.com/yourusername/ghana-health-app.git"
echo "3. Push: git push -u origin gh-pages"
echo "4. Enable GitHub Pages in repository settings"
echo ""
echo "🌐 Your app will be live at: https://yourusername.github.io/ghana-health-app"