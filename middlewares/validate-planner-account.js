const { request, response } = require('express');
const { getJsonRes } = require('../helpers');
const { RolesEnum, TypeAccountsEnum } = require('../helpers/enums');
const {  } = require('../models');

const validatePlannerAccount = async ( req = request, res = response, next ) => {

     const { account, role } = req.user;
     const { numberEvents, typeAccount } = req.payment;

     if( role !== RolesEnum.planificador )
          return res.status(401).json( getJsonRes( false,  `La cuenta para realizar esta acción debe ser planificador`) );

     if( typeAccount === TypeAccountsEnum.gratuito && numberEvents >= 2 )
          return res.status(401).json( getJsonRes( false, `Has realizado 2 eventos este mes, si quieres organizar otro evento actualiza tu cuenta a Premium o Empresarial`) );
     
     next();

}

module.exports = {
     validatePlannerAccount,
}
