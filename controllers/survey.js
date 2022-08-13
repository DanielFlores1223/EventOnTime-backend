const { request, response } = require('express');
const { Survey } = require('../models');
const { getJsonRes, updateStarsService } = require('../helpers');

const create = async ( req = request, res = response ) => {

     try {
          
          const { _id } = req.user;
          const { id } = req.params; //id of service

          req.body.user = _id;
          req.body.service = id;

          const newSurv = new Survey( req.body );
          const result = await newSurv.save();

          await updateStarsService( id );

          res.status( 201 ).json( getJsonRes( true, 'Las respuestas de la encuesta se ha guardado correctamente', result ) ); 

     } catch (error) {
          console.log(error);
          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );
     }

}

const getPendingSurveys = async ( req = request, res = response ) => {

     try {
          
          const { _id } = req.user;
          const surveys = await Survey.find( { user: _id } ).populate( {path: 'service',
                                                                       select: '_id name description'} )
                                                            .populate( { path: 'user', select: 'name' } )
                                                            .populate({ path:'event', select: 'name type dateStart dateFinish' });
          let result = [];

          for (let i = 0; i < surveys.length; i++) {
               const s = surveys[i];
               
               if( s.answers.length === 0 )
                    result = [ ...result, s ];
          }


          res.status( 200 ).json( getJsonRes( true, 'Encuestas pendientes encontradas correctamente', result ) ); 

     } catch (error) {
          console.log(error);
          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );
     }

}

const answerSurvey = async ( req = request, res = response ) => {

     try {
          
          const { answers, comments } = req.body;
          const { id } = req.params; //id of survey

          const survey = await Survey.findById( id );

          survey.answers = answers;
          survey.comments = comments;

          await survey.save();
          await updateStarsService( survey.service ); //pass to id service

          res.status( 200 ).json( getJsonRes( true, 'Las respuestas de la encuesta se ha guardado correctamente', survey ) ); 

     } catch (error) {
          console.log(error);
          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );
     }

}


module.exports = {
     create,
     answerSurvey,
     getPendingSurveys
}