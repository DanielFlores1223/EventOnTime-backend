const { model, Schema } = require('mongoose');
const { ObjectId } = Schema.Types;

const UserSchema = new Schema({
     
     name: {
          type: String,
          required: true,
     },
     email: {
          type: String,
          required: true,
          unique: true,
     },
     password: {
          type: String,
          required: true,
     },
     google: {
          type: Boolean,
          required: true,
          default: false
     },
     favorites: [{ type: ObjectId, ref: 'Service', default: [] }],
     status: {
          type: Boolean,
          required: true,
          default: true
     },
     account: {
          type: String,
          required: true,
     },
     role: {
          type: String,
          required: true,
     }
});

UserSchema.methods.toJSON = function() {

     // Editing data result of this collections 
     const { __v, password, _id, ...user } = this.toObject();

     user.uid = _id;

     return user;
}

module.exports = model( 'User', UserSchema );