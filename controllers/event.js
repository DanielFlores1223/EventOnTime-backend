const { Event, Guest, Payment, Service, Survey } = require('../models');
const { request, response } = require('express');
const { getJsonRes, generateCodeRandom, getImages } = require('../helpers');
const { sendEmailEvent, sendEmailEventCancelled } = require('../libs');
const mongoose = require('mongoose');

const getMyEvents = async ( req = request, res = response ) => {
     try {
          const { _id } = req.user;
          const { limit = 5, from = 0, pagination = 'true', search='' } = req.query;
          let result;

          const p = ( pagination.toLowerCase() === 'true' );

          const query = { '$and': [ { planner: _id }, 
                                    { status: true },
                                    {
                                        '$or': [  { 'name': { '$regex': search, '$options': 'i' }  }, 
                                                  { 'type': { '$regex': search, '$options': 'i' } } 
                                               ] 
                                    }
                                  ] }
          if( p ) {
               result = await Promise.all([
                    Event.countDocuments( query ),
                    Event.find( query )
                        .skip( Number( from ) )
                        .limit( Number( limit ) )
               ]);
          
          } else {
               result = await Promise.all([
                    Event.countDocuments( query ),
                    Event.find( query )
               ]);
          }

          const [ total, events ] = result;
          const servImg = await getImages( events );
          const resultJson = { total, events: servImg }

          res.status( 200 ).json( getJsonRes( true, 'Tus eventos se han encontrado correctamente', resultJson ) );

     } catch (error) {
          console.log(error);
          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );
     }
} 

const getEvent = async ( req = request, res = response ) => {

     try {

          const { id } = req.params;
          const eventFound = await Event.findById( id ).populate({
               path: 'services',
               select: '_id name type description price phone rating status'
          });

          const resultImg = await getImages( eventFound );
          const guests = await Guest.find( { event: id } );

          const result = { ...resultImg, guests };

          res.status( 200 ).json( getJsonRes( true, 'El evento se han encontrado correctamente', result ) );

     } catch (error) {
          console.log(error);
          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );
     }

}

const create = async ( req = request, res = response ) => {

     try {
          const { status, guests = [], ...body } = req.body;
          body.planner = req.user._id;

          //generate code
          let exist;
          let random = 0;
          
          do {
               
               random = generateCodeRandom();
               exist = await Event.findOne( { code: random } );

          } while ( exist );
          
          body.code = random;

          // Save event
          const newEvent = new Event( body );
          const result = await newEvent.save();

          // send guests
          let guestCreated = [];
          for (let i = 0; i < guests.length; i++) {
               const g = guests[i];
               let codeGuest = 0;
               
               //create code for guest
               do {
               
                    codeGuest = generateCodeRandom();
                    existGuest = await Guest.findOne( { '$and': [ { code: codeGuest }, { event: newEvent._id }] } );
     
               } while ( existGuest );

               //Creating a guest
               g.code = codeGuest;
               g.event = newEvent._id;
               const newGuest = new Guest( g );
               const gnew = await newGuest.save();

               guestCreated = [ ...guestCreated, gnew._doc ];
          
               infoEmail = {
                    email: gnew._doc.email,
                    codeInv: gnew._doc.code,
                    codeEve: newEvent.code,
                    nameEve: newEvent.name,
                    nameInv: gnew._doc.name,
                    namePlanner: req.user.name
               }

               //Send email
               sendEmailEvent( infoEmail );
          }

          // Creating surveys for each service in the event
          for (let i = 0; i < body.services.length; i++) {
               const serv = body.services[i];

               const surveyData = {
                    answers: [],
                    comments: '',
                    user: req.user._id,
                    service: serv, //id service
                    event: result._id
               }

               console.log(surveyData);
               const surveyNew = new Survey( surveyData );
               await surveyNew.save();
               
          }

          // Recording the event recorded
          const totalEvents = req.payment.numberEvents + 1;
          await Payment.findByIdAndUpdate( req.payment._id, { numberEvents: totalEvents } );
          
          const finalResult = { ...result._doc, guests: guestCreated } 
          res.status( 201 ).json( getJsonRes( true, 'Tu evento se ha creado correctamente', finalResult ) );

     } catch (error) {
          console.log(error);
          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );
     }

}

const update = async ( req = request, res = response ) => {

     try {
          const { id } = req.params;
          const { _id, code, status, planner, services, guests, ...body } = req.body;

          const eventBefore = await Event.findById( id );

          const dateNow = new Date();
          const dateFinish = new Date(eventBefore.dateFinish);
          if( dateNow.getTime() >= dateFinish )
               return res.status( 400 ).send( getJsonRes( false, `No se puede editar un evento el cual ya término` ) );

          // Creating surveys for each service in the event
          let servicesNew = [];
          for (let i = 0; i < services.length; i++) {
               const serv = services[i];

               console.log(serv)
               console.log(eventBefore.services.includes(serv))
               
               if( eventBefore.services.includes(serv) ) 
                    continue;
                   

               servicesNew = [ ...servicesNew, serv ]
               const surveyData = {
                    answers: [],
                    comments: '',
                    user: req.user._id,
                    service: serv, //id service
                    event: id
               }

               //console.log(surveyData);
               const surveyNew = new Survey( surveyData );
               await surveyNew.save();
          }

          //Checking the guests before updating
          let guestCreated = [];
          for (let i = 0; i < guests.length; i++) {
               const g = guests[i];
               
               const guestBefore = await Guest.findOne( { event: id, email: g.email } );

               if( guestBefore ) 
                   return res.status( 400 ).send( getJsonRes( false, `Ya existe un invitado con el email: ${g.email}` ) );

               let codeGuest = 0;
               
               //create code for guest
               do {
                    codeGuest = generateCodeRandom();
                    existGuest = await Guest.findOne( { '$and': [ { code: codeGuest }, { event: id }] } );
         
               } while ( existGuest );
    
               //Creating a guest
               g.code = codeGuest;
               g.event = id;
               const newGuest = new Guest( g );
               const gnew = await newGuest.save();
    
               guestCreated = [ ...guestCreated, gnew._doc ];
              
               infoEmail = {
                    email: gnew._doc.email,
                    codeInv: gnew._doc.code,
                    codeEve: eventBefore.code,
                    nameEve: body.name,
                    nameInv: gnew._doc.name,
                    namePlanner: req.user.name
               }
    
               //Send email
               sendEmailEvent( infoEmail );
                   
          }

          if( servicesNew.length > 0 ) {
               eventBefore.services = [ ...eventBefore.services, ...servicesNew ] ;
               await eventBefore.save() //Update the services of the event
          }

          const updateEvent = await Event.findByIdAndUpdate( id, body );

          res.status( 200 ).json( getJsonRes( true, 'Tu evento se ha modificado correctamente', updateEvent ) );

     } catch (error) {
          console.log(error);
          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );
     }

}

const removeService = async ( req = request, res = response ) => {

     try {     
          const { idService } = req.body;
          const { id } = req.params;

          const idMongo = new mongoose.Types.ObjectId(idService);
          
          const event = await Event.findById( id );
          const { services } = event;

          const newServices = services.filter( s => String(s) !== String(idMongo) );

          if ( newServices.length === services.length ) {
               return res.status( 400 ).send( getJsonRes( false, 'Este servicio no se encuentra en tu evento' ) );
          }

          event.services = newServices;

          //Delete the survey of the service was deleted
          await Survey.findOneAndDelete( { '$and': [ { user: req.user._id }, { event: id }, { service: idService} ] } );

          await event.save();
          res.status( 200 ).send( getJsonRes( true, 'Servicio eliminado del evento', event ) );

     } catch (error) {
          console.log(error);
          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );
     }

}


const deleteEvent = async ( req = request, res = response ) => {

     try {
          const { id } = req.params;

          const result = await Event.findByIdAndUpdate( id, { status: false }, { new: true } );

          const guests = await Guest.find( { event: id } );

          for (let i = 0; i < guests.length; i++) {
               const g = guests[i];
               
               const infoEmail = {
                    email: g.email,
                    nameEve: result.name,
                    nameInv: g.name,
               }

               sendEmailEventCancelled( infoEmail ) ;

          }

          res.status( 200 ).send( getJsonRes( true, 'Evento eliminado correctamente', result ) );

     } catch (error) {
          console.log(error);
          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );
     }

}


module.exports = {
     getMyEvents,
     getEvent,
     create,
     update,
     removeService,
     deleteEvent
}