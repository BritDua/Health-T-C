const { getCollection } = require('./lib/mongodb');

module.exports = async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const collection = await getCollection('meals');
        const { week } = req.query;

        let query = {};
        if (week) {
            query = { week: parseInt(week) };
        }

        const meals = await collection.find(query).sort({ week: 1, day: 1 }).toArray();

        if (meals.length === 0) {
            // Fallback: return data from static JSON if DB is empty
            return res.status(200).json({ source: 'static', message: 'No data in DB yet. Run seed script.' });
        }

        return res.status(200).json({ source: 'database', data: meals });
    } catch (error) {
        console.error('Meals API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};