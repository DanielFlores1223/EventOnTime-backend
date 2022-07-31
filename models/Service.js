const { Schema, model, Types } = require('mongoose');

const ServiceSchema = new Schema({
     name: {
          type: String,
          required: true,
     },
     type: {
          type: String,
          required: true,
     },
     description: {
          type: String,
          required: true,
     },
     price: {
          type: Number,
          required: true,
     },
     phone: {
          type: String,
          required: true,
     },
     rating: {
          type: Number,
          required: true,
          default: 0
     },
     status: {
          type: Boolean,
          required: true,
          default: true,
     },
     view: {
          type: Boolean,
          required: true,
          default: false,
     },
     provider: {
          type: Types.ObjectId,
          required: true,
          ref: 'User'
     }
});

ServiceSchema.methods.toJSON = function() {

     // Editing data result of this collections 
     const { __v, ...service } = this.toObject();

     return service;
}

module.exports = model( 'Service', ServiceSchema );