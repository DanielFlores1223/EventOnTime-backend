const { Router } = require('express');
const { check } = require('express-validator');
const { isValidCollection } = require('../helpers');
const { validateFields, uploadImages, isImage,idExistInModel } = require('../middlewares');
const controller = require('../controllers/picture');
const router = Router();

router.post('/:collection/:id', [
     check('id', 'No es un id válido').isMongoId(),
     check('collection').custom( isValidCollection ),
     validateFields,
     idExistInModel,
     uploadImages,
     isImage,
],  controller.create);


module.exports = router;