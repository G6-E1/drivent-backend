import { prisma } from "@/config";

function findActivityEnrollmentById(userId: number, activityId: number) {
  return prisma.enrollmentActivity.findFirst({
    where: {
      userId,
      activityId,
    },
  });
}

function findUserEnrollments(userId: number) {
  return prisma.enrollmentActivity.findMany({
    where: {
      userId,
    },
    select: {
      Activity: true,
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
  findUserEnrollments,
  createActivityEnrollment,
  deleteActivityEnrollment,
};

export default activitiesEnrollmentsRepository;
