const Model = require('../models');
const { getJsonRes } = require('../helpers')

const idExistInModel = async ( req, res, next ) => {
     
     const { collection, id } = req.params;

     const exist = await Model[ collection ].findById( id );

     if ( !exist )
          return res.status(400).send( getJsonRes( false, `No existe algun registro con el id ${id}` ) )
          
     next();
}    

module.exports = {
     idExistInModel,
}