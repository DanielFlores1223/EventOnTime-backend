const { Event, Guest, Payment } = require('../models');
const { request, response } = require('express');
const { getJsonRes, generateCodeRandom, getImages } = require('../helpers');
const { sendEmailEvent } = require('../libs');

const getMyEvents = async ( req = request, res = response ) => {
     try {
          const { _id } = req.user;
          const { limit = 5, from = 0, pagination = 'true' } = req.query;
          let result;

          const p = ( pagination.toLowerCase() === 'true' );

          const query = { '$and': [ { panner: _id }, { status: true } ] }
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



module.exports = {
     getMyEvents,
     getEvent,
     create,
}