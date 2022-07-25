const { Schema, model, Types } = require('mongoose');

const GuestSchema = new Schema({
     
     code: {
          type: String,
          required: true,
     },
     name: {
          type: String,
          required: true,
     },
     assitence: {
          type: Boolean,
          required: true,
          default: false,
     },
     confirmation: {
          type: Boolean,
          required: true,
          default: false,
     },
     numberPartner: {
          type: Number,
          default: 1
     },
     email: {
          type: String,
          required: true,
     },
     event: {
          type: Types.ObjectId,
          ref: 'Event',
          required: true,
     },
     rol: {
          type: String,
          required: true,
          default: 'Invitado'
     }
     
});

module.exports = model( 'Guest', GuestSchema );