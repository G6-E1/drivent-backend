import { AuthenticatedRequest } from "@/middlewares";
import { PostActivityEnrollment } from "@/protocols";
import activitiesEnrollementsService from "@/services/activities-enrollment-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function postActivityEnrollment(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { activityId } = req.body as PostActivityEnrollment;

  try {
    const enrollment = await activitiesEnrollementsService.postActivityEnrollment(userId, activityId);
    return res.status(httpStatus.OK).send(enrollment);
  } catch (err) {
    if (err.name === "NotFoundError") return res.status(httpStatus.NOT_FOUND);
    if (err.name === "ConflictError") return res.status(httpStatus.CONFLICT);
  }
}
