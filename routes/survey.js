const { Router } = require( 'express' );
const { check } = require('express-validator');
const { documentExist,  } = require('../helpers');
const { RolesEnum } = require('../helpers/enums');
const { validateJWT, validateRole, validateFields } = require('../middlewares');
const controller = require('../controllers/survey');

const router = Router();

router.post( '/idService/:id', [
     validateJWT,
     validateRole( RolesEnum.planificador ),
     check( 'answers', 'Las respuestas deben se un arreglo de boleanos' ).isArray(),
     check( 'id', 'Id de servicio inválido' ).isMongoId(),
     check( 'id' ).custom( id => documentExist( id, 'Service' ) ),
     validateFields,
], controller.create );

router.get( '/pending/surveys', [
     validateJWT,
     validateRole( RolesEnum.planificador ),
], controller.getPendingSurveys );

router.put( '/answerSurvey/:id', [
     validateJWT,
     validateRole( RolesEnum.planificador ),
     check( 'answers', 'Las respuestas deben se un arreglo de boleanos' ).isArray(),
     check( 'id', 'Id de servicio inválido' ).isMongoId(),
     check( 'id' ).custom( id => documentExist( id, 'Survey' ) ),
     validateFields,
], controller.answerSurvey );

module.exports = router;