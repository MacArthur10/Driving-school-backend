const express = require('express');
const router = express.Router();
const userProgressController = require('../controllers/userProgressController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/record', userProgressController.recordAttempt);
router.get('/:userId/:sujetId', userProgressController.getProgressForSujet);
router.get('/:userId/stats', userProgressController.getStats);
router.get('/:userId/dashboard', userProgressController.getDashboardStats);

// Ajouter cette nouvelle route pour les statistiques du tableau de bord
router.get('/:userId/dashboard', authMiddleware.authenticateToken, userProgressController.getDashboardStats);

module.exports = router;