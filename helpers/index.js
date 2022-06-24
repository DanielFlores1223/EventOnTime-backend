const jsonResponses = require('./json-responses');
const dbValidators = require('./db-validators');

module.exports = {
     ...jsonResponses,
     ...dbValidators
}