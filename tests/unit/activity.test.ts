import { init } from "@/app";
import { prisma } from "@/config";
import dayjs from "dayjs";
import { cleanDb, generateValidToken } from "../helpers";
import activitiesService from "@/services/activities-service";
import activitiesEnrollementsService from "@/services/activities-enrollment-service";

beforeAll(async () => {
  await init();
  await cleanDb();
});

describe("Activities unit tests", () => {
  beforeEach(async () => {
    await cleanDb();
  });
  it("Should respond with the activities with enrollmentActivity data ", async () => {
    await prisma.user.create({
      data: {
        email: "user@gmail.com",
        password: "1234567",
      },
    });
    const user = await prisma.user.findFirst({});

    await prisma.local.create({
      data: { name: "Auditório Principal", maxCapacity: 100 },
    });

    const locals = await prisma.local.findFirst({});
    const startAt = dayjs().month(2).date(20).day(3).hour(9).minute(0).second(0).millisecond(0).toDate();
    const finishAt = dayjs().month(2).date(20).day(3).hour(10).minute(0).second(0).millisecond(0).toDate();
    await prisma.activity.create({
      data: {
        name: "React - uma nova forma de desenvolver pra web",
        localId: locals.id,
        vacancies: locals.maxCapacity,
        startAt: startAt,
        finishAt: finishAt,
      },
    });
    const activities = await prisma.activity.findFirst({});

    await prisma.enrollmentActivity.create({
      data: {
        activityId: activities.id,
        userId: user.id,
      },
    });
    const enrollmentActivity = await prisma.enrollmentActivity.findFirst({});

    const filteredActivity = await activitiesService.getActivities(startAt.toString(), locals.id);

    expect(filteredActivity).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: activities.id,
          name: activities.name,
          vacancies: activities.vacancies,
          startAt: startAt,
          finishAt: finishAt,
          localId: locals.id,
          EnrollmentActivity: [
            {
              id: enrollmentActivity.id,
              userId: user.id,
            },
          ],
        }),
      ]),
    );
  });

  it("Should respond with all activities dates", async () => {
    await prisma.local.create({
      data: { name: "Auditório Principal", maxCapacity: 100 },
    });

    const locals = await prisma.local.findFirst({});
    await prisma.activity.createMany({
      data: [
        {
          name: "Segunda atividade",
          localId: locals.id,
          vacancies: locals.maxCapacity,
          startAt: dayjs().month(2).date(20).day(3).hour(9).minute(0).second(0).millisecond(0).toDate(),
          finishAt: dayjs().month(2).date(20).day(3).hour(10).minute(0).second(0).millisecond(0).toDate(),
        },
        {
          name: "Primeira atividade",
          localId: locals.id,
          vacancies: locals.maxCapacity,
          startAt: dayjs().month(2).date(20).day(3).hour(11).minute(0).second(0).millisecond(0).toDate(),
          finishAt: dayjs().month(2).date(20).day(3).hour(12).minute(0).second(0).millisecond(0).toDate(),
        },
      ],
    });

    const activitiesDates = await activitiesService.getDatesActivities();
    expect(activitiesDates).toEqual(
      expect.arrayContaining([
        {
          startAt: dayjs().month(2).date(20).day(3).hour(9).minute(0).second(0).millisecond(0).toDate(),
        },
        {
          startAt: dayjs().month(2).date(20).day(3).hour(11).minute(0).second(0).millisecond(0).toDate(),
        },
      ]),
    );
  });
});

describe("Enrollment Activities unit tests", () => {
  beforeEach(async () => {
    await cleanDb();
  });

  it("Should insert a new enrollment activities in database", async () => {
    await prisma.user.create({
      data: {
        email: "user@gmail.com",
        password: "1234567",
      },
    });
    const user = await prisma.user.findFirst({});

    await prisma.local.create({
      data: { name: "Auditório Principal", maxCapacity: 100 },
    });

    const locals = await prisma.local.findFirst({});
    await prisma.activity.createMany({
      data: [
        {
          name: "Segunda atividade",
          localId: locals.id,
          vacancies: locals.maxCapacity,
          startAt: dayjs().month(2).date(20).day(3).hour(9).minute(0).second(0).millisecond(0).toDate(),
          finishAt: dayjs().month(2).date(20).day(3).hour(10).minute(0).second(0).millisecond(0).toDate(),
        },
        {
          name: "Primeira atividade",
          localId: locals.id,
          vacancies: locals.maxCapacity,
          startAt: dayjs().month(2).date(20).day(3).hour(11).minute(0).second(0).millisecond(0).toDate(),
          finishAt: dayjs().month(2).date(20).day(3).hour(12).minute(0).second(0).millisecond(0).toDate(),
        },
      ],
    });
    const activities = await prisma.activity.findFirst({});
    await activitiesEnrollementsService.postActivityEnrollment(user.id, activities.id);

    const enrollmentActivity = await prisma.enrollmentActivity.findFirst({});
    delete enrollmentActivity.createdAt;
    delete enrollmentActivity.updatedAt;
    expect(enrollmentActivity).toEqual({
      id: enrollmentActivity.id,
      activityId: activities.id,
      userId: user.id,
    });
  });

  it("Should delete a enrollment activities in database", async () => {
    await prisma.user.create({
      data: {
        email: "user@gmail.com",
        password: "1234567",
      },
    });
    const user = await prisma.user.findFirst({});

    await prisma.local.create({
      data: { name: "Auditório Principal", maxCapacity: 100 },
    });

    const locals = await prisma.local.findFirst({});
    await prisma.activity.createMany({
      data: [
        {
          name: "Segunda atividade",
          localId: locals.id,
          vacancies: locals.maxCapacity,
          startAt: dayjs().month(2).date(20).day(3).hour(9).minute(0).second(0).millisecond(0).toDate(),
          finishAt: dayjs().month(2).date(20).day(3).hour(10).minute(0).second(0).millisecond(0).toDate(),
        },
        {
          name: "Primeira atividade",
          localId: locals.id,
          vacancies: locals.maxCapacity,
          startAt: dayjs().month(2).date(20).day(3).hour(11).minute(0).second(0).millisecond(0).toDate(),
          finishAt: dayjs().month(2).date(20).day(3).hour(12).minute(0).second(0).millisecond(0).toDate(),
        },
      ],
    });
    const activities = await prisma.activity.findFirst({});
    await prisma.enrollmentActivity.create({
      data: {
        userId: user.id,
        activityId: activities.id,
      },
    });

    await activitiesEnrollementsService.deleteActivityEnrollment(user.id, activities.id);
    const result = await prisma.enrollmentActivity.findFirst({});
    expect(result).toEqual(null);
  });
});
