const prisma = require('../lib/prisma');

function create(userId, data) {
  return prisma.transaction.create({
    data: {
      userId,
      categoryId: data.categoryId,
      value: data.value,
      date: new Date(data.date),
      description: data.description ?? null,
      type: data.type,
      recurrenceId: data.recurrenceId ?? null,
    },
    include: { category: true },
  });
}

function findMany(userId, filters = {}) {
  const where = {
    userId,
    deletedAt: null,
  };
  if (filters.month != null && filters.year != null) {
    const start = new Date(filters.year, filters.month - 1, 1);
    const end = new Date(filters.year, filters.month, 0, 23, 59, 59, 999);
    where.date = { gte: start, lte: end };
  }
  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.type) where.type = filters.type;

  return prisma.transaction.findMany({
    where,
    include: { category: true },
    orderBy: { date: 'desc' },
  });
}

function sumByCategoryAndMonth(userId, categoryId, year, month) {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59, 999);
  return prisma.transaction.aggregate({
    where: {
      userId,
      categoryId,
      type: 'despesa',
      date: { gte: start, lte: end },
      deletedAt: null,
    },
    _sum: { value: true },
  });
}

function existsByRecurrenceAndMonth(recurrenceId, year, month) {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59, 999);
  return prisma.transaction.findFirst({
    where: {
      recurrenceId,
      date: { gte: start, lte: end },
      deletedAt: null,
    },
  });
}

module.exports = {
  create,
  findMany,
  sumByCategoryAndMonth,
  existsByRecurrenceAndMonth,
};
