import { prisma } from "@/config";

async function findDatesActivities() {
  return prisma.activity.findMany({
    select:{
        startAt: true
    }
  });
};

const activitiesRepository = {
    findDatesActivities
};

export default activitiesRepository;