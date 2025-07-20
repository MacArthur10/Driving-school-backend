const Admin = require('../data/admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function findAll() {
    return await Admin.find().populate('subscription');
}

async function find(userId) {
    return await Admin.findById(userId).populate('subscription');
}

async function create(data) {
    const user = new Admin(data);
    try {
        console.log('Tentative de création utilisateur:', data);

        // Vérifier si l'email existe déjà
        const existingUser = await Admin.findOne({ email: data.email });
        if (existingUser) {
            console.log('Utilisateur existant:', existingUser);
            return { success: false, message: 'Utilisateur déjà existant' };
        }


        // Log avant sauvegarde
        console.log('Avant sauvegarde user:', user);

        const savedUser = await user.save();

        // Log après sauvegarde
        console.log('Après sauvegarde user:', savedUser);

        const token = jwt.sign(
            { 
                userId: user._id,
                role: "admin",       // Ajoutez un rôle explicite
                isAdmin: true,       // Indicateur clair d'administrateur
                permissions: ["create", "read", "update", "delete"]  // Permissions explicites
            }, 
            'your-secret-key', 
            { expiresIn: '24h' }     // Augmentez la durée de validité à 24h
        );        return { success: true, user: savedUser, token };
    } catch (error) {
        console.error('Erreur création user:', error);
        
        // Analyser l'erreur pour donner un message plus précis
        if (error.code === 11000 && error.keyPattern && error.keyPattern.telephone) {
            return { success: false, message: 'Ce numéro de téléphone est déjà utilisé' };
        }
        
        throw error;
    }
}
async function login(data) {
    try {
        console.log('Login attempt:', data);
        // Allow login for both admin and superadmin
        const user = await Admin.findOne({ 
            email: data.email, 
            role: data.superadmin ? 'superadmin' : 'admin' 
        });
        console.log('User found:', user);
        if (!user) {
            return { message: 'Utilisateur non trouvé' };
        }
        const validPassword = await bcrypt.compare(data.password, user.password);
        console.log('Password valid:', validPassword);
        if (!validPassword) {
            return { message: 'Mot de passe incorrect' };
        }
        // Generate JWT with centre and role
        const token = jwt.sign(
            { 
                userId: user._id,
                role: user.role,
                centre: user.centre,
                isAdmin: user.role === 'admin',
                permissions: ["create", "read", "update", "delete"]
            }, 
            'your-secret-key', 
            { expiresIn: '24h' }
        );
        return { user, token };
    } catch (error) {
        return { message: 'Erreur lors de la connexion', error };
    }
}

async function update(userId, data) {
    return await Admin.findByIdAndUpdate(userId, data, { new: true });
}

async function remove(userId) {
    return await Admin.findByIdAndRemove(userId);
}

module.exports = {
    findAll, find, create, update, remove, login
};
