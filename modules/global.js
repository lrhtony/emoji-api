const cache = require('memory-cache');
const redis = require('redis');
// const { REDIS_URL } = require('../config.json');
const REDIS_URL = process.env.REDIS_URL;

const redis_client = redis.createClient({url: REDIS_URL});
redis_client.on('error', (err) => console.log('Redis Client Error', err));
const r = redis_client.connect()

module.exports = {
    cache,
    r,
    redis_client
}