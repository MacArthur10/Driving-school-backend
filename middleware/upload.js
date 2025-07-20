// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // Configuration de stockage
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         // Vérifie si le répertoire uploads existe, sinon le crée
//         const uploadPath = path.join(__dirname, '../uploads');
//         if (!fs.existsSync(uploadPath)) {
//             fs.mkdirSync(uploadPath, { recursive: true });
//         }
//         cb(null, uploadPath); // Dossier de destination pour les fichiers téléchargés
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + path.extname(file.originalname)); // Nom du fichier
//     }
// });

// // Filtre pour accepter les fichiers image, audio et vidéo
// const fileFilter = (req, file, cb) => {
//     // Accepter les images, les audios et les vidéos
//     if (
//         file.mimetype.startsWith('image/') || 
//         file.mimetype.startsWith('audio/') || 
//         file.mimetype.startsWith('video/')
//     ) {
//         cb(null, true);
//     } else {
//         cb(new Error('Format de fichier non supporté! Veuillez télécharger une image, un audio ou une vidéo.'), false);
//     }
// };

// const upload = multer({
//     storage: storage,
//     fileFilter: fileFilter,
//     limits: { fileSize: 1024 * 1024 * 50 } // Limite de taille de fichier à 50MB pour les vidéos
// });

// module.exports = upload;



const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

// Configuration de Cloudinary
cloudinary.config({ 
    cloud_name: 'ddmraaeif', 
    api_key: process.env.api_key, 
    api_secret: process.env.api_secret
});
// Configuration du stockage Cloudinary (remplace multer.diskStorage)
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads',
        public_id: (req, file) => `${Date.now()}_${file.originalname.split('.')[0]}`,
        resource_type: 'auto' // Permet de détecter automatiquement le type de ressource
    }
});

// Filtre pour accepter les fichiers image, audio et vidéo (identique à la version commentée)
const fileFilter = (req, file, cb) => {
    // Accepter les images, les audios et les vidéos
    if (
        file.mimetype.startsWith('image/') || 
        file.mimetype.startsWith('audio/') || 
        file.mimetype.startsWith('video/')
    ) {
        cb(null, true);
    } else {
        cb(new Error('Format de fichier non supporté! Veuillez télécharger une image, un audio ou une vidéo.'), false);
    }
};

// Configuration du middleware multer avec stockage Cloudinary
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 50 } // Limite de taille de fichier à 50MB pour les vidéos
});

module.exports = upload;