const Role = require('../models/Role');

const saveSeedRoles = async () => {

     const roles = await Role.find().count();

     if (roles > 0) 
          return;

     const role1 = new Role({ name: 'Admin' });   
     const role2 = new Role({ name: 'Planificador' });
     const role3 = new Role({ name: 'Proveedor' });

     await Promise.all([ role1.save(), role2.save(), role3.save() ]);
     console.log('roles have successfully completed');

}


module.exports = {
     saveSeedRoles,
}