const userProgressService = require('../services/userProgressService');
const mongoose = require('mongoose');

async function recordAttempt(req, res) {
  const { userId, sujetId, questionId, isCorrect } = req.body;
  try {
    const progress = await userProgressService.recordAttempt(userId, sujetId, questionId, isCorrect);
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getProgressForSujet(req, res) {
  const { userId, sujetId } = req.params;
  try {
    const progress = await userProgressService.getProgressForSujet(userId, sujetId);
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getStats(req, res) {
  const { userId } = req.params;
  try {
    const stats = await userProgressService.getStats(userId);
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getDashboardStats(req, res) {
  const { userId } = req.params;
  try {
    console.log('Requête reçue pour userId:', userId);
    
    // Validation de l'ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'ID utilisateur invalide' });
    }
    
    const dashboardStats = await userProgressService.getUserDashboardStats(userId);
    console.log('Statistiques récupérées avec succès');
    res.status(200).json(dashboardStats);
  } catch (error) {
    console.error('ERREUR DÉTAILLÉE:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  recordAttempt,
  getProgressForSujet,
  getStats,
  getDashboardStats
};