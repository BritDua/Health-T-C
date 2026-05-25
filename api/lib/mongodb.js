const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || 'ghana_health';

if (!MONGODB_URI) {
    throw new Error('Please define MONGODB_URI environment variable in Vercel');
}

let cached = global._mongoClientPromise;

if (!cached) {
    const client = new MongoClient(MONGODB_URI);
    cached = global._mongoClientPromise = client.connect();
}

async function getDb() {
    const client = await cached;
    return client.db(DB_NAME);
}

async function getCollection(name) {
    const db = await getDb();
    return db.collection(name);
}

module.exports = { getDb, getCollection };