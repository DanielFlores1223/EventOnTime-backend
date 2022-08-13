const { Schema, model, Types } = require('mongoose');

const SurveySchema = new Schema({
     answers: [ { type: Boolean, required: false } ],
     comments: {
          type: String,
          required: false
     },
     user: {
          type: Types.ObjectId,
          ref: 'User'
     },
     service: {
          type: Types.ObjectId,
          ref: 'Service'
     },
     event: {
          type: Types.ObjectId,
          ref: 'Event'
     }
});

module.exports = model( 'Survey', SurveySchema );