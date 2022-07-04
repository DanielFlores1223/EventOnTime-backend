const { request, response } = require('express');
const { ContactUs } = require('../models');
const { getJsonRes } = require('../helpers/json-responses');

const getAll =  async ( req = request, res = response ) => {

     try {
          const { limit = 5, from = 0, pagination = 'true' } = req.query;

          let result;
          const p = ( pagination.toLowerCase() === 'true' );
          
          if( p ) {
               result = await Promise.all([
                    ContactUs.countDocuments(),
                    ContactUs.find()
                        .skip( Number( from ) )
                        .limit( Number( limit ) )
               ]);
          
          } else {
               result = await Promise.all([
                    ContactUs.countDocuments(),
                    ContactUs.find()
               ]);
          }
     
          const [ total, contactus ] = result;

          const resultJson = { total, contactus };

          res.status( 200 ).json( getJsonRes( true, 'Registros encontrados correctamente', resultJson ) );

     } catch (error) {
          console.log(error);
          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );
     }

}

const getById = async ( req = request, res = response ) => {

     try {
          const { id } = req.params;
          const contactus = await ContactUs.findById( id );
          res.status( 200 ).json( getJsonRes( true, 'La información se encontró correctamente', contactus ) );
          
     } catch (error) {
          console.log(error);
          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );
     }
}

const create = async ( req = request, res = response ) => {

     try {
          const { view, ...rest } =  req.body;
          const contactUs = new ContactUs( rest );
          await contactUs.save();
          res.status( 201 ).json( getJsonRes( true, 'Se ha registrado tu mensaje correctamente', contactUs ) );

     } catch (error) {
          console.log(error);
          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );

     }
     
}

const viewRegister = async ( req = request, res = response ) => {

     try {
          const { id } = req.params;
          const result = await ContactUs.findByIdAndUpdate( id ,{ view: true }, { new: true} );

          res.status( 200 ).json( getJsonRes( true, 'Se ha actualizado el registro correctamente', result ) ); 

     } catch (error) {
          console.log(error);
          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );

     }

}

const deleteOne = async ( req = request, res = response ) => {

     try { 
          const { id } = req.params;
          const result = await ContactUs.findByIdAndDelete( id );
          
          res.status( 200 ).json( getJsonRes( true, 'El registro se ha elimnado correctamente', result ) ); 
     } catch (error) {
          console.log(error);
          res.status( 400 ).send( getJsonRes( false, 'Algo salió mal...' ) );

     }

}


module.exports = {
     getAll,
     getById,
     create,
     viewRegister,
     deleteOne
}