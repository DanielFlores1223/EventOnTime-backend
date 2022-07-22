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

module.exports = model( 'Service', ServiceSchema );