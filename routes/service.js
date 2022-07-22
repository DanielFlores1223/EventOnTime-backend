const { Router } = require('express');
const { check } = require('express-validator');
const { documentExist } = require('../helpers');
const { RolesEnum } = require('../helpers/enums');
const { numberPhoneRegex } = require('../helpers/regex');
const { validateJWT, validateRole, validateFields, validatePayment } = require('../middlewares');

const controller = require('../controllers/service');
const router = Router();

router.get( '/', [
     check('limit', 'El limite debe ser númerico').optional().isNumeric(),
     check('from', 'El inicio debe ser númerico').optional().isNumeric(),
     validateFields
], controller.getAll );

router.get( '/:id', [
     check( 'id', 'No es un id válido' ).isMongoId(),
     check( 'id' ).custom( id => documentExist( id, 'Service' ) ),
     validateFields
], controller.getById );

router.get( '/myServices', [
     validateJWT,
     validateRole( RolesEnum.proveedor )
], controller.getMyServices );

router.post( '/', [
     validateJWT,
     validateRole( RolesEnum.proveedor ),
     validatePayment,
     check( 'name', 'El nombre es un campo obligatorio' ).not().isEmpty(),
     check( 'type', 'El tipo es un campo obligatorio' ).not().isEmpty(),
     check( 'description', 'La descripción es un campo obligatorio' ).not().isEmpty(),
     check( 'price', 'El precio es un campo obligatorio' ).not().isEmpty(),
     check( 'price', 'El precio debe ser un dato numérico' ).isNumeric(),
     check( 'phone', 'El teléfono es un campo obligatorio' ).not().isEmpty(),
     check ( 'phone', 'El formato del teléfono no es válido, ejemplo: 3333333333' ).matches(numberPhoneRegex),
     validateFields,
], controller.create );

router.put( '/:id', [
     validateJWT,
     validateRole( RolesEnum.proveedor ),
     check( 'id', 'No es un id válido' ).isMongoId(),
     check( 'id' ).custom( id => documentExist( id, 'Service' ) ),
     check( 'name', 'El nombre es un campo obligatorio' ).optional().not().isEmpty(),
     check( 'type', 'El tipo es un campo obligatorio' ).optional().not().isEmpty(),
     check( 'description', 'La descripción es un campo obligatorio' ).optional().not().isEmpty(),
     check( 'price', 'El precio es un campo obligatorio' ).optional().not().isEmpty(),
     check( 'price', 'El precio debe ser un dato numérico' ).optional().isNumeric(),
     check( 'phone', 'El teléfono es un campo obligatorio' ).optional().not().isEmpty(),
     check ( 'phone', 'El formato del teléfono no es válido, ejemplo: 3333333333' ).optional().matches(numberPhoneRegex),
     validateFields,
], controller.update );

router.delete( '/:id', [
     validateJWT,
     validateRole( RolesEnum.proveedor, RolesEnum.admin ),
     check( 'id', 'No es un id válido' ).isMongoId(),
     check( 'id' ).custom( id => documentExist( id, 'Service' ) ),
     validateFields
], controller.deleteOne );

module.exports = router;