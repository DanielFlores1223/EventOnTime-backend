const { Schema, model } = require('mongoose');


const ContactUsSchema = new Schema({
     name: {
          type: String,
          required: true
     },
     email: {
          type: String,
          required: true
     },
     message: {
          type: String,
          required: true
     },
     view: {
          type: Boolean,
          required: true,
          default: false,
     }
});

ContactUsSchema.methods.toJSON = function() {

     // Editing data result of this collections 
     const { __v, ...contact } = this.toObject();

     return contact;
}


module.exports = model( 'ContactUs', ContactUsSchema );