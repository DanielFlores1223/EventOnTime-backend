const { Event, Payment, Guest, Service, Survey, User, Picture } = require('../models');
const { getJsonRes, getImages, calculateStarts } = require('../helpers');
const { request, response } = require('express');

const getDataDashboardPlanner = async ( req = request, res = response ) => {
     
     try {
          const { _id } = req.user;

          const dateNow = new Date();
          let eventsSAndP = {
               amountSuccess: [],
               amountPending: []
          }

          const events = await Event.find(  { '$and': [ { status: true }, { planner: _id } ] });
          const lastPayment =  await Payment.find( { user: _id } ).sort( { $natural:-1 } ).limit( 1 );
     
          //Getting pending and success events
          for (let i = 0; i < events.length; i++) {
               const e = events[i];

               const dateEvent = new Date( e.dateFinish );

               if( dateNow.getTime() < dateEvent.getTime() ) 
                    eventsSAndP.amountPending = [ ...eventsSAndP.amountPending, e ];
               else
                    eventsSAndP.amountSuccess = [ ...eventsSAndP.amountSuccess, e ];
               
          }

          //Getting days for finishing the payment
          var x = new Date( lastPayment[0].dateEnd );
          var y = new Date( dateNow );
          const diffInDays = Math.floor((x - y) / (1000 * 60 * 60 * 24));

          const result = {
               pieChart: [
                    { name: "Eventos completados", value: eventsSAndP.amountSuccess.length },
                    { name: "Eventos Pendientes", value: eventsSAndP.amountPending.length }
               ],
               daysOff: diffInDays,
               numberEvents: lastPayment[0].numberEvents,
          }
       
          res.status( 200 ).json( getJsonRes( true, 'Información para el dashboard correctamente', result ) );

     } catch (error) {
          console.log( error );
          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );
     }

}

const getDataPlannerMovilApp = async( req = request, res = response ) => {

     try {
          const { _id } = req.user;
          const events = await Event.find( { '$and': [ { status: true }, { planner: _id } ] } );

          let eventsActive = [];
          const dateNow = new Date();

          for (let i = 0; i < events.length; i++) {
               const e = events[i];
            
               const dateFinish = new Date( e.dateFinish )
               if( dateNow.getTime() < dateFinish.getTime() ) {
                    
                    const gConfirmation = await Guest.find( { '$and': [ 
                                                                        { confirmation: true },
                                                                        { event: e._id }
                                                                      ] 
                                                            } ).count();

                    const gNoConfirmation = await Guest.find( { '$and': [ 
                                                                           { confirmation: false },
                                                                           { event: e._id }
                                                                         ] 
                                                               } ).count();

                    const eventImg = await getImages( e );
                    const data = { ...eventImg, stadistics: { amountConfirmation: gConfirmation, 
                                                       amountNoConfirmation: gNoConfirmation } }

                    eventsActive = [ ...eventsActive, data ];
               }
                   
          }

          res.status( 200 ).json( getJsonRes( true, 'Información para el dashboard correctamente', eventsActive ) );

     } catch ( error) {
          console.log( error );
          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );
     }

}

const getDataDashboardProveer = async ( req = request, res = response ) => {

     try {
          
          const { _id } = req.user
          let memebresiaFin = 0;
          let eventsRecorded = 0;
          let promedioEstrellas = 0;
          let popularService = {};

          //Getting days for finishing the payment
          const lastPayment =  await Payment.find( { user: _id } ).sort( { $natural:-1 } ).limit( 1 );
          const dateNow = new Date();
          var x = new Date( lastPayment[0].dateEnd );
          var y = new Date( dateNow );
          memebresiaFin = Math.floor((x - y) / (1000 * 60 * 60 * 24));

          //Getting amount of events recorded
          eventsRecorded = await Service.find( { '$and': [ { provider: _id }, { status: true } ] } ).count();

          //Obteniendo promedio de estrellas
          const services = await Service.find( { '$and': [ { provider: _id }, { status: true } ] } );

          let sumStars = 0;
          for (let i = 0; i < services.length; i++) {
               const s = services[i];
               
               sumStars += s.rating;
          }

          promedioEstrellas = (sumStars / eventsRecorded).toFixed(2);

          //Obteniendo servicio mas popular
          let ratingServices = [];

               //Obteniendo los servicios con mas estrellas
          for (let i = 5; i >= 1; i--) {
               
               const servicesRating = await Service.find( { '$and': [ { provider: _id }, 
                                                                      { status: true }, 
                                                                      { rating: i } ] 
               
                                                                 } );
               if( servicesRating.length > 0 ) {
                    ratingServices = servicesRating;
                    break;
               }

          }

          if( ratingServices.length > 0 ) {
               let amountSurveys = []
               for (let i = 0; i < ratingServices.length; i++) {
                    const rs = ratingServices[i];

                    const amountSurv = await Survey.find( { event: rs._id } ).count();

                    amountSurveys = [ ...amountSurveys, amountSurv ];
               }

               const maxAmountSurv = Math.max( ...amountSurveys );
               const indexMax = amountSurveys.findIndex( v => v === maxAmountSurv );
          

               //Obteniendo comentarios y calificaciones del servicio mas popular
               const surveys = await Survey.find( { service: ratingServices[ indexMax ]._id } );
               let grades = []

               // Getting comments of the service
               for (let i = 0; i < surveys.length; i++) {
                    const s = surveys[i];

                    if( s.answers.length === 0 ) 
                         continue;

                    const idUser = s.user;
                    const { name } = await User.findById( idUser );
                    const stars = await calculateStarts( s.answers );
                    const picture = await Picture.findOne( { document: idUser } );

                    const data = { comments: s.comments, stars, user: { name, picture } };

                    grades = [ ...grades, data ];
               }

               const pservi = { _doc: { ...ratingServices[ indexMax ]._doc, grades }  };
               popularService = await getImages( pservi );
          }

          // Tipo de servicio que mas hay en la app
          const types = [ 'Comida', 'Entretenimiento', 'Multimedia', 'Hospedaje', 'Salud' ];
          let amountTypes = [];

          for (let i = 0; i < types.length; i++) {
               const t = types[i];   
               const amount = await Service.find( { '$and': [ { status: true, type: types[i] } ] } ).count();
               amountTypes = [ ...amountTypes, amount ];
          }

          const maxAmoutnType = Math.max( ...amountTypes );
          const indexMaxType = amountTypes.findIndex( v => v === maxAmoutnType );

          let popularType = { name: types[ indexMaxType ], amount: amountTypes[indexMaxType] }
          let chartTypes = [
               {
                    name: types[ 0 ] ,
                    value: amountTypes [ 0 ]
               },
               {
                    name: types[ 1 ] ,
                    value: amountTypes [ 1 ]
               },
               {
                    name: types[ 2 ] ,
                    value: amountTypes [ 2 ]
               },

               {
                    name: types[ 3 ] ,
                    value: amountTypes [ 3 ]
               },
               {
                    name: types[ 4 ] ,
                    value: amountTypes [ 4 ]
               },
          ]

          const result = { memebresiaFin, 
                           eventsRecorded, 
                           promedioEstrellas, 
                           popularService, 
                           popularType,
                           chartTypes }

          res.status( 200 ).json( getJsonRes( true, 'Información para el dashboard correctamente', result ) );
     } catch (error) {
          console.log( error );
          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );
     }

}

module.exports = {
     getDataDashboardPlanner,
     getDataPlannerMovilApp,
     getDataDashboardProveer
}