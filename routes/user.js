const { Router } = require('express');
const { check } = require('express-validator');
const controller = require('../controllers/user');
const { RolesEnum } = require('../helpers/enums');
const { isValidRole, 
        emailExist, 
        isValidTypeAccount,
        isValidRoleWithoutAdmin } = require('../helpers');
const { validateJWT, 
        validateRole, 
        validateFields } = require('../middlewares');

const router = Router();

// This route is for a Admin wants to register a User
router.post( '/', [
     validateJWT,
     validateRole( RolesEnum.admin ),
     check( 'name', 'El nombre es obligatorio').not().isEmpty(),
     check( 'email', 'El correo no es valido' ).not().isEmpty(),
     check( 'email' ).custom( emailExist ),
     check( 'role', 'El rol es obligatorio' ).not().isEmpty(),
     check( 'role' ).custom( isValidRole ),
     check( 'account', 'El rol es obligatorio' ).not().isEmpty(),
     check( 'account' ).custom( isValidTypeAccount ),
     validateFields,
], controller.create );

// This route is for when the user wants to register himself from landing page
router.post( '/register', [
        check( 'name', 'El nombre es obligatorio').not().isEmpty(),
        check( 'email', 'El correo no es valido' ).not().isEmpty(),
        check( 'email' ).custom( emailExist ),
        check( 'role', 'El rol es obligatorio' ).not().isEmpty(),
        check( 'role' ).custom( isValidRoleWithoutAdmin ),
        check( 'account', 'El rol es obligatorio' ).not().isEmpty(),
        check( 'account' ).custom( isValidTypeAccount ),
        validateFields,
   ], controller.create );
 
module.exports = router;