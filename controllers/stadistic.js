const { Event, Payment } = require('../models');
const { getJsonRes } = require('../helpers');
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

module.exports = {
     getDataDashboardPlanner,
}