import { PostActivityEnrollment } from "@/protocols";
import Joi from "joi";

export const createActivityEnrollmentSchema = Joi.object<PostActivityEnrollment>({
  activityId: Joi.number().positive().integer().required(),
});
