const { model, Schema } = require('mongoose');

const TypeAccountSchema = new Schema( {

     name:  { 
          type: String,
          unique: true,
          required: true
     },
     permits: {
          personal: Boolean,
          familiar: Boolean,
          educational: Boolean,
          labor: Boolean
     }

} );


module.exports = model( 'TypeAccount', TypeAccountSchema );