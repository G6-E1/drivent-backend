import { prisma } from "@/config";

async function findLocals() {
  return prisma.local.findMany({
    select: {
        id: true,
        maxCapacity: true,
        name: true,
    },
  });
}

const localsRepository = {
    findLocals,
  };
  
  export default localsRepository;
  