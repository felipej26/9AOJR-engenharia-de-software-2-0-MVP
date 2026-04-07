const prisma = require('../lib/prisma');

function monthRange(month, year) {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59, 999);
  return { start, end };
}

function buildMonthlyReportPayload(transactions, budgets, month, year) {
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

  const spentByCategoryId = transactions.reduce((acc, t) => {
    if (t.type !== 'despesa') return acc;
    const id = t.categoryId;
    acc[id] = (acc[id] || 0) + Number(t.value);
    return acc;
  }, {});

  const budgetStatus = budgets.map((b) => {
    const spent = spentByCategoryId[b.categoryId] || 0;
    const budgetAmount = Number(b.amount);
    return {
      categoryId: b.categoryId,
      categoryName: b.category.name,
      budgetAmount,
      spent,
      exceeded: spent > budgetAmount,
    };
  });

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

async function findMonthlyReportData(userId, month, year) {
  const { start, end } = monthRange(month, year);

  const [transactions, budgets] = await Promise.all([
    prisma.transaction.findMany({
      where: {
        userId,
        date: { gte: start, lte: end },
        deletedAt: null,
      },
      include: { category: true },
      orderBy: { date: 'desc' },
    }),
    prisma.budget.findMany({
      where: { userId, month, year },
      include: { category: true },
    }),
  ]);

  return { transactions, budgets };
}

async function getMonthlyReport(userId, month, year) {
  const { transactions, budgets } = await findMonthlyReportData(userId, month, year);
  return buildMonthlyReportPayload(transactions, budgets, month, year);
}

module.exports = {
  buildMonthlyReportPayload,
  findMonthlyReportData,
  getMonthlyReport,
  monthRange,
};
