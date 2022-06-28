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
     }

});

module.exports = model( 'Picture', PictureSchema );

