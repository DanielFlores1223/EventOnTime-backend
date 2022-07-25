const jsonResponses = require('./json-responses');
const dbValidators = require('./db-validators');
const generateJWT = require('./generate-jwt');
const withoutDBValidators = require('./without-db-validators');
const fsHelper = require('./fs-helper');
const getImages = require('./getImages');
const updateStarsService = require('./calculate-stars');
const generateNumberRandom = require('./generate-number-random');

module.exports = {
     ...jsonResponses,
     ...dbValidators,
     ...generateJWT,
     ...withoutDBValidators,
     ...fsHelper,
     ...getImages,
     ...updateStarsService,
     ...generateNumberRandom,
}