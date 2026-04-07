const transactionRepository = require('../repositories/transaction-repository');
const categoryRepository = require('../repositories/category-repository');
const budgetRepository = require('../repositories/budget-repository');
const { HttpError } = require('../errors/http-error');

async function create(userId, data) {
  const category = await categoryRepository.findById(userId, data.categoryId);
  if (!category) {
    throw new HttpError(404, 'Categoria não encontrada');
  }
  if (category.type !== data.type) {
    throw new HttpError(400, 'Tipo da transação não confere com o tipo da categoria');
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
