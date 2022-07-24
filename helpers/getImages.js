const { Picture } = require('../models')

const getImages = async ( records = [] || {} ) => {
     
     if( Object.keys( records ) &&  !Array.isArray(records) ) {
          const { _id } = records._doc;

          const pictures = await Picture.find( { document: _id } );
          const data = {
               ...records._doc,
               pictures
          }

          return data;
     }

     if( Array.isArray(records) ) {
          let response = [];
          for (let i = 0; i < records.length; i++) {
               const r = records[i]._doc;
               const { _id } = r;
     
               const pictures = await Picture.find({ document: _id });
               const data = {
                    ...r,
                    pictures
               }
     
               response = [ ...response, data ];
          }
     
          //console.log(response)
          return response;
     }
     
     return null;
}

module.exports = {
     getImages,
}