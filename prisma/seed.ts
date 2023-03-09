import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
const prisma = new PrismaClient();
import { TicketType, Hotel } from "@prisma/client";
import { Room } from "../src/protocols";

async function main() {
  await prisma.event.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.ticket.deleteMany({});
  await prisma.ticketType.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.room.deleteMany({});
  await prisma.hotel.deleteMany({});

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
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1w70-bSiiCCdYVEJA4MtEjPgsbNLCl-sLeQ&usqp=CAU",
        name: "Driven Resort",
      },
      {
        name: "Driven Palace",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1w70-bSiiCCdYVEJA4MtEjPgsbNLCl-sLeQ&usqp=CAU",
      },
      {
        name: "Driven World",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1w70-bSiiCCdYVEJA4MtEjPgsbNLCl-sLeQ&usqp=CAU",
      },
    ],
  });

  const hotels = await prisma.hotel.findMany({});
  await prisma.room.createMany({
    data: createRooms(hotels),
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

function createRooms(hotels: Hotel[]): Room[] {
  const rooms: Room[] = [];

  for (let j = 0; j < hotels.length; j++) {
    for (let i = 101; i <= 116; i++) {
      rooms.push({ name: `${i}`, capacity: getRandom(), hotelId: hotels[j].id });
    }
  }

  return rooms;
}

function getRandom() {
  return Math.floor(Math.random() * 3 + 1);
}
