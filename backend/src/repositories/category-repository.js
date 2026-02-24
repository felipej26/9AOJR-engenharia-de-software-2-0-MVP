const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function create(userId, data) {
  return prisma.category.create({
    data: {
      userId,
      name: data.name,
      type: data.type,
    },
  });
}

function findMany(userId) {
  return prisma.category.findMany({
    where: { userId },
    orderBy: { name: 'asc' },
  });
}

function findById(userId, id) {
  return prisma.category.findFirst({
    where: { id, userId },
  });
}

module.exports = {
  create,
  findMany,
  findById,
};
