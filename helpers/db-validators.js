const { Role } = require('../models');

const isValidRole = async ( role = '' ) => {
     const exist = await Role.findOne( { role } );

     if (!exist) {
          throw new Error(`El rol ${role} no existe`);
     }
}


module.exports = {
     isValidRole
}