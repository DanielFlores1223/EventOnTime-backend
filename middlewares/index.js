const validateFields = require('./validate-fields');
const validateJWT = require('./validate-jwt');
const validateRole = require('./validate-role');
const validateAccount = require('./validate-account');
const validateImage = require('./validate-type-image');
const validateIdExistModel = require('./validate-id-exist-model');
const multer = require('./multer');



module.exports = {
     ...validateFields,
     ...validateJWT,
     ...validateRole,
     ...validateAccount,
     ...validateImage,
     ...validateIdExistModel,
     ...multer,
}