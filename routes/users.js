const express=require('express');
const router=express.Router();
const userSController=require('../controllers/users');
const authMiddleware = require('../middleware/authMiddleware');
const LoginHistory = require('../data/loginHistory');
//Afficher tous les utilisateurs
router.get('/',userSController.list);
//Creer un utilisateur
router.post("/register",userSController.create);
//Se connecter
router.post("/login",userSController.login);
//Afficher l'historique de connexion
router.get('/login-history', authMiddleware.authenticateToken, async (req, res) => {
    try {
      const userId = req.user._id; // Assuming your auth middleware sets req.user
      const loginHistory = await LoginHistory.find({ userId }).sort({ loginDate: -1 }); // Sort by date descending
      res.status(200).json(loginHistory);
    } catch (error) {
      console.error('Error fetching login history:', error);
      res.status(500).json({ message: 'Error fetching login history', error: error });
    }
  });
//Afficher un utilisateur en particulier
router.get("/:id",userSController.read);
//Modifier un utilisateur
router.put("/:id/update",userSController.update);
//Supprimer un utilisateur
router.delete("/:id/delete",userSController.remove);
module.exports=router;