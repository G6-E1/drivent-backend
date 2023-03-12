import { redis } from "@/server";
import dotenv from "dotenv";

dotenv.config();

export async function connectRedis(): Promise<void> {
  try {
    await redis.connect();
    if (await redis.ping() === "PONG") {
      /* eslint-disable-next-line no-console */
      console.log("Redis running in URL: ", process.env.REDIS_URL);
    }
  } catch (error) {
    /* eslint-disable-next-line no-console */
    console.error("Error connecting to Redis: ", error);
  }
}
