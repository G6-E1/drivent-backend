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

function deleteActivityEnrollment(id: number) {
  return prisma.enrollmentActivity.delete({
    where: {
      id,
    },
  });
}

const activitiesEnrollmentsRepository = {
  findActivityEnrollmentById,
  createActivityEnrollment,
  deleteActivityEnrollment,
};

export default activitiesEnrollmentsRepository;
