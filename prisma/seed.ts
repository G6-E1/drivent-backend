import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
const prisma = new PrismaClient();
import { TicketType, Hotel, Room, Booking } from "@prisma/client";
type ShortRoom = Omit<Room, "id" | "createdAt" | "updatedAt">;
type ShortBooking = Omit<Booking, "id" | "createdAt" | "updatedAt">;

async function main() {
  await prisma.event.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.ticketType.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.hotel.deleteMany({});
  await prisma.room.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.ticket.deleteMany({});


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
        image: "https://media-cdn.tripadvisor.com/media/photo-s/16/1a/ea/54/hotel-presidente-4s.jpg",
        name: "Driven Resort",
      },
      {
        name: "Driven Palace",
        image: "https://pix10.agoda.net/hotelImages/124/1246280/1246280_16061017110043391702.jpg?ca=6&ce=1&s=1024x768",
      },
      {
        name: "Driven World",
        image: "https://cdn.loewshotels.com/loewshotels.com-2466770763/cms/cache/v2/620d6d91270c8.jpg/1920x1080/fit/80/eb7551cd93224863612f7472c55d933f.jpg",
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
        for (let j = 0; j < 2; j++) {
          booking.push({ userId: userId, roomId: rooms[i].id });
        }
      }
      if (rooms[i].capacity === 1 && booking.length === 2) {
        booking.push({ userId: userId, roomId: rooms[i].id });
      }
    } else if (i <= 31) {
      if (rooms[i].capacity === 3 && booking.length === 3) {
        for (let j = 0; j < 3; j++) {
          booking.push({ userId: userId, roomId: rooms[i].id });
        }
      }
      if (rooms[i].capacity === 1 && booking.length === 6) {
        booking.push({ userId: userId, roomId: rooms[i].id });
      }
    } else {
      if (rooms[i].capacity === 2 && booking.length === 7) {
        for (let j = 0; j < 2; j++) {
          booking.push({ userId: userId, roomId: rooms[i].id });
        }
      }
      if (rooms[i].capacity === 1 && booking.length === 9) {
        booking.push({ userId: userId, roomId: rooms[i].id });
      }
    }
  }

  return booking;
}
