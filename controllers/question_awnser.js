const mongoose = require('mongoose');
const question_awnserService = require('../services/question_awnser');

async function list(req, res) {
  try {
    const questions = await question_awnserService.findByFilter({ centre: req.user.centre });
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des question-réponse", err });
  }
}

async function read(req, res) {
  const { id, subscription, type } = req.query;
  try {
    const query = { sujet: id, subscription, type };
    console.log('Query:', query);
    const question_awnser = await question_awnserService.findByQuery(query);

    if (question_awnser.length > 0) {
      res.status(200).json({ questions: question_awnser });
    } else {
      res.status(404).json({ message: "Aucune question trouvée pour ce sujet, abonnement et type." });
    }
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des questions-réponses", error: err });
  }
}

async function create(req, res) {
  try {
    console.log('--- Nouvelle Requête ---');
    console.log('Requête reçue :', req.body);
    console.log('Fichiers reçus :', req.files);

    const sujetId = req.body.sujet;
    const subscription = req.body.subscription;
    const type = req.body.type;

    if (!sujetId || !mongoose.Types.ObjectId.isValid(sujetId)) {
      return res.status(400).json({ error: 'ID du sujet invalide ou manquant' });
    }

    const questionsData = JSON.parse(JSON.stringify(req.body.questions));

    if (!Array.isArray(questionsData)) {
      return res.status(400).json({ error: 'Les questions doivent être un tableau' });
    }

    req.files.forEach((file) => {
      const match = file.fieldname.match(/questions\[(\d+)\]\[fichier\]/);
      if (match) {
        const index = parseInt(match[1], 10);
        if (questionsData[index]) {
          questionsData[index].fichier = file.path;
        }
      }
    });

    questionsData.forEach((question, idx) => {
      // Defensive check for required fields
      if (!question.question || !question.anwser || !question.falseAnwser1 || !question.falseAnwser2 || !question.falseAnwser3) {
        throw new Error(`Missing required fields in question at index ${idx}`);
      }
      question.sujet = new mongoose.Types.ObjectId(sujetId);
      question.subscription = subscription;
      question.type = type;
      question.centre = req.user.centre;
    });

    console.log('questionsData final:', questionsData);

    const createdQuestions = await question_awnserService.createMany(questionsData);

    res.status(201).json({ message: 'Questions créées avec succès', questions: createdQuestions });
  } catch (err) {
    console.error('Detailed error:', err);
    res.status(500).json({
      message: "Erreur lors de la création de la question-réponse",
      error: err.message,
      stack: err.stack
    });
  }
}

async function update(req, res) {
  const question_awnserId = req.params.id;
  try {
    console.log('Requête update reçue:', req.body);
    console.log('Fichier reçu:', req.file);
    
    const data = req.body;
    
    // Ajouter le chemin du fichier aux données si un fichier est téléchargé
    if (req.file) {
      data.fichier = req.file.path;
      console.log('Nouveau chemin d\'image ajouté:', req.file.path);
    }
    
    const updatedquestion_awnser = await question_awnserService.update(question_awnserId, data);
    if (updatedquestion_awnser) {
      res.status(200).json({ message: "Question et réponse éditées", question: updatedquestion_awnser });
    } else {
      res.status(400).json({ message: "Erreur lors de l'édition" });
    }
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'édition de la question-réponse", error: err });
  }
}

// Modifiez la fonction remove dans controllers/question_awnser.js
async function remove(req, res) {
  const question_awnserId = req.params.id;
  try {
    console.log(`Tentative de suppression de la question ID: ${question_awnserId}`);
    
    // Vérifier que l'ID est valide pour MongoDB
    if (!mongoose.Types.ObjectId.isValid(question_awnserId)) {
      console.log('ID non valide pour MongoDB');
      return res.status(400).json({ message: "ID de question non valide" });
    }
    
    const removedquestion_awnser = await question_awnserService.remove(question_awnserId);
    console.log('Résultat de la suppression:', removedquestion_awnser);
    
    if (removedquestion_awnser) {
      res.status(200).json({ message: "Question et réponse supprimées" });
    } else {
      res.status(404).json({ message: "Question non trouvée" });
    }
  } catch (err) {
    console.error("Erreur détaillée:", err);
    res.status(500).json({ 
      message: "Erreur lors de la suppression de la question-réponse", 
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
}
module.exports = {
  list,
  read,
  create,
  update,
  remove
};
