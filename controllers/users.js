const userService = require('../services/users');
const LoginHistory = require('../data/loginHistory');
const upload = require('../middleware/upload');
const User = require('../data/users'); // Ajoutez cette ligne pour importer le modèle User

async function list(req, res) {
    try {
        const user = await userService.findAll();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs", err });
    }
}

async function read(req, res) {
    const userId = req.params.id;
    try {
        const user = await userService.find(userId);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "Utilisateur non trouvé" });
        }
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur", error: err });
    }
}

async function create(req, res) {
    try {
        console.log('Tentative d\'inscription reçue:', req.body);
        
        upload.single('profileImage')(req, res, async function(err) {
          if (err) {
            console.error('Erreur upload:', err);
            return res.status(400).json({ message: 'Erreur lors de l\'upload de l\'image', error: err.message });
          }
          
          console.log('Corps de la requête après upload:', req.body);
          console.log('Fichier reçu:', req.file);
          
          const { name, email, password, Tel, Country, City } = req.body;
                  
        // Vérifier les champs uniques individuellement
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
          return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }
        
        const existingName = await User.findOne({ name });
        if (existingName) {
          return res.status(400).json({ message: 'Ce nom est déjà utilisé' });
        }
        
        const existingTel = await User.findOne({ Tel });
        if (existingTel) {
          return res.status(400).json({ message: 'Ce numéro de téléphone est déjà utilisé' });
        }
        
        // Créer l'utilisateur
        const newUser = new User({
          name,
          email,
          password,
          Tel,
          Country,
          City,
          profileImage: req.file ? req.file.path : null
        });
        
        await newUser.save();
        res.status(201).json({ message: 'Utilisateur créé avec succès', user: newUser });
      });
    } catch (error) {
      console.error('Erreur détaillée:', error);
      res.status(500).json({ message: 'Erreur interne du serveur', error: error.message });
    }
}
  async function login(req, res) {
    console.log('[BACKEND] /api/users/login endpoint hit');
    console.log('[BACKEND] Request body:', req.body);
    const data = req.body;
    try {
        const result = await userService.login(data);
        console.log('Login result:', result);
        if (result.user) {
            const user = result.user;
        // Create login history entry
        const loginHistory = new LoginHistory({ userId: result.user._id });
        await loginHistory.save();
             res.status(200).json(result);

        } else {
            res.status(404).json({ message: "Utilisateur non trouvé" });
        }
    } catch (err) {
        console.error('Erreur lors de la connexion:', err);
        res.status(500).json({ message: "Erreur lors de la connexion", error: err });
    }
}

async function update(req, res) {
    const userId = req.params.id;
    try {
        // Utiliser multer pour gérer l'upload d'image
        upload.single('profileImage')(req, res, async function(err) {
            if (err) {
                return res.status(400).json({ 
                    message: 'Erreur lors de l\'upload de l\'image', 
                    error: err.message 
                });
            }
            
            const data = {...req.body};
            
            // Ajouter le nom du fichier image au profil si une image a été uploadée
            if (req.file) {
                data.profileImage = req.file.path;
            }
            
            const updateUser = await userService.update(userId, data);
            
            if (updateUser) {
                res.status(200).json({ 
                    message: "Utilisateur édité avec succès",
                    user: updateUser
                });
            } else {
                res.status(400).json({ message: "Erreur lors de l'édition" });
            }
        });
    } catch (err) {
        res.status(500).json({ 
            message: "Erreur lors de l'édition de l'utilisateur", 
            error: err 
        });
    }
}
async function remove(req, res) {
    const userId = req.params.id;
    try {
        const removeUser = await userService.remove(userId);
        if (removeUser) {
            res.status(200).json({ message: "Utilisateur supprimé" });
        } else {
            res.status(400).json({ message: "Erreur lors de la suppression" });
        }
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur", error: err });
    }
}

module.exports = {
    list, read, create, update, remove, login
};
