//TODO: Add picture in method login with google

const { request, response } = require('express');
const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const { generateJWT, getJsonRes } = require('../helpers');
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
          
          const info = user._doc;
          const { name, account, role } = info;
          const result = { name, account, role, token };

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
          }

          if( !user.status ) 
               return res.status( 401 ).json( getJsonRes( false, 'Tu usuario está bloqueado, contacte a un admin' ) );

          const token = await generateJWT( user._id );
          const info = user._doc;
          const result = { name: info.name, account: info.account, role: info.role, token };

          res.status( 200 ).json( getJsonRes( true, `Bienvenido ${ result.name }`, result ) );

     } catch (error) {
          console.log(error);
          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );
     }

}



module.exports = { 
     login,
     google
}