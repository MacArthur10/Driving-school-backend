const express = require('express');
const router = express.Router();
const resultsController = require('../controllers/resultsController');
const authMiddleware = require('../middleware/authMiddleware');

// Route pour enregistrer un nouveau résultat
router.post('/', authMiddleware.authenticateToken, resultsController.saveResult);

// Route pour récupérer les résultats d'un utilisateur
router.get('/user/:userId', authMiddleware.authenticateToken, resultsController.getUserResults);

// Route pour récupérer un résultat spécifique
router.get('/:resultId', authMiddleware.authenticateToken, resultsController.getResultDetails);

module.exports = router;