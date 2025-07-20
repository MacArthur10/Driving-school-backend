const User = require('../data/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function findAll() {
    return await User.find().populate('subscription');
}

async function find(userId) {
    return await User.findById(userId).populate('subscription');
}

async function create(data) {
    const user = new User(data);
    try {
        console.log('Tentative de création utilisateur:', data);

        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            console.log('Utilisateur existant:', existingUser);
            return { success: false, message: 'Utilisateur déjà existant' };
        }

        // Log avant sauvegarde
        console.log('Avant sauvegarde user:', user);

        const savedUser = await user.save();

        // Log après sauvegarde
        console.log('Après sauvegarde user:', savedUser);

        const token = jwt.sign({ userId: savedUser._id }, 'your-secret-key', { expiresIn: '1h' });
        return { success: true, user: savedUser, token };
    } catch (error) {
        console.error('Erreur création user:', error);
        throw error;
    }
}

async function login(data) {
    try {
        // Vérifier si l'utilisateur existe avec identifiantUnique et centre
        if (!data.identifiantUnique || !data.centre) {
            return { message: 'Identifiant unique et centre requis' };
        }
        let query = { identifiantUnique: data.identifiantUnique, centre: data.centre };
        if (data.superadmin) {
            query.role = 'superadmin';
        }
        const user = await User.findOne(query);
        if (!user) {
            return { message: 'Utilisateur non trouvé avec cet identifiant et ce centre' };
        }
        const validPassword = await bcrypt.compare(data.password, user.password);
        if (!validPassword) {
            return { message: 'Mot de passe incorrect' };
        }
        // Mise à jour de la dernière connexion
        await User.findByIdAndUpdate(user._id, { lastLogin: Date.now() });
        // Générer un token JWT
        const token = jwt.sign({ userId: user._id, centre: user.centre, identifiantUnique: user.identifiantUnique }, 'your-secret-key', { expiresIn: '1h' });
        return { user, token };
    } catch (error) {
        return { message: 'Erreur lors de la connexion', error };
    }
}

async function update(userId, data) {
    return await User.findByIdAndUpdate(userId, data, { new: true });
}

async function remove(userId) {
    return await User.findByIdAndRemove(userId);
}

module.exports = {
    findAll, find, create, update, remove, login
};
