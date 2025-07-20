const Admin = require('../data/admin');
const bcrypt = require('bcrypt');

exports.list = async (req, res) => {
  try {
    const admins = await Admin.find().populate('centre');
    res.status(200).json(admins);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des admins', err });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, email, password, centre } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ name, email, password: hashedPassword, centre, role: 'admin' });
    await admin.save();
    // Populate centre before sending response
    await admin.populate('centre');
    res.status(201).json(admin);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'admin', err });
  }
};

exports.read = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).populate('centre');
    if (!admin) return res.status(404).json({ message: 'Admin non trouvé' });
    res.status(200).json(admin);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'admin', err });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, email, password, centre } = req.body;
    const updateData = { name, email, centre };
    if (password) updateData.password = await bcrypt.hash(password, 10);
    let admin = await Admin.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!admin) return res.status(404).json({ message: 'Admin non trouvé' });
    // Populate centre before sending response
    admin = await admin.populate('centre');
    res.status(200).json(admin);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'admin', err });
  }
};

exports.remove = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Admin non trouvé' });
    res.status(200).json({ message: 'Admin supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'admin', err });
  }
}; 