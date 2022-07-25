const { Event, Guest } = require('../models');
const { request, response } = require('express');
const { getJsonRes, generateCodeRandom } = require('../helpers');

//TODO: Send email to every guest
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
          for (let i = 0; i < guests.length; i++) {
               const g = guests[i];
               let codeGuest = 0;
               
               //create code for guest
               do {
               
                    codeGuest = generateCodeRandom();
                    existGuest = await Guest.findOne( { '$and': [ { code: codeGuest }, { event: newEvent._id }] } );
     
               } while ( existGuest );

               //Creating a guest
               const newGuest = new Guest( g );
               await newGuest.save();

               //Send email

          }

          const finalResult = { ...result, guests }
          res.status( 201 ).json( getJsonRes( true, 'Tu evento se ha creado correctamente', finalResult ) );

     } catch (error) {
          console.log(error);
          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );
     }

}

module.exports = {
     create,
}