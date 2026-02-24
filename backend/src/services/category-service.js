const categoryRepository = require('../repositories/category-repository');

async function create(userId, data) {
  const category = await categoryRepository.create(userId, {
    name: data.name.trim(),
    type: data.type,
  });
  return { data: serializeCategory(category) };
}

function serializeCategory(c) {
  return {
    id: c.id,
    userId: c.userId,
    name: c.name,
    type: c.type,
    createdAt: c.createdAt.toISOString(),
  };
}

async function list(userId) {
  const list = await categoryRepository.findMany(userId);
  return { data: list.map(serializeCategory) };
}

module.exports = {
  create,
  list,
  serializeCategory,
};
