import { notFoundError } from "@/errors";
import activitiesRepository from "@/repositories/activities-repository";

async function getActivities(date: string, localId: number) {
  const activities = await activitiesRepository.findActivitiesByDate(date, localId);
  return activities;
}

async function getDatesActivities() {
  const datesActivities = await activitiesRepository.findDatesActivities();

  return datesActivities;
}

const activitiesService = {
  getDatesActivities,
  getActivities,
};

export default activitiesService;
