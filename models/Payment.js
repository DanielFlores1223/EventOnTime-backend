const { Schema, model, Types } = require('mongoose');

const PaymentSchema = new Schema({

     numberCard: {
          type: String,
          required: true
     },
     nameOwnerCard: {
          type: String,
          required: true
     },
     amount: {
          type: Number,
          required: true
     },
     dateStart: {
          type: Date,
          required: true
     },
     dateEnd: {
          type: Date,
          required: true
     },
     numberEvents: {
          type: Number,
          required: true
     },
     typeAccount: {
          type: String,
          required: true,
          default: 'Gratuito'
     },
     user: {
          type: Types.ObjectId,
          ref: 'User',
          required: true
     }

});

module.exports = model( 'Payment', PaymentSchema );