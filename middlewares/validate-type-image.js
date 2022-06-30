const { request, response } = require("express");
const { getJsonRes, deleteFiles } = require('../helpers');

const isImage = async ( req = request, res = response, next ) => {

     const files = req.files;
     let errors = [];

     if( files.length === 0 ) {
          deleteFiles( files );
          return res.status(400).json( getJsonRes( false, 'No se incluyo ningún archivo en la petición' ) );
     }
         

     for (let i = 0; i < files.length; i++) {
          
          const type = files[i].mimetype;
          
          if ( type.includes('image') )
               continue;

           errors = [ ...errors, 'Todos los archivos deben ser imagenes' ];
     }

     if( errors.length === 0 )
          return next();

     deleteFiles( files );
     res.status(400).json( getJsonRes( false, 'Todos los archivos deben ser Imagenes!' ) );
}

module.exports = {
     isImage,
}

