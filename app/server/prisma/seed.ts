import { prisma } from "../lib/prisma";


const chatrooms = [
  { name: "General Chat" },
  { name: "Sports Talk" },
  { name: "Tech News" },
  { name: "Gaming Room" },
  { name: "Music Lounge" },
];

async function main() {
  for (const room of chatrooms) {
    await prisma.chatroom.create({
      data: {
        name: room.name,
        userCount: 0,
      },
    });
  }

  console.log("Seeded chatrooms!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
