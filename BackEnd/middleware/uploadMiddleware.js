import multer from 'multer';
import path from 'path';

// Configuration du stockage pour multer
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
        // Génère un nom de fichier unique pour éviter les conflits
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialise l'upload
const upload = multer({
    storage: storage,
    limits:{fileSize: 3000000}, 
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('avatar'); // 'avatar' est le nom du champ du formulaire

// Vérifie le type de fichier
function checkFileType(file, cb){
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null,true);
    } else {
        cb('Erreur: Seules les images sont autorisées !');
    }
}

export default upload;