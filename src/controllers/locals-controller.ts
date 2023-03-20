import { AuthenticatedRequest } from "@/middlewares";
import activitiesService from "@/services/activities-service";
import localsService from "@/services/locals-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getLocals(req: AuthenticatedRequest, res: Response) {
    try {
      const locals = await localsService.getLocals();
      return res.status(httpStatus.OK).send(locals);
    } catch (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR);
    }
  }