import { createClient } from "redis";
import dotenv from "dotenv";
import eventRepository from "@/repositories/event-repository";

dotenv.config();

export const redis = createClient({
    url: process.env.REDIS_URL
});

export async function connectRedis(): Promise<void> {
    try {
        await redis.connect();
        if (await redis.ping() === "PONG") {
            /* eslint-disable-next-line no-console */
            console.log("Redis running in URL: ", process.env.REDIS_URL);
        };
        const event = await eventRepository.findFirst();
        redis.set("event", JSON.stringify(event));
    } catch (error) {
        console.error('Error connecting to Redis:', error);
    }
}
