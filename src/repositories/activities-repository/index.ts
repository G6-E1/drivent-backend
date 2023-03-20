import { prisma } from "@/config";

async function findActivitiesByDate(startDate: string, localIdStr: string) {
  const localId = parseInt(localIdStr);
  return prisma.activity.findMany({
    where: {
      localId,
      AND: {
        startAt: {
          gte: new Date(startDate),
          lt: new Date(new Date(startDate).getTime() + 24 * 60 * 60 * 1000)
        }
      }
    },
    select: {
      id: true,
      name: true,
      vacancies: true,
      startAt: true,
      finishAt: true,
      localId: true,
      EnrollmentActivity: {
        select: {
          id: true,
          userId: true,
        }
      }
    },
  });
}

async function findDatesActivities() {
  return prisma.activity.findMany({
    select: {
      startAt: true,
    },
  });
}

function findActivityById(activityId: number) {
  return prisma.activity.findUnique({
    where: {
      id: activityId,
    },
  });
}

const activitiesRepository = {
  findDatesActivities,
  findActivityById,
  findActivitiesByDate,
};

export default activitiesRepository;
