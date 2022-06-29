const { Router } = require('express');
const { check } = require('express-validator');
const { isValidCollection, documentExist } = require('../helpers');
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

router.delete('/:id', [
     check('id', 'No es un id válido').isMongoId(),
     check('id').custom( param => documentExist( param, 'Picture' ) ),
     validateFields,
], controller.deletePicture);


module.exports = router;