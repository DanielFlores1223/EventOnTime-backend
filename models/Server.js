const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { dbConnection } = require('../database/config');
const { runSeeds } = require('../seeds')

class Server {
     constructor() {
          this.app = express();
          this.PORT = process.env.PORT;

          // you can access the routes with /api/nameRoute
          this.paths = {
               user: 'user',
               auth: 'auth',
               picture: 'picture',
          }

          this.connectDB();
          this.createFolder();
          this.middlewares();
          this.routes();
          this.seeds();
     }

     async connectDB() {
          await dbConnection();
     }

     createFolder() { 
          console.log()
          if( !fs.existsSync('./uploads') )
               fs.mkdirSync("./uploads");
     }

     middlewares() {
          this.app.use( express.urlencoded( { extended:true } ) );
          this.app.use( express.json() );
          this.app.use( cors() );
          this.app.use( '/uploads', express.static('uploads') );
     }

     routes() {
          for (const path in this.paths ) {
               this.app.use( `/api/${path}`, require(`../routes/${path}`) );
          }
     }

     async seeds() {
          await runSeeds();
     }


     listen() {
          this.app.listen( this.PORT, () => {
               console.log(`Server is running in port: ${this.PORT}`);
          } );
     }
}

module.exports = Server;