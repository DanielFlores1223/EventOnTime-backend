// TODO: Add a record of payment when the user is created
const { request, response } = require('express');
const { getJsonRes, generateJWT, getImages } = require('../helpers');
const { TypeAccountsEnum } = require('../helpers/enums');
const bcryptjs = require('bcryptjs')
const { User, Payment } = require('../models');
const mongoose = require('mongoose');

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

          const { _id, account } = req.user;
          const user = await User.findById( _id );
          const userImg = await getImages( user );
          res.status( 200 ).json( getJsonRes( true, 'La información del usuario se encontró correctamente', userImg ) );

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
          const { name, email, password, status, account, role, company, workstation } = req.body;

          let dataCompany = {};
          if( company && workstation ) {
               dataCompany = { company, workstation };
          }

          const user = new User( { name, 
                                   email, 
                                   password, 
                                   status, 
                                   account: TypeAccountsEnum.gratuito, 
                                   role, 
                                   company: dataCompany } );

          // Encrypting user password
          const salt = bcryptjs.genSaltSync();
          user.password = bcryptjs.hashSync(password, salt);

          await user.save();

          const token = await generateJWT( user._doc._id );
          const info = user._doc;
          const result = { name: info.name, 
                           account: info.account, 
                           role: info.role,
                           token };

          if( Object.keys( info.company ).length > 0 )
               result.company = info.company

          // Recording the first payment free (it's default)
          const payment = {
               numberCard: '-',
               nameOwnerCard: '-',
               expiration: '-',
               amount: 0,
               user: info._id
          };

          // Get currently date and add one month
          payment.dateStart = new Date();
          let d = new Date();
          const dateFinish = new Date(d.setMonth(d.getMonth() + 1));
          payment.dateEnd = dateFinish;


          const paymentNew = new Payment( payment );
          await paymentNew.save();

          res.status( 201 ).json( getJsonRes( true, ` Bienvenido ${user.name} a Event on Time`, result ) );

     } catch (error) {
          console.log(error);
          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );
     }
}

// Update profile of the user
const update = async ( req = request, res = response ) => {

     try {
          
          let { google, favorites, status, account, role, _id, workstation, company, ...rest } = req.body;

          if( rest.password ) {
               const salt = bcryptjs.genSaltSync();
               rest.password = bcryptjs.hashSync( rest.password, salt );
          }

          if( company || workstation ) {

               if( company )
                    rest = { ...rest, 'company.company': company } ;

               if( workstation )
                    rest = { ...rest, 'company.workstation': workstation } ;
          }


          const user = await User.findByIdAndUpdate( req.user._id , rest , { new: true } );

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

// FAVORITES
const addFavorites = async ( req = request, res = response ) => {

     try {     
          const { idService } = req.body;
          const { _id } = req.user;

          if ( req.user.favorites.includes( idService ) ) {
               return res.status( 400 ).send( getJsonRes( false, 'Este servicio ya está agregado a tus favoritos' ) );
          }

          const user = await User.findById( _id );
          const { favorites } = user;

          const newFavorites = [ ...favorites, idService ];

          user.favorites = newFavorites;

          await user.save();
          res.status( 200 ).send( getJsonRes( true, 'Servicio agregado a favoritos', user ) );

     } catch (error) {
          console.log(error);
          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );
     }

}

const getFavorites = async ( req = request, res = response ) => {
     try {
          const { limit = 5, from = 0, /*pagination = 'true'*/ search = '' } = req.query;
          let result = [];
          //const p = ( pagination.toLowerCase() === 'true' );

          const { _id } = req.user;
          
          const userFav = await User.findById( _id ).populate('favorites');
          const { favorites } = userFav;

          const favoritesImg = await getImages( favorites );

          const regex = new RegExp( search, 'i' )
          // Searching for regex of search
          for (let i = 0; i < favoritesImg.length; i++) {
               const f = favoritesImg[i];

               if( f.name.match(regex) || f.type.match(regex) )
                    result = [ ...result, f ];
          }

          //console.log(result)

          let resultPag = [];
          let fromArr = from;
          //Pagination
          for (let i = 0; i < limit; i++) {
               if( fromArr >= result.length )
                    break;

               resultPag = [ ...resultPag, result[ fromArr ] ];
               fromArr++;
          }

          const resultJson = { total: result.length , services: resultPag };
          res.status( 200 ).json( getJsonRes( true, 'Servicios encontrados correctamente', resultJson ) );
     } catch (error) {
          console.log(error);
          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );
     }
}

const removeFavorites = async ( req = request, res = response ) => {

     try {     
          const { idService } = req.body;
          const { _id } = req.user;

          const idMongo = new mongoose.Types.ObjectId(idService);
          
          const user = await User.findById( _id );
          const { favorites } = user;

          const newFavorites = favorites.filter( f => String(f) !== String(idMongo) );

          if ( newFavorites.length === favorites.length ) {
               return res.status( 400 ).send( getJsonRes( false, 'Este servicio no se encuentra en tus favoritos' ) );
          }

          user.favorites = newFavorites;

          await user.save();
          res.status( 200 ).send( getJsonRes( true, 'Servicio eliminado de favoritos', user ) );

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
     addFavorites,
     getFavorites,
     removeFavorites
}