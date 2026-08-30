import bcrypt from "bcryptjs";
import promptSync from "prompt-sync";
import prisma from "./lib/prisma.js";

const prompt = promptSync();

const username = prompt("Admin username: ");
const email = prompt("Admin email: ");
const password = prompt.hide("Admin password: ");

try {
  const existingAdmin = await prisma.user.findFirst({
    where: {
      role: "ADMIN",
    },
  });

  if (existingAdmin) {
    console.log("An admin already exists.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.user.create({
    data: {
      username,
      email,
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log(`Admin "${admin.username}" created successfully.`);
} catch (error) {
  console.error("Failed to create admin:", error);
} finally {
  await prisma.$disconnect();
}