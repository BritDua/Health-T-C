// ============================================
// Ghana Health & Fitness App
// Professional PWA - Data-Driven Architecture
// ============================================

class GhanaHealthApp {
    constructor() {
        this.state = {
            currentTab: 'meals',
            currentWeek: 1,
            currentDay: 1,
            workoutWeek: 1,
            mealData: null,
            workoutData: null,
            ingredientData: null,
            progress: this.loadProgress(),
            shoppingChecked: this.loadShoppingState()
        };
        this.init();
    }

    // --- Initialization ---
    async init() {
        try {
            await this.loadAllData();
            this.render();
            this.setupNavigation();
            this.setupModal();
            this.registerServiceWorker();
        } catch (error) {
            console.error('App initialization failed:', error);
            this.showError('Failed to load app data. Please refresh.');
        }
    }

    async loadAllData() {
        const [mealRes, workoutRes, ingredientRes] = await Promise.all([
            fetch('data/meal-plan-30-days.json'),
            fetch('data/workout-plan-4-weeks.json'),
            fetch('data/ghanaian-ingredients.json')
        ]);

        if (!mealRes.ok || !workoutRes.ok || !ingredientRes.ok) {
            throw new Error('Failed to fetch data files');
        }

        this.state.mealData = await mealRes.json();
        this.state.workoutData = await workoutRes.json();
        this.state.ingredientData = await ingredientRes.json();
    }

    // --- State Persistence ---
    loadProgress() {
        try {
            const saved = localStorage.getItem('gh_progress');
            return saved ? JSON.parse(saved) : {
                mealsCompleted: [],
                workoutsCompleted: [],
                startDate: new Date().toISOString()
            };
        } catch {
            return { mealsCompleted: [], workoutsCompleted: [], startDate: new Date().toISOString() };
        }
    }

    saveProgress() {
        try {
            localStorage.setItem('gh_progress', JSON.stringify(this.state.progress));
        } catch (e) {
            console.warn('Could not save progress:', e);
        }
    }

    loadShoppingState() {
        try {
            const saved = localStorage.getItem('gh_shopping');
            return saved ? JSON.parse(saved) : {};
        } catch {
            return {};
        }
    }

    saveShoppingState() {
        try {
            localStorage.setItem('gh_shopping', JSON.stringify(this.state.shoppingChecked));
        } catch (e) {
            console.warn('Could not save shopping state:', e);
        }
    }

    // --- Navigation ---
    setupNavigation() {
        const nav = document.getElementById('bottomNav');
        nav.addEventListener('click', (e) => {
            const btn = e.target.closest('.nav-btn');
            if (!btn) return;

            const tab = btn.dataset.tab;
            this.switchTab(tab);
        });
    }

    switchTab(tabName) {
        this.state.currentTab = tabName;

        document.querySelectorAll('.nav-btn').forEach(btn => {
            const isActive = btn.dataset.tab === tabName;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-current', isActive ? 'page' : 'false');
        });

        this.render();
    }

    // --- Modal ---
    setupModal() {
        const modal = document.getElementById('modal');
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');

        closeBtn.addEventListener('click', () => this.closeModal());
        overlay.addEventListener('click', () => this.closeModal());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });
    }

    openModal(content) {
        const modal = document.getElementById('modal');
        const body = document.getElementById('modalBody');
        body.innerHTML = content;
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('modal');
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // --- Rendering Engine ---
    render() {
        const main = document.getElementById('mainContent');
        switch (this.state.currentTab) {
            case 'meals':
                main.innerHTML = this.renderMeals();
                this.attachMealEvents();
                break;
            case 'workouts':
                main.innerHTML = this.renderWorkouts();
                this.attachWorkoutEvents();
                break;
            case 'shopping':
                main.innerHTML = this.renderShopping();
                this.attachShoppingEvents();
                break;
            case 'progress':
                main.innerHTML = this.renderProgress();
                this.attachProgressEvents();
                break;
        }
    }

    // --- Meals Tab ---
    renderMeals() {
        const { mealData, currentWeek, currentDay } = this.state;
        const weekKey = `week_${currentWeek}`;
        const dayKey = `day_${currentDay}`;
        const weekData = mealData[weekKey];

        if (!weekData) return this.renderEmptyState('🍽️', 'Meal data not available for this week.');

        const dayData = weekData[dayKey];
        const totalWeeks = Object.keys(mealData).length;
        const daysInWeek = Object.keys(weekData).filter(k => k.startsWith('day_')).length;

        let html = `
            <div class="selector-row" role="tablist" aria-label="Week selector">
                ${Array.from({ length: totalWeeks }, (_, i) => `
                    <button class="selector-btn ${currentWeek === i + 1 ? 'active' : ''}" 
                            data-week="${i + 1}" role="tab" aria-selected="${currentWeek === i + 1}">
                        Week ${i + 1}
                    </button>
                `).join('')}
            </div>
            <div class="selector-row" role="tablist" aria-label="Day selector">
                ${Array.from({ length: daysInWeek }, (_, i) => `
                    <button class="selector-btn ${currentDay === i + 1 ? 'active' : ''}" 
                            data-day="${i + 1}" role="tab" aria-selected="${currentDay === i + 1}">
                        Day ${i + 1}
                    </button>
                `).join('')}
            </div>
        `;

        if (!dayData) {
            html += this.renderEmptyState('📅', 'No meals planned for this day yet.');
            return html;
        }

        const meals = [
            { key: 'breakfast', icon: '🌅', label: 'Breakfast' },
            { key: 'lunch', icon: '🍽️', label: 'Lunch' },
            { key: 'snack', icon: '🥜', label: 'Snack' }
        ];

        meals.forEach((meal, index) => {
            const data = dayData[meal.key];
            if (!data) return;

            const mealId = `w${currentWeek}d${currentDay}_${meal.key}`;
            const isCompleted = this.state.progress.mealsCompleted.includes(mealId);

            html += `
                <div class="card animate-in" style="animation-delay: ${index * 60}ms">
                    <div class="card-header">
                        <h3>${meal.icon} ${meal.label}</h3>
                        <span class="card-badge">${data.prep_time}</span>
                    </div>
                    <div class="card-title">${data.name}</div>
                    <div class="meal-stats">
                        <span class="stat-chip stat-chip--calories">🔥 ${data.calories} cal</span>
                        <span class="stat-chip stat-chip--protein">💪 ${data.protein}</span>
                        <span class="stat-chip stat-chip--fiber">🌾 ${data.fiber}</span>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn btn--primary" data-recipe="${meal.key}">View Recipe</button>
                        <button class="btn ${isCompleted ? 'btn--secondary' : 'btn--secondary'}" data-complete-meal="${mealId}" style="${isCompleted ? 'background: var(--color-green-light); color: var(--color-green);' : ''}">
                            ${isCompleted ? '✓ Done' : 'Mark Done'}
                        </button>
                    </div>
                </div>
            `;
        });

        // Daily totals
        const totalCals = (dayData.breakfast?.calories || 0) + (dayData.lunch?.calories || 0) + (dayData.snack?.calories || 0);
        html += `
            <div class="card card--progress animate-in" style="animation-delay: 200ms">
                <div class="card-header">
                    <h3>📊 Daily Totals</h3>
                </div>
                <div class="meal-stats">
                    <span class="stat-chip stat-chip--calories">🔥 ${totalCals} cal total</span>
                </div>
            </div>
        `;

        return html;
    }

    attachMealEvents() {
        const main = document.getElementById('mainContent');

        main.querySelectorAll('[data-week]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.state.currentWeek = parseInt(btn.dataset.week);
                this.state.currentDay = 1;
                this.render();
            });
        });

        main.querySelectorAll('[data-day]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.state.currentDay = parseInt(btn.dataset.day);
                this.render();
            });
        });

        main.querySelectorAll('[data-recipe]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.showRecipe(btn.dataset.recipe);
            });
        });

        main.querySelectorAll('[data-complete-meal]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.toggleMealComplete(btn.dataset.completeMeal);
            });
        });
    }

    showRecipe(mealType) {
        const { mealData, currentWeek, currentDay } = this.state;
        const meal = mealData[`week_${currentWeek}`]?.[`day_${currentDay}`]?.[mealType];
        if (!meal) return;

        const content = `
            <h2 class="modal-recipe-title">${meal.name}</h2>
            <div class="modal-recipe-meta">
                <span class="stat-chip">⏱️ ${meal.prep_time}</span>
                <span class="stat-chip stat-chip--calories">🔥 ${meal.calories} cal</span>
                <span class="stat-chip stat-chip--protein">💪 ${meal.protein}</span>
                <span class="stat-chip stat-chip--fiber">🌾 ${meal.fiber}</span>
            </div>
            
            <div class="modal-section">
                <h3>🛒 Ingredients</h3>
                <ul>
                    ${meal.ingredients.map(i => `<li>${i}</li>`).join('')}
                </ul>
            </div>
            
            <div class="modal-section">
                <h3>👨‍🍳 Instructions</h3>
                <ol>
                    ${meal.instructions.map(s => `<li>${s}</li>`).join('')}
                </ol>
            </div>
            
            <div class="modal-benefit">
                <strong>💡 Health Benefits</strong>
                ${meal.benefits}
            </div>
        `;

        this.openModal(content);
    }

    toggleMealComplete(mealId) {
        const { mealsCompleted } = this.state.progress;
        const index = mealsCompleted.indexOf(mealId);
        if (index > -1) {
            mealsCompleted.splice(index, 1);
        } else {
            mealsCompleted.push(mealId);
        }
        this.saveProgress();
        this.render();
    }

    // --- Workouts Tab ---
    renderWorkouts() {
        const { workoutData, workoutWeek } = this.state;
        const weekKey = `week_${workoutWeek}`;
        const week = workoutData[weekKey];

        if (!week) return this.renderEmptyState('💪', 'Workout data not available for this week.');

        const totalWeeks = Object.keys(workoutData).length;
        const days = Object.keys(week).filter(k => k.startsWith('day_'));

        let html = `
            <div class="selector-row" role="tablist" aria-label="Workout week selector">
                ${Array.from({ length: totalWeeks }, (_, i) => `
                    <button class="selector-btn ${workoutWeek === i + 1 ? 'active' : ''}" 
                            data-workout-week="${i + 1}" role="tab" aria-selected="${workoutWeek === i + 1}">
                        Week ${i + 1}
                    </button>
                `).join('')}
            </div>

            <div class="week-banner animate-in">
                <h2>${week.focus}</h2>
                <p>${week.description} • ${week.frequency} per week</p>
            </div>
        `;

        days.forEach((dayKey, index) => {
            const day = week[dayKey];
            const workoutId = `w${workoutWeek}_${dayKey}`;
            const isCompleted = this.state.progress.workoutsCompleted.includes(workoutId);

            html += `
                <div class="card card--workout animate-in" style="animation-delay: ${(index + 1) * 60}ms">
                    <div class="card-header">
                        <h3>${day.name}</h3>
                        <span class="card-badge">${day.duration}</span>
                    </div>
                    <div class="exercise-list">
                        ${day.exercises.slice(0, 3).map(ex => `
                            <div class="exercise-item">
                                <span class="exercise-name">${ex.name}</span>
                                <span class="exercise-detail">${ex.sets} × ${ex.reps}</span>
                            </div>
                        `).join('')}
                        ${day.exercises.length > 3 ? `
                            <div class="exercise-item" style="color: var(--color-text-secondary); font-size: var(--font-size-xs);">
                                <span>+ ${day.exercises.length - 3} more exercises</span>
                            </div>
                        ` : ''}
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn btn--danger" data-view-workout="${dayKey}">View Full Workout</button>
                        <button class="btn ${isCompleted ? 'btn--secondary' : 'btn--secondary'}" data-complete-workout="${workoutId}" style="${isCompleted ? 'background: var(--color-green-light); color: var(--color-green);' : ''}">
                            ${isCompleted ? '✓ Done' : 'Complete'}
                        </button>
                    </div>
                </div>
            `;
        });

        return html;
    }

    attachWorkoutEvents() {
        const main = document.getElementById('mainContent');

        main.querySelectorAll('[data-workout-week]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.state.workoutWeek = parseInt(btn.dataset.workoutWeek);
                this.render();
            });
        });

        main.querySelectorAll('[data-view-workout]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.showWorkoutDetail(btn.dataset.viewWorkout);
            });
        });

        main.querySelectorAll('[data-complete-workout]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.toggleWorkoutComplete(btn.dataset.completeWorkout);
            });
        });
    }

    showWorkoutDetail(dayKey) {
        const { workoutData, workoutWeek } = this.state;
        const day = workoutData[`week_${workoutWeek}`]?.[dayKey];
        if (!day) return;

        const content = `
            <h2 class="modal-recipe-title">${day.name}</h2>
            <div class="modal-recipe-meta">
                <span class="stat-chip">⏱️ ${day.duration}</span>
                <span class="stat-chip stat-chip--protein">${day.exercises.length} exercises</span>
            </div>

            ${day.warmup ? `
                <div class="modal-section">
                    <h3>🔥 Warm-up</h3>
                    <ul>
                        ${day.warmup.map(w => `<li>${w}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}

            <div class="modal-section">
                <h3>💪 Exercises</h3>
                ${day.exercises.map((ex, i) => `
                    <div style="background: var(--color-bg); padding: 12px; border-radius: 8px; margin-bottom: 8px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                            <strong>${i + 1}. ${ex.name}</strong>
                            <span class="card-badge">${ex.sets} × ${ex.reps}</span>
                        </div>
                        <div style="font-size: 0.8rem; color: var(--color-text-secondary); margin-bottom: 4px;">
                            Rest: ${ex.rest} ${ex.form_tips ? `• ${ex.form_tips}` : ''}
                        </div>
                        <div style="font-size: 0.75rem; color: var(--color-green); font-style: italic;">
                            🧬 ${ex.testosterone_benefit}
                        </div>
                    </div>
                `).join('')}
            </div>

            ${day.cooldown ? `
                <div class="modal-section">
                    <h3>🧘 Cool-down</h3>
                    <ul>
                        ${day.cooldown.map(c => `<li>${c}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        `;

        this.openModal(content);
    }

    toggleWorkoutComplete(workoutId) {
        const { workoutsCompleted } = this.state.progress;
        const index = workoutsCompleted.indexOf(workoutId);
        if (index > -1) {
            workoutsCompleted.splice(index, 1);
        } else {
            workoutsCompleted.push(workoutId);
        }
        this.saveProgress();
        this.render();
    }

    // --- Shopping Tab ---
    renderShopping() {
        const { mealData, currentWeek } = this.state;
        const weekKey = `week_${currentWeek}`;
        const weekData = mealData[weekKey];

        if (!weekData) return this.renderEmptyState('🛒', 'No shopping data for this week.');

        const totalWeeks = Object.keys(mealData).length;

        // Dynamically generate shopping list from meal ingredients
        const categories = this.generateShoppingList(weekData);

        let html = `
            <div class="selector-row" role="tablist" aria-label="Shopping week selector">
                ${Array.from({ length: totalWeeks }, (_, i) => `
                    <button class="selector-btn ${currentWeek === i + 1 ? 'active' : ''}" 
                            data-shopping-week="${i + 1}" role="tab" aria-selected="${currentWeek === i + 1}">
                        Week ${i + 1}
                    </button>
                `).join('')}
            </div>

            <div class="week-banner animate-in">
                <h2>🛒 Week ${currentWeek} Shopping List</h2>
                <p>Auto-generated from your meal plan</p>
            </div>
        `;

        Object.entries(categories).forEach(([category, items], catIndex) => {
            const categoryIcons = {
                'Proteins': '🐟',
                'Vegetables & Greens': '🥬',
                'Grains & Starches': '🌾',
                'Fruits': '🍍',
                'Healthy Fats & Nuts': '🥥',
                'Spices & Seasonings': '🌿',
                'Other': '🧂'
            };

            html += `
                <div class="shopping-category animate-in" style="animation-delay: ${catIndex * 50}ms">
                    <h3>${categoryIcons[category] || '📦'} ${category}</h3>
                    ${items.map(item => {
                        const itemId = `w${currentWeek}_${item.replace(/\s/g, '_')}`;
                        const isChecked = this.state.shoppingChecked[itemId] || false;
                        return `
                            <div class="shopping-item ${isChecked ? 'checked' : ''}">
                                <input type="checkbox" id="${itemId}" data-shopping-item="${itemId}" ${isChecked ? 'checked' : ''}>
                                <label for="${itemId}">${item}</label>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        });

        return html;
    }

    generateShoppingList(weekData) {
        const { ingredientData } = this.state;
        const allIngredients = new Set();

        // Collect all ingredients from the week's meals
        Object.values(weekData).forEach(day => {
            if (typeof day !== 'object' || !day.breakfast) return;
            ['breakfast', 'lunch', 'snack'].forEach(meal => {
                if (day[meal]?.ingredients) {
                    day[meal].ingredients.forEach(ing => allIngredients.add(ing));
                }
            });
        });

        // Categorize ingredients
        const categories = {
            'Proteins': [],
            'Vegetables & Greens': [],
            'Grains & Starches': [],
            'Fruits': [],
            'Healthy Fats & Nuts': [],
            'Spices & Seasonings': [],
            'Other': []
        };

        const proteinKeywords = ['fish', 'tilapia', 'mackerel', 'sardine', 'chicken', 'turkey', 'egg', 'guinea', 'cowpea', 'black-eyed', 'groundnut paste', 'peas'];
        const vegKeywords = ['kontomire', 'spinach', 'cabbage', 'tomato', 'onion', 'pepper', 'okra', 'garden egg', 'carrot', 'green bean', 'lettuce', 'bell pepper', 'greens', 'salad'];
        const grainKeywords = ['rice', 'millet', 'yam', 'cassava', 'plantain', 'sweet potato', 'sorghum', 'oat', 'bread', 'quinoa', 'corn', 'banku'];
        const fruitKeywords = ['papaya', 'mango', 'pineapple', 'watermelon', 'banana', 'orange', 'lime', 'lemon', 'avocado'];
        const fatKeywords = ['coconut', 'tiger nut', 'groundnut', 'palm oil', 'olive oil', 'chia', 'date'];
        const spiceKeywords = ['ginger', 'garlic', 'nutmeg', 'cinnamon', 'thyme', 'bay', 'pepper', 'salt', 'curry', 'vanilla', 'mint', 'basil', 'suya', 'moringa', 'honey', 'cocoa', 'soy sauce'];

        allIngredients.forEach(ingredient => {
            const lower = ingredient.toLowerCase();
            if (proteinKeywords.some(k => lower.includes(k))) {
                categories['Proteins'].push(ingredient);
            } else if (vegKeywords.some(k => lower.includes(k))) {
                categories['Vegetables & Greens'].push(ingredient);
            } else if (grainKeywords.some(k => lower.includes(k))) {
                categories['Grains & Starches'].push(ingredient);
            } else if (fruitKeywords.some(k => lower.includes(k))) {
                categories['Fruits'].push(ingredient);
            } else if (fatKeywords.some(k => lower.includes(k))) {
                categories['Healthy Fats & Nuts'].push(ingredient);
            } else if (spiceKeywords.some(k => lower.includes(k))) {
                categories['Spices & Seasonings'].push(ingredient);
            } else {
                categories['Other'].push(ingredient);
            }
        });

        // Remove empty categories
        Object.keys(categories).forEach(key => {
            if (categories[key].length === 0) delete categories[key];
        });

        return categories;
    }

    attachShoppingEvents() {
        const main = document.getElementById('mainContent');

        main.querySelectorAll('[data-shopping-week]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.state.currentWeek = parseInt(btn.dataset.shoppingWeek);
                this.render();
            });
        });

        main.querySelectorAll('[data-shopping-item]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const itemId = e.target.dataset.shoppingItem;
                this.state.shoppingChecked[itemId] = e.target.checked;
                this.saveShoppingState();

                const item = e.target.closest('.shopping-item');
                item.classList.toggle('checked', e.target.checked);
            });
        });
    }

    // --- Progress Tab ---
    renderProgress() {
        const { progress, mealData, workoutData } = this.state;

        // Calculate stats
        const totalMealSlots = this.countTotalMeals();
        const mealsCompleted = progress.mealsCompleted.length;
        const mealPercent = totalMealSlots > 0 ? Math.round((mealsCompleted / totalMealSlots) * 100) : 0;

        const totalWorkoutSlots = this.countTotalWorkouts();
        const workoutsCompleted = progress.workoutsCompleted.length;
        const workoutPercent = totalWorkoutSlots > 0 ? Math.round((workoutsCompleted / totalWorkoutSlots) * 100) : 0;

        // Calculate streak
        const streak = this.calculateStreak();

        // Days since start
        const startDate = new Date(progress.startDate);
        const today = new Date();
        const daysSinceStart = Math.max(1, Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1);

        let html = `
            <div class="week-banner animate-in">
                <h2>📊 Your Progress</h2>
                <p>Day ${daysSinceStart} of your health journey</p>
            </div>

            ${streak > 0 ? `
                <div class="text-center mb-md animate-in" style="animation-delay: 50ms">
                    <span class="streak-badge">🔥 ${streak} day streak!</span>
                </div>
            ` : ''}

            <div class="card card--progress animate-in" style="animation-delay: 100ms">
                <div class="progress-header">
                    <h3 style="color: var(--color-green); font-weight: 700;">🍽️ Meals Completed</h3>
                    <span class="card-badge">${mealPercent}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${mealPercent}%"></div>
                </div>
                <p class="progress-label">${mealsCompleted} of ${totalMealSlots} meals completed</p>
            </div>

            <div class="card card--workout animate-in" style="animation-delay: 150ms">
                <div class="progress-header">
                    <h3 style="color: var(--color-red); font-weight: 700;">💪 Workouts Completed</h3>
                    <span class="card-badge">${workoutPercent}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${workoutPercent}%"></div>
                </div>
                <p class="progress-label">${workoutsCompleted} of ${totalWorkoutSlots} workouts completed</p>
            </div>

            <div class="card animate-in" style="animation-delay: 200ms">
                <div class="card-header">
                    <h3>📈 Weekly Breakdown</h3>
                </div>
                ${this.renderWeeklyBreakdown()}
            </div>

            <div class="card animate-in" style="animation-delay: 250ms">
                <div class="card-header">
                    <h3>⚙️ Actions</h3>
                </div>
                <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px;">
                    <button class="btn btn--secondary btn--sm" data-action="reset-progress">Reset All Progress</button>
                    <button class="btn btn--secondary btn--sm" data-action="reset-shopping">Clear Shopping Lists</button>
                </div>
            </div>
        `;

        return html;
    }

    renderWeeklyBreakdown() {
        const { mealData } = this.state;
        const weeks = Object.keys(mealData);

        return weeks.map((weekKey, i) => {
            const weekNum = i + 1;
            const weekMeals = this.state.progress.mealsCompleted.filter(id => id.startsWith(`w${weekNum}`)).length;
            const weekData = mealData[weekKey];
            const totalDays = Object.keys(weekData).filter(k => k.startsWith('day_')).length;
            const totalMeals = totalDays * 3;
            const percent = totalMeals > 0 ? Math.round((weekMeals / totalMeals) * 100) : 0;

            return `
                <div style="margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 4px;">
                        <span>Week ${weekNum}</span>
                        <span>${weekMeals}/${totalMeals} meals</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${percent}%"></div>
                    </div>
                </div>
            `;
        }).join('');
    }

    countTotalMeals() {
        const { mealData } = this.state;
        let total = 0;
        Object.values(mealData).forEach(week => {
            Object.keys(week).filter(k => k.startsWith('day_')).forEach(() => {
                total += 3; // breakfast, lunch, snack
            });
        });
        return total;
    }

    countTotalWorkouts() {
        const { workoutData } = this.state;
        let total = 0;
        Object.values(workoutData).forEach(week => {
            total += Object.keys(week).filter(k => k.startsWith('day_')).length;
        });
        return total;
    }

    calculateStreak() {
        const { mealsCompleted, workoutsCompleted } = this.state.progress;
        // Simple streak: count consecutive days with at least one completion
        const allDates = [...mealsCompleted, ...workoutsCompleted]
            .map(id => {
                const match = id.match(/w(\d+)d(\d+)/);
                if (match) return (parseInt(match[1]) - 1) * 7 + parseInt(match[2]);
                return null;
            })
            .filter(Boolean);

        if (allDates.length === 0) return 0;

        const uniqueDays = [...new Set(allDates)].sort((a, b) => b - a);
        let streak = 1;
        for (let i = 0; i < uniqueDays.length - 1; i++) {
            if (uniqueDays[i] - uniqueDays[i + 1] === 1) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }

    attachProgressEvents() {
        const main = document.getElementById('mainContent');

        main.querySelector('[data-action="reset-progress"]')?.addEventListener('click', () => {
            if (confirm('Reset all meal and workout progress? This cannot be undone.')) {
                this.state.progress = {
                    mealsCompleted: [],
                    workoutsCompleted: [],
                    startDate: new Date().toISOString()
                };
                this.saveProgress();
                this.render();
            }
        });

        main.querySelector('[data-action="reset-shopping"]')?.addEventListener('click', () => {
            if (confirm('Clear all shopping list checkmarks?')) {
                this.state.shoppingChecked = {};
                this.saveShoppingState();
                this.render();
            }
        });
    }

    // --- Utilities ---
    renderEmptyState(icon, message) {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">${icon}</div>
                <p>${message}</p>
            </div>
        `;
    }

    showError(message) {
        const main = document.getElementById('mainContent');
        main.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">⚠️</div>
                <p>${message}</p>
                <button class="btn btn--primary mt-md" onclick="location.reload()">Retry</button>
            </div>
        `;
    }

    // --- Service Worker ---
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('sw.js')
                    .then(reg => console.log('Service Worker registered:', reg.scope))
                    .catch(err => console.warn('Service Worker registration failed:', err));
            });
        }
    }
}

// --- Initialize App ---
const app = new GhanaHealthApp();
