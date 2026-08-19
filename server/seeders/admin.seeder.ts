
import { prisma } from "../utils/prisma";
import { hash } from "bcryptjs";
import { config } from "dotenv";

config();

async function seedAdmin() {
  try {
    const existingAdmin = await prisma.account.findFirst({
      where: {
        role: 0,
      },
    });

    if (!existingAdmin) {
      const email = process.env.ADMIN_EMAIL ?? "admin@example.com";
      const rawPassword = process.env.ADMIN_PASSWORD ?? "admin123456";
      const hashedPassword = await hash(rawPassword, 10);

      await prisma.account.create({
        data: {
          email,
          password: hashedPassword,
          name: process.env.ADMIN_NAME ?? "Admin",
          role: 0,
          isEmailVerified: true,
        },
      });
      console.log(`Admin account seeded successfully: ${email}`);
    } else {
      console.log("Admin account already exists.");
    }
  } catch (error) {
    console.error("Error seeding admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();



