const { Schema, model, Types } = require('mongoose');

const SurveySchema = new Schema({
     answers: [ { type: Boolean } ],
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
     }
});

module.exports = model( 'Survey', SurveySchema );