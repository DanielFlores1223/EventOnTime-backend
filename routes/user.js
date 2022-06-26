const { Router } = require('express');
const { check } = require('express-validator');
const controller = require('../controllers/user');
const { RolesEnum } = require('../helpers/enums');
const { isValidRole, 
        emailExist, 
        isValidTypeAccount } = require('../helpers');
const { validateJWT, 
        validateRole, 
        validateTypeAccount, 
        validateFields } = require('../middlewares');

const router = Router();

router.post( '/', [
     check( 'name', 'El nombre es obligatorio').not().isEmpty(),
     check( 'email', 'El correo no es valido' ).not().isEmpty(),
     check( 'email' ).custom( emailExist ),
     check( 'role', 'El rol es obligatorio' ).not().isEmpty(),
     check( 'role' ).custom( isValidRole ),
     check( 'account', 'El rol es obligatorio' ).not().isEmpty(),
     check( 'account' ).custom( isValidTypeAccount ),
     validateFields,
], controller.create );
 
module.exports = router;