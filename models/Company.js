const { Schema, model, Types } = require('mongoose');

const CompanySchema = new Schema({
     workstation: {
          type: String,
          required: true,
     },
     company: {
          type: String,
          required: true
     },
     user:{
          type: Types.ObjectId,
          ref: 'User',
          required: true,
     }
});

module.exports = model( 'Company', CompanySchema );