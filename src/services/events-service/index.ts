import { redis } from "@/config";
import { notFoundError } from "@/errors";
import eventRepository from "@/repositories/event-repository";
import { exclude } from "@/utils/prisma-utils";
import { Event } from "@prisma/client";
import dayjs from "dayjs";
import { env } from "process";

async function getFirstEvent(): Promise<GetFirstEventResult> {
  let event = await eventRepository.findCached();
  if(!event) {
    event = await eventRepository.findFirst();
  }
  if (!event) throw notFoundError();
  console.log(event);
  await redis.set("event", JSON.stringify(event));

  return exclude(event, "createdAt", "updatedAt");
}

export type GetFirstEventResult = Omit<Event, "createdAt" | "updatedAt">;

async function isCurrentEventActive(): Promise<boolean> {
  let event = await eventRepository.findCached();
  if (!event) {
    event = await eventRepository.findFirst();
    if (!event) return false;
    await redis.set("event", JSON.stringify(event));
  }
   
  const now = dayjs();
  const eventStartsAt = dayjs(event.startsAt);
  const eventEndsAt = dayjs(event.endsAt);

  return now.isAfter(eventStartsAt) && now.isBefore(eventEndsAt);
}

const eventsService = {
  getFirstEvent,
  isCurrentEventActive,
};

export default eventsService;
