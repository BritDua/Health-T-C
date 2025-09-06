// Ghanaian Health App JavaScript
class GhanaianHealthApp {
    constructor() {
        this.currentDay = 1;
        this.currentTab = 'meals';
        this.mealData = this.loadMealData();
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupDaySelector();
        this.setupModal();
        this.loadDay(1);
    }

    loadMealData() {
        return {
            1: {
                breakfast: {
                    name: "Kontomire & Egg Scramble",
                    time: "15 mins",
                    calories: 320,
                    protein: "22g",
                    ingredients: ["2 cups kontomire", "2 eggs", "1 tomato", "1 onion", "1 tsp ginger", "1 tsp coconut oil"],
                    instructions: [
                        "Heat coconut oil in pan over medium heat",
                        "Sauté onions and ginger until fragrant (2 mins)",
                        "Add tomatoes, cook until soft (3 mins)",
                        "Add kontomire, cook until wilted (3 mins)",
                        "Beat eggs and scramble with vegetables (4 mins)",
                        "Season with salt and pepper"
                    ],
                    benefits: "High in folate, iron, and complete proteins for testosterone support"
                },
                lunch: {
                    name: "Grilled Tilapia with Sweet Potato",
                    time: "25 mins",
                    calories: 450,
                    protein: "35g",
                    ingredients: ["6 oz tilapia fillet", "1 sweet potato", "2 cups spinach", "2 cloves garlic", "1 tsp ginger", "1 lemon"],
                    instructions: [
                        "Season tilapia with garlic, ginger, lemon, salt, pepper",
                        "Grill tilapia 4-5 mins each side",
                        "Steam sweet potato cubes until tender (15 mins)",
                        "Sauté spinach with garlic (2 mins)",
                        "Serve fish over sweet potato with spinach"
                    ],
                    benefits: "Omega-3 fatty acids, beta-carotene, and lean protein for hormone optimization"
                },
                snack: {
                    name: "Tiger Nut & Coconut Mix",
                    time: "5 mins",
                    calories: 180,
                    protein: "6g",
                    ingredients: ["1/4 cup tiger nuts", "2 tbsp coconut flakes", "Pinch of cinnamon"],
                    instructions: [
                        "Soak tiger nuts for 2 hours or overnight",
                        "Mix with coconut flakes and cinnamon",
                        "Enjoy as afternoon snack"
                    ],
                    benefits: "Natural testosterone boosters, healthy fats, and fiber"
                }
            },
            2: {
                breakfast: {
                    name: "Millet Porridge with Groundnuts",
                    time: "20 mins",
                    calories: 340,
                    protein: "18g"
                },
                lunch: {
                    name: "Black-Eyed Peas Stew with Brown Rice",
                    time: "35 mins",
                    calories: 420,
                    protein: "20g"
                },
                snack: {
                    name: "Roasted Plantain Chips",
                    time: "20 mins",
                    calories: 160,
                    protein: "3g"
                }
            },
            3: {
                breakfast: {
                    name: "Yam & Spinach Hash",
                    time: "18 mins",
                    calories: 350,
                    protein: "20g"
                },
                lunch: {
                    name: "Grilled Chicken with Okra Stew",
                    time: "30 mins",
                    calories: 480,
                    protein: "40g"
                },
                snack: {
                    name: "Papaya & Groundnut Bowl",
                    time: "5 mins",
                    calories: 170,
                    protein: "8g"
                }
            }
        };
    }

    setupNavigation() {
        const navBtns = document.querySelectorAll('.nav-btn');
        navBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchTab(tab);
            });
        });
    }

    setupDaySelector() {
        const dayBtns = document.querySelectorAll('.day-btn');
        dayBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const day = parseInt(e.target.dataset.day);
                this.loadDay(day);
            });
        });
    }

    setupModal() {
        const modal = document.getElementById('recipeModal');
        const closeBtn = document.querySelector('.close');
        
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    switchTab(tabName) {
        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        this.currentTab = tabName;
    }

    loadDay(day) {
        this.currentDay = day;
        
        // Update day buttons
        document.querySelectorAll('.day-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-day="${day}"]`).classList.add('active');

        // Update meal content
        this.updateMealContent(day);
    }

    updateMealContent(day) {
        const dayData = this.mealData[day];
        if (!dayData) return;

        const mealsContainer = document.querySelector('.meals-container');
        mealsContainer.innerHTML = `
            <div class="meal-card">
                <div class="meal-header">
                    <h3>🌅 Breakfast</h3>
                    <span class="meal-time">${dayData.breakfast.time}</span>
                </div>
                <h4>${dayData.breakfast.name}</h4>
                <div class="meal-stats">
                    <span>${dayData.breakfast.calories} cal</span>
                    <span>${dayData.breakfast.protein} protein</span>
                </div>
                <button class="recipe-btn" onclick="app.showRecipe('breakfast', ${day})">View Recipe</button>
            </div>

            <div class="meal-card">
                <div class="meal-header">
                    <h3>🍽️ Lunch</h3>
                    <span class="meal-time">${dayData.lunch.time}</span>
                </div>
                <h4>${dayData.lunch.name}</h4>
                <div class="meal-stats">
                    <span>${dayData.lunch.calories} cal</span>
                    <span>${dayData.lunch.protein} protein</span>
                </div>
                <button class="recipe-btn" onclick="app.showRecipe('lunch', ${day})">View Recipe</button>
            </div>

            <div class="meal-card">
                <div class="meal-header">
                    <h3>🥜 Snack</h3>
                    <span class="meal-time">${dayData.snack.time}</span>
                </div>
                <h4>${dayData.snack.name}</h4>
                <div class="meal-stats">
                    <span>${dayData.snack.calories} cal</span>
                    <span>${dayData.snack.protein} protein</span>
                </div>
                <button class="recipe-btn" onclick="app.showRecipe('snack', ${day})">View Recipe</button>
            </div>
        `;
    }

    showRecipe(mealType, day = this.currentDay) {
        const meal = this.mealData[day][mealType];
        if (!meal || !meal.ingredients) {
            alert('Recipe details coming soon!');
            return;
        }

        const modal = document.getElementById('recipeModal');
        const content = document.getElementById('recipeContent');
        
        content.innerHTML = `
            <h2>${meal.name}</h2>
            <div style="margin: 15px 0;">
                <strong>⏱️ ${meal.time} • 🔥 ${meal.calories} cal • 💪 ${meal.protein} protein</strong>
            </div>
            
            <h3 style="color: var(--ghana-green); margin: 20px 0 10px 0;">🛒 Ingredients</h3>
            <ul style="margin-left: 20px;">
                ${meal.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
            
            <h3 style="color: var(--ghana-green); margin: 20px 0 10px 0;">👨‍🍳 Instructions</h3>
            <ol style="margin-left: 20px;">
                ${meal.instructions.map(step => `<li style="margin-bottom: 8px;">${step}</li>`).join('')}
            </ol>
            
            <div style="background: var(--light-gray); padding: 15px; border-radius: 8px; margin-top: 20px;">
                <strong>💡 Health Benefits:</strong><br>
                ${meal.benefits}
            </div>
        `;
        
        modal.style.display = 'block';
    }
}

// Initialize app
const app = new GhanaianHealthApp();

// Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    });
}