import { conflictError, notFoundError, requestError, unauthorizedError } from "@/errors";
import activitiesEnrollmentsRepository from "@/repositories/activities-enrollments-repository";
import activitiesRepository from "@/repositories/activities-repository";

async function validateActivityId(activityId: number) {
  const activity = await activitiesRepository.findActivityById(activityId);

  if (!activity) {
    throw notFoundError();
  }

  return activity;
}

async function postActivityEnrollment(userId: number, activityId: number) {
  const repeatedEnrollment = await activitiesEnrollmentsRepository.findActivityEnrollmentById(userId, activityId);

  if (repeatedEnrollment) {
    throw conflictError("The user is already enrolled in this activity");
  }

  const activity = await validateActivityId(activityId);

  const userEnrollments = await activitiesEnrollmentsRepository.findUserEnrollments(userId);

  userEnrollments.map((enrollment) => {
    if (
      (activity.startAt >= enrollment.Activity.startAt && activity.finishAt <= enrollment.Activity.finishAt) ||
      (activity.startAt <= enrollment.Activity.startAt && activity.finishAt >= enrollment.Activity.finishAt) ||
      (activity.finishAt > enrollment.Activity.startAt && activity.finishAt <= enrollment.Activity.finishAt) ||
      (activity.startAt >= enrollment.Activity.startAt && activity.startAt < enrollment.Activity.finishAt)
    ) {
      throw conflictError("Conflicting times");
    }
  });

  const enrollment = await activitiesEnrollmentsRepository.createActivityEnrollment(userId, activityId);

  return enrollment;
}

async function deleteActivityEnrollment(userId: number, activityId: number) {
  if (isNaN(activityId) || !Number.isInteger(activityId)) {
    throw requestError(400, "Invalid params");
  }

  await validateActivityId(activityId);

  const enrollment = await activitiesEnrollmentsRepository.findActivityEnrollmentById(userId, activityId);

  if (!enrollment) {
    throw notFoundError();
  }

  return activitiesEnrollmentsRepository.deleteActivityEnrollment(enrollment.id);
}

const activitiesEnrollementsService = {
  postActivityEnrollment,
  deleteActivityEnrollment,
};

export default activitiesEnrollementsService;
