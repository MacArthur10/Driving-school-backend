const userService = require('../services/users');
const adminService = require('../services/admin');

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
    const data = req.body;
    try {
        const result = await userService.create(data);

        if (result.success) {
            return res.status(201).json({
                message: "Utilisateur créé avec succès",
                token: result.token,
                user: result.user
            });
        } else {
            return res.status(400).json({
                message: result.message || 'Erreur lors de la création'
            });
        }
    } catch (err) {
        console.error('Controller error:', err);
        return res.status(500).json({
            message: "Erreur lors de la création de l'utilisateur",
            error: err.message
        });
    }
}

async function login(req, res) {
    const data = req.body;
    try {
        const result = await adminService.login(data);
        if (result && result.user) {
            res.status(200).json(result);
        } else if (result && result.message === 'Utilisateur non trouvé') {
            res.status(404).json({ message: 'Identifiants invalides' });
        } else if (result && result.message === 'Mot de passe incorrect') {
            res.status(401).json({ message: 'Identifiants invalides' });
        } else {
            res.status(500).json({ message: 'Erreur lors de la connexion' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la connexion', error: err });
    }
}

async function update(req, res) {
    const userId = req.params.id;
    try {
        const data = req.body;
        const updateUser = await userService.update(userId, data);
        if (updateUser) {
            res.status(200).json({ message: "Utilisateur édité" });
        } else {
            res.status(400).json({ message: "Erreur lors de l'édition" });
        }
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de l'édition de l'utilisateur", error: err });
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
