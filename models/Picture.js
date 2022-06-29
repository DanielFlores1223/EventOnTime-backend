const { Schema, model, Types } = require('mongoose');
const { ObjectId } = Types;

const PictureSchema = new Schema({

     url: {
          type: String,
          required: true
     },
     name: {
          type: String,
          required: true
     },
     document: {
          type: ObjectId,
          required: true
     },
     collectionDB: {
          type: String,
          enum: {
               values: ['User', 'Service', 'Event', 'Section' ]
          }
     }
});

module.exports = model( 'Picture', PictureSchema );

