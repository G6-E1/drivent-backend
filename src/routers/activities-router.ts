import { getDatesActivities, getActivities } from "@/controllers/activities-controller";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const activitiesRouter = Router();

activitiesRouter.all("/*", authenticateToken).get("/dates", getDatesActivities).get("/:localId/:date", getActivities);

export { activitiesRouter };
