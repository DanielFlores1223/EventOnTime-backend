const { getJsonRes } = require('../helpers');

const validateEventDates = async ( req, res, next ) => {

     if( !req.guest )
          return res.status(401).json( getJsonRes( false, 'La autentificación ha fallado' ) );

     const { event } = req.guest;
     const dateNow = new Date();
     const dateFinish = new Date(event.dateFinish);

     if( dateNow.getTime() >= dateFinish.getTime() )
          return res.status(401).json( getJsonRes( false, 'El evento al que intenta entrar ha terminado' ) );

     next();
}

module.exports = {
     validateEventDates,
}