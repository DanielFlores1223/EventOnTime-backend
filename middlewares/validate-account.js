const { getJsonRes } = require('../helpers')

const validateTypeAccount = ( ...typeAccounts ) => {
    
     return ( req, res, next ) => {

          if( !req.user )
               return res.status(500).json( getJsonRes( false, 'Error en la autenticación del usuario' ) );
          
          if( !typeAccounts.includes( req.user.account ) )
               return res.status(401).json( getJsonRes( false,  `${req.user.name} no tiene el tipo de cuenta necesario para realizar está acción` ) );

          next();
     }
}

module.exports = {
     validateTypeAccount
}
