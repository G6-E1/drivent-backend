import { notFoundError } from "@/errors";
import activitiesRepository from "@/repositories/activities-repository";

async function getDatesActivities() {
  const datesActivities = await activitiesRepository.findDatesActivities();
  
  if (!datesActivities) {
    throw notFoundError();
  };
  
  return datesActivities;
};

const activitiesService = {
  getDatesActivities
};

export default activitiesService;