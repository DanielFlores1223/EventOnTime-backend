const TypeAccount = require('../models/TypeAccount');

const saveSeedTypeAccounts = async () => {

     const types = await TypeAccount.find().count();

     if (types > 0) 
          return;

     const types1 = new TypeAccount({ 
          name: 'Gratuito',
          permits: {
               personal: true,
               familiar: false,
               educational: false,
               labor: false
          }
     });   

     const types2 = new TypeAccount({ 
          name: 'Premium',
          permits: {
               personal: true,
               familiar: true,
               educational: false,
               labor: false
          }
     });

     const types3 = new TypeAccount({
          name: 'Empresarial',
          permits: {
               personal: true,
               familiar: true,
               educational: true,
               labor: true
          }
      });

     await Promise.all([ types1.save(), types2.save(), types3.save() ]);

     console.log('type of accounts have successfully completed');

}

module.exports = {
     saveSeedTypeAccounts
}