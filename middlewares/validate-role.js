const { getJsonRes } = require('../helpers')

const validateRole = ( ...roles ) => {
    
     return ( req, res, next ) => {

          if( !req.user )
               return res.status(500).json( getJsonRes( false, 'Error en la autenticación del usuario' ) );
          
          if( !roles.includes( req.user.role ) )
               return res.status(401).json( getJsonRes( false,  `${req.user.name} no tiene permisos para realizar está acción`) );

          next();
     }
}

module.exports = {
     validateRole,
}