import Redis from "ioredis";
import logger from "../utils/logger.js";

let redis = null;

const connectRedis = async () => {
    try {
        redis = new Redis({
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT),
            password: process.env.REDIS_PASSWORD,
            // No tls option — Redis Cloud free tier on this port is non-TLS
            maxRetriesPerRequest: 3,
            retryStrategy: (times) => {
                if (times > 5) {
                    logger.error("Redis: max retries reached, giving up");
                    return null;
                }
                return Math.min(times * 200, 2000);
            },
            lazyConnect: true,
        });

        redis.on("connect", () => logger.info("Redis connected"));
        redis.on("error", (err) => logger.error({ err }, "Redis error"));
        redis.on("close", () => logger.warn("Redis connection closed"));

        await redis.connect();
    } catch (err) {
        logger.error({ err }, "Redis initial connection failed — caching disabled");
        redis = null;
    }
};

export { redis, connectRedis };