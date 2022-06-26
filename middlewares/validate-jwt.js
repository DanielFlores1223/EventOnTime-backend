const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { getJsonRes } = require('../helpers');

const validateJWT = async (req, res, next) => {

     //Get token from headers
     const token = req.header('Authorization');

     if( !token ) 
          return res.status(401).json( getJsonRes( false, 'No hay token en la petición' ) );

     try {
          //verify if token is valid
          const { uid } = jwt.verify( token, process.env.SECRETPRIVATEKEY );
          const user = await User.findById( uid );

          if ( !user || !user.status ) 
               return res.status(401).json( getJsonRes( false, 'token inválido' ) );

          req.user = user;
          
          next();
     
     } catch (error) {
          console.log(error);
          res.status(401).json( getJsonRes( false, 'token inválido' ) );
     }

}

module.exports = {
     validateJWT,
}