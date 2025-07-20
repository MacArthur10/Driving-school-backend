const Sujet = require('../data/sujets');

async function createSujet(data) {
    try {
        const sujet = new Sujet(data);
        const savedSujet = await sujet.save();
        return savedSujet;
    } catch (err) {
        console.error('Error in create service:', err);
        throw err;
    }
}

async function findAllSujets() {
    try {
        const sujets = await Sujet.find();
        return sujets;
    } catch (err) {
        console.error('Erreur lors de la récupération des sujets:', err);
        throw err;
    }
}

async function findSujetsByType(type) {
    try {
        const sujets = await Sujet.find({ type });
        return sujets;
    } catch (err) {
        console.error(`Erreur lors de la récupération des sujets pour le type ${type}:`, err);
        throw err;
    }
}

async function findSujetsByTypeAndSubscription(type, subscription) {
    try {
        const sujets = await Sujet.find({ type, subscription });
        return sujets;
    } catch (err) {
        console.error(`Erreur lors de la récupération des sujets pour le type ${type} et abonnement ${subscription}:`, err);
        throw err;
    }
}

async function findSujetById(sujetId) {
    return await Sujet.findById(sujetId);
}

async function findQuestionsForSujet(sujetId) {
    try {
        const sujet = await Sujet.findById(sujetId)
            .populate({
                path: 'questions',
                model: 'QuestionAwnser'
            });
        return sujet;
    } catch (err) {
        console.error('Erreur lors de la récupération des questions:', err);
        throw err;
    }
}

async function updateSujet(sujetId, data) {
    return await Sujet.findByIdAndUpdate(sujetId, data, { new: true });
}

async function deleteSujet(sujetId) {
    return await Sujet.findByIdAndDelete(sujetId);
}

async function findByFilter(filter) {
    return await Sujet.find(filter);
}

module.exports = {
    createSujet,
    findAllSujets,
    findSujetsByType,
    findSujetsByTypeAndSubscription,
    findSujetById,
    updateSujet,
    deleteSujet,
    findQuestionsForSujet,
    findByFilter
};
