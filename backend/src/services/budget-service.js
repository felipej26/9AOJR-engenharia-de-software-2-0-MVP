const budgetRepository = require('../repositories/budget-repository');
const categoryRepository = require('../repositories/category-repository');
const transactionRepository = require('../repositories/transaction-repository');

async function create(userId, data) {
  const now = new Date();
  const budgetMonth = new Date(data.year, data.month - 1, 1);
  if (budgetMonth < new Date(now.getFullYear(), now.getMonth(), 1)) {
    const err = new Error('Orçamento só pode ser criado para o mês atual ou meses futuros');
    err.statusCode = 400;
    throw err;
  }

  const category = await categoryRepository.findById(userId, data.categoryId);
  if (!category) {
    const err = new Error('Categoria não encontrada');
    err.statusCode = 404;
    throw err;
  }

  const budget = await budgetRepository.create(userId, {
    categoryId: data.categoryId,
    month: data.month,
    year: data.year,
    amount: Number(data.amount),
  });
  return { data: serializeBudget(budget) };
}

function serializeBudget(b) {
  return {
    id: b.id,
    userId: b.userId,
    categoryId: b.categoryId,
    category: b.category ? { id: b.category.id, name: b.category.name } : undefined,
    month: b.month,
    year: b.year,
    amount: Number(b.amount),
    createdAt: b.createdAt.toISOString(),
  };
}

async function list(userId, filters = {}) {
  const list = await budgetRepository.findMany(userId, filters);
  const withExceeded = await Promise.all(
    list.map(async (b) => {
      const sum = await transactionRepository.sumByCategoryAndMonth(
        userId,
        b.categoryId,
        b.year,
        b.month
      );
      const total = Number(sum._sum.value || 0);
      const exceeded = total > Number(b.amount);
      return { ...serializeBudget(b), exceeded };
    })
  );
  return { data: withExceeded };
}

module.exports = {
  create,
  list,
  serializeBudget,
};
