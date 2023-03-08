import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
const prisma = new PrismaClient();

import { TicketType } from "@prisma/client";

async function main() {
  await prisma.event.deleteMany({});
  await prisma.ticketType.deleteMany({});
  await prisma.hotel.deleteMany({});
  await prisma.room.deleteMany({});

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
    data: [
      {
        name: "Single and Double",
        capacity: 103,
        hotelId: hotels[0].id,
      },
      {
        name: "Single, Double and Triple",
        capacity: 25,
        hotelId: hotels[1].id,
      },
      {
        name: "Single and Double",
        capacity: 2,
        hotelId: hotels[2].id,
      },
    ],
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
