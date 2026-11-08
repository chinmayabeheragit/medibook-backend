import { redis } from "../config/redis.js";
import logger from "./logger.js";

const DEFAULT_TTL = 300; // 5 minutes

const cache = {
    async get(key) {
        if (!redis) return null;
        try {
            const data = await redis.get(key);
            return data ? JSON.parse(data) : null;
        } catch (err) {
            logger.error({ err, key }, "Cache GET failed");
            return null;
        }
    },

    async set(key, value, ttl = DEFAULT_TTL) {
        if (!redis) return;
        try {
            await redis.set(key, JSON.stringify(value), "EX", ttl);
        } catch (err) {
            logger.error({ err, key }, "Cache SET failed");
        }
    },

    async del(...keys) {
        if (!redis) return;
        try {
            await redis.del(...keys);
        } catch (err) {
            logger.error({ err, keys }, "Cache DEL failed");
        }
    },
};

export default cache;