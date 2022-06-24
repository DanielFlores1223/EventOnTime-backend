const validateFields = require('./validate-fields');
const validateJWT = require('./validate-jwt');
const validateRole = require('./validate-role');
const validateAccount = require('./validate-account');



module.exports = {
     ...validateFields,
     ...validateJWT,
     ...validateRole,
     ...validateAccount,
     
}