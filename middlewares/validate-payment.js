const { request, response } = require("express");
const { Payment } = require('../models');
const { getJsonRes } = require('../helpers');

/*
     If you want to use this middlewares, first you have to use validateJWT middleware
     becuase in this we use the user information
*/
const validatePayment = async ( req = request, res = response, next ) => {

      const { _id } = req.user;
      const dateNow = new Date();
      // Getting the last payment of the user
      const payment = await Payment.find( { user: _id } ).sort( { $natural:-1 } ).limit( 1 );
      
      if( payment.length === 0 )
          return res.status( 400 ).json( getJsonRes( false,  `Hola ${req.user.name}, tu cuenta no tiene ningun tipo de cuenta seleccionada:(`) );

      req.payment = payment[0];

      if ( dateNow >= payment[0].dateStart && dateNow <= payment[0].dateEnd ) 
           return next();
     
      res.status(401).json( getJsonRes( false,  `Hola ${req.user.name}, lamentamos informarte que tu mensualidad de tipo ${payment[0].typeAccount} ha vencido :(`) );

}

module.exports = {
     validatePayment
}