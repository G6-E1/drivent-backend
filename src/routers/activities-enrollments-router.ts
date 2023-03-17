import { deleteActivityEnrollment, postActivityEnrollment } from "@/controllers/activities-enrollments-controller";
import { authenticateToken, validateBody } from "@/middlewares";
import { createActivityEnrollmentSchema } from "@/schemas/activities-enrollments-schemas";
import { Router } from "express";

const activitiesEnrollmentsRouter = Router();

activitiesEnrollmentsRouter
  .all("/*", authenticateToken)
  .post("/", validateBody(createActivityEnrollmentSchema), postActivityEnrollment)
  .delete("/:activityId", deleteActivityEnrollment);

export { activitiesEnrollmentsRouter };
