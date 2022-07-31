const { Event, Guest, Payment } = require('../models');
const { request, response } = require('express');
const { getJsonRes, generateCodeRandom } = require('../helpers');
const { sendEmailEvent } = require('../libs');

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
     create,
}