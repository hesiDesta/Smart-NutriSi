const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, recommendationController.getRecommendations);
router.post('/generate-menu', authMiddleware, recommendationController.generateMenuFromIngredients);
router.post('/predict-single', authMiddleware, recommendationController.predictSingleFood);

module.exports = router;

