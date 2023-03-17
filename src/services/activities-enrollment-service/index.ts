import { conflictError, notFoundError } from "@/errors";
import activitiesEnrollmentsRepository from "@/repositories/activities-enrollments-repository";
import activitiesRepository from "@/repositories/activities-repository";

async function postActivityEnrollment(userId: number, activityId: number) {
  const repeatedEnrollment = await activitiesEnrollmentsRepository.findActivityEnrollmentById(userId, activityId);

  if (repeatedEnrollment) {
    throw conflictError("The user is already enrolled in this activity");
  }

  const activity = await activitiesRepository.findActivityById(activityId);

  if (!activity) {
    throw notFoundError();
  }

  const enrollment = await activitiesEnrollmentsRepository.createActivityEnrollment(userId, activityId);

  return enrollment;
}

const activitiesEnrollementsService = {
  postActivityEnrollment,
};

export default activitiesEnrollementsService;
