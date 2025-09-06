#!/usr/bin/env python3
"""
PDF Generator for Ghanaian Health App
Generates mobile-optimized PDFs from meal plans and workout data
"""

import json
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_LEFT
import os

# Ghanaian color scheme
COLORS = {
    'red': HexColor('#CE1126'),
    'gold': HexColor('#FCD116'),
    'green': HexColor('#006B3F'),
    'dark_gray': HexColor('#212529'),
    'light_gray': HexColor('#F8F9FA')
}

class GhanaianHealthPDF:
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self.setup_custom_styles()
    
    def setup_custom_styles(self):
        """Setup custom styles with Ghanaian theme"""
        # Title style
        self.styles.add(ParagraphStyle(
            name='GhanaTitle',
            parent=self.styles['Title'],
            fontSize=24,
            textColor=COLORS['red'],
            spaceAfter=20,
            alignment=TA_CENTER
        ))
        
        # Header style
        self.styles.add(ParagraphStyle(
            name='GhanaHeader',
            parent=self.styles['Heading1'],
            fontSize=18,
            textColor=COLORS['green'],
            spaceAfter=12,
            spaceBefore=20
        ))
        
        # Subheader style
        self.styles.add(ParagraphStyle(
            name='GhanaSubHeader',
            parent=self.styles['Heading2'],
            fontSize=14,
            textColor=COLORS['red'],
            spaceAfter=8,
            spaceBefore=12
        ))
    
    def generate_meal_plan_pdf(self, output_path="meal-plan-week1.pdf"):
        """Generate PDF for meal plan"""
        doc = SimpleDocTemplate(output_path, pagesize=A4)
        story = []
        
        # Title
        title = Paragraph("🇬🇭 Ghanaian Health & Fitness Plan", self.styles['GhanaTitle'])
        story.append(title)
        story.append(Spacer(1, 20))
        
        # Subtitle
        subtitle = Paragraph("Week 1 - Foundation Building", self.styles['GhanaHeader'])
        story.append(subtitle)
        
        # Overview
        overview_text = """
        <b>Daily Goals:</b><br/>
        • Calories: 950-1000 (fat loss optimized)<br/>
        • Protein: 45-55g daily<br/>
        • Fiber: 25-35g daily<br/>
        • Style: Low oil, high fiber, testosterone-boosting
        """
        overview = Paragraph(overview_text, self.styles['Normal'])
        story.append(overview)
        story.append(Spacer(1, 20))
        
        # Sample day
        day_header = Paragraph("📅 Day 1 - Monday", self.styles['GhanaHeader'])
        story.append(day_header)
        
        # Breakfast
        breakfast_header = Paragraph("🌅 Breakfast: Kontomire & Egg Scramble", self.styles['GhanaSubHeader'])
        story.append(breakfast_header)
        
        breakfast_info = """
        <b>Prep Time:</b> 15 minutes | <b>Calories:</b> 320 | <b>Protein:</b> 22g<br/><br/>
        <b>Ingredients:</b><br/>
        • 2 cups fresh kontomire (chopped)<br/>
        • 2 eggs<br/>
        • 1 medium tomato (diced)<br/>
        • 1 small onion (sliced)<br/>
        • 1 tsp fresh ginger (minced)<br/>
        • 1 tsp coconut oil<br/><br/>
        <b>Health Benefits:</b> High in folate, iron, and complete proteins for testosterone support
        """
        breakfast_text = Paragraph(breakfast_info, self.styles['Normal'])
        story.append(breakfast_text)
        story.append(Spacer(1, 15))
        
        # Add more content...
        
        # Build PDF
        doc.build(story)
        return output_path
    
    def generate_workout_pdf(self, output_path="workout-plan-week1.pdf"):
        """Generate PDF for workout plan"""
        doc = SimpleDocTemplate(output_path, pagesize=A4)
        story = []
        
        # Title
        title = Paragraph("💪 4-Week Bodyweight Workout Plan", self.styles['GhanaTitle'])
        story.append(title)
        story.append(Spacer(1, 20))
        
        # Week 1 header
        week_header = Paragraph("Week 1 - Foundation Building", self.styles['GhanaHeader'])
        story.append(week_header)
        
        # Workout overview
        overview_text = """
        <b>Focus:</b> Building movement foundation and establishing routine<br/>
        <b>Frequency:</b> 3 days per week (Monday, Wednesday, Friday)<br/>
        <b>Duration:</b> 20-25 minutes per session<br/>
        <b>Equipment:</b> None required (bodyweight only)<br/>
        <b>Benefits:</b> Fat burning and testosterone optimization
        """
        overview = Paragraph(overview_text, self.styles['Normal'])
        story.append(overview)
        story.append(Spacer(1, 20))
        
        # Day 1 workout
        day1_header = Paragraph("📅 Day 1 - Monday: Upper Body Power", self.styles['GhanaSubHeader'])
        story.append(day1_header)
        
        # Exercise table
        exercise_data = [
            ['Exercise', 'Sets', 'Reps', 'Rest'],
            ['Push-ups', '3', '8-12', '60s'],
            ['Pike Push-ups', '3', '6-10', '60s'],
            ['Tricep Dips', '3', '8-12', '45s'],
            ['Plank Hold', '3', '30-45s', '45s'],
            ['Mountain Climbers', '3', '20 each', '60s']
        ]
        
        exercise_table = Table(exercise_data, colWidths=[2*inch, 0.8*inch, 0.8*inch, 0.8*inch])
        exercise_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), COLORS['green']),
            ('TEXTCOLOR', (0, 0), (-1, 0), HexColor('#FFFFFF')),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), HexColor('#F8F9FA')),
            ('GRID', (0, 0), (-1, -1), 1, COLORS['dark_gray'])
        ]))
        
        story.append(exercise_table)
        story.append(Spacer(1, 20))
        
        # Build PDF
        doc.build(story)
        return output_path
    
    def generate_shopping_list_pdf(self, output_path="shopping-list-week1.pdf"):
        """Generate PDF for shopping list"""
        doc = SimpleDocTemplate(output_path, pagesize=A4)
        story = []
        
        # Title
        title = Paragraph("🛒 Week 1 Shopping List", self.styles['GhanaTitle'])
        story.append(title)
        story.append(Spacer(1, 20))
        
        # Proteins section
        proteins_header = Paragraph("🐟 Proteins", self.styles['GhanaHeader'])
        story.append(proteins_header)
        
        proteins_text = """
        □ Tilapia fillets (1 lb)<br/>
        □ Mackerel (1 lb)<br/>
        □ Sardines (1 can or fresh)<br/>
        □ Chicken breast (1.5 lbs)<br/>
        □ Turkey pieces (1 lb)<br/>
        □ Chicken eggs (1 dozen)<br/>
        □ Black-eyed peas (2 cups dried)<br/>
        □ Groundnuts/Peanuts (1 cup raw)
        """
        proteins_list = Paragraph(proteins_text, self.styles['Normal'])
        story.append(proteins_list)
        story.append(Spacer(1, 15))
        
        # Cost estimate
        cost_header = Paragraph("💰 Estimated Cost", self.styles['GhanaSubHeader'])
        story.append(cost_header)
        
        cost_text = """
        <b>Total Weekly Budget:</b> ₵210-310 (~$35-52 USD)<br/><br/>
        <b>Shopping Tips:</b><br/>
        • Visit local markets early morning for freshest produce<br/>
        • Buy fruits in season for better prices<br/>
        • Purchase grains and legumes in bulk to save money
        """
        cost_info = Paragraph(cost_text, self.styles['Normal'])
        story.append(cost_info)
        
        # Build PDF
        doc.build(story)
        return output_path

def main():
    """Generate all PDFs"""
    generator = GhanaianHealthPDF()
    
    # Create exports directory if it doesn't exist
    os.makedirs('../exports', exist_ok=True)
    
    # Generate PDFs
    meal_pdf = generator.generate_meal_plan_pdf("../exports/ghanaian-meal-plan-week1.pdf")
    workout_pdf = generator.generate_workout_pdf("../exports/ghanaian-workout-plan-week1.pdf")
    shopping_pdf = generator.generate_shopping_list_pdf("../exports/ghanaian-shopping-list-week1.pdf")
    
    print(f"✅ Generated PDFs:")
    print(f"   📄 {meal_pdf}")
    print(f"   📄 {workout_pdf}")
    print(f"   📄 {shopping_pdf}")

if __name__ == "__main__":
    main()