const { Router } = require('express');
const { check } = require('express-validator');
const controller = require('../controllers/payment');
const { isValidTypeAccount } = require('../helpers');
const { RolesEnum } = require('../helpers/enums');
const { numberCardRegex, expirationCardRegex } = require('../helpers/regex');
const { validateFields, validateJWT, validateRole } = require('../middlewares');

const router = Router();

router.get( '/lastCreditCard', [
     validateJWT,
     validateRole( RolesEnum.proveedor, RolesEnum.planificador ),
], controller.getLastCreditCard );

router.get( '/infoLastPayment', [
     validateJWT,
     validateRole( RolesEnum.proveedor, RolesEnum.planificador ),
], controller.getInfoLastPayment );

router.post( '/', [
     validateJWT,
     validateRole( RolesEnum.proveedor, RolesEnum.planificador ),
     check( 'numberCard', 'El número de la tarjeta es obligatorio' ).not().isEmpty(),
     check( 'numberCard', 'Número de tarjeta con formato inválido' ).matches( numberCardRegex ),
     check( 'nameOwnerCard', 'El nombre del propietario es obligatorio' ).not().isEmpty(),
     check( 'expiration', 'Formato de fecha de expiración inválido: MM/YY' ).matches( expirationCardRegex ),
     check( 'typeAccount', 'El tipo de cuenta es obligatorio' ).not().isEmpty(),
     check( 'typeAccount' ).custom( isValidTypeAccount ),
     validateFields,
], controller.create );

module.exports = router;