const categoryService = require('../services/category-service');

async function postCategory(req, res, next) {
  try {
    const userId = req.user.id;
    const data = req.validated;
    const result = await categoryService.create(userId, data);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

async function getCategories(req, res, next) {
  try {
    const userId = req.user.id;
    const result = await categoryService.list(userId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  postCategory,
  getCategories,
};
