import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import dayjs from "dayjs";
import { TicketType, Hotel, Room, Booking, Local, EnrollmentActivity, Activity } from "@prisma/client";
export type ShortRoom = Omit<Room, "id" | "createdAt" | "updatedAt">;
export type ShortBooking = Omit<Booking, "id" | "createdAt" | "updatedAt">;
export type ShortLocal = Omit<Local, "id" | "createdAt" | "updatedAt">;
export type ShortActivity = Omit<Activity, "id" | "createdAt" | "updatedAt">;

async function main() {
  await prisma.event.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.ticket.deleteMany({});
  await prisma.ticketType.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.room.deleteMany({});
  await prisma.hotel.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.user.deleteMany({});

  const user = await prisma.user.create({
    data: {
      email: "email@email.com",
      password: "password",
    },
  });

  const event = await prisma.event.create({
    data: {
      title: "Driven.t",
      logoImageUrl: "https://files.driveneducation.com.br/images/logo-rounded.png",
      backgroundImageUrl: "linear-gradient(to right, #FA4098, #FFD77F)",
      startsAt: dayjs().toDate(),
      endsAt: dayjs().add(21, "days").toDate(),
    },
  });

  await prisma.ticketType.createMany({
    data: [
      {
        name: "Remoto",
        price: 100,
        isRemote: true,
        includesHotel: false,
      },
      {
        name: "Presencial sem Hotel",
        price: 250,
        isRemote: false,
        includesHotel: false,
      },
      {
        name: "Presencial com Hotel",
        price: 600,
        isRemote: false,
        includesHotel: true,
      },
    ],
  });

  await prisma.hotel.createMany({
    data: [
      {
        image: "https://pix10.agoda.net/hotelImages/124/1246280/1246280_16061017110043391702.jpg?ca=6&ce=1&s=1024x768",
        name: "Driven Resort",
      },
      {
        name: "Driven Palace",
        image: "https://pix10.agoda.net/hotelImages/124/1246280/1246280_16061017110043391702.jpg?ca=6&ce=1&s=1024x768",
      },
      {
        name: "Driven World",
        image:
          "https://cdn.loewshotels.com/loewshotels.com-2466770763/cms/cache/v2/620d6d91270c8.jpg/1920x1080/fit/80/eb7551cd93224863612f7472c55d933f.jpg",
      },
    ],
  });

  const hotels = await prisma.hotel.findMany({});
  await prisma.room.createMany({
    data: createRooms(hotels),
  });

  const rooms = await prisma.room.findMany({});
  await prisma.booking.createMany({
    data: createBooking(user.id, rooms),
  });

  await prisma.local.createMany({
    data: createLocals(),
  });

  const locals = await prisma.local.findMany({});
  await prisma.activity.createMany({
    data: createActivities(locals),
  });

  console.log({ event });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

function createRooms(hotels: Hotel[]): ShortRoom[] {
  const rooms: ShortRoom[] = [];
  let num: number;
  for (let i = 0; i < hotels.length; i++) {
    if (i % 2 === 0) {
      num = 2;
    } else {
      num = 3;
    }

    for (let j = 101; j <= 116; j++) {
      rooms.push({ name: `${j}`, capacity: getRandom(num), hotelId: hotels[i].id });
    }
  }

  return rooms;
}

function getRandom(num: number): number {
  return Math.floor(Math.random() * num + 1);
}

function createBooking(userId: number, rooms: Room[]): ShortBooking[] {
  const booking: ShortBooking[] = [];
  for (let i = 0; i < rooms.length; i++) {
    if (i <= 15) {
      if (rooms[i].capacity === 2 && booking.length === 0) {
        for (let j = 0; j < 1; j++) {
          booking.push({ userId: userId, roomId: rooms[i].id });
        }
      }
      if (rooms[i].capacity === 1 && booking.length === 1) {
        booking.push({ userId: userId, roomId: rooms[i].id });
      }
    } else if (i <= 31) {
      if (rooms[i].capacity === 3 && booking.length === 2) {
        for (let j = 0; j < 2; j++) {
          booking.push({ userId: userId, roomId: rooms[i].id });
        }
      }
      if (rooms[i].capacity === 1 && booking.length === 4) {
        booking.push({ userId: userId, roomId: rooms[i].id });
      }
    } else {
      if (rooms[i].capacity === 2 && booking.length === 5) {
        for (let j = 0; j < 1; j++) {
          booking.push({ userId: userId, roomId: rooms[i].id });
        }
      }
      if (rooms[i].capacity === 1 && booking.length === 6) {
        booking.push({ userId: userId, roomId: rooms[i].id });
      }
    }
  }

  return booking;
}

export function createLocals(): ShortLocal[] {
  const locals: ShortLocal[] = [];
  locals.push(
    { name: "Auditório Principal", maxCapacity: 200 },
    { name: "Auditório lateral", maxCapacity: 120 },
    { name: "Sala de Workshop", maxCapacity: 80 },
  );

  return locals;
}

export function createActivities(locals: Local[]): ShortActivity[] {
  const activities: ShortActivity[] = [];

  activities.push(
    {
      name: "React - uma nova forma de desenvolver pra web",
      localId: locals[0].id,
      vacancies: locals[0].maxCapacity,
      startAt: dayjs().month(2).date(20).day(3).hour(9).minute(0).second(0).millisecond(0).toDate(),
      finishAt: dayjs().month(2).date(20).day(3).hour(10).minute(0).second(0).millisecond(0).toDate(),
    },
    {
      name: "Prisma - O ORM do futuro",
      localId: locals[0].id,
      vacancies: locals[0].maxCapacity,
      startAt: dayjs().month(2).date(20).day(3).hour(10).minute(0).second(0).millisecond(0).toDate(),
      finishAt: dayjs().month(2).date(20).day(3).hour(11).minute(0).second(0).millisecond(0).toDate(),
    },
    {
      name: "ChatGPT - A revolução das máquinas começou",
      localId: locals[1].id,
      vacancies: locals[1].maxCapacity,
      startAt: dayjs().month(2).date(20).day(3).hour(9).minute(0).second(0).millisecond(0).toDate(),
      finishAt: dayjs().month(2).date(20).day(3).hour(12).minute(0).second(0).millisecond(0).toDate(),
    },
    {
      name: "Curso de Manutenção de computadores",
      localId: locals[2].id,
      vacancies: locals[2].maxCapacity,
      startAt: dayjs().month(2).date(21).day(4).hour(9).minute(0).second(0).millisecond(0).toDate(),
      finishAt: dayjs().month(2).date(21).day(4).hour(12).minute(0).second(0).millisecond(0).toDate(),
    },
    {
      name: "Workshop de inglês técnico para programadores",
      localId: locals[2].id,
      vacancies: locals[2].maxCapacity,
      startAt: dayjs().month(2).date(22).day(5).hour(9).minute(0).second(0).millisecond(0).toDate(),
      finishAt: dayjs().month(2).date(22).day(5).hour(12).minute(0).second(0).millisecond(0).toDate(),
    },
  );

  return activities;
}
