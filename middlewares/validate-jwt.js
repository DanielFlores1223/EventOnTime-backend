const jwt = require('jsonwebtoken');
const { User, Guest } = require('../models');
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

const validateJWTGuest = async (req, res, next) => {

     //Get token from headers
     const token = req.header('Authorization');

     if( !token ) 
          return res.status(401).json( getJsonRes( false, 'No hay token en la petición' ) );

     try {
          //verify if token is valid
          const { uid } = jwt.verify( token, process.env.SECRETPRIVATEKEY );
          const guest = await Guest.findById( uid ).populate('event');

          if ( !guest ) 
               return res.status(401).json( getJsonRes( false, 'token inválido' ) );

          req.guest = guest;
          
          next();
     
     } catch (error) {
          console.log(error);
          res.status(401).json( getJsonRes( false, 'token inválido' ) );
     }

}

module.exports = {
     validateJWT,
     validateJWTGuest
}