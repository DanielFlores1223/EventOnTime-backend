const { Router } = require('express');
const { check } = require('express-validator');
const { isValidRoleForGuest } = require('../helpers');
const { RolesEnum } = require('../helpers/enums');
const { validateJWT, validateRole, validateFields, validatePayment, validatePlannerAccount } = require('../middlewares');
const controller = require('../controllers/event');

const router = Router();

router.post( '/', [
     validateJWT,
     validateRole( RolesEnum.planificador ),
     validatePayment,
     validatePlannerAccount,
     check( 'name', 'El nombre del evento es obligatorio' ).not().isEmpty(),
     check( 'description', 'La descripción del evento es obligatoria' ).not().isEmpty(),
     check( 'dateStart', 'Formato de fecha inválido' ).isDate(),
     check( 'dateFinish', 'Formato de fecha inválido' ).isDate(),
     check( 'googleMaps', 'La url de google maps no debe estar vacía' ).optional().not().isEmpty(),
     check( 'dressCode', 'El código de vestimenta del evento es obligatorio' ).not().isEmpty(),
     check( 'address', 'La dirección del evento es obligatoria' ).not().isEmpty(),
     check( 'services', 'Los servicios debe ser un arreglo' ).isArray(),
     check( 'services.*', 'Cada elemento de los servicios debe ser un id' ).isMongoId(),
     check( 'guests', 'Los invitados deben ser un arreglo' ).isArray(),
     check( 'guests.*.name', 'El nombre del invitado es obligatorio' ).not().isEmpty(),
     check( 'guests.*.email', 'Formato inválido del correo del invitado' ).isEmail(),
     check( 'guests.*.numberPartner', 'El numero de invitados deber ser númerico y mayor o igual a 0' ).isNumeric({ min: 0 }),
     check( 'guests.*.numberPartner', 'El numero de invitados deber ser númerico y mayor a 1' ).isNumeric({ min: 0 }),
     check( 'guests.*.role' ).custom( isValidRoleForGuest ),
     validateFields,
], controller.create );

module.exports = router;