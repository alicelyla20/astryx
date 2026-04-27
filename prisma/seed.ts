import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

async function main() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log("Cleaning database...");
  
  // Order matters due to foreign keys
  await prisma.templateItem.deleteMany({});
  await prisma.missionTemplate.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.chainEvent.deleteMany({});
  await prisma.chain.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.dailyLog.deleteMany({});
  await prisma.journalEntry.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Database cleaned.");

  const hashedPassword = await bcrypt.hash("purpleblack.666", 12);

  const user = await prisma.user.create({
    data: {
      username: "alice",
      password: hashedPassword,
    },
  });

  console.log("Seed completed. User created:", user.username);
  
  await prisma.$disconnect();
  await pool.end();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
