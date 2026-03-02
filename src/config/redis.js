const redis = require('redis');
require('dotenv').config();

const client = redis.createClient({ url: process.env.REDIS_URL });

client.on('error', (err) => console.error('Redis error:', err));
client.connect();

module.exports = client;