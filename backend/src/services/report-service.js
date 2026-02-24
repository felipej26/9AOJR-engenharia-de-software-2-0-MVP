const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function monthly(userId, month, year) {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59, 999);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: { gte: start, lte: end },
      deletedAt: null,
    },
    include: { category: true },
    orderBy: { date: 'desc' },
  });

  const receita = transactions
    .filter((t) => t.type === 'receita')
    .reduce((acc, t) => acc + Number(t.value), 0);
  const despesa = transactions
    .filter((t) => t.type === 'despesa')
    .reduce((acc, t) => acc + Number(t.value), 0);

  const byCategory = {};
  for (const t of transactions) {
    const key = t.categoryId;
    if (!byCategory[key]) {
      byCategory[key] = {
        categoryId: t.categoryId,
        categoryName: t.category.name,
        type: t.type,
        total: 0,
      };
    }
    byCategory[key].total += Number(t.value);
  }
  const byCategoryList = Object.values(byCategory).map((c) => ({
    ...c,
    total: Math.round(c.total * 100) / 100,
  }));

  const budgets = await prisma.budget.findMany({
    where: { userId, month, year },
    include: { category: true },
  });
  const budgetStatus = await Promise.all(
    budgets.map(async (b) => {
      const sum = await prisma.transaction.aggregate({
        where: {
          userId,
          categoryId: b.categoryId,
          type: 'despesa',
          date: { gte: start, lte: end },
          deletedAt: null,
        },
        _sum: { value: true },
      });
      const total = Number(sum._sum.value || 0);
      return {
        categoryId: b.categoryId,
        categoryName: b.category.name,
        budgetAmount: Number(b.amount),
        spent: total,
        exceeded: total > Number(b.amount),
      };
    })
  );

  return {
    data: {
      month,
      year,
      totalReceita: Math.round(receita * 100) / 100,
      totalDespesa: Math.round(despesa * 100) / 100,
      saldo: Math.round((receita - despesa) * 100) / 100,
      byCategory: byCategoryList,
      budgetStatus,
    },
  };
}

module.exports = {
  monthly,
};
