const transactionRepository = require('../repositories/transaction-repository');
const categoryRepository = require('../repositories/category-repository');
const budgetRepository = require('../repositories/budget-repository');

async function create(userId, data) {
  const category = await categoryRepository.findById(userId, data.categoryId);
  if (!category) {
    const err = new Error('Categoria não encontrada');
    err.statusCode = 404;
    throw err;
  }
  if (category.type !== data.type) {
    const err = new Error('Tipo da transação não confere com o tipo da categoria');
    err.statusCode = 400;
    throw err;
  }

  const transaction = await transactionRepository.create(userId, {
    ...data,
    value: Number(data.value),
  });

  const date = new Date(data.date);
  const budget = await budgetRepository.findByCategoryAndMonth(
    userId,
    data.categoryId,
    date.getMonth() + 1,
    date.getFullYear()
  );
  let budgetExceeded = false;
  if (data.type === 'despesa' && budget) {
    const sum = await transactionRepository.sumByCategoryAndMonth(
      userId,
      data.categoryId,
      date.getFullYear(),
      date.getMonth() + 1
    );
    const total = Number(sum._sum.value || 0);
    budgetExceeded = total > Number(budget.amount);
  }

  return {
    transaction: serializeTransaction(transaction),
    budgetExceeded: budgetExceeded || undefined,
  };
}

function serializeTransaction(t) {
  return {
    id: t.id,
    userId: t.userId,
    categoryId: t.categoryId,
    category: t.category ? { id: t.category.id, name: t.category.name, type: t.category.type } : undefined,
    value: Number(t.value),
    date: t.date.toISOString().slice(0, 10),
    description: t.description,
    type: t.type,
    createdAt: t.createdAt.toISOString(),
  };
}

async function list(userId, filters = {}) {
  const list = await transactionRepository.findMany(userId, filters);
  return { data: list.map(serializeTransaction) };
}

module.exports = {
  create,
  list,
  serializeTransaction,
};
