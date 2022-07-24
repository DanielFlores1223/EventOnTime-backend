const { Schema, model, Types } = require('mongoose');

const EventSchema = new Schema({
     name: {
          type: String,
          required: true
     },
     code: {
          type: String,
          required: true
     },
     description: {
          type: String,
          required: true
     },
     dateStart: {
          type: Date,
          required: true
     },
     dateFinish: {
          type: String,
          required: true
     },
     googleMaps: {
          type: String,
          required: true
     },
     dressCode: {
          type: String,
          required: true
     },
     address: {
          type: String,
          required: true
     },
     services: [ { type: Types.ObjectId, ref: 'Service' } ],
     type: {
          type: String,
          enum: {
               values: [ 'Personal', 'Familiar', 'Educativo', 'Laboral' ]
          },
          required: true
     },
     status: {
          type: Boolean,
          default: true
     },
     planner: {
          type: Types.ObjectId, 
          ref: 'User'
     }
});

module.exports = model( 'Event', EventSchema );