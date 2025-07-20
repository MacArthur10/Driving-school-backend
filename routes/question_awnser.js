// const express = require('express');
// const router = express.Router();
// const authMiddleware = require('../middleware/authMiddleware');
// const upload = require('../middleware/upload');
// const question_awnserController = require('../controllers/question_awnser');

// // Afficher tous les sujets
// router.get('/', question_awnserController.list);
// // Afficher une question en particulier, including subscription and type as query params
// router.get("/questions", question_awnserController.read);
// // Creer un sujet
// router.post("/create", upload.any(), question_awnserController.create);
// // Modifier un sujet
// router.put("/:id/update", upload.single('fichier'), question_awnserController.update);
// // Supprimer une question
// router.delete("/:id/delete", authMiddleware.authenticateToken, question_awnserController.remove);

// module.exports = router;



const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const question_awnserController = require('../controllers/question_awnser');

const validSubscriptions = ['elite', 'premium', 'gold', 'diamond', 'silver', 'basic'];
const validTypes = ['comprehension-ecrite', 'comprehension-orale', 'expression-ecrite', 'expression-orale'];

// 🟢 List all questions
router.get('/', authMiddleware.authenticateToken, question_awnserController.list);

// 🟢 Get a specific question (with subscription & type as query params)
router.get("/questions", question_awnserController.read);

// 🟢 Create a new question
router.post("/create", authMiddleware.authenticateToken, upload.any(), question_awnserController.create);

// 🟢 Update a question
router.put("/:id/update", upload.single('fichier'), question_awnserController.update);

// 🟢 Delete a question
router.delete("/:id/delete",  question_awnserController.remove);

// 🟢 GET: Fetch questions dynamically based on subscription and type
router.get('/:subscription/:type', async (req, res) => {
    const { subscription, type } = req.params;

    if (!validSubscriptions.includes(subscription) || !validTypes.includes(type)) {
        return res.status(400).json({ error: "Invalid subscription or type" });
    }

    try {
        const questions = await question_awnserController.getQuestionsByCategory(subscription, type);
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: "Error fetching questions" });
    }
});

// 🟢 POST: Add a new question dynamically
router.post('/:subscription/:type', async (req, res) => {
    const { subscription, type } = req.params;
    const { questionText, answers } = req.body;

    if (!validSubscriptions.includes(subscription) || !validTypes.includes(type)) {
        return res.status(400).json({ error: "Invalid subscription or type" });
    }

    try {
        const result = await question_awnserController.createQuestion(subscription, type, questionText, answers);
        res.json({ message: "Question added successfully", result });
    } catch (error) {
        res.status(500).json({ error: "Error adding question" });
    }
});

module.exports = router;