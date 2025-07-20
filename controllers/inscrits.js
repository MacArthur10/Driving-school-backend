const User = require('../data/users');
const bcrypt = require('bcrypt');

// Génère un mot de passe aléatoire
function generatePassword(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let pwd = '';
  for (let i = 0; i < length; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pwd;
}

// Liste des inscrits (users) du centre de l'admin connecté
async function list(req, res) {
  console.log('[CONTROLLER] inscrits.list called');
  try {
    const centre = req.user.centre;
    const users = await User.find({ centre, role: 'user' });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des inscrits', error: err });
  }
}

// Création d'un inscrit
async function create(req, res) {
  console.log('[CONTROLLER] inscrits.create called', req.body);
  try {
    const { name, email, Tel, Country, City, password } = req.body;
    const centre = req.user.centre;
    const role = 'user';
    let pwd = password;
    if (!pwd) {
      pwd = generatePassword(10);
    }
    // Génération de l'identifiant unique ici
    const centreCode = centre ? String(centre).slice(-4).toUpperCase() : 'CENTRE';
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    const identifiantUnique = `${centreCode}-${randomPart}`;
    const user = new User({ name, email, Tel, Country, City, password: pwd, centre, role, identifiantUnique });
    await user.save();
    res.status(201).json({ message: 'Inscrit créé', user: { ...user.toObject(), password: pwd } });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }
    console.error('[CONTROLLER] inscrits.create error:', err);
    res.status(500).json({ message: 'Erreur lors de la création de l’inscrit', error: err });
  }
}

// Modification d'un inscrit
async function update(req, res) {
  try {
    const userId = req.params.id;
    const { name, email, Tel, Country, City } = req.body;
    const user = await User.findByIdAndUpdate(userId, { name, email, Tel, Country, City }, { new: true });
    if (!user) return res.status(404).json({ message: 'Inscrit non trouvé' });
    res.status(200).json({ message: 'Inscrit modifié', user });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la modification de l’inscrit', error: err });
  }
}

// Suppression d'un inscrit
async function remove(req, res) {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: 'Inscrit non trouvé' });
    res.status(200).json({ message: 'Inscrit supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l’inscrit', error: err });
  }
}

// Réinitialisation du mot de passe
async function resetPassword(req, res) {
  try {
    const userId = req.params.id;
    const newPassword = generatePassword(10);
    const hashed = await bcrypt.hash(newPassword, 10);
    const user = await User.findByIdAndUpdate(userId, { password: hashed }, { new: true });
    if (!user) return res.status(404).json({ message: 'Inscrit non trouvé' });
    res.status(200).json({ message: 'Mot de passe réinitialisé', newPassword });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la réinitialisation du mot de passe', error: err });
  }
}

module.exports = { list, create, update, remove, resetPassword }; 