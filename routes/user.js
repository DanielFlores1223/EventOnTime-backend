const { Router } = require('express');
const { check } = require('express-validator');
const controller = require('../controllers/user');
const { RolesEnum } = require('../helpers/enums');
const { isValidRole, 
        emailExist, 
        isValidTypeAccount,
        isValidRoleWithoutAdmin, 
        documentExist} = require('../helpers');
const { validateJWT, 
        validateRole, 
        validateFields } = require('../middlewares');

const router = Router();

router.get( '/', [
     validateJWT,
     check('limit', 'El limite debe ser númerico').optional().isNumeric(),
     check('from', 'El inicio debe ser númerico').optional().isNumeric(),
     validateFields
], controller.getAll );

router.get( '/profile', [
     validateJWT
], controller.getInfoProfile );

router.get( '/:id', [
        validateJWT,
        check( 'id', 'No es un id válido' ).isMongoId(),
        check( 'id' ).custom( id => documentExist( id, 'User' ) ),
        validateFields
   ], controller.getById );

// This route is for a Admin wants to register a User
router.post( '/', [
     validateJWT,
     validateRole( RolesEnum.admin ),
     check( 'name', 'El nombre es obligatorio').not().isEmpty(),
     check( 'email', 'El correo no es válido' ).not().isEmail(),
     check( 'email' ).custom( emailExist ),
     check( 'password', 'La contraseña es obligatoria' ).not().isEmpty(),
     check( 'role', 'El rol es obligatorio' ).not().isEmpty(),
     check( 'role' ).custom( isValidRole ),
     check( 'account', 'El rol es obligatorio' ).not().isEmpty(),
     check( 'account' ).custom( isValidTypeAccount ),
     validateFields,
], controller.create );

// This route is for when the user wants to register himself from landing page
router.post( '/register', [
        check( 'name', 'El nombre es obligatorio').not().isEmpty(),
        check( 'email', 'El correo no es válido' ).not().isEmail(),
        check( 'email' ).custom( emailExist ),
        check( 'password', 'La contraseña es obligatoria' ).not().isEmpty(),
        check( 'role', 'El rol es obligatorio' ).not().isEmpty(),
        check( 'role' ).custom( isValidRoleWithoutAdmin ),
        check( 'account', 'El rol es obligatorio' ).not().isEmpty(),
        check( 'account' ).custom( isValidTypeAccount ),
        validateFields,
   ], controller.create );


router.put( '/profile', [
    validateJWT,
    check( 'name', 'El nombre no debe estar vacío').optional().not().isEmpty(),
    check( 'password', 'La contraseña no debe estar vacía').optional().not().isEmpty(),
    check( 'email', 'El correo no es válido' ).optional().isEmail(),
    validateFields,
], controller.update );

router.delete( '/:id', [
    validateJWT,
    validateRole( RolesEnum.admin ),
    check( 'id', 'No es un id válido' ).isMongoId(),
    check( 'id' ).custom( id => documentExist( id, 'User' ) ),
    validateFields,
], controller.deleteOne );
 
module.exports = router;