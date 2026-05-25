/**
 * Seed MongoDB Atlas with meal and workout data
 * 
 * Usage:
 *   Set MONGODB_URI environment variable, then run:
 *   node scripts/seed-db.js
 */

const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || 'ghana_health';

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is required');
    console.error('   Set it with: $env:MONGODB_URI = "your-connection-string"');
    process.exit(1);
}

async function seed() {
    const client = new MongoClient(MONGODB_URI, {
        serverSelectionTimeoutMS: 15000,
        connectTimeoutMS: 15000
    });

    try {
        console.log('🔌 Connecting to MongoDB Atlas...');
        await client.connect();
        const db = client.db(DB_NAME);
        console.log(`✅ Connected to database: ${DB_NAME}`);

        // --- Seed Meals ---
        console.log('\n🍽️  Seeding meals...');
        const mealData = JSON.parse(
            fs.readFileSync(path.join(__dirname, '..', 'public', 'data', 'meal-plan-30-days.json'), 'utf8')
        );

        const mealsCollection = db.collection('meals');
        await mealsCollection.deleteMany({}); // Clear existing

        const mealDocs = [];
        Object.entries(mealData).forEach(([weekKey, weekData]) => {
            const weekNum = parseInt(weekKey.replace('week_', ''));
            Object.entries(weekData).forEach(([dayKey, dayData]) => {
                if (!dayKey.startsWith('day_')) return;
                const dayNum = parseInt(dayKey.replace('day_', ''));
                mealDocs.push({
                    week: weekNum,
                    day: dayNum,
                    breakfast: dayData.breakfast,
                    lunch: dayData.lunch,
                    snack: dayData.snack
                });
            });
        });

        await mealsCollection.insertMany(mealDocs);
        console.log(`   ✅ Inserted ${mealDocs.length} meal days`);

        // --- Seed Workouts ---
        console.log('\n💪 Seeding workouts...');
        const workoutData = JSON.parse(
            fs.readFileSync(path.join(__dirname, '..', 'public', 'data', 'workout-plan-4-weeks.json'), 'utf8')
        );

        const workoutsCollection = db.collection('workouts');
        await workoutsCollection.deleteMany({}); // Clear existing

        const workoutDocs = [];
        Object.entries(workoutData).forEach(([weekKey, weekData]) => {
            const weekNum = parseInt(weekKey.replace('week_', ''));
            Object.entries(weekData).forEach(([dayKey, dayData]) => {
                if (!dayKey.startsWith('day_')) return;
                const dayNum = parseInt(dayKey.replace('day_', ''));
                workoutDocs.push({
                    week: weekNum,
                    day: dayNum,
                    name: dayData.name,
                    duration: dayData.duration,
                    warmup: dayData.warmup || [],
                    exercises: dayData.exercises,
                    cooldown: dayData.cooldown || [],
                    focus: weekData.focus,
                    frequency: weekData.frequency
                });
            });
        });

        await workoutsCollection.insertMany(workoutDocs);
        console.log(`   ✅ Inserted ${workoutDocs.length} workout days`);

        // --- Seed Ingredients ---
        console.log('\n🥬 Seeding ingredients...');
        const ingredientData = JSON.parse(
            fs.readFileSync(path.join(__dirname, '..', 'public', 'data', 'ghanaian-ingredients.json'), 'utf8')
        );

        const ingredientsCollection = db.collection('ingredients');
        await ingredientsCollection.deleteMany({});
        await ingredientsCollection.insertOne(ingredientData);
        console.log('   ✅ Inserted ingredient categories');

        // --- Create Indexes ---
        console.log('\n📇 Creating indexes...');
        await mealsCollection.createIndex({ week: 1, day: 1 });
        await workoutsCollection.createIndex({ week: 1, day: 1 });
        await db.collection('progress').createIndex({ userId: 1 }, { unique: true });
        console.log('   ✅ Indexes created');

        console.log('\n🎉 Database seeded successfully!');
        console.log(`   📊 ${mealDocs.length} meal days`);
        console.log(`   💪 ${workoutDocs.length} workout days`);
        console.log(`   🥬 1 ingredient document`);

    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        process.exit(1);
    } finally {
        await client.close();
        console.log('\n🔌 Connection closed.');
    }
}

seed();