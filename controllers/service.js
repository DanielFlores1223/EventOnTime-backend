const { request, response } = require('express');
const { getJsonRes, getImages, calculateStarts } = require('../helpers');
const { RolesEnum } = require('../helpers/enums');
const { Service, User, Payment, Survey, Picture } = require('../models');

//TODO: Get all images by each service
const getAll = async ( req = request, res = response ) => {

     try {
          
          const providers = await User.find( { role: RolesEnum.proveedor } );
          let ids = [];
          let idsTrue = [];
          const dateNow = new Date();

          // Getting the last payment of each provider and check if their payment is valid
          for (let i = 0; i < providers.length; i++) {
               const p = providers[i];
               
               const lastPayment = await Payment.find( { user: p._id } ).sort( { $natural:-1 } ).limit( 1 );
               console.log(p)
               if (  dateNow >= lastPayment[0].dateStart && dateNow <= lastPayment[0].dateEnd ) {
                    idsTrue = [ ...idsTrue, p._id ];
                    continue;
               }
                    
               ids = [ ...ids, p._id ];
          }

          // Updating services without a valid payment
          for (let i = 0; i < ids.length; i++) {
               const id = ids[i];
               await Service.updateMany( { user: id }, { view: false } );
          }

          // Updating services with a valid payment
          for (let i = 0; i < idsTrue.length; i++) {
               const id = idsTrue[i];
               await Service.updateMany( { user: id }, { view: true } );
          }

          // Getting the records of services
          const { limit = 5, from = 0, pagination = 'true' } = req.query;
          let result;
          const p = ( pagination.toLowerCase() === 'true' );
          
          if( p ) {
               result = await Promise.all([
                    Service.countDocuments( { status: true, view: true } ),
                    Service.find( { status: true, view: true } )
                        .skip( Number( from ) )
                        .limit( Number( limit ) )
               ]);
          
          } else {
               result = await Promise.all([
                    Service.countDocuments( { status: true, view: true } ),
                    Service.find( { status: true, view: true } )
               ]);
          }
     
          const [ total, services ] = result;
          const servImg = await getImages( services );
          console.log(services)
          const resultJson = { total, services: servImg };

          res.status( 200 ).json( getJsonRes( true, 'Servicios encontrados correctamente', resultJson ) );

     } catch (error) {
          console.log(error);
          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );
     }

}

const getById = async ( req = request, res = response ) => { 

     try {
          const { id } = req.params;
          const service = await Service.findById( id );
          const servImg = await getImages( service );
          const surveys = await Survey.find( { service: id } );
          let grades = []

          // Getting comments of the service
          for (let i = 0; i < surveys.length; i++) {
               const s = surveys[i];
               const idUser = s.user;
               const { name } = await User.findById( idUser );
               const stars = await calculateStarts( s.answers );
               const picture = await Picture.findOne( { document: idUser } );

               const data = { comments: s.comments, stars, user: { name, picture } };

               grades = [ ...grades, data ];
          }

          const result = { ...servImg, grades }

          res.status( 200 ).json( getJsonRes( true, 'Servicio encontrado correctamente', result ) );
     } catch (error) {
          console.log(error);
          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );
     }

}

const getMyServices = async ( req = request, res = response ) => {

     try {
          
          const { _id } = req.user;
          const { limit = 5, from = 0, pagination = 'true' } = req.query;
          let result;
          const p = ( pagination.toLowerCase() === 'true' );

          if( p ) {
               result = await Promise.all([
                    Service.countDocuments( { user: _id } ),
                    Service.find( { user: _id } )
                        .skip( Number( from ) )
                        .limit( Number( limit ) )
               ]);
          
          } else {
               result = await Promise.all([
                    Service.countDocuments( { user: _id } ),
                    Service.find( { user: _id } )
               ]);
          }
     
          const [ total, services ] = result;
          const servImg = await getImages( services );
          const resultJson = { total, services: servImg };

          res.status( 200 ).json( getJsonRes( true, 'Servicios encontrados correctamente', resultJson ) );

     } catch (error) {
          console.log(error);
          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );
     }

}

const search = async ( req = request, res = response ) => {
     
     try {
          const { limit = 5, from = 0, pagination = 'true', search = '' } = req.query;
          let result;
          const p = ( pagination.toLowerCase() === 'true' );

          const query = { 
                              '$and': [
                                   { 'status': true },
                                   {
                                        '$or': [  { 'name': { '$regex': search, '$options': 'i' }  }, 
                                                  { 'type': { '$regex': search, '$options': 'i' } } 
                                               ] 
                                   }
                              ]
                                   
                         } 
          if( p ) {
               result = await Promise.all([
                    Service.countDocuments( query ),
                    Service.find( query )
                        .skip( Number( from ) )
                        .limit( Number( limit ) )
               ]);
          
          } else {
               result = await Promise.all([
                    Service.countDocuments( query ),
                    Service.find( query )
               ]);
          }
     
          const [ total, services ] = result;
          const servImg = await getImages( services );
          const resultJson = { total, services: servImg };

          res.status( 200 ).json( getJsonRes( true, 'Servicios encontrados correctamente', resultJson ) );

     } catch (error) {
          console.log(error);
          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );
     }
}

const create = async ( req = request, res = response ) => {
     try {
          const { rating, status, ...body } = req.body;
          body.provider = req.user._id;
          // If the information of user could access to here, so they have a payment for showing their services
          body.view = true;

          const service = new Service( body );
          const result = await service.save();

          res.status( 201 ).json( getJsonRes( true, 'El servicio fue creado y publicado correctamente', result ) );

     } catch (error) {
          console.log(error);
          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );
     }
}

const update = async ( req = request, res = response ) => {
     
     try {
          const { id } = req.params;
          const { rating, status, view, ...body } = req.body;
          const service = await Service.findByIdAndUpdate( id, body, { new: true } );
          res.status( 200 ).json( getJsonRes( true, 'El servicio se modificó correctamente', service ) );

     } catch (error) {
          console.log(error);
          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );
     }

}

const deleteOne = async ( req = request, res = response ) => {
     
     try {
          const { id } = req.params; 
          const service = await Service.findByIdAndUpdate( id, { status: false, view: false }, { new: true } );
          res.status( 200 ).send( getJsonRes( true, 'El servicio se eliminó correctamente', service ) );
     
     } catch (error) {
          console.log(error);
          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );
     }
}


module.exports = {
     getAll,
     getById,
     getMyServices,
     search,
     create,
     update,
     deleteOne,
}