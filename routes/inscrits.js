console.log('[ROUTE] /api/inscrits loaded');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const inscritsController = require('../controllers/inscrits');

router.get('/', (req, res, next) => { console.log('[ROUTE] GET /api/inscrits called'); next(); }, authMiddleware.authenticateToken, inscritsController.list);
router.post('/', authMiddleware.authenticateToken, inscritsController.create);
router.put('/:id', authMiddleware.authenticateToken, inscritsController.update);
router.delete('/:id', authMiddleware.authenticateToken, inscritsController.remove);
router.post('/:id/reset-password', authMiddleware.authenticateToken, inscritsController.resetPassword);

module.exports = router; 