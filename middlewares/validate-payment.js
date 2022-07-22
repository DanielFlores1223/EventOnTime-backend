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
      
      if ( dateNow >= payment[0].dateStart && dateNow <= payment[0].dateEnd ) 
           return next();
     
      res.status(401).json( getJsonRes( false,  `Hola ${req.user.name}, lamentamos informarte que tu mensualidad ha vencido :(`) );

}

module.exports = {
     validatePayment
}