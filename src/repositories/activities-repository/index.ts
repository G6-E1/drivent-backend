import { prisma } from "@/config";

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
};

export default activitiesRepository;
