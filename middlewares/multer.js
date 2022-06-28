const multer = require('multer');

const storage = multer.diskStorage({
     destination: function(req, file, cb) {
         cb(null, 'uploads')
     },
     filename: function(req, file, cb) {
         cb(null,`${Date.now}-${file.originalname}`)
     }
});

const upload = multer({ storage });
const uploadImage = upload.single('image');
const uploadImages = upload.array('image', 10);

module.exports = {
     uploadImage,
     uploadImages
}