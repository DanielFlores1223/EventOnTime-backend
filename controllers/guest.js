const { request, response } = require('express');
const { Guest } = require('../models');
const { getJsonRes } = require('../helpers');

const updateAssistenceConfirmation = async ( req = request, res = response ) => {

     try {
          const { _id } = req.guest;
          const guest = await Guest.findById( _id );
          const gUpdate = await Guest.findByIdAndUpdate( _id, 
                                                        { confirmation: !guest.confirmation }, 
                                                        { new: true } );
          let msg = 'confirmado tu';
          if( !gUpdate.confirmation )
               msg = 'rechazado la';

          res.status( 200 ).json( getJsonRes( true, `Se ha ${msg} asistencia al evento`, gUpdate ) );
          
     } catch (error) {
          console.log(error);
          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );
     }

}

const updateAssistence = async ( req = request, res = response ) => {

     try {
          const { id } = req.params;
          const gUpdate = await Guest.findByIdAndUpdate( id, 
                                                        { assitence: true }, 
                                                        { new: true } );

          res.status( 200 ).json( getJsonRes( true, 'La asistencia al evento se ha registrado', gUpdate ) );
          
     } catch (error) {
          console.log(error);
          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );
     }

}

module.exports = {
     updateAssistenceConfirmation,
     updateAssistence,
}