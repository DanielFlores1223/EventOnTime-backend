const { Router } = require('express');
const { check } = require('express-validator');
const controller = require('../controllers/contactUs');
const { RolesEnum } = require('../helpers/enums');
const { documentExist } = require('../helpers');
const { validateFields, 
        validateJWT, 
        validateRole } = require('../middlewares');
const router = Router();

router.get( '/', [
     validateJWT,
     validateRole( RolesEnum.admin ),
     check('limit', 'El limite debe ser númerico').optional().isNumeric(),
     check('from', 'El inicio debe ser númerico').optional().isNumeric(),
     validateFields
], controller.getAll );

router.get( '/:id', [
     validateJWT,
     validateRole( RolesEnum.admin ),
     check( 'id', 'No es un id válido' ).isMongoId(),
     check( 'id' ).custom( id => documentExist( id, 'ContactUs' ) ),
     validateFields
], controller.getById );

router.post( '/', [
     check( 'name', 'El nombre es un campo obligatiorio' ).not().isEmpty(),
     check( 'email', 'No es un correo válido' ).isEmail(),
     check( 'message','El mensaje es un campo obligatorio' ).not().isEmpty(),
     validateFields,
], controller.create );

router.put( '/view/:id', [
     validateJWT,
     validateRole( RolesEnum.admin ),
     check( 'id', 'El id no es válido' ).isMongoId(),
     check( 'id' ).custom( id => documentExist( id, 'ContactUs' ) ),
     validateFields,
], controller.viewRegister );

router.delete( '/:id', [
     validateJWT,
     validateRole( RolesEnum.admin ),
     check( 'id', 'El id no es válido' ).isMongoId(),
     check( 'id' ).custom( id => documentExist( id, 'ContactUs' ) ),
     validateFields,
], controller.deleteOne)

module.exports = router;