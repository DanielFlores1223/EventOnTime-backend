// TODO: Add a record of payment when the user is created

const { request, response } = require('express');
const { getJsonRes, generateJWT } = require('../helpers');
const bcryptjs = require('bcryptjs')
const { User } = require('../models');

const getAll = async ( req = request, res = response ) => {

     try {
          const { limit = 5, from = 0, pagination = 'true' } = req.query;

          let result;
          const p = ( pagination.toLowerCase() === 'true' );
          
          if( p ) {
               result = await Promise.all([
                    User.countDocuments( { status: true } ),
                    User.find( { status: true } )
                        .skip( Number( from ) )
                        .limit( Number( limit ) )
               ]);
          
          } else {
               result = await Promise.all([
                    User.countDocuments( { status: true } ),
                    User.find( { status: true } )
               ]);
          }
     
          const [ total, users ] = result;

          const resultJson = { total, users };

          res.status( 200 ).json( getJsonRes( true, 'Usuarios encontrados correctamente', resultJson ) );

     } catch (error) {
          console.log(error);
          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );
     }

}

const getById = async ( req = request, res = response ) => {

     try {
          const { id } = req.params;
          const user = await User.findById( id );
          res.status( 200 ).json( getJsonRes( true, 'La información del usuario se encontró correctamente', user ) );
          
     } catch (error) {
          console.log(error);
          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );
     }
}

const getInfoProfile = async ( req = request, res = response ) => {

     try {
          const { _id } = req.user;
          const user = await User.findById( _id );
          res.status( 200 ).json( getJsonRes( true, 'La información del usuario se encontró correctamente', user ) );
     
     } catch (error) {
          console.log(error);
          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );

     }
}

const create = async ( req = request, res = response ) => {
     try {
          const { name, email, password, status, account, role } = req.body;

          const user = new User( { name, email, password, status, account, role } );

          // Encrypting user password
          const salt = bcryptjs.genSaltSync();
          user.password = bcryptjs.hashSync(password, salt);

          await user.save();

          res.status( 201 ).json( getJsonRes( true, ` Bienvenido ${user.name} a Event on Time`, user ) );

     } catch (error) {
          console.log(error);
          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );
     }
}

const register = async ( req = request, res = response ) => {
     try {
          const { name, email, password, status, account, role } = req.body;

          const user = new User( { name, email, password, status, account, role } );

          // Encrypting user password
          const salt = bcryptjs.genSaltSync();
          user.password = bcryptjs.hashSync(password, salt);

          await user.save();

          const token = await generateJWT( user._id );
          const info = user._doc;
          const result = { name: info.name, 
                           account: info.account, 
                           role: info.role,
                           picture: pictureInfo, 
                           token };

          res.status( 201 ).json( getJsonRes( true, ` Bienvenido ${user.name} a Event on Time`, result ) );

     } catch (error) {
          console.log(error);
          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );
     }
}

// Update profile of the user
const update = async ( req = request, res = response ) => {

     try {
          const { google, favorites, status, account, role, _id, ...rest } = req.body;

          if( rest.password ) {
               const salt = bcryptjs.genSaltSync();
               rest.password = bcryptjs.hashSync( rest.password, salt );
          }

          const user = await User.findByIdAndUpdate( req.user._id, rest, { new: true } );

          res.status( 200 ).send( getJsonRes( true, `Tu perfil se modificó correctamente`, user ) );

     } catch (error) {
          console.log( error );

          if( error.message.includes( 'E11000 duplicate key' ) )
               return res.status( 400 ).send( getJsonRes( false, 'El correo que intentó registrar ya existe' ) );

          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );
     }
}

const deleteOne = async ( req = request, res = response ) => {
     
     try {
          const { id } = req.params; 
          const user = await User.findByIdAndUpdate( id, { status: false }, { new: true } );
          res.status( 200 ).send( getJsonRes( true, 'El usuario se eliminó correctamente', user ) );
     
     } catch (error) {
          console.log(error);
          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );
     }
}

module.exports = {
     getAll,
     getById,    
     getInfoProfile,
     create,
     register,
     update,
     deleteOne,
}