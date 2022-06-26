const { Role, User, TypeAccount } = require('../models');

const isValidRole = async ( role = '' ) => {
     const exist = await Role.findOne( { name: role } );

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


module.exports = {
     isValidRole,
     isValidTypeAccount,
     emailExist
}