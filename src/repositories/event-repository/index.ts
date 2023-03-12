import { prisma, redis } from "@/config";
import { Event } from "@prisma/client";

async function findFirst() {
  return await prisma.event.findFirst();
}

async function findCached(): Promise<Event> {
  const event = await redis.get("event");
  return  JSON.parse(event);
}

const eventRepository = {
  findFirst,
  findCached
};

export default eventRepository;
