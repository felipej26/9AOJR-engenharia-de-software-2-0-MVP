const express = require('express');
const { authMock } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { categoryCreateSchema } = require('../utils/validators');
const categoryController = require('../controllers/category-controller');

const router = express.Router();
router.use(authMock);

router.post('/', validate(categoryCreateSchema), categoryController.postCategory);
router.get('/', categoryController.getCategories);

module.exports = router;
