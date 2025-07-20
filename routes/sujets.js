const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const sujetController = require('../controllers/sujets');

// Afficher tous les sujets (with optional type filter)
router.get('/', authMiddleware.authenticateToken, sujetController.list);

// Afficher un sujet en particulier
router.get("/:id", sujetController.read);

// Route pour récupérer toutes les questions d'un sujet
router.get('/:id/questions', sujetController.getQuestions);

// Creer un sujet
router.post("/created", authMiddleware.authenticateToken, sujetController.create);

// Modifier un sujet
router.put("/:id/update", authMiddleware.authenticateToken, sujetController.update);

// Supprimer un sujet
router.delete("/:id/delete", authMiddleware.authenticateToken, sujetController.remove);

module.exports = router;
