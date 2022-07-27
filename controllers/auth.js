const { request, response } = require('express');
const { User, Picture, Payment, Event, Guest }= require('../models');
const bcryptjs = require('bcryptjs');
const { generateJWT, getJsonRes, getImages } = require('../helpers');
const { googleVerify } = require('../helpers/google-verify');
const { TypeAccountsEnum } = require('../helpers/enums');

const login = async ( req = request, res = response ) => {

     try {
          const { email, password } = req.body;
          const user = await User.findOne( { email } );
  
          if ( !user || !user.status )
               return res.status( 404 ).json( getJsonRes( false, 'Credenciales Incorrectas' ) );
          
          if( user.google )
               return res.status( 400 ).json( getJsonRes( false, 'Inicia sesión con Google' ) );

          const validPassword = bcryptjs.compareSync( password, user.password );
     
          if ( !validPassword )
               return res.status( 404 ).json( getJsonRes( false, 'Credenciales Incorrectas' ) );

          const token = await generateJWT( user._id );
          
          const picture = await Picture.findOne( { document: user._id } );
          const info = user._doc;
          const { name, account, role } = info;
          const result = { name, account, role, picture, token };

          res.status( 200 ).json( getJsonRes( true, `Bienvenido ${ name }`, result ) );
          
     } catch (error) {
          console.log(error);
          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );
     }

}

const google = async ( req = request, res = response ) => {

     try {
          const { id_token, role } = req.body;
          const { name, email, picture } = await googleVerify( id_token );

          let user = await User.findOne( { email } );

          if ( !user ) {
               const data = {
                    name,
                    email,
                    password : '@@@@aaa!*921s',
                    role,
                    google: true,
                    account: TypeAccountsEnum.gratuito, 
               }

               user = new User( data );
               await user.save();

               // Register a Google Picture 
               const dataPicture = {
                    url: picture,
                    name: `${name}-googleImg`,
                    document: user._id,
                    collectionDB: 'User'
               }

               const pictureNew = new Picture( dataPicture );
               await pictureNew.save();

               // Recording the first payment free (it's default)
               const payment = {
                    numberCard: '-',
                    nameOwnerCard: '-',
                    expiration: '-',
                    amount: 0,
                    user: user._id
               };

               // Get currently date and add one month
               payment.dateStart = new Date();
               let d = new Date();
               const dateFinish = new Date(d.setMonth(d.getMonth() + 1));
               payment.dateEnd = dateFinish;

               // Saving the payment created
               const paymentNew = new Payment( payment );
               await paymentNew.save();
          }

          if( !user.status ) 
               return res.status( 401 ).json( getJsonRes( false, 'Tu usuario está bloqueado, contacte a un admin' ) );
          

          const pictureInfo = await Picture.findOne( { document: user._id } );
          const token = await generateJWT( user._id );
          const info = user._doc;
          const result = { name: info.name, 
                           account: info.account, 
                           role: info.role,
                           picture: pictureInfo,
                           token };

          res.status( 200 ).json( getJsonRes( true, `Bienvenido ${ result.name }`, result ) );

     } catch (error) {
          console.log(error);
          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );
     }

}

const event = async ( req = request, res = response ) => {

     try {
          
          const { codeEvent, codeInvit } = req.body;

          const guest = await Guest.findOne( { code: codeInvit } ).populate('event');

          if( !guest || codeEvent !== guest.event.code )
               return res.status( 404 ).json( getJsonRes( false, 'Credenciales Incorrectas' ) );
          
          const event = await Event.findById( guest.event._id ).populate({
               path: 'services',
               select: '_id name description'
          });

          const result = await getImages( event );

          res.status( 200 ).json( getJsonRes( true, `Bienvenido ${ guest.name }`, result ) );

     } catch (error) {
          console.log(error);
          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );
     }

}

module.exports = { 
     login,
     google,
     event
}