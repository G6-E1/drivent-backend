import { prisma } from "@/config";

function findActivityEnrollmentById(userId: number, activityId: number) {
  return prisma.enrollmentActivity.findFirst({
    where: {
      userId,
      activityId,
    },
  });
}

function createActivityEnrollment(userId: number, activityId: number) {
  return prisma.enrollmentActivity.create({
    data: {
      userId,
      activityId,
    },
  });
}

const activitiesEnrollmentsRepository = {
  findActivityEnrollmentById,
  createActivityEnrollment,
};

export default activitiesEnrollmentsRepository;
