const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

module.exports = async function handler(req, res) {
    // Only allow POST with a secret key
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'POST only' });
    }

    const { secret } = req.body || {};
    if (secret !== process.env.SEED_SECRET && secret !== 'ghana2024') {
        return res.status(401).json({ error: 'Invalid secret' });
    }

    const MONGODB_URI = process.env.MONGODB_URI;
    const DB_NAME = process.env.MONGODB_DB || 'ghana_health';

    if (!MONGODB_URI) {
        return res.status(500).json({ error: 'MONGODB_URI not configured' });
    }

    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        const db = client.db(DB_NAME);

        // Load data from static files
        const mealData = JSON.parse(
            fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'meal-plan-30-days.json'), 'utf8')
        );
        const workoutData = JSON.parse(
            fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'workout-plan-4-weeks.json'), 'utf8')
        );
        const ingredientData = JSON.parse(
            fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'ghanaian-ingredients.json'), 'utf8')
        );

        // Seed Meals
        const mealsCollection = db.collection('meals');
        await mealsCollection.deleteMany({});
        const mealDocs = [];
        Object.entries(mealData).forEach(([weekKey, weekData]) => {
            const weekNum = parseInt(weekKey.replace('week_', ''));
            Object.entries(weekData).forEach(([dayKey, dayData]) => {
                if (!dayKey.startsWith('day_')) return;
                const dayNum = parseInt(dayKey.replace('day_', ''));
                mealDocs.push({ week: weekNum, day: dayNum, breakfast: dayData.breakfast, lunch: dayData.lunch, snack: dayData.snack });
            });
        });
        await mealsCollection.insertMany(mealDocs);

        // Seed Workouts
        const workoutsCollection = db.collection('workouts');
        await workoutsCollection.deleteMany({});
        const workoutDocs = [];
        Object.entries(workoutData).forEach(([weekKey, weekData]) => {
            const weekNum = parseInt(weekKey.replace('week_', ''));
            Object.entries(weekData).forEach(([dayKey, dayData]) => {
                if (!dayKey.startsWith('day_')) return;
                const dayNum = parseInt(dayKey.replace('day_', ''));
                workoutDocs.push({
                    week: weekNum, day: dayNum, name: dayData.name, duration: dayData.duration,
                    warmup: dayData.warmup || [], exercises: dayData.exercises, cooldown: dayData.cooldown || [],
                    focus: weekData.focus, frequency: weekData.frequency, description: weekData.description || ''
                });
            });
        });
        await workoutsCollection.insertMany(workoutDocs);

        // Seed Ingredients
        const ingredientsCollection = db.collection('ingredients');
        await ingredientsCollection.deleteMany({});
        await ingredientsCollection.insertOne(ingredientData);

        // Create Indexes
        await mealsCollection.createIndex({ week: 1, day: 1 });
        await workoutsCollection.createIndex({ week: 1, day: 1 });
        await db.collection('progress').createIndex({ userId: 1 }, { unique: true });

        return res.status(200).json({
            success: true,
            seeded: { meals: mealDocs.length, workouts: workoutDocs.length, ingredients: 1 }
        });
    } catch (error) {
        console.error('Seed error:', error);
        return res.status(500).json({ error: error.message });
    } finally {
        await client.close();
    }
};