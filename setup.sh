#!/bin/bash

# Ghanaian Health App Setup Script
echo "🇬🇭 Setting up Ghanaian Health & Fitness App..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    echo "Please install Python 3 and try again."
    exit 1
fi

# Create virtual environment for PDF generation
echo "📦 Creating virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install PDF generation dependencies
echo "📄 Installing PDF generation dependencies..."
pip install -r exports/requirements.txt

# Make PDF generator executable
chmod +x exports/generate-pdf.py

# Generate sample PDFs
echo "🔄 Generating sample PDFs..."
cd exports
python3 generate-pdf.py
cd ..

echo "✅ Setup complete!"
echo ""
echo "📁 Project structure:"
echo "   meal-plans/     - Detailed meal plans with recipes"
echo "   workout-plans/  - Progressive workout programs"
echo "   shopping-lists/ - Weekly shopping lists with pricing"
echo "   data/          - JSON data files"
echo "   ui-mockups/    - App design concepts"
echo "   exports/       - PDF generation and outputs"
echo ""
echo "🚀 Next steps:"
echo "   1. Review PROJECT-SUMMARY.md for complete overview"
echo "   2. Check exports/ folder for generated PDFs"
echo "   3. Customize meal plans in data/meal-plan-30-days.json"
echo "   4. Generate additional PDFs with: cd exports && python3 generate-pdf.py"
echo ""
echo "💡 To activate PDF generation environment:"
echo "   source venv/bin/activate"