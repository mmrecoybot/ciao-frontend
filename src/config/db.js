const { PrismaClient } = require("@prisma/client"); // Import Prisma Client

const prisma = new PrismaClient(); // Instantiate Prisma Client

module.exports = prisma;
