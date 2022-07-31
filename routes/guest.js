 const { Router } = require('express');
 const { check } = require('express-validator');
 const { RolesEnum } = require('../helpers/enums');
 const { documentExist } = require('../helpers');
 const { validateFields, validateJWTGuest, validateRoleMovil, validateEventDates } = require('../middlewares');
 const controller = require('../controllers/guest');
 const router = Router();

 router.put( '/assitence/confirmation', [
     validateJWTGuest,
     validateRoleMovil( RolesEnum.invitado ),
     validateEventDates
 ], controller.updateAssistenceConfirmation );

 router.put( '/:id/assitence', [
    validateJWTGuest,
    validateRoleMovil( RolesEnum.cadenero ),
    validateEventDates,
    check('id', 'Id es inválido').isMongoId(),
    check( 'id' ).custom( id => documentExist( id, 'Guest' ) ),
    validateFields,
], controller.updateAssistence )

 module.exports = router;