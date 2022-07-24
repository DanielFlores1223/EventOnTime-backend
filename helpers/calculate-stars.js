const { Service, Survey } = require('../models');

const calculateStarts = async ( answers = [] ) => {

     try {
          
          let stars = 0;
          const total = answers.length;
          
          const average = answers.filter( a => a === true );
          
          const r = ( average.length * 100 ) / total;
         
          if ( r > 0 && r <= 20 ) stars = 1; 
          if ( r > 20 && r <= 40 ) stars = 2; 
          if ( r > 40 && r <= 60 ) stars = 3; 
          if ( r > 60 && r <= 80 ) stars = 4; 
          if ( r > 80 && r <= 100 ) stars = 5; 

          return stars;
     } catch (error) {
          throw new Error('It could not calculate stars');
     }

}

const updateStarsService = async ( idService = '' ) => {

     try {

          const surveys = await Survey.find( { service: idService } )
          
          let stars = [];

          for (let i = 0; i < surveys.length; i++) {
               const s = surveys[i];
               const star = await calculateStarts( s.answers );
               stars = [ ...stars, star ];                 
          }

          let totalStars = 0
          stars.forEach( s => {
               totalStars += s;
          });

          const average =  Math.round( totalStars / stars.length );
          
          const result = await Service.findByIdAndUpdate( idService, { rating: average } );

          return result;

     } catch (error) {
          throw new Error('It could not update stars');
     }

}

module.exports = {
     calculateStarts,
     updateStarsService,
}