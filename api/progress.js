const { getCollection } = require('./lib/mongodb');

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const collection = await getCollection('progress');

    try {
        if (req.method === 'GET') {
            const { userId } = req.query;
            if (!userId) {
                return res.status(400).json({ error: 'userId is required' });
            }

            const progress = await collection.findOne({ userId });
            if (!progress) {
                // Return default progress for new users
                return res.status(200).json({
                    userId,
                    mealsCompleted: [],
                    workoutsCompleted: [],
                    shoppingChecked: {},
                    startDate: new Date().toISOString(),
                    createdAt: new Date().toISOString()
                });
            }

            return res.status(200).json(progress);
        }

        if (req.method === 'POST' || req.method === 'PUT') {
            const { userId, mealsCompleted, workoutsCompleted, shoppingChecked } = req.body;

            if (!userId) {
                return res.status(400).json({ error: 'userId is required' });
            }

            const update = {
                $set: {
                    userId,
                    mealsCompleted: mealsCompleted || [],
                    workoutsCompleted: workoutsCompleted || [],
                    shoppingChecked: shoppingChecked || {},
                    updatedAt: new Date().toISOString()
                },
                $setOnInsert: {
                    startDate: new Date().toISOString(),
                    createdAt: new Date().toISOString()
                }
            };

            const result = await collection.updateOne(
                { userId },
                update,
                { upsert: true }
            );

            return res.status(200).json({ success: true, modified: result.modifiedCount, upserted: result.upsertedCount });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Progress API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};