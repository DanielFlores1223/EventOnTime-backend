const { request, response } = require('express');
const { Survey } = require('../models');
const { getJsonRes, updateStarsService } = require('../helpers');

const create = async ( req = request, res = response ) => {

     try {
          
          const { _id } = req.user;
          const { id } = req.params; //id of service

          req.body.user = _id;
          req.body.service = id;

          const newSurv = new Survey( req.body );
          const result = await newSurv.save();

          await updateStarsService( id );

          res.status( 201 ).json( getJsonRes( true, 'Las respuestas de la encuesta se ha guardado correctamente', result ) ); 

     } catch (error) {
          console.log(error);
          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );
     }

}

module.exports = {
     create,
}