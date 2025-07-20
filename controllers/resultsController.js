const Result = require('../data/result');
const Question = require('../data/question_awnser');
const UserAnswer = require('../data/UserAnswer'); 
exports.saveResult = async (req, res) => {
  try {
    const { 
      userId, sujetId, sujetName, score, total, 
      percentage, status, date, type 
    } = req.body;
    
    const newResult = new Result({
      userId, 
      sujetId, 
      sujetName,
      score, 
      total, 
      percentage, 
      status, 
      date,
      type
    });
    
    const savedResult = await newResult.save();
    res.status(201).json(savedResult);
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du résultat:', error);
    res.status(500).json({ message: "Erreur lors de l'enregistrement du résultat" });
  }
};

exports.getUserResults = async (req, res) => {
  try {
    const { userId } = req.params;
    const results = await Result.find({ userId }).sort({ date: -1 });
    res.status(200).json(results);
  } catch (error) {
    console.error('Erreur lors de la récupération des résultats:', error);
    res.status(500).json({ message: "Erreur lors de la récupération des résultats" });
  }
};

exports.getResultDetails = async (req, res) => {
  try {
    const { resultId } = req.params;
    const result = await Result.findById(resultId);
    
    if (!result) {
      return res.status(404).json({ message: "Résultat non trouvé" });
    }
    
    // Récupérer les détails des questions pour ce sujet
    const questions = await Question.find({ sujet: result.sujetId });
    
    // Pas de recherche de réponses utilisateur pour l'instant
    res.status(200).json({ 
      result,
      questions
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du résultat:', error);
    res.status(500).json({ message: "Erreur lors de la récupération des détails du résultat" });
  }
};