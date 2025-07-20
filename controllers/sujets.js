const sujetService = require('../services/sujets');

async function list(req, res) {
    const { type, subscription } = req.query; // Get the type and subscription from the query parameters
    try {
        console.log('[DEBUG] req.user in list:', req.user);
        let filter = { centre: req.user.centre };
        if (type) filter.type = type;
        if (subscription) filter.subscription = subscription;
        const sujets = await sujetService.findByFilter(filter);
        res.status(200).json(sujets);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération des sujets", err });
    }
}


async function read(req, res) {
    const sujetId = req.params.id;
    try {
        const sujet = await sujetService.findSujetById(sujetId);
        if (sujet) {
            res.status(200).json(sujet);
        } else {
            res.status(404).json({ message: "Sujet non trouvé" });
        }
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération du sujet", error: err });
    }
}

async function getQuestions(req, res) {
    const sujetId = req.params.id;
    console.log('Reçu sujetId:', sujetId);
    try {
        const sujetWithQuestions = await sujetService.findQuestionsForSujet(sujetId);
        if (sujetWithQuestions) {
            res.status(200).json(sujetWithQuestions);
        } else {
            res.status(404).json({ message: "Sujet non trouvé" });
        }
    } catch (err) {
        res.status(500).json({ 
            message: "Erreur lors de la récupération des questions", 
            error: err 
        });
    }
}

async function create(req, res) {
    const { name, description, type, subscription } = req.body;
    try {
        console.log('[DEBUG] req.user in create:', req.user);
        const createdSujet = await sujetService.createSujet({ name, description, type, subscription, centre: req.user.centre });
        if (createdSujet) {
            res.status(201).json({ message: "Sujet créé", sujet: createdSujet });
        } else {
            res.status(400).json({ message: 'Erreur lors de l\'insertion' });
        }
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la création du sujet", error: err.message });
    }
}




async function update(req, res) {
    const sujetId = req.params.id;
    try {
        const data = req.body;
        const updateSujet = await sujetService.updateSujet(sujetId, data);
        if (updateSujet) {
            res.status(200).json({ message: "Sujet édité" });
        } else {
            res.status(400).json({ message: "Erreur lors de l'édition" });
        }
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de l'édition du sujet", error: err });
    }
}

async function remove(req, res) {
    const sujetId = req.params.id;
    try {
        console.log('[SUPPRESSION] Tentative de suppression du sujet ID:', sujetId);
        const removeSujet = await sujetService.deleteSujet(sujetId);
        if (removeSujet) {
            console.log('[SUPPRESSION] Sujet supprimé avec succès:', sujetId);
            res.status(200).json({ message: "Sujet supprimé" });
        } else {
            console.warn('[SUPPRESSION] Sujet non trouvé pour suppression:', sujetId);
            res.status(400).json({ message: "Erreur lors de la suppression " });
        }
    } catch (err) {
        console.error('[SUPPRESSION] Erreur détaillée lors de la suppression du sujet:', err);
        res.status(500).json({ message: "Erreur lors de la suppression du sujet", error: err });
    }
}

async function findSujetsByTypeAndSubscription(type, subscription) {
    try {
        console.log(`Recherche de sujets avec le type: ${type} et abonnement: ${subscription}`);
        const sujets = await Sujet.find({ type, subscription });
        console.log(`Sujets trouvés pour le type ${type} et abonnement ${subscription}:`, sujets);
        return sujets;
    } catch (err) {
        console.error(`Erreur lors de la récupération des sujets pour le type ${type} et abonnement ${subscription}:`, err);
        throw err;
    }
}

module.exports = {
    list,
    read,
    create,
    update,
    remove,
    getQuestions
};
