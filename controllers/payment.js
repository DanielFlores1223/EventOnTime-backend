const { request, response } = require('express');
const { Payment, User } = require('../models');
const { getJsonRes } = require('../helpers');

const getLastCreditCard = async ( req = request, res = response ) => {

     try {
          const { _id } = req.user;

          // Get the last register of the user
          const result = await Payment.find( { user: _id } ).sort({$natural:-1}).limit(1);

          const { numberCard, nameOwnerCard, expiration } = result[0]._doc;
          const data = { numberCard, nameOwnerCard, expiration }

          res.status( 200 ).json( getJsonRes( true, 'La información de la última tarjeta que utilizaste se realizó correctamente', data ) );

     } catch (error) {
          console.log(error);
          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );
     }

}

const getInfoLastPayment = async ( req = request, res = response ) => {

     try {
          const { _id } = req.user;

          // Get the last register of the user
          const result = await Payment.find( { user: _id } ).sort({$natural:-1}).limit(1);

          const { numberCard, nameOwnerCard, expiration, ...rest } = result[0]._doc;

          res.status( 200 ).json( getJsonRes( true, 'Información de tu último pago realizado correctamente', rest ) );

     } catch (error) {
          console.log(error);
          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );
     }

}

const create = async ( req = request, res = response ) => {

     try {
          const { _id } = req.user;
          const { numberEvents, ...body } = req.body;
          
          body.user = _id;
          body.dateStart = new Date();

          //
          
          // Getting the last payment of the user
          const payment = await Payment.find( { user: _id } ).sort( { $natural:-1 } ).limit( 1 );

          const dateNow = new Date();

          if ( payment.length > 0 && dateNow >= payment[0].dateStart && dateNow <= payment[0].dateEnd ) {
                let d2 = new Date( payment[0].dateEnd );
                let dateFinishExist = new Date( d2.setMonth( d2.getMonth() + 1 ) );
                body.dateEnd = dateFinishExist;
          } else {
                // Add a year date currently
                let d = new Date();
                const dateFinish = new Date(d.setMonth(d.getMonth() + 1));
                body.dateEnd = dateFinish;
          }
          
          //Get info about the user
          const user = await User.findById( _id );

          // Set amount of price, if the role of the user is Planificador or Proveedor
          if ( user.role === 'Planificador' ) {
               if ( body.typeAccount === 'Gratuito' ) 
                    body.amount = 0;
                    
               if ( body.typeAccount === 'Premium' ) 
                    body.amount = 150;
               
               if ( body.typeAccount === 'Empresarial' ) 
                    body.amount = 2000;
          }

          if ( user.role === 'Proveedor' ) {
               if ( body.typeAccount === 'Gratuito' ) 
                    body.amount = 0;
                    
               if ( body.typeAccount === 'Premium' ) 
                    body.amount = 2000;
          }

          // Updating the type of user account 
          await User.findByIdAndUpdate( _id, { account: body.typeAccount }, { new: true } );

          const paymentNew = new Payment( body );
          const result = await paymentNew.save(); 

          res.status( 201 ).json( getJsonRes( true, 'Tu pago se ha realizado correctamente', result ) );
          
     } catch (error) {
          console.log(error);
          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );
     }

}

module.exports = {
     getLastCreditCard,
     getInfoLastPayment,
     create,
}
