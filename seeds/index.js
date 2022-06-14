const { saveSeedRoles } = require('./role');
const { saveSeedTypeAccounts } = require('./typeAccount');

const runSeeds = async() => {
     
     // Run seeds
     await saveSeedRoles();
     await saveSeedTypeAccounts();

     console.log('seeds done!');
}


module.exports = {
     runSeeds
}