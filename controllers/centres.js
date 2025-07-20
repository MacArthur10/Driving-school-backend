const Centre = require('../data/centre');

exports.list = async (req, res) => {
  try {
    const centres = await Centre.find();
    res.status(200).json(centres);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des centres', err });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, address } = req.body;
    const centre = new Centre({ name, address });
    await centre.save();
    res.status(201).json(centre);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création du centre', err });
  }
};

exports.read = async (req, res) => {
  try {
    const centre = await Centre.findById(req.params.id);
    if (!centre) return res.status(404).json({ message: 'Centre non trouvé' });
    res.status(200).json(centre);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération du centre', err });
  }
};

exports.update = async (req, res) => {
  try {
    const centre = await Centre.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!centre) return res.status(404).json({ message: 'Centre non trouvé' });
    res.status(200).json(centre);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du centre', err });
  }
};

exports.remove = async (req, res) => {
  try {
    const centre = await Centre.findByIdAndDelete(req.params.id);
    if (!centre) return res.status(404).json({ message: 'Centre non trouvé' });
    res.status(200).json({ message: 'Centre supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression du centre', err });
  }
}; 