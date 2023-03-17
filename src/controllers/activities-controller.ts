import { AuthenticatedRequest } from "@/middlewares";
import activitiesService from "@/services/activities-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getDatesActivities(req: AuthenticatedRequest, res: Response) {

  try {
    const datesActivities = await activitiesService.getDatesActivities();
    return res.status(httpStatus.OK).send(datesActivities); 
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND)
  }
}