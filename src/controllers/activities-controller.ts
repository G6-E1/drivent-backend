import { AuthenticatedRequest } from "@/middlewares";
import activitiesService from "@/services/activities-service";
import { Response } from "express";
import httpStatus from "http-status";
import { string } from "joi";

export async function getActivities(req: AuthenticatedRequest, res: Response) {
  const { date, localId } = req.params;
  try {
    const activities = await activitiesService.getActivities(date, localId);
    return res.status(httpStatus.OK).send(activities);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND);
  }
}

export async function getDatesActivities(req: AuthenticatedRequest, res: Response) {

  try {
    const datesActivities = await activitiesService.getDatesActivities();
    return res.status(httpStatus.OK).send(datesActivities); 
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND)
  }
}