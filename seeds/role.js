const Role = require('../models/Role');

const saveSeedRoles = async () => {

     const roles = await Role.find().count();

     if (roles > 0) 
          return;

     const role1 = new Role({ name: 'Admin' });   
     const role2 = new Role({ name: 'Planificador' });
     const role3 = new Role({ name: 'Proveedor' });
     const role4 = new Role({ name: 'Invitado' });
     const role5 = new Role({ name: 'Cadenero' });

     await Promise.all([ role1.save(), 
                         role2.save(), 
                         role3.save(), 
                         role4.save(), 
                         role5.save() ]);
                         
     console.log('roles have successfully completed');

}


module.exports = {
     saveSeedRoles,
}