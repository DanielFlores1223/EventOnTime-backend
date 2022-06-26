const { Router } = require('express');
const { check } = require('express-validator');
const controller = require('../controllers/auth');
const { isValidRole } = require('../helpers')
const { validateFields } = require('../middlewares');

const router = Router();

router.post( '/', [
     check('email', 'El correo es obligatorio').not().isEmpty(),
     check('password', 'La contraseña es obligatorio').not().isEmpty(),
     validateFields
], controller.login );

router.post('/google', [
     check( 'id_token', 'El id_token es obligatorio' ).not().isEmpty(),
     check( 'role' ).custom( isValidRole ),
     validateFields
], controller.google);

module.exports = router;
