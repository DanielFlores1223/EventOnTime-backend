const { validationResult } = require('express-validator');
const { getJsonRes } = require('../helpers')

const validateFields = ( req, res, next ) => {

     //check if there are errors in the request
     const errors = validationResult( req );
     
     if (!errors.isEmpty()) 
          return res.status(400).json( getJsonRes( false, 'información erronea', errors ) );

     next();
}

module.exports = {
     validateFields
}