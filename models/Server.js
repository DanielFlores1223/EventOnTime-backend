const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {
     constructor() {
          this.app = express();
          this.PORT = process.env.PORT;

          // you can access the routes with /api/nameRoute
          this.paths = {
               example: 'example',
          }

          this.connectDB();
          this.middlewares();
          this.initRoutes();
          this.seeds();
     }

     async connectDB() {
          await dbConnection();
     }

     middlewares() {
          this.app.use( express.json() );
          this.app.use( cors() );
     }

     initRoutes() {
          for (const path in this.paths ) {
               this.app.use( `/api/${path}`, require(`../routes/${path}`) );
          }
     }

     async seeds() {

     }


     listen() {
          this.app.listen( this.PORT, () => {
               console.log(`Server is running in port: ${this.PORT}`);
          } );
     }
}

module.exports = Server;