const mongoose = require('mongoose');

const connect = async () => {
    try {
        await mongoose.connect('mongodb+srv://belmacarthur:Codeislife237@cluster0.hhprgtw.mongodb.net/quiz', {
            // Supprimez les options dépréciées
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
    }
};

module.exports = connect;