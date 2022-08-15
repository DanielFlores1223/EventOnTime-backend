const { Router } = require('express');
const { validateJWT, validateRole } = require('../middlewares');
const { RolesEnum } = require('../helpers/enums');
const router = Router();
const controller = require('../controllers/stadistic');

router.get( '/dashboard/planner', [
     validateJWT,
     validateRole( RolesEnum.planificador )
], controller.getDataDashboardPlanner );

router.get( '/dashboard/provider', [
     validateJWT,
     validateRole( RolesEnum.proveedor )
], controller.getDataDashboardProveer );

router.get( '/dashboard/planner/movil', [
     validateJWT,
     validateRole( RolesEnum.planificador )
], controller.getDataPlannerMovilApp );

module.exports = router;