const { Role, User, TypeAccount } = require('../models');
const Models = require('../models');
const { RolesEnum } = require('../helpers/enums')

/* IMPORTANT: All the custom validations for using in express-validator have to be async */
const isValidRole = async ( role = '' ) => {
     const exist = await Role.findOne( { name: role } );

     if (!exist)
          throw new Error(`El rol ${role} no existe`);
}

const isValidRoleWithoutAdmin = async ( role = '' ) => {
     const exist = await Role.findOne( { name: role } );

     if( exist.name === RolesEnum.admin )
          throw new Error(`El rol ${role} no existe`);

     if (!exist)
          throw new Error(`El rol ${role} no existe`);
}

const isValidTypeAccount = async ( typeAccount = '' ) => {
     const exist = await TypeAccount.findOne( { name: typeAccount } );

     if (!exist)
          throw new Error(`El tipo de cuenta ${typeAccount} no existe`);
}

const emailExist = async ( email = '' ) => {
     const exist = await User.findOne( { email } );

     if ( exist )
          throw new Error(`El correo que ingreso ya está registrado`);
}

const documentExist = async ( id = '', model = '' ) => {

     const exist = await Models[model].findById( id );

     if ( !exist )
          throw new Error(`No se encontró ningun registro con el id ${id}`);
}

module.exports = {
     isValidRole,
     isValidTypeAccount,
     emailExist,
     documentExist,
     isValidRoleWithoutAdmin
}