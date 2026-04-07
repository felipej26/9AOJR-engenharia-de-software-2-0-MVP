const prisma = require('../lib/prisma');

function create(userId, data) {
  return prisma.budget.create({
    data: {
      userId,
      categoryId: data.categoryId,
      month: data.month,
      year: data.year,
      amount: data.amount,
    },
    include: { category: true },
  });
}

function findMany(userId, filters = {}) {
  const where = { userId };
  if (filters.month != null) where.month = filters.month;
  if (filters.year != null) where.year = filters.year;

  return prisma.budget.findMany({
    where,
    include: { category: true },
    orderBy: [{ year: 'asc' }, { month: 'asc' }],
  });
}

function findByCategoryAndMonth(userId, categoryId, month, year) {
  return prisma.budget.findUnique({
    where: {
      userId_categoryId_month_year: { userId, categoryId, month, year },
    },
    include: { category: true },
  });
}

module.exports = {
  create,
  findMany,
  findByCategoryAndMonth,
};
