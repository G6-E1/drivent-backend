import "reflect-metadata";
import "express-async-errors";
import express, { Express } from "express";
import cors from "cors";

import { loadEnv, connectDb, disconnectDB } from "@/config";

loadEnv();

import { handleApplicationErrors } from "@/middlewares";
import {
  usersRouter,
  authenticationRouter,
  eventsRouter,
  enrollmentsRouter,
  ticketsRouter,
  paymentsRouter,
  hotelsRouter,
  bookingRouter,
  localsRouter,
} from "@/routers";

import { connectRedis } from "./config/redis";
import { activitiesRouter } from "./routers/activities-router";
import { activitiesEnrollmentsRouter } from "./routers/activities-enrollments-router";

const app = express();
app
  .use(cors())
  .use(express.json())
  .get("/health", (_req, res) => res.send("OK!"))
  .use("/users", usersRouter)
  .use("/auth", authenticationRouter)
  .use("/event", eventsRouter)
  .use("/enrollments", enrollmentsRouter)
  .use("/tickets", ticketsRouter)
  .use("/payments", paymentsRouter)
  .use("/hotels", hotelsRouter)
  .use("/booking", bookingRouter)
  .use("/activities", activitiesRouter)
  .use("/activities-enrollments", activitiesEnrollmentsRouter)
  .use("/locals", localsRouter)
  .use(handleApplicationErrors);

export function init(): Promise<Express> {
  connectDb();
  // connectRedis();
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  await disconnectDB();
}

export default app;
