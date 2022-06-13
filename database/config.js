const { default: mongoose } = require("mongoose")

const dbConnection = async() => {
     try {
          await mongoose.connect(process.env.MONGO_CNN, {
               useNewUrlParser: true,
               useUnifiedTopology: true, 
          });

          console.log( 'Data Base online' );
     } catch (error) {
          console.log( error );
          throw new Error( 'Error database connection' );
     }
}

module.exports = {
     dbConnection
}